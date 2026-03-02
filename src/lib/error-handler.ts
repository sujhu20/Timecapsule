import { NextResponse } from 'next/server';
import { logger } from './logger';
import { ValidationError } from './validation';
import { Prisma } from '@prisma/client';

/**
 * Secure Error Handler
 * 
 * Prevents internal error exposure while providing useful feedback
 * - Never exposes stack traces in production
 * - Never exposes database errors
 * - Never exposes file paths
 * - Logs all errors for debugging
 * - Returns safe, user-friendly messages
 */

export enum ErrorType {
    VALIDATION = 'VALIDATION_ERROR',
    AUTHENTICATION = 'AUTHENTICATION_ERROR',
    AUTHORIZATION = 'AUTHORIZATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
    SERVER = 'SERVER_ERROR',
    DATABASE = 'DATABASE_ERROR',
}

export interface SafeError {
    type: ErrorType;
    message: string;
    statusCode: number;
    details?: Record<string, any>;
}

/**
 * Convert any error to a safe, user-facing error
 */
export function toSafeError(error: unknown, context?: string): SafeError {
    // Log the full error for debugging (server-side only)
    logger.error('Error occurred', error, { context });

    // Validation errors - safe to expose
    if (error instanceof ValidationError) {
        return {
            type: ErrorType.VALIDATION,
            message: 'Invalid input data',
            statusCode: 400,
            details: { errors: error.errors },
        };
    }

    // Prisma errors - DO NOT expose details
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation
        if (error.code === 'P2002') {
            return {
                type: ErrorType.CONFLICT,
                message: 'A record with this information already exists',
                statusCode: 409,
            };
        }

        // P2025: Record not found
        if (error.code === 'P2025') {
            return {
                type: ErrorType.NOT_FOUND,
                message: 'Resource not found',
                statusCode: 404,
            };
        }

        // P2003: Foreign key constraint violation
        if (error.code === 'P2003') {
            return {
                type: ErrorType.VALIDATION,
                message: 'Invalid reference to related resource',
                statusCode: 400,
            };
        }

        // Generic database error - DO NOT expose code or details
        return {
            type: ErrorType.DATABASE,
            message: 'Database operation failed',
            statusCode: 500,
        };
    }

    // Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
        return {
            type: ErrorType.VALIDATION,
            message: 'Invalid data format',
            statusCode: 400,
        };
    }

    // Custom application errors
    if (error instanceof Error) {
        // Check for known error messages
        if (error.message.includes('Authentication required')) {
            return {
                type: ErrorType.AUTHENTICATION,
                message: 'Authentication required',
                statusCode: 401,
            };
        }

        if (error.message.includes('Access denied') || error.message.includes('Forbidden')) {
            return {
                type: ErrorType.AUTHORIZATION,
                message: 'You do not have permission to access this resource',
                statusCode: 403,
            };
        }

        if (error.message.includes('Not found')) {
            return {
                type: ErrorType.NOT_FOUND,
                message: 'Resource not found',
                statusCode: 404,
            };
        }

        if (error.message.includes('Rate limit')) {
            return {
                type: ErrorType.RATE_LIMIT,
                message: 'Too many requests. Please try again later.',
                statusCode: 429,
            };
        }

        // Generic error - DO NOT expose message in production
        if (process.env.NODE_ENV === 'production') {
            return {
                type: ErrorType.SERVER,
                message: 'An unexpected error occurred',
                statusCode: 500,
            };
        } else {
            // In development, expose the message for debugging
            return {
                type: ErrorType.SERVER,
                message: error.message,
                statusCode: 500,
            };
        }
    }

    // Unknown error type
    return {
        type: ErrorType.SERVER,
        message: 'An unexpected error occurred',
        statusCode: 500,
    };
}

/**
 * Create a safe error response
 */
export function errorResponse(error: unknown, context?: string): NextResponse {
    const safeError = toSafeError(error, context);

    return NextResponse.json(
        {
            success: false,
            error: {
                type: safeError.type,
                message: safeError.message,
                ...(safeError.details && { details: safeError.details }),
            },
        },
        { status: safeError.statusCode }
    );
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends any[], R>(
    handler: (...args: T) => Promise<R>,
    context?: string
) {
    return async (...args: T): Promise<R | NextResponse> => {
        try {
            return await handler(...args);
        } catch (error) {
            return errorResponse(error, context);
        }
    };
}

/**
 * Assert condition or throw error
 */
export function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * Assert value is not null/undefined or throw error
 */
export function assertExists<T>(
    value: T | null | undefined,
    message: string = 'Required value is missing'
): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error(message);
    }
}
