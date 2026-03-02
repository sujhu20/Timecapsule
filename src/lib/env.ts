import { z } from 'zod';

/**
 * Environment variable schema with strict validation for production
 * Development mode has relaxed requirements with fallbacks
 */

const isDev = process.env.NODE_ENV === 'development';

const envSchema = z.object({
    // Database - Required in production, optional in dev (uses SQLite)
    DATABASE_URL: isDev
        ? z.string().default('file:./prisma/dev.db')
        : z.string().min(1, 'DATABASE_URL is required in production'),

    // Authentication - Required in production
    NEXTAUTH_SECRET: isDev
        ? z.string().default('dev-secret-change-in-production-min-32-chars')
        : z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

    NEXTAUTH_URL: isDev
        ? z.string().default('http://localhost:3000')
        : z.string().url('NEXTAUTH_URL must be a valid URL'),

    // Encryption - Required in production, has dev fallback
    // WARNING: Dev fallback is INSECURE - only for local testing
    ENCRYPTION_KEY: isDev
        ? z.string().default('ZGV2LWtleS1kb25vdHVzZWlucHJvZHVjdGlvbjEyMzQ=') // "dev-key-donotuseinproduction1234" (32 bytes)
        : z.string().length(44, 'ENCRYPTION_KEY must be exactly 44 characters (32-byte base64)'),

    // OAuth (optional in all environments)
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),

    // Monitoring (optional)
    SENTRY_DSN: z.string().optional(),

    // Cron Security (optional in dev, required in production if using cron)
    CRON_SECRET: z.string().optional(),

    // Node Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parsed environment — skips validation during `next build` static analysis
 * (NEXT_PHASE === 'phase-production-build'), but validates on first request at runtime.
 *
 * This allows `next build` to complete without requiring all env vars to be
 * present locally, while still ensuring misconfigured production servers are
 * caught immediately on startup.
 */
const NEXT_PHASE = process.env.NEXT_PHASE;
const isBuildPhase = NEXT_PHASE === 'phase-production-build';

let _cached: Env | undefined;

function parseEnv(): Env {
    if (_cached) return _cached;

    // During `next build`, skip strict validation to allow build to complete.
    // Env vars are still available at runtime via process.env.
    if (isBuildPhase) {
        // Return a best-effort parse with defaults so the build can proceed
        _cached = envSchema.parse({
            ...process.env,
            DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/dev.db',
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'build-phase-placeholder-not-used',
            NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
            ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'YnVpbGQtcGhhc2UtcGxhY2Vob2xkZXItbm90LXVzZWQ=',
        });
        return _cached;
    }

    try {
        const parsed = envSchema.parse(process.env);

        // EXTRA SECURITY: Hard check for default key in production
        if (parsed.NODE_ENV === 'production') {
            const DEV_KEY = 'ZGV2LWtleS1kb25vdHVzZWlucHJvZHVjdGlvbjEyMzQ=';
            if (parsed.ENCRYPTION_KEY === DEV_KEY) {
                throw new Error('🚨 FATAL SECURITY ERROR: You are using the default development ENCRYPTION_KEY in production. Update ENCRYPTION_KEY immediately.');
            }
        }

        // Warn in development if using fallback values
        if (isDev) {
            const warnings: string[] = [];

            if (!process.env.ENCRYPTION_KEY) {
                warnings.push('⚠️  Using development ENCRYPTION_KEY (insecure - for local testing only)');
            }
            if (!process.env.NEXTAUTH_SECRET) {
                warnings.push('⚠️  Using development NEXTAUTH_SECRET');
            }
            if (!process.env.DATABASE_URL) {
                warnings.push('⚠️  Using SQLite database (file:./prisma/dev.db)');
            }

            if (warnings.length > 0) {
                console.log('\n🔧 Development Mode - Using Fallback Values:');
                warnings.forEach(w => console.log(`   ${w}`));
                console.log('   💡 For production setup, copy .env.example to .env and configure\n');
            }
        }

        _cached = parsed;
        return parsed;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });

            console.error('\n📝 Setup Instructions:');
            console.error('1. Copy .env.example to .env');
            console.error('2. Generate ENCRYPTION_KEY: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
            console.error('3. Generate NEXTAUTH_SECRET: openssl rand -base64 32');
            console.error('4. Set DATABASE_URL to your PostgreSQL connection string');
            console.error('5. Set NEXTAUTH_URL to your application URL (e.g., http://localhost:3000)');

            throw new Error('Environment validation failed. See errors above.');
        }
        throw error;
    }
}

export const env: Env = new Proxy({} as Env, {
    get(_target, prop: string) {
        return parseEnv()[prop as keyof Env];
    },
});

/**
 * Helper to check if running in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper to check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper to check if running in test
 */
export const isTest = env.NODE_ENV === 'test';
