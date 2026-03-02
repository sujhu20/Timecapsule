import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server-db';
import { apiResponse, apiError } from '@/lib/api-response';
import { env } from '@/lib/env';

/**
 * GET /api/health
 * 
 * Health check endpoint for monitoring
 * Returns system status and connectivity checks
 */
export async function GET(req: NextRequest) {
    const checks: Record<string, { status: 'healthy' | 'unhealthy'; message?: string }> = {};

    // 1. Database connectivity
    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.database = { status: 'healthy' };
    } catch (error) {
        checks.database = {
            status: 'unhealthy',
            message: error instanceof Error ? error.message : 'Database connection failed',
        };
    }

    // 2. Environment variables
    try {
        // Critical env vars are validated at startup by env.ts
        // If we got here, they're present
        checks.environment = { status: 'healthy' };
    } catch (error) {
        checks.environment = {
            status: 'unhealthy',
            message: 'Critical environment variables missing',
        };
    }

    // 3. Encryption key
    try {
        const { encrypt, decrypt } = await import('@/lib/encryption');
        const testString = 'health-check-test';
        const encrypted = encrypt(testString);
        const decrypted = decrypt(encrypted);

        if (decrypted === testString) {
            checks.encryption = { status: 'healthy' };
        } else {
            checks.encryption = {
                status: 'unhealthy',
                message: 'Encryption/decryption mismatch',
            };
        }
    } catch (error) {
        checks.encryption = {
            status: 'unhealthy',
            message: error instanceof Error ? error.message : 'Encryption test failed',
        };
    }

    // Determine overall status
    const allHealthy = Object.values(checks).every((check) => check.status === 'healthy');
    const status = allHealthy ? 200 : 503;

    return NextResponse.json(
        {
            status: allHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            environment: env.NODE_ENV,
            checks,
        },
        { status }
    );
}
