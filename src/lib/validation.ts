import { z } from 'zod';

/**
 * Input Validation Schemas
 * 
 * Comprehensive validation for all API inputs to prevent:
 * - XSS attacks
 * - SQL injection
 * - Oversized payloads
 * - Invalid data types
 * - Missing required fields
 */

// ===== CAPSULE VALIDATION =====

export const createCapsuleSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim(),

    content: z.string()
        .min(1, 'Content is required')
        .max(10_000_000, 'Content must be less than 10MB') // 10MB limit
        .trim(),

    unlockTime: z.string()
        .datetime('Invalid unlock time format')
        .refine((date) => new Date(date) > new Date(), {
            message: 'Unlock time must be in the future',
        }),

    privacy: z.enum(['public', 'private'], {
        errorMap: () => ({ message: 'Privacy must be either public or private' }),
    }).default('private'),

    type: z.enum(['text', 'image', 'video', 'audio', 'mixed', 'ar'], {
        errorMap: () => ({ message: 'Invalid capsule type' }),
    }).default('text'),
});

export const updateCapsuleSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim()
        .optional(),

    content: z.string()
        .min(1, 'Content is required')
        .max(10_000_000, 'Content must be less than 10MB')
        .trim()
        .optional(),

    privacy: z.enum(['public', 'private']).optional(),
});

// ===== USER VALIDATION =====

export const updateUserSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters')
        .trim()
        .optional(),

    bio: z.string()
        .max(500, 'Bio must be less than 500 characters')
        .trim()
        .optional(),

    image: z.string()
        .url('Invalid image URL')
        .optional(),
});

// ===== COMMENT VALIDATION =====

export const createCommentSchema = z.object({
    content: z.string()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment must be less than 1000 characters')
        .trim(),

    capsuleId: z.string()
        .uuid('Invalid capsule ID'),
});

// ===== AUTH VALIDATION =====

export const signUpSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .max(255, 'Email too long'),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name too long')
        .trim(),
});

export const signInSchema = z.object({
    email: z.string()
        .email('Invalid email address'),

    password: z.string()
        .min(1, 'Password is required'),
});

// ===== PAGINATION VALIDATION =====

export const paginationSchema = z.object({
    cursor: z.string().optional(),
    limit: z.number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .default(50),
});

// ===== QUERY VALIDATION =====

export const capsuleQuerySchema = z.object({
    privacy: z.enum(['public', 'private', 'all']).optional(),
    isLocked: z.boolean().optional(),
    sortBy: z.enum(['createdAt', 'unlockTime']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).merge(paginationSchema);

// ===== SANITIZATION HELPERS =====

/**
 * Sanitize HTML to prevent XSS
 * Strips all HTML tags and dangerous characters
 */
export function sanitizeHtml(input: string): string {
    return input
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}

/**
 * Sanitize user input for safe storage
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}

// ===== VALIDATION MIDDLEWARE =====

/**
 * Validate request body against schema
 * Returns validated data or throws error
 */
export async function validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): Promise<T> {
    try {
        return await schema.parseAsync(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            throw new ValidationError('Validation failed', errors);
        }
        throw error;
    }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
    constructor(
        message: string,
        public errors: Array<{ field: string; message: string }>
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

// ===== TYPE EXPORTS =====

export type CreateCapsuleInput = z.infer<typeof createCapsuleSchema>;
export type UpdateCapsuleInput = z.infer<typeof updateCapsuleSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CapsuleQueryInput = z.infer<typeof capsuleQuerySchema>;
