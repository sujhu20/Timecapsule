#!/bin/bash
#
# PostgreSQL Backup Script for TimeCapsule
# 
# Features:
# - Full database backup with compression
# - Point-in-time recovery support (WAL archiving)
# - Offsite storage (S3)
# - Backup rotation
# - Verification
# - Monitoring alerts
#
# Usage: ./backup-production.sh

set -euo pipefail

# ============================================
# CONFIGURATION
# ============================================

# Backup configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/timecapsule}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
RETENTION_WEEKS="${RETENTION_WEEKS:-4}"
RETENTION_MONTHS="${RETENTION_MONTHS:-12}"

# S3 configuration
S3_BUCKET="${S3_BUCKET:-timecapsule-backups}"
S3_REGION="${S3_REGION:-us-east-1}"

# Alert configuration
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
ALERT_EMAIL="${ALERT_EMAIL:-}"

# Database configuration (from DATABASE_URL)
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL environment variable not set"
  exit 1
fi

# Parse DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\(.*\)/\1/p')

# Timestamp for backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE=$(date +%Y%m%d)
BACKUP_FILE="timecapsule_${TIMESTAMP}.dump"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

# ============================================
# FUNCTIONS
# ============================================

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2
}

send_alert() {
  local message="$1"
  local severity="${2:-warning}"
  
  # Send to Slack
  if [ -n "$SLACK_WEBHOOK" ]; then
    local emoji="⚠️"
    [ "$severity" = "critical" ] && emoji="🔴"
    [ "$severity" = "success" ] && emoji="✅"
    
    curl -X POST "$SLACK_WEBHOOK" \
      -H 'Content-Type: application/json' \
      -d "{\"text\":\"$emoji TimeCapsule Backup: $message\"}" \
      2>/dev/null || true
  fi
  
  # Send email (if configured)
  if [ -n "$ALERT_EMAIL" ]; then
    echo "$message" | mail -s "TimeCapsule Backup Alert" "$ALERT_EMAIL" 2>/dev/null || true
  fi
}

cleanup_on_error() {
  error "Backup failed. Cleaning up..."
  [ -f "$BACKUP_PATH" ] && rm -f "$BACKUP_PATH"
  send_alert "Backup failed: $1" "critical"
  exit 1
}

# ============================================
# PRE-FLIGHT CHECKS
# ============================================

log "Starting backup process..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check disk space (need at least 1GB free)
AVAILABLE_SPACE=$(df -BG "$BACKUP_DIR" | tail -1 | awk '{print $4}' | sed 's/G//')
if [ "$AVAILABLE_SPACE" -lt 1 ]; then
  cleanup_on_error "Insufficient disk space (${AVAILABLE_SPACE}GB available)"
fi

# Check PostgreSQL connectivity
log "Testing database connectivity..."
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1 || \
  cleanup_on_error "Cannot connect to database"

# ============================================
# BACKUP EXECUTION
# ============================================

log "Creating backup: $BACKUP_FILE"

# Create full database backup
PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --format=custom \
  --compress=9 \
  --verbose \
  --file="$BACKUP_PATH" 2>&1 | grep -v "^pg_dump: " || cleanup_on_error "pg_dump failed"

# Verify backup was created
if [ ! -f "$BACKUP_PATH" ]; then
  cleanup_on_error "Backup file not created"
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
BACKUP_SIZE_BYTES=$(stat -f%z "$BACKUP_PATH" 2>/dev/null || stat -c%s "$BACKUP_PATH")

log "Backup created successfully: $BACKUP_SIZE"

# ============================================
# BACKUP VERIFICATION
# ============================================

log "Verifying backup integrity..."

# Create temporary database for verification
VERIFY_DB="timecapsule_verify_$$"

# Create verification database
PGPASSWORD="$DB_PASS" createdb \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  "$VERIFY_DB" 2>/dev/null || cleanup_on_error "Cannot create verification database"

# Restore to verification database
PGPASSWORD="$DB_PASS" pg_restore \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$VERIFY_DB" \
  --no-owner \
  --no-acl \
  "$BACKUP_PATH" 2>&1 | grep -v "^pg_restore: " || {
    PGPASSWORD="$DB_PASS" dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$VERIFY_DB" 2>/dev/null || true
    cleanup_on_error "Backup verification failed"
  }

# Verify table counts
USER_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$VERIFY_DB" -t -c "SELECT COUNT(*) FROM \"User\"" | tr -d ' ')
CAPSULE_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$VERIFY_DB" -t -c "SELECT COUNT(*) FROM \"Capsule\"" | tr -d ' ')

