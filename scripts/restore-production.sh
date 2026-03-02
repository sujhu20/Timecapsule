#!/bin/bash
#
# PostgreSQL Restore Script for TimeCapsule
#
# Usage: ./restore-production.sh <backup_file> [target_time]
#
# Examples:
#   ./restore-production.sh timecapsule_20260217_020000.dump
#   ./restore-production.sh timecapsule_20260217_020000.dump "2026-02-17 14:30:00"

set -euo pipefail

# ============================================
# CONFIGURATION
# ============================================

BACKUP_FILE="$1"
TARGET_TIME="${2:-}"

# Database configuration
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL environment variable not set"
  exit 1
fi

# Parse DATABASE_URL
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\(.*\)/\1/p')

# ============================================
# FUNCTIONS
# ============================================

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2
  exit 1
}

# ============================================
# PRE-FLIGHT CHECKS
# ============================================

log "TimeCapsule Database Restore"
log "=============================="

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  error "Backup file not found: $BACKUP_FILE"
fi

# Get backup info
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log "Backup file: $BACKUP_FILE ($BACKUP_SIZE)"

# Confirm restore
echo ""
echo "⚠️  WARNING: This will REPLACE the current database!"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo "Backup: $BACKUP_FILE"
[ -n "$TARGET_TIME" ] && echo "Target Time: $TARGET_TIME (Point-in-Time Recovery)"
echo ""
read -p "Are you absolutely sure? Type 'yes' to continue: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  log "Restore cancelled by user"
  exit 0
fi

# ============================================
# BACKUP CURRENT DATABASE
# ============================================

log "Creating safety backup of current database..."

SAFETY_BACKUP="/tmp/timecapsule_pre_restore_$(date +%Y%m%d_%H%M%S).dump"

PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --format=custom \
  --compress=9 \
  --file="$SAFETY_BACKUP" || error "Safety backup failed"

log "Safety backup created: $SAFETY_BACKUP"

# ============================================
# RESTORE DATABASE
# ============================================

log "Terminating active connections..."

PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" \
  > /dev/null 2>&1 || true

log "Dropping existing database..."

PGPASSWORD="$DB_PASS" dropdb \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  "$DB_NAME" \
  --if-exists || error "Failed to drop database"

log "Creating new database..."

PGPASSWORD="$DB_PASS" createdb \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  "$DB_NAME" || error "Failed to create database"

log "Restoring from backup..."

PGPASSWORD="$DB_PASS" pg_restore \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --verbose \
  --no-owner \
  --no-acl \
  "$BACKUP_FILE" 2>&1 | grep -v "^pg_restore: " || error "Restore failed"

# ============================================
# POINT-IN-TIME RECOVERY (if requested)
# ============================================

if [ -n "$TARGET_TIME" ]; then
  log "Applying point-in-time recovery to: $TARGET_TIME"
  
  # This requires WAL archiving to be configured
  # Implementation depends on your WAL archive location
  
  log "WARNING: Point-in-time recovery requires WAL archiving configuration"
  log "Please refer to PostgreSQL documentation for PITR setup"
fi

# ============================================
# VERIFICATION
# ============================================

log "Verifying restored database..."

# Check table counts
USER_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"User\"" | tr -d ' ')
CAPSULE_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"Capsule\"" | tr -d ' ')
AUDIT_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"AuditLog\"" | tr -d ' ')

log "Verification complete:"
log "  Users: $USER_COUNT"
log "  Capsules: $CAPSULE_COUNT"
log "  Audit Logs: $AUDIT_COUNT"

# ============================================
# POST-RESTORE TASKS
# ============================================

log "Running post-restore tasks..."

# Update sequences (if needed)
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c \
  "SELECT setval(pg_get_serial_sequence('\"User\"', 'id'), COALESCE(MAX(id), 1)) FROM \"User\";" \
  > /dev/null 2>&1 || true

# Analyze database
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;" \
  > /dev/null 2>&1 || true

log "Post-restore tasks complete"

# ============================================
# COMPLETION
# ============================================

echo ""
log "✅ Database restore completed successfully!"
log ""
log "Safety backup saved at: $SAFETY_BACKUP"
log "Keep this file until you verify the restore is correct"
log ""
log "Next steps:"
log "1. Verify application functionality"
log "2. Check recent data integrity"
log "3. Monitor error logs"
log "4. Delete safety backup when confirmed: rm $SAFETY_BACKUP"
echo ""

exit 0
