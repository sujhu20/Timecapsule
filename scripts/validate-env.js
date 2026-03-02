const crypto = require('crypto');

/**
 * PRODUCTION ENVIRONMENT VALIDATOR (Standalone JS)
 * 
 * Runs critical checks before application start.
 * 1. Validates ENCRYPTION_KEY presence and strength.
 * 2. Checks for known weak/development keys.
 * 3. Validates encryption round-trip capability using the exact algorithm (aes-256-gcm).
 * 
 * Usage: node scripts/validate-env.js
 */

const ALGORITHM = 'aes-256-gcm';
const DEV_KEY_VALUE = 'ZGV2LWtleS1kb25vdHVzZWlucHJvZHVjdGlvbjEyMzQ='; // "dev-key-donotuseinproduction1234" (32 bytes)

function validate() {
    console.log('🔒 Validating Production Environment Security...');

    // Load from process.env (assuming dotenv is preloaded or vars are set)
    // If running solely via node, you might need: require('dotenv').config();
    // But usually this script runs in a context where env is set (e.g. Next.js startup or container)
    // For local test, we attempt to load .env if available
    try {
        require('dotenv').config();
    } catch (e) {
        // ignore if dotenv not present
    }

    const key = process.env.ENCRYPTION_KEY;
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Presence Check
    if (!key) {
        if (isProduction) {
            console.error('❌ FATAL: ENCRYPTION_KEY is missing in production!');
            process.exit(1);
        } else {
            console.warn('⚠️  ENCRYPTION_KEY missing (Allowed in Dev, allows fallback)');
            // Check if fallback would work (simulated)
            return;
        }
    }

    // 2. Strength Check
    const keyBuffer = Buffer.from(key, 'base64');
    if (keyBuffer.length !== 32) {
        console.error(`❌ FATAL: ENCRYPTION_KEY must be exactly 32 bytes (base64 decoded). Found ${keyBuffer.length} bytes.`);
        process.exit(1);
    }

    // 3. Weak Key Check
    if (isProduction && key === DEV_KEY_VALUE) {
        console.error('🚨 FATAL SECURITY ERROR: You are using the default development ENCRYPTION_KEY in production.');
        console.error('   Update ENCRYPTION_KEY immediately.');
        process.exit(1);
    }

    // 4. Encryption Capabilities Check (Round-trip)
    try {
        const testPayload = `test-payload-${Date.now()}`;
        console.log('... Testing encryption round-trip (aes-256-gcm)');

        // Encrypt
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
        let encrypted = cipher.update(testPayload, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();

        // Decrypt
        const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        if (decrypted !== testPayload) {
            throw new Error('Decrypted data does not match original.');
        }

    } catch (error) {
        console.error('\n❌ FATAL CRYPTOGRAPHIC ERROR');
        console.error('   System cannot perform reliable encryption/decryption.');
        console.error(error);
        process.exit(1);
    }

    console.log('✅ Environment Security Validation Passed.');
}

validate();
