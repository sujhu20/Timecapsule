
import { encrypt, decrypt, reencrypt } from './encryption';

// Mock env module to avoid validation errors during test execution
jest.mock('./env', () => ({
    env: {
        ENCRYPTION_KEY: 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=', // Valid 32 bytes (base64 of '12345678901234567890123456789012')
        NODE_ENV: 'test'
    }
}));

describe('Encryption Library', () => {
    const TEST_PAYLOAD = 'This is a secret message 🚀';

    describe('encrypt', () => {
        it('should encrypt a string successfully', () => {
            const encrypted = encrypt(TEST_PAYLOAD);
            expect(encrypted).toBeDefined();
            expect(encrypted).not.toBe(TEST_PAYLOAD);
            expect(encrypted).toContain(':'); // Should have parts

            // Check format: version:iv:authTag:encrypted
            const parts = encrypted.split(':');
            expect(parts.length).toBe(4);
            expect(parts[0]).toBe('v1'); // Current version
        });

        it('should return different outputs for the same input (random IV)', () => {
            const enc1 = encrypt(TEST_PAYLOAD);
            const enc2 = encrypt(TEST_PAYLOAD);
            expect(enc1).not.toBe(enc2);
        });
    });

    describe('decrypt', () => {
        it('should decrypt a valid encrypted string', () => {
            const encrypted = encrypt(TEST_PAYLOAD);
            const decrypted = decrypt(encrypted);
            expect(decrypted).toBe(TEST_PAYLOAD);
        });

        it('should return empty string for empty input', () => {
            expect(decrypt('')).toBe('');
        });

        it('should throw "Invalid encrypted format" for malformed strings', () => {
            expect(() => decrypt('malformed-string')).toThrow('Invalid encrypted format');
            expect(() => decrypt('part1:part2')).toThrow('Invalid encrypted format'); // 2 parts is invalid
        });

        it('should throw "Unknown encryption key version" for unknown versions', () => {
            // Mock a string with v999
            // version:iv:authTag:encrypted
            // We need valid hex for IV/AuthTag to pass parsing if it got that far, but version check happens early?
            // Actually, logic splits then checks version.
            const fakeEncrypted = 'v999:0000:0000:0000';
            expect(() => decrypt(fakeEncrypted)).toThrow('Unknown encryption key version');
        });

        it('should throw "Decryption failed" for tampered payload', () => {
            const encrypted = encrypt(TEST_PAYLOAD);
            const parts = encrypted.split(':');

            // Tamper with the encrypted content part (last part)
            // Flip a char
            const lastPartRequest = parts[3];
            const tamperedLastPart = lastPartRequest.substring(0, lastPartRequest.length - 1) + (lastPartRequest.endsWith('a') ? 'b' : 'a');
            parts[3] = tamperedLastPart;

            const tamperedString = parts.join(':');

            // Verify it throws the specific integrity check error
            expect(() => decrypt(tamperedString)).toThrow('Decryption failed');
        });
    });

    describe('reencrypt', () => {
        it('should decrypt and re-encrypt properly', () => {
            const encrypted = encrypt(TEST_PAYLOAD);
            const reencrypted = reencrypt(encrypted);

            expect(reencrypted).not.toBe(encrypted); // New IV
            expect(decrypt(reencrypted)).toBe(TEST_PAYLOAD);
        });
    });
});
