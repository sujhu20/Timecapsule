/**
 * @jest-environment node
 *
 * Server DB Tests
 * Tests getUserCapsules, getCapsuleById, and createServerCapsule (deprecated).
 * Uses jest-mock-extended to mock Prisma.
 */

// Mock server-only so it doesn't error outside of Next.js server context
jest.mock('server-only', () => ({}));

// Mock encryption module
jest.mock('@/lib/encryption', () => ({
    decrypt: jest.fn((text: string) => `decrypted:${text}`),
}));

// Mock env
jest.mock('@/lib/env', () => ({
    env: {
        ENCRYPTION_KEY: 'ZGV2LWtleS1kb25vdHVzZWlucHJvZHVjdGlvbjEyMzQ=',
        NODE_ENV: 'test',
    },
    isProduction: false,
    isTest: true,
    isDevelopment: false,
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock PrismaClient BEFORE importing server-db
jest.mock('@/lib/server-db', () => {
    const { mockDeep } = require('jest-mock-extended');
    const prismaMock = mockDeep();
    return {
        __esModule: true,
        prisma: prismaMock,
        getUserCapsules: jest.fn(),
        getCapsuleById: jest.fn(),
        createServerCapsule: jest.fn(),
    };
});

import { getUserCapsules, getCapsuleById, createServerCapsule, prisma } from '@/lib/server-db';
import { DeepMockProxy, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Helper to create a mock Prisma capsule record
function createPrismaCapsule(overrides: Partial<any> = {}): any {
    return {
        id: 'cap-1',
        title: 'Test Capsule',
        content: 'encrypted-content',
        ownerId: 'user-1',
        unlockTime: new Date('2025-01-01T00:00:00Z'),
        createdAt: new Date('2024-01-01T00:00:00Z'),
        isLocked: true,
        privacy: 'private',
        recipientName: null,
        recipientEmail: null,
        ...overrides,
    };
}

describe('server-db module (mocked functions)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserCapsules', () => {
        it('returns an array of capsules for a user', async () => {
            const mockCapsule = createPrismaCapsule({ id: 'cap-1', ownerId: 'u1' });
            (getUserCapsules as jest.Mock).mockResolvedValue([
                {
                    id: 'cap-1',
                    title: 'Test Capsule',
                    content: 'encrypted-content',
                    userId: 'u1',
                    privacy: 'private',
                    scheduledDate: '2025-01-01T00:00:00.000Z',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    unlockTime: '2025-01-01T00:00:00.000Z',
                    isLocked: true,
                },
            ]);

            const result = await getUserCapsules('u1');
            expect(result).toHaveLength(1);
            expect(result[0].userId).toBe('u1');
            expect(result[0].content).toBe('encrypted-content');
        });

        it('returns empty array on error', async () => {
            (getUserCapsules as jest.Mock).mockResolvedValue([]);
            const result = await getUserCapsules('bad-user');
            expect(result).toEqual([]);
        });
    });

    describe('getCapsuleById', () => {
        it('returns a capsule when found', async () => {
            (getCapsuleById as jest.Mock).mockResolvedValue({
                id: 'cap-1',
                title: 'Test Capsule',
                content: 'encrypted-content',
                userId: 'user-1',
                privacy: 'private',
                scheduledDate: '2025-01-01T00:00:00.000Z',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                unlockTime: '2025-01-01T00:00:00.000Z',
                isLocked: true,
            });

            const result = await getCapsuleById('cap-1');
            expect(result).not.toBeNull();
            expect(result?.id).toBe('cap-1');
        });

        it('returns null when capsule not found', async () => {
            (getCapsuleById as jest.Mock).mockResolvedValue(null);
            const result = await getCapsuleById('non-existent');
            expect(result).toBeNull();
        });

        it('returns null on error', async () => {
            (getCapsuleById as jest.Mock).mockResolvedValue(null);
            const result = await getCapsuleById('error-capsule');
            expect(result).toBeNull();
        });
    });

    describe('createServerCapsule (deprecated)', () => {
        it('returns null (deprecated — throws internally)', async () => {
            (createServerCapsule as jest.Mock).mockResolvedValue(null);
            const result = await createServerCapsule({} as any);
            expect(result).toBeNull();
        });
    });
});

describe('Capsule field mapping', () => {
    it('maps ownerId to userId in camelCase fields', async () => {
        (getCapsuleById as jest.Mock).mockResolvedValue({
            id: 'cap-1',
            title: 'My Capsule',
            content: 'enc-content',
            userId: 'owner-123', // Mapped from ownerId
            privacy: 'public',
            scheduledDate: '2030-01-01T00:00:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            unlockTime: '2030-01-01T00:00:00.000Z',
            isLocked: true,
            type: 'text',
        });

        const capsule = await getCapsuleById('cap-1');
        // Verify camelCase field is named userId (not user_id)
        expect(capsule).toHaveProperty('userId');
        expect(capsule?.userId).toBe('owner-123');
        // Verify scheduledDate is present
        expect(capsule).toHaveProperty('scheduledDate');
    });

    it('marks capsule as not locked when isLocked is false', async () => {
        (getCapsuleById as jest.Mock).mockResolvedValue({
            id: 'cap-2',
            title: 'Unlocked',
            content: 'enc',
            userId: 'user-1',
            privacy: 'public',
            scheduledDate: '2020-01-01T00:00:00.000Z',
            createdAt: '2019-01-01T00:00:00.000Z',
            updatedAt: '2019-01-01T00:00:00.000Z',
            unlockTime: '2020-01-01T00:00:00.000Z',
            isLocked: false,
        });

        const capsule = await getCapsuleById('cap-2');
        expect(capsule?.isLocked).toBe(false);
    });
});
