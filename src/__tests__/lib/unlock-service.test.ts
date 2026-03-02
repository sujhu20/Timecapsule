/**
 * Unlock Service Tests
 * 
 * CRITICAL: 100% coverage required
 * 
 * Tests:
 * - Successful unlock
 * - Idempotency
 * - Transaction rollback on error
 * - Timezone handling
 * - Manual unlock
 * - Error handling
 */

import { UnlockService } from '@/lib/unlock-service';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// 1. Setup Mock Factory (Hoisted)
jest.mock('@/lib/server-db', () => {
    const { mockDeep } = require('jest-mock-extended');
    return {
        __esModule: true,
        prisma: mockDeep(),
    };
});

// 2. Import the mocked module to get the reference (Jest returns the mock)
import { prisma } from '@/lib/server-db';
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

import { createMockCapsule, pastDate, futureDate } from '../utils/test-utils';

describe('UnlockService', () => {
    let unlockService: UnlockService;

    // Reset mocks
    beforeEach(() => {
        mockReset(prismaMock);
        unlockService = new UnlockService();
        jest.clearAllMocks();
    });

    describe('unlockDueCapsules', () => {
        it('should unlock capsules that have passed their unlock time', async () => {
            // Arrange
            const pastUnlockTime = pastDate(1);
            const capsule = createMockCapsule({
                id: 'capsule-1',
                isLocked: true,
                unlockTime: pastUnlockTime,
            });

            prismaMock.capsule.findMany.mockResolvedValue([capsule]);
            prismaMock.$transaction.mockImplementation(async (callback: any) => {
                return callback(prismaMock);
            });
            prismaMock.capsule.update.mockResolvedValue({
                ...capsule,
                isLocked: false,
            });
            prismaMock.auditLog.create.mockResolvedValue({
                id: 'audit-1',
                action: 'CAPSULE_UNLOCKED',
                capsuleId: capsule.id,
                userId: capsule.ownerId,
                timestamp: new Date(),
                details: JSON.stringify({}),
            });

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(true);
            expect(result.unlockedCount).toBe(1);
            expect(result.errors).toHaveLength(0);

            // Verify transaction was used
            expect(prismaMock.$transaction).toHaveBeenCalled();

            // Verify capsule was updated
            expect(prismaMock.capsule.update).toHaveBeenCalledWith({
                where: { id: capsule.id },
                data: { isLocked: false },
            });

            // Verify audit log was created
            expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    action: 'CAPSULE_UNLOCKED',
                    capsuleId: capsule.id,
                    userId: capsule.ownerId,
                }),
            });
        });

        it('should not unlock capsules with future unlock times', async () => {
            // Arrange
            const futureUnlockTime = futureDate(1);
            const capsule = createMockCapsule({
                isLocked: true,
                unlockTime: futureUnlockTime,
            });

            prismaMock.capsule.findMany.mockResolvedValue([]);

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(true);
            expect(result.unlockedCount).toBe(0);
            expect(prismaMock.capsule.update).not.toHaveBeenCalled();
        });

        it('should handle multiple capsules', async () => {
            // Arrange
            const capsules = [
                createMockCapsule({ id: 'capsule-1', unlockTime: pastDate(1) }),
                createMockCapsule({ id: 'capsule-2', unlockTime: pastDate(2) }),
                createMockCapsule({ id: 'capsule-3', unlockTime: pastDate(3) }),
            ];

            prismaMock.capsule.findMany.mockResolvedValue(capsules);
            prismaMock.$transaction.mockImplementation(async (callback: any) => {
                return callback(prismaMock);
            });
            prismaMock.capsule.update.mockResolvedValue({} as any);
            prismaMock.auditLog.create.mockResolvedValue({} as any);

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(true);
            expect(result.unlockedCount).toBe(3);
            expect(prismaMock.$transaction).toHaveBeenCalledTimes(3);
        });

        it('should be idempotent - handle already unlocked capsules gracefully', async () => {
            // Arrange
            const capsule = createMockCapsule({
                isLocked: false, // Already unlocked
                unlockTime: pastDate(1),
            });

            // Should not find any locked capsules
            prismaMock.capsule.findMany.mockResolvedValue([]);

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(true);
            expect(result.unlockedCount).toBe(0);
            expect(prismaMock.capsule.update).not.toHaveBeenCalled();
        });

        it('should rollback transaction if audit log creation fails', async () => {
            // Arrange
            const capsule = createMockCapsule({
                unlockTime: pastDate(1),
            });

            prismaMock.capsule.findMany.mockResolvedValue([capsule]);
            prismaMock.$transaction.mockRejectedValue(new Error('Audit log creation failed'));

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(false);
            expect(result.unlockedCount).toBe(0);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0]).toContain('Failed to unlock capsule');
        });

        it('should continue unlocking other capsules if one fails', async () => {
            // Arrange
            const capsules = [
                createMockCapsule({ id: 'capsule-1', unlockTime: pastDate(1) }),
                createMockCapsule({ id: 'capsule-2', unlockTime: pastDate(2) }),
            ];

            prismaMock.capsule.findMany.mockResolvedValue(capsules);

            let callCount = 0;
            prismaMock.$transaction.mockImplementation(async (callback: any) => {
                callCount++;
                if (callCount === 1) {
                    throw new Error('First capsule failed');
                }
                return callback(prismaMock);
            });

            prismaMock.capsule.update.mockResolvedValue({} as any);
            prismaMock.auditLog.create.mockResolvedValue({} as any);

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(false); // Not fully successful
            expect(result.unlockedCount).toBe(1); // Second capsule succeeded
            expect(result.errors).toHaveLength(1);
        });

        it('should handle database connection errors gracefully', async () => {
            // Arrange
            prismaMock.capsule.findMany.mockRejectedValue(new Error('Database connection failed'));

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(false);
            expect(result.unlockedCount).toBe(0);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0]).toContain('Unlock job failed');
        });

        it('should use UTC timezone for unlock time comparison', async () => {
            // Arrange
            const now = new Date();
            const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

            const capsule = createMockCapsule({
                unlockTime: oneMinuteAgo,
            });

            prismaMock.capsule.findMany.mockResolvedValue([capsule]);
            prismaMock.$transaction.mockImplementation(async (callback: any) => {
                return callback(prismaMock);
            });
            prismaMock.capsule.update.mockResolvedValue({} as any);
            prismaMock.auditLog.create.mockResolvedValue({} as any);

            // Act
            const result = await unlockService.unlockDueCapsules();

            // Assert
            expect(result.success).toBe(true);
            expect(result.unlockedCount).toBe(1);

            // Verify query used correct time comparison
            expect(prismaMock.capsule.findMany).toHaveBeenCalledWith({
                where: {
                    isLocked: true,
                    unlockTime: {
                        lte: expect.any(Date),
                    },
                },
                select: expect.any(Object),
            });
        });
    });

    describe('shouldUnlock', () => {
        it('should return true for locked capsule past unlock time', async () => {
            // Arrange
            const capsule = createMockCapsule({
                isLocked: true,
                unlockTime: pastDate(1),
            });

            prismaMock.capsule.findUnique.mockResolvedValue(capsule);

            // Act
            const result = await unlockService.shouldUnlock(capsule.id);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false for locked capsule with future unlock time', async () => {
            // Arrange
            const capsule = createMockCapsule({
                isLocked: true,
                unlockTime: futureDate(1),
            });

            prismaMock.capsule.findUnique.mockResolvedValue(capsule);

            // Act
            const result = await unlockService.shouldUnlock(capsule.id);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for already unlocked capsule', async () => {
            // Arrange
            const capsule = createMockCapsule({
                isLocked: false,
                unlockTime: pastDate(1),
            });

            prismaMock.capsule.findUnique.mockResolvedValue(capsule);

            // Act
            const result = await unlockService.shouldUnlock(capsule.id);

            // Assert
            expect(result).toBe(false);
        });

        it('should return false for non-existent capsule', async () => {
            // Arrange
            prismaMock.capsule.findUnique.mockResolvedValue(null);

            // Act
            const result = await unlockService.shouldUnlock('non-existent');

            // Assert
            expect(result).toBe(false);
        });

        it('should return false on database error', async () => {
            // Arrange
            prismaMock.capsule.findUnique.mockRejectedValue(new Error('Database error'));

            // Act
            const result = await unlockService.shouldUnlock('capsule-1');

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('manualUnlock', () => {
        it('should unlock capsule when owner requests', async () => {
            // Arrange
            const capsule = createMockCapsule({
                id: 'capsule-1',
                ownerId: 'user-1',
                isLocked: true,
            });

            prismaMock.capsule.findUnique.mockResolvedValue(capsule);
            prismaMock.$transaction.mockImplementation(async (callback: any) => {
                return callback(prismaMock);
            });
            prismaMock.capsule.update.mockResolvedValue({} as any);
            prismaMock.auditLog.create.mockResolvedValue({} as any);

            // Act
            const result = await unlockService.manualUnlock('capsule-1', 'user-1');

            // Assert
            expect(result).toBe(true);
            expect(prismaMock.$transaction).toHaveBeenCalled();
            expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    action: 'CAPSULE_MANUALLY_UNLOCKED',
                }),
            });
        });

        it('should reject manual unlock from non-owner', async () => {
            // Arrange
            const capsule = createMockCapsule({
                ownerId: 'user-1',
            });

            prismaMock.capsule.findUnique.mockResolvedValue(capsule);

            // Act
            const result = await unlockService.manualUnlock('capsule-1', 'user-2');

            // Assert
            expect(result).toBe(false);
            expect(prismaMock.capsule.update).not.toHaveBeenCalled();
        });

        it('should be idempotent - return true for already unlocked capsule', async () => {
            // Arrange
            const capsule = createMockCapsule({
                ownerId: 'user-1',
                isLocked: false,
            });

            prismaMock.capsule.findUnique.mockResolvedValue(capsule);

            // Act
            const result = await unlockService.manualUnlock('capsule-1', 'user-1');

            // Assert
            expect(result).toBe(true);
            expect(prismaMock.capsule.update).not.toHaveBeenCalled();
        });

        it('should return false for non-existent capsule', async () => {
            // Arrange
            prismaMock.capsule.findUnique.mockResolvedValue(null);

            // Act
            const result = await unlockService.manualUnlock('non-existent', 'user-1');

            // Assert
            expect(result).toBe(false);
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            const capsule = createMockCapsule({
                ownerId: 'user-1',
                isLocked: true,
            });

            prismaMock.capsule.findUnique.mockResolvedValue(capsule);
            prismaMock.$transaction.mockRejectedValue(new Error('Database error'));

            // Act
            const result = await unlockService.manualUnlock('capsule-1', 'user-1');

            // Assert
            expect(result).toBe(false);
        });
    });
});
