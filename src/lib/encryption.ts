import crypto from 'crypto';
import { env } from './env';

const ALGORITHM = 'aes-256-gcm';

/**
 * Key Rotation Strategy
 * 
 * We support Versioned Keys.
 * Format: "version:iv:authTag:encrypted"
 * Legacy Format: "iv:authTag:encrypted" (Assume v1)
 */

const KEYS: Record<string, Buffer> = {
    // Current active key
    'v1': Buffer.from(env.ENCRYPTION_KEY, 'base64'),
    // Future keys would be added here, e.g. 'v2': Buffer.from(env.ENCRYPTION_KEY_V2, 'base64')
};

// The key version to use for NEW encryption
const API_CURRENT_KEY_VERSION = 'v1';

// Verify all keys are valid
Object.entries(KEYS).forEach(([version, key]) => {
    if (key.length !== 32) {
        throw new Error(`Encryption key for ${version} must be exactly 32 bytes (44 chars base64)`);
    }
});

class EncryptionError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'EncryptionError';
    }
}

export function encrypt(text: string): string {
    try {
        const key = KEYS[API_CURRENT_KEY_VERSION];
        if (!key) throw new Error(`Active encryption key ${API_CURRENT_KEY_VERSION} not found`);

        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Format: version:iv:authTag:encrypted
        return `${API_CURRENT_KEY_VERSION}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
        throw new EncryptionError('Encryption failed', 'ENCRYPTION_FAILED');
    }
}

export function decrypt(text: string): string {
    if (!text) return '';

    try {
        const parts = text.split(':');

        // Handle Legacy Format (3 parts) vs New Format (4 parts)
        let version = 'v1';
        let ivHex: string, authTagHex: string, encryptedHex: string;

        if (parts.length === 3) {
            // Legacy: iv:authTag:encrypted
            [ivHex, authTagHex, encryptedHex] = parts;
            version = 'v1';
        } else if (parts.length === 4) {
            // New: version:iv:authTag:encrypted
            [version, ivHex, authTagHex, encryptedHex] = parts;
        } else {
            throw new EncryptionError('Invalid encrypted format', 'INVALID_FORMAT');
        }

        const key = KEYS[version];
        if (!key) {
            throw new EncryptionError(`Unknown encryption key version: ${version}`, 'UNKNOWN_KEY_VERSION');
        }

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        if (error instanceof EncryptionError) throw error;

        // GCM auth tag mismatch throws here
        console.error('Decryption error details:', error);
        throw new EncryptionError('Decryption failed (integrity check failed)', 'DECRYPTION_FAILED');
    }
}

/**
 * Re-encrypt data with the current key version
 * Useful for migration scripts
 */
export function reencrypt(text: string): string {
    const decrypted = decrypt(text);
    return encrypt(decrypted);
}