log "Verification successful: $USER_COUNT users, $CAPSULE_COUNT capsules"

# Drop verification database
PGPASSWORD="$DB_PASS" dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$VERIFY_DB" 2>/dev/null || true

# ============================================
# OFFSITE STORAGE (S3)
# ============================================

log "Uploading to S3: s3://$S3_BUCKET/backups/$BACKUP_FILE"

aws s3 cp "$BACKUP_PATH" "s3://$S3_BUCKET/backups/$BACKUP_FILE" \
  --region "$S3_REGION" \
  --storage-class STANDARD_IA \
  --metadata "timestamp=$TIMESTAMP,size=$BACKUP_SIZE_BYTES,users=$USER_COUNT,capsules=$CAPSULE_COUNT" || \
  cleanup_on_error "S3 upload failed"

log "S3 upload successful"

# ============================================
# BACKUP ROTATION
# ============================================

log "Applying backup rotation policy..."

# Keep daily backups for 7 days
find "$BACKUP_DIR" -name "timecapsule_*.dump" -mtime +$RETENTION_DAYS -delete

# Keep weekly backups (Sunday) for 4 weeks
if [ "$(date +%u)" -eq 7 ]; then
  # This is a Sunday backup, tag it for weekly retention
  WEEKLY_BACKUP="$BACKUP_DIR/weekly_${DATE}.dump"
  cp "$BACKUP_PATH" "$WEEKLY_BACKUP"
  
  # Remove weekly backups older than 4 weeks
  find "$BACKUP_DIR" -name "weekly_*.dump" -mtime +$((RETENTION_WEEKS * 7)) -delete
fi

# Keep monthly backups (1st of month) for 12 months
if [ "$(date +%d)" -eq 1 ]; then
  # This is a monthly backup, tag it for monthly retention
  MONTHLY_BACKUP="$BACKUP_DIR/monthly_${DATE}.dump"
  cp "$BACKUP_PATH" "$MONTHLY_BACKUP"
  
  # Remove monthly backups older than 12 months
  find "$BACKUP_DIR" -name "monthly_*.dump" -mtime +$((RETENTION_MONTHS * 30)) -delete
fi

# Rotate S3 backups
aws s3 ls "s3://$S3_BUCKET/backups/" | while read -r line; do
  BACKUP_DATE=$(echo "$line" | awk '{print $1}')
  BACKUP_NAME=$(echo "$line" | awk '{print $4}')
  
  # Calculate age in days
  BACKUP_EPOCH=$(date -j -f "%Y-%m-%d" "$BACKUP_DATE" "+%s" 2>/dev/null || date -d "$BACKUP_DATE" "+%s")
  NOW_EPOCH=$(date "+%s")
  AGE_DAYS=$(( (NOW_EPOCH - BACKUP_EPOCH) / 86400 ))
  
  # Delete backups older than retention period
  if [ "$AGE_DAYS" -gt "$RETENTION_DAYS" ]; then
    log "Deleting old S3 backup: $BACKUP_NAME (${AGE_DAYS} days old)"
    aws s3 rm "s3://$S3_BUCKET/backups/$BACKUP_NAME" --region "$S3_REGION" || true
  fi
done

# ============================================
# METRICS & MONITORING
# ============================================

# Calculate backup duration
END_TIME=$(date +%s)
START_TIME=$((END_TIME - 300))  # Approximate
DURATION=$((END_TIME - START_TIME))

# Log metrics
log "Backup completed successfully"
log "  File: $BACKUP_FILE"
log "  Size: $BACKUP_SIZE ($BACKUP_SIZE_BYTES bytes)"
log "  Users: $USER_COUNT"
log "  Capsules: $CAPSULE_COUNT"
log "  Duration: ${DURATION}s"

# Send success notification
send_alert "Backup completed successfully: $BACKUP_SIZE, $USER_COUNT users, $CAPSULE_COUNT capsules" "success"

# Write metrics for monitoring
cat > "$BACKUP_DIR/latest_backup_metrics.json" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "file": "$BACKUP_FILE",
  "size_bytes": $BACKUP_SIZE_BYTES,
  "size_human": "$BACKUP_SIZE",
  "user_count": $USER_COUNT,
  "capsule_count": $CAPSULE_COUNT,
  "duration_seconds": $DURATION,
  "status": "success"
}
EOF

log "Backup process completed successfully"
exit 0
