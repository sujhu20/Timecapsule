
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getServerSession } from 'next-auth';

// 1. Hoist the mock object so it's available in the mock factory
const { mockPrisma } = vi.hoisted(() => {
    return {
        mockPrisma: {
            user: {
                upsert: vi.fn(),
            },
            capsule: {
                create: vi.fn(),
            },
        },
    };
});

// 2. Mock PrismaClient as a class that returns the hoisted mock
vi.mock('@prisma/client', () => {
    return {
        PrismaClient: class {
            constructor() {
                return mockPrisma;
            }
        },
    };
});

// 3. Mock next-auth
vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}));

// Import the action AFTER mocking
import { createCapsule } from './create-capsule';

describe('createCapsule Action', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error if user is not authenticated', async () => {
        (getServerSession as any).mockResolvedValue(null);

        const result = await createCapsule({
            title: 'Secret',
            content: 'Message',
            unlockTime: new Date(Date.now() + 100000).toISOString(),
        });

        expect(result.error).toBeDefined();
        // The safe-action wrapper catches the "Unauthorized" error and returns generic message (or specific if configured)
        // In our safe-action.ts, we return "An unexpected error occurred." for caught errors in production/default.
        expect(result.error).toBe('An unexpected error occurred.');
    });

    it('should create a capsule if input is valid and user is auth', async () => {
        (getServerSession as any).mockResolvedValue({
            user: { email: 'test@example.com', name: 'Test User' },
        });

        mockPrisma.user.upsert.mockResolvedValue({ id: 'user-123' });
        mockPrisma.capsule.create.mockResolvedValue({
            id: 'cap-123',
            title: 'Secret',
            ownerId: 'user-123',
        });

        const futureDate = new Date(Date.now() + 100000).toISOString();
        const result = await createCapsule({
            title: 'Secret',
            content: 'Message',
            unlockTime: futureDate,
        });

        expect(result.error).toBeUndefined();
        expect(result.data).toBeDefined();
        expect(result.data?.id).toBe('cap-123');
        expect(mockPrisma.capsule.create).toHaveBeenCalled();
    });

    it('should validate input constraints (zod)', async () => {
        const result = await createCapsule({
            title: '', // Empty title
            content: 'Message',
            unlockTime: new Date(Date.now() + 100000).toISOString(),
        });

        expect(result.error).toBe("Title is required");
        expect(mockPrisma.capsule.create).not.toHaveBeenCalled();
    });

    it('should reject unlock time in the past', async () => {
        const pastDate = new Date(Date.now() - 10000).toISOString();
        const result = await createCapsule({
            title: 'Past Capsule',
            content: 'Message',
            unlockTime: pastDate,
        });

        expect(result.error).toBe("Unlock time must be in the future");
        expect(mockPrisma.capsule.create).not.toHaveBeenCalled();
    });
});
