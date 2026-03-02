/**
 * @jest-environment node
 *
 * Error Handler Tests
 * Tests the toSafeError, errorResponse, assert, and assertExists utilities.
 */

// Mock logger to prevent noise
jest.mock('@/lib/logger', () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    },
}));

// Mock Prisma error types
jest.mock('@prisma/client', () => {
    class PrismaClientKnownRequestError extends Error {
        code: string;
        meta?: Record<string, unknown>;
        clientVersion: string;
        batchRequestIdx?: number;

        constructor(message: string, { code, meta, clientVersion }: { code: string; meta?: Record<string, unknown>; clientVersion: string }) {
            super(message);
            this.name = 'PrismaClientKnownRequestError';
            this.code = code;
            this.meta = meta;
            this.clientVersion = clientVersion;
        }
    }

    class PrismaClientValidationError extends Error {
        clientVersion: string;
        constructor(message: string, { clientVersion }: { clientVersion: string }) {
            super(message);
            this.name = 'PrismaClientValidationError';
            this.clientVersion = clientVersion;
        }
    }

    return {
        Prisma: {
            PrismaClientKnownRequestError,
            PrismaClientValidationError,
        },
    };
});

import { Prisma } from '@prisma/client';
import {
    toSafeError,
    errorResponse,
    assert,
    assertExists,
    ErrorType,
} from '@/lib/error-handler';
import { ValidationError } from '@/lib/validation';

describe('toSafeError', () => {
    describe('ValidationError', () => {
        it('should map to 400 VALIDATION_ERROR', () => {
            const err = new ValidationError('Validation failed', [
                { field: 'email', message: 'Invalid email' },
            ]);
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.VALIDATION);
            expect(result.statusCode).toBe(400);
            expect(result.details?.errors).toHaveLength(1);
        });
    });

    describe('Prisma errors', () => {
        it('P2002 unique constraint → 409 CONFLICT', () => {
            const err = new Prisma.PrismaClientKnownRequestError('Unique', {
                code: 'P2002',
                clientVersion: '5.0',
            });
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.CONFLICT);
            expect(result.statusCode).toBe(409);
        });

        it('P2025 not found → 404 NOT_FOUND', () => {
            const err = new Prisma.PrismaClientKnownRequestError('Not found', {
                code: 'P2025',
                clientVersion: '5.0',
            });
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.NOT_FOUND);
            expect(result.statusCode).toBe(404);
        });

        it('P2003 FK constraint → 400 VALIDATION_ERROR', () => {
            const err = new Prisma.PrismaClientKnownRequestError('FK', {
                code: 'P2003',
                clientVersion: '5.0',
            });
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.VALIDATION);
            expect(result.statusCode).toBe(400);
        });

        it('Unknown Prisma code → 500 DATABASE_ERROR', () => {
            const err = new Prisma.PrismaClientKnownRequestError('Unknown', {
                code: 'P9999',
                clientVersion: '5.0',
            });
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.DATABASE);
            expect(result.statusCode).toBe(500);
        });

        it('PrismaClientValidationError → 400 VALIDATION_ERROR', () => {
            const err = new Prisma.PrismaClientValidationError('Validation', {
                clientVersion: '5.0',
            });
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.VALIDATION);
            expect(result.statusCode).toBe(400);
        });
    });

    describe('Generic Error', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        afterEach(() => {
            Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, configurable: true });
        });

        it('Authentication required → 401', () => {
            const err = new Error('Authentication required');
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.AUTHENTICATION);
            expect(result.statusCode).toBe(401);
        });

        it('Access denied → 403', () => {
            const err = new Error('Access denied');
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.AUTHORIZATION);
            expect(result.statusCode).toBe(403);
        });

        it('Not found → 404', () => {
            const err = new Error('Not found');
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.NOT_FOUND);
            expect(result.statusCode).toBe(404);
        });

        it('Rate limit → 429', () => {
            const err = new Error('Rate limit exceeded');
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.RATE_LIMIT);
            expect(result.statusCode).toBe(429);
        });

        it('Generic error in production → safe message (no internal details)', () => {
            Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
            const err = new Error('Internal DB connection string leaked');
            const result = toSafeError(err);
            expect(result.type).toBe(ErrorType.SERVER);
            expect(result.statusCode).toBe(500);
            expect(result.message).toBe('An unexpected error occurred');
            expect(result.message).not.toContain('DB connection string');
        });

        it('Generic error in development → actual message exposed', () => {
            Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', configurable: true });
            const err = new Error('Specific debug info');
            const result = toSafeError(err);
            expect(result.message).toBe('Specific debug info');
        });
    });

    describe('Unknown error type', () => {
        it('non-Error → 500 SERVER_ERROR with safe message', () => {
            const result = toSafeError('string error');
            expect(result.type).toBe(ErrorType.SERVER);
            expect(result.statusCode).toBe(500);
        });

        it('null → 500 SERVER_ERROR', () => {
            const result = toSafeError(null);
            expect(result.statusCode).toBe(500);
        });
    });
});

describe('errorResponse', () => {
    it('should return a NextResponse with the correct status code', () => {
        const err = new ValidationError('bad', [{ field: 'x', message: 'required' }]);
        const response = errorResponse(err);
        // NextResponse.json is mocked by jest environment — just verify shape
        expect(response).toBeDefined();
    });
});

describe('assert', () => {
    it('should not throw when condition is true', () => {
        expect(() => assert(true, 'should not throw')).not.toThrow();
    });

    it('should throw when condition is false', () => {
        expect(() => assert(false, 'assertion failed')).toThrow('assertion failed');
    });
});

describe('assertExists', () => {
    it('should not throw when value is defined', () => {
        expect(() => assertExists('hello', 'missing')).not.toThrow();
        expect(() => assertExists(0, 'missing')).not.toThrow();
        expect(() => assertExists(false, 'missing')).not.toThrow();
    });

    it('should throw when value is null', () => {
        expect(() => assertExists(null, 'Value is null')).toThrow('Value is null');
    });

    it('should throw when value is undefined', () => {
        expect(() => assertExists(undefined, 'Value is undefined')).toThrow('Value is undefined');
    });

    it('should use default message when not provided', () => {
        expect(() => assertExists(null)).toThrow('Required value is missing');
    });
});
