/**
 * Validation Tests
 * 
 * Tests all Zod validation schemas
 */

import {
    createCapsuleSchema,
    updateCapsuleSchema,
    createCommentSchema,
    signUpSchema,
    signInSchema,
    paginationSchema,
    validateRequest,
    ValidationError,
    sanitizeHtml,
    sanitizeInput,
} from '@/lib/validation';

describe('Validation Schemas', () => {
    describe('createCapsuleSchema', () => {
        it('should validate valid capsule data', async () => {
            const validData = {
                title: 'My Time Capsule',
                content: 'This is my secret message',
                unlockTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                privacy: 'private' as const,
                type: 'text',
            };

            const result = await createCapsuleSchema.parseAsync(validData);
            expect(result).toEqual(validData);
        });

        it('should reject title longer than 200 characters', async () => {
            const invalidData = {
                title: 'A'.repeat(201),
                content: 'Content',
                unlockTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            await expect(createCapsuleSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject content longer than 10MB', async () => {
            const invalidData = {
                title: 'Title',
                content: 'A'.repeat(10_000_001),
                unlockTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            await expect(createCapsuleSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject unlock time in the past', async () => {
            const invalidData = {
                title: 'Title',
                content: 'Content',
                unlockTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            };

            await expect(createCapsuleSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject invalid privacy value', async () => {
            const invalidData = {
                title: 'Title',
                content: 'Content',
                unlockTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                privacy: 'invalid',
            };

            await expect(createCapsuleSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should default privacy to private', async () => {
            const data = {
                title: 'Title',
                content: 'Content',
                unlockTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            const result = await createCapsuleSchema.parseAsync(data);
            expect(result.privacy).toBe('private');
        });

        it('should trim whitespace from title and content', async () => {
            const data = {
                title: '  My Title  ',
                content: '  My Content  ',
                unlockTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            const result = await createCapsuleSchema.parseAsync(data);
            expect(result.title).toBe('My Title');
            expect(result.content).toBe('My Content');
        });
    });

    describe('signUpSchema', () => {
        it('should validate valid signup data', async () => {
            const validData = {
                email: 'test@example.com',
                password: 'SecurePass123',
                name: 'Test User',
            };

            const result = await signUpSchema.parseAsync(validData);
            expect(result).toEqual(validData);
        });

        it('should reject invalid email', async () => {
            const invalidData = {
                email: 'not-an-email',
                password: 'SecurePass123',
                name: 'Test User',
            };

            await expect(signUpSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject password shorter than 8 characters', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: 'Short1',
                name: 'Test User',
            };

            await expect(signUpSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject password without uppercase letter', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: 'lowercase123',
                name: 'Test User',
            };

            await expect(signUpSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject password without lowercase letter', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: 'UPPERCASE123',
                name: 'Test User',
            };

            await expect(signUpSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject password without number', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: 'NoNumbers',
                name: 'Test User',
            };

            await expect(signUpSchema.parseAsync(invalidData)).rejects.toThrow();
        });
    });

    describe('createCommentSchema', () => {
        it('should validate valid comment', async () => {
            const validData = {
                content: 'This is a comment',
                capsuleId: '123e4567-e89b-12d3-a456-426614174000',
            };

            const result = await createCommentSchema.parseAsync(validData);
            expect(result).toEqual(validData);
        });

        it('should reject comment longer than 1000 characters', async () => {
            const invalidData = {
                content: 'A'.repeat(1001),
                capsuleId: '123e4567-e89b-12d3-a456-426614174000',
            };

            await expect(createCommentSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject invalid UUID', async () => {
            const invalidData = {
                content: 'Comment',
                capsuleId: 'not-a-uuid',
            };

            await expect(createCommentSchema.parseAsync(invalidData)).rejects.toThrow();
        });
    });

    describe('paginationSchema', () => {
        it('should validate valid pagination', async () => {
            const validData = {
                cursor: 'cursor-123',
                limit: 25,
            };

            const result = await paginationSchema.parseAsync(validData);
            expect(result).toEqual(validData);
        });

        it('should default limit to 50', async () => {
            const result = await paginationSchema.parseAsync({});
            expect(result.limit).toBe(50);
        });

        it('should reject limit > 100', async () => {
            const invalidData = { limit: 101 };
            await expect(paginationSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should reject limit < 1', async () => {
            const invalidData = { limit: 0 };
            await expect(paginationSchema.parseAsync(invalidData)).rejects.toThrow();
        });
    });
});

describe('Sanitization', () => {
    describe('sanitizeHtml', () => {
        it('should remove HTML tags', () => {
            const input = '<script>alert("xss")</script>Hello';
            const result = sanitizeHtml(input);
            expect(result).toBe('alert("xss")Hello');
        });

        it('should remove javascript: protocol', () => {
            const input = 'javascript:alert("xss")';
            const result = sanitizeHtml(input);
            expect(result).not.toContain('javascript:');
        });

        it('should remove event handlers', () => {
            const input = '<div onclick="alert()">Click</div>';
            const result = sanitizeHtml(input);
            expect(result).not.toContain('onclick');
        });
    });

    describe('sanitizeInput', () => {
        it('should remove control characters', () => {
            const input = 'Hello\x00World\x1F';
            const result = sanitizeInput(input);
            expect(result).toBe('HelloWorld');
        });

        it('should trim whitespace', () => {
            const input = '  Hello World  ';
            const result = sanitizeInput(input);
            expect(result).toBe('Hello World');
        });
    });
});

describe('validateRequest', () => {
    it('should return validated data on success', async () => {
        const data = {
            email: 'test@example.com',
            password: 'SecurePass123',
        };

        const result = await validateRequest(signInSchema, data);
        expect(result).toEqual(data);
    });

    it('should throw ValidationError on failure', async () => {
        const invalidData = {
            email: 'not-an-email',
            password: 'short',
        };

        await expect(validateRequest(signInSchema, invalidData)).rejects.toThrow(ValidationError);
    });

    it('should include field-level errors', async () => {
        const invalidData = {
            email: 'not-an-email',
            password: '',
        };

        try {
            await validateRequest(signInSchema, invalidData);
            fail('Should have thrown ValidationError');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            if (error instanceof ValidationError) {
                expect(error.errors.length).toBeGreaterThan(0);
                expect(error.errors[0]).toHaveProperty('field');
                expect(error.errors[0]).toHaveProperty('message');
            }
        }
    });
});
