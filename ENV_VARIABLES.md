# Environment Variables Documentation

This document lists all required environment variables for the Timecapsul application.

## Required Variables

### Database
```bash
DATABASE_URL="file:./dev.db"  # SQLite database path for development
# For production, use PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Authentication (NextAuth.js)
```bash
NEXTAUTH_URL="http://localhost:3000"  # Your application URL
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
```

### OAuth Providers (Optional)
```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### Email (Optional - for email verification)
```bash
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@timecapsul.app"
```

### Encryption
```bash
ENCRYPTION_KEY="your-32-character-encryption-key"  # For capsule content encryption
```

## Development vs Production

### Development (.env.local)
```bash
NODE_ENV="development"
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-change-in-production"
```

### Production (.env.production)
```bash
NODE_ENV="production"
DATABASE_URL="postgresql://..."  # Use PostgreSQL in production
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-random-secret"
# Add OAuth credentials
# Add email server credentials
# Add encryption key
```

## Setup Instructions

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values

3. Never commit `.env.local` or `.env.production` to version control

4. For production deployment, set environment variables in your hosting platform (Vercel, Railway, etc.)

## Security Notes

- **NEVER** commit actual secrets to git
- Use strong, randomly generated values for `NEXTAUTH_SECRET` and `ENCRYPTION_KEY`
- Rotate secrets regularly in production
- Use different secrets for development and production
- Store production secrets in a secure vault (e.g., 1Password, AWS Secrets Manager)
