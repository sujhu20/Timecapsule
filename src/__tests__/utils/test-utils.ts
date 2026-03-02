/**
 * Test Utilities
 * 
 * Helper functions and mock data generators for testing
 */

import { User, Capsule, AuditLog } from '@prisma/client';

/**
 * Generate mock user data
 */
export function createMockUser(overrides?: Partial<User>): User {
    return {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: '$2a$10$hashedpassword', // Hashed password
        image: null,
        emailVerified: null,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
        ...overrides,
    };
}

/**
 * Generate mock capsule data
 */
export function createMockCapsule(overrides?: Partial<Capsule>): Capsule {
    return {
        id: 'capsule-123',
        title: 'Test Capsule',
        content: 'encrypted-content',
        createdAt: new Date('2026-01-01'),
        unlockTime: new Date('2026-12-31'),
        isLocked: true,
        ownerId: 'user-123',
        recipientName: null,
        recipientEmail: null,
        privacy: 'private',
        ...overrides,
    };
}

/**
 * Generate mock audit log data
 */
export function createMockAuditLog(overrides?: Partial<AuditLog>): AuditLog {
    return {
        id: 'audit-123',
        action: 'CAPSULE_CREATED',
        capsuleId: 'capsule-123',
        userId: 'user-123',
        timestamp: new Date('2026-01-01'),
        details: JSON.stringify({ test: 'data' }),
        ...overrides,
    };
}

/**
 * Create a date in the past
 */
export function pastDate(daysAgo: number = 1): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
}

/**
 * Create a date in the future
 */
export function futureDate(daysAhead: number = 1): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date;
}

/**
 * Wait for async operations
 */
export function wait(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock NextAuth session
 */
export function createMockSession(userId: string = 'user-123') {
    return {
        user: {
            id: userId,
            email: 'test@example.com',
            name: 'Test User',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
}

/**
 * Mock NextRequest
 */
export function createMockRequest(options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    url?: string;
} = {}) {
    const {
        method = 'GET',
        body = null,
        headers = {},
        url = 'http://localhost:3000/api/test',
    } = options;

    return {
        method,
        url,
        headers: new Headers(headers),
        json: async () => body,
        text: async () => JSON.stringify(body),
    } as any;
}
