import { NextRequest, NextResponse } from 'next/server';
import { unlockService } from '@/lib/unlock-service';
import { logger } from '@/lib/logger';
import { verifyCronSecret } from '@/lib/auth-middleware';
import { apiResponse, apiError } from '@/lib/api-response';

/**
 * POST /api/cron/unlock-capsules
 *
 * Automated cron job to unlock capsules that have passed their unlock time.
 *
 * Security: Requires Bearer token matching CRON_SECRET environment variable.
 * Should be called by Vercel Cron or GitHub Actions.
 *
 * Schedule: Every 15 minutes  (Vercel Cron schedule: every 15 minutes)
 *
 * Example:
 *   curl -X POST https://your-app.vercel.app/api/cron/unlock-capsules \
 *     -H "Authorization: Bearer your-cron-secret"
 */
export async function POST(req: NextRequest) {
    try {
        // SECURITY: Verify cron secret
        if (!verifyCronSecret(req)) {
            logger.warn('Unauthorized cron request', {
                ip: req.headers.get('x-forwarded-for') || 'unknown',
                userAgent: req.headers.get('user-agent') || 'unknown',
            });

            return apiError('Unauthorized', 401);
        }

        logger.info('Starting unlock cron job');

        // Run unlock service
        const result = await unlockService.unlockDueCapsules();

        if (!result.success) {
            logger.error('Unlock cron job completed with errors', {
                unlockedCount: result.unlockedCount,
                errorCount: result.errors.length,
                errors: result.errors,
            });

            return apiResponse(
                {
                    success: false,
                    unlockedCount: result.unlockedCount,
                    errors: result.errors,
                },
                'Unlock job completed with errors',
                207 // Multi-Status
            );
        }

        logger.info('Unlock cron job completed successfully', {
            unlockedCount: result.unlockedCount,
        });

        return apiResponse({
            success: true,
            unlockedCount: result.unlockedCount,
            message: `Successfully unlocked ${result.unlockedCount} capsule(s)`,
        });
    } catch (error) {
        logger.error('Unlock cron job failed', error);
        return apiError('Unlock job failed', 500, error);
    }
}

/**
 * GET /api/cron/unlock-capsules
 * 
 * Health check endpoint for the unlock cron job
 * Returns information about the last run (if available)
 */
export async function GET(req: NextRequest) {
    try {
        // SECURITY: Verify cron secret
        if (!verifyCronSecret(req)) {
            return apiError('Unauthorized', 401);
        }

        // Get count of locked capsules that should be unlocked
        const { prisma } = await import('@/lib/server-db');
        const now = new Date();

        const pendingUnlockCount = await prisma.capsule.count({
            where: {
                isLocked: true,
                unlockTime: {
                    lte: now,
                },
            },
        });

        const totalLockedCount = await prisma.capsule.count({
            where: {
                isLocked: true,
            },
        });

        return apiResponse({
            status: 'healthy',
            pendingUnlockCount,
            totalLockedCount,
            currentTime: now.toISOString(),
        });
    } catch (error) {
        logger.error('Unlock cron health check failed', error);
        return apiError('Health check failed', 500, error);
    }
}
