import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/server-db';
import { decrypt } from '@/lib/encryption';
import { apiResponse, apiError } from '@/lib/api-response';
import { logger } from '@/lib/logger';
import { checkRateLimit, userRateLimiter } from '@/lib/rate-limit'; // Fixed import

/**
 * GET /api/capsules/[id]/content
 * 
 * Secure Content Access Endpoint
 * - Strict validation
 * - Decrypts only on-the-fly
 * - explicit lock checks
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        const capsuleId = params.id;

        if (!userId) {
            return apiError('Unauthorized', 401);
        }

        // Rate limit (stricter for decryption operations)
        // Using userRateLimiter (20 req/min)
        const rateLimitResult = await checkRateLimit(userId, userRateLimiter);
        if (!rateLimitResult.success) {
            return rateLimitResult.response!;
        }

        // 1. Fetch Capsule (Raw, fetch all fields to avoid stale type issues)
        // removed select to avoid "privacy does not exist" type errors if types are stale
        const capsule = await prisma.capsule.findUnique({
            where: { id: capsuleId },
        });

        if (!capsule) {
            return apiError('Capsule not found', 404);
        }

        // 2. Strict Access Control
        const isOwner = capsule.ownerId === userId;
        const isPublic = capsule.privacy === 'public';

        // Must be Owner OR Public
        if (!isOwner && !isPublic) {
            logger.warn(`Access denied to content: User ${userId} -> Capsule ${capsuleId}`);
            return apiError('Forbidden', 403);
        }

        // 3. Strict Lock Check
        const now = new Date();
        const unlockTime = capsule.unlockTime || capsule.createdAt;

        // Explicit lock status check
        const isLocked = capsule.isLocked || unlockTime > now;

        if (isLocked) {
            if (isOwner) {
                logger.info(`Owner accessing locked content: ${capsuleId}`, { userId });
                // Owner allowed
            } else {
                logger.warn(`Attempt to access locked content: ${capsuleId}`, { userId });
                return apiError('Capsule is locked', 403, { unlockTime: unlockTime.toISOString() });
            }
        }

        // 4. Decrypt
        let content: string;
        try {
            content = decrypt(capsule.content);
        } catch (error) {
            logger.error(`Decryption failed for secure access: ${capsuleId}`, error);
            return apiError('Content corrupted or decryption failed', 422, { code: 'DECRYPTION_FAILED' });
        }

        // 5. Return Content
        return apiResponse({
            id: capsule.id,
            content: content,
            unlockedAt: now.toISOString(),
        });

    } catch (error: any) {
        logger.error('Secure content access failed', error);
        return apiError('Internal server error', 500);
    }
}
