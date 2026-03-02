import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock Prisma Client
jest.mock('../server-db', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
}));

// Export mock for use in tests
import { prisma } from '../server-db';

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Reset mock between tests
beforeEach(() => {
    mockReset(prismaMock);
});
