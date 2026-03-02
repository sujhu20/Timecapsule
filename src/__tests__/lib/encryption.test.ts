/**
 * @jest-environment node
 *
 * Encryption Tests
 * Tests the AES-256-GCM encrypt/decrypt pipeline including:
 * - Round-trip correctness
 * - Legacy format compatibility
 * - Tamper detection (auth tag integrity)
 * - Key versioning
 * - Edge cases (empty string, re-encryption)
 */

// Mock env module BEFORE importing encryption
jest.mock('@/lib/env', () => ({
    env: {
        ENCRYPTION_KEY: 'ZGV2LWtleS1kb25vdHVzZWlucHJvZHVjdGlvbjEyMzQ=', // 32 bytes base64
        NODE_ENV: 'test',
    },
    isProduction: false,
    isDevelopment: false,
    isTest: true,
}));

import { encrypt, decrypt, reencrypt } from '@/lib/encryption';

describe('Encryption', () => {
    describe('encrypt', () => {
        it('should return a string in version:iv:authTag:ciphertext format', () => {
            const result = encrypt('hello world');
            const parts = result.split(':');
            expect(parts).toHaveLength(4);
            expect(parts[0]).toBe('v1');
        });

        it('should produce different ciphertext for the same plaintext (random IV)', () => {
            const first = encrypt('same plaintext');
            const second = encrypt('same plaintext');
            expect(first).not.toBe(second);
        });

        it('should handle empty string input', () => {
            const result = encrypt('');
            expect(result.split(':')).toHaveLength(4);
        });

        it('should handle unicode characters', () => {
            const plaintext = '🔒 Secret अभिलेख secrets 🗝️';
            const encrypted = encrypt(plaintext);
            const decrypted = decrypt(encrypted);
            expect(decrypted).toBe(plaintext);
        });

        it('should handle very long content', () => {
            const longContent = 'A'.repeat(100_000);
            const encrypted = encrypt(longContent);
            const decrypted = decrypt(encrypted);
            expect(decrypted).toBe(longContent);
        });
    });

    describe('decrypt', () => {
        it('should round-trip: decrypt(encrypt(x)) === x', () => {
            const original = 'My secret time capsule message!';
            const encrypted = encrypt(original);
            const decrypted = decrypt(encrypted);
            expect(decrypted).toBe(original);
        });

        it('should return empty string for empty input', () => {
            expect(decrypt('')).toBe('');
        });

        it('should handle legacy 3-part format (iv:authTag:encrypted)', () => {
            // Manually create a legacy-format encrypted string using crypto
            const crypto = require('crypto');
            const key = Buffer.from('ZGV2LWtleS1kb25vdHVzZWlucHJvZHVjdGlvbjEyMzQ=', 'base64');
            const iv = crypto.randomBytes(12);
            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
            let encrypted = cipher.update('legacy message', 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag();

            const legacyFormat = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
            const result = decrypt(legacyFormat);
            expect(result).toBe('legacy message');
        });

        it('should throw DECRYPTION_FAILED when ciphertext is tampered', () => {
            const encrypted = encrypt('tamper me');
            const parts = encrypted.split(':');
            // Flip last character of ciphertext
            parts[3] = parts[3].slice(0, -1) + (parts[3].endsWith('a') ? 'b' : 'a');
            const tampered = parts.join(':');

            expect(() => decrypt(tampered)).toThrow();
        });

        it('should throw INVALID_FORMAT for malformed input (1 part)', () => {
            expect(() => decrypt('onlyone')).toThrow();
        });

        it('should throw INVALID_FORMAT for malformed input (2 parts)', () => {
            expect(() => decrypt('one:two')).toThrow();
        });

        it('should throw UNKNOWN_KEY_VERSION for unknown key version', () => {
            const parts = encrypt('test').split(':');
            parts[0] = 'v999'; // Unknown version
            expect(() => decrypt(parts.join(':'))).toThrow();
        });
    });

    describe('reencrypt', () => {
        it('should produce a different ciphertext but the same plaintext', () => {
            const plaintext = 'reencrypt me safely';
            const original = encrypt(plaintext);
            const reencrypted = reencrypt(original);

            // Different ciphertexts (random IV means they differ)
            expect(reencrypted).not.toBe(original);
            // Same plaintext when decrypted
            expect(decrypt(reencrypted)).toBe(plaintext);
        });
    });
});
