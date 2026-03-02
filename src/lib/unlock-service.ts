import { prisma } from './server-db';
import { logger } from './logger';

export interface UnlockResult {
    success: boolean;
    unlockedCount: number;
    errors: string[];
}

/**
 * Unlock Service
 * 
 * Handles automated unlocking of time capsules
 * - Timezone-safe (uses UTC)
 * - Idempotent (safe to run multiple times)
 * - Audit logging
 */
export class UnlockService {
    /**
     * Unlock all capsules that have passed their unlock time
     * 
     * @returns Result with count of unlocked capsules and any errors
     */
    async unlockDueCapsules(): Promise<UnlockResult> {
        const errors: string[] = [];
        let unlockedCount = 0;

        try {
            const now = new Date();

            logger.info('Starting capsule unlock job', {
                timestamp: now.toISOString(),
            });

            // Find all locked capsules where unlock time has passed
            const capsulestoUnlock = await prisma.capsule.findMany({
                where: {
                    isLocked: true,
                    unlockTime: {
                        lte: now, // Less than or equal to current time
                    },
                },
                select: {
                    id: true,
                    title: true,
                    unlockTime: true,
                    ownerId: true,
                },
            });

            logger.info(`Found ${capsulestoUnlock.length} capsules to unlock`);

            // Unlock each capsule individually for better error handling
            // ✅ CRITICAL FIX: Use transactions to ensure atomicity
            for (const capsule of capsulestoUnlock) {
                try {
                    // ✅ Transaction ensures unlock + audit log are atomic
                    // If audit log fails, unlock is rolled back
                    await prisma.$transaction(async (tx) => {
                        // Update capsule lock status
                        await tx.capsule.update({
                            where: { id: capsule.id },
                            data: { isLocked: false },
                        });

                        // Create audit log (part of same transaction)
                        await tx.auditLog.create({
                            data: {
                                action: 'CAPSULE_UNLOCKED',
                                capsuleId: capsule.id,
                                userId: capsule.ownerId,
                                details: JSON.stringify({
                                    title: capsule.title,
                                    unlockTime: capsule.unlockTime.toISOString(),
                                    unlockedAt: now.toISOString(),
                                }),
                            },
                        });
                    });

                    unlockedCount++;

                    logger.info(`Unlocked capsule: ${capsule.id}`, {
                        capsuleId: capsule.id,
                        title: capsule.title,
                        scheduledUnlockTime: capsule.unlockTime.toISOString(),
                        actualUnlockTime: now.toISOString(),
                    });

                    // TODO: Send notification to owner (outside transaction)
                    // await sendUnlockNotification(capsule.ownerId, capsule.id);
                } catch (error) {
                    const errorMessage = `Failed to unlock capsule ${capsule.id}: ${error instanceof Error ? error.message : String(error)}`;
                    errors.push(errorMessage);
                    logger.error(errorMessage, error, { capsuleId: capsule.id });
                    // Transaction automatically rolled back on error
                }
            }

            logger.info('Capsule unlock job completed', {
                unlockedCount,
                errorCount: errors.length,
            });

            return {
                success: errors.length === 0,
                unlockedCount,
                errors,
            };
        } catch (error) {
            const errorMessage = `Unlock job failed: ${error instanceof Error ? error.message : String(error)}`;
            logger.error(errorMessage, error);

            return {
                success: false,
                unlockedCount,
                errors: [errorMessage, ...errors],
            };
        }
    }

    /**
     * Check if a specific capsule should be unlocked
     * 
     * @param capsuleId - Capsule ID to check
     * @returns true if capsule should be unlocked
     */
    async shouldUnlock(capsuleId: string): Promise<boolean> {
        try {
            const capsule = await prisma.capsule.findUnique({
                where: { id: capsuleId },
                select: {
                    isLocked: true,
                    unlockTime: true,
                },
            });

            if (!capsule) {
                return false;
            }

            const now = new Date();
            return capsule.isLocked && capsule.unlockTime <= now;
        } catch (error) {
            logger.error('Error checking unlock status', error, { capsuleId });
            return false;
        }
    }

    /**
     * Manually unlock a specific capsule (admin/owner only)
     * 
     * @param capsuleId - Capsule ID to unlock
     * @param userId - User ID performing the unlock
     * @returns true if successful
     */
    async manualUnlock(capsuleId: string, userId: string): Promise<boolean> {
        try {
            const capsule = await prisma.capsule.findUnique({
                where: { id: capsuleId },
                select: {
                    id: true,
                    title: true,
                    ownerId: true,
                    isLocked: true,
                },
            });

            if (!capsule) {
                throw new Error('Capsule not found');
            }

            if (capsule.ownerId !== userId) {
                throw new Error('Only the owner can manually unlock a capsule');
            }

            if (!capsule.isLocked) {
                logger.warn('Capsule already unlocked', { capsuleId });
                return true; // Idempotent
            }

            // ✅ CRITICAL FIX: Use transaction for manual unlock
            await prisma.$transaction(async (tx) => {
                await tx.capsule.update({
                    where: { id: capsuleId },
                    data: { isLocked: false },
                });

                // Create audit log (part of same transaction)
                await tx.auditLog.create({
                    data: {
                        action: 'CAPSULE_MANUALLY_UNLOCKED',
                        capsuleId: capsule.id,
                        userId,
                        details: JSON.stringify({
                            title: capsule.title,
                            unlockedAt: new Date().toISOString(),
                        }),
                    },
                });
            });

            logger.info(`Manually unlocked capsule: ${capsuleId}`, {
                capsuleId,
                userId,
            });

            return true;
        } catch (error) {
            logger.error('Manual unlock failed', error, { capsuleId, userId });
            return false;
        }
    }
}

// Export singleton instance
export const unlockService = new UnlockService();
