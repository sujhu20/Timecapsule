const assert = require('assert');
const crypto = require('crypto');
require('dotenv').config();

console.log('--- STARTING LIVE ENVIRONMENT VERIFICATION ---');

// 1. Check NODE_ENV
const nodeEnv = process.env.NODE_ENV;
console.log('NODE_ENV:', nodeEnv);
if (nodeEnv !== 'production') {
    console.error('FAIL: NODE_ENV is not production (' + nodeEnv + ')');
} else {
    console.log('PASS: NODE_ENV is production');
}

// 2. Encryption Key Validation
const key = process.env.ENCRYPTION_KEY;
if (!key) {
    console.error('FAIL: ENCRYPTION_KEY definition missing');
} else {
    const keyBuffer = Buffer.from(key, 'base64');
    console.log('Key Buffer Length:', keyBuffer.length);

    if (keyBuffer.length !== 32) {
        console.error('FAIL: ENCRYPTION_KEY must be 32 bytes (256 bits). Found: ' + keyBuffer.length);
    } else {
        console.log('PASS: ENCRYPTION_KEY is valid 32 bytes');
    }
}

// 3. Database URL
if (!process.env.DATABASE_URL) {
    console.error('FAIL: DATABASE_URL missing');
} else {
    console.log('PASS: DATABASE_URL present');
}

// 4. Redis
if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn('WARNING: UPSTASH_REDIS_REST_URL missing (Rate limiting disabled?)');
} else {
    console.log('PASS: Redis config present');
}

console.log('--- ENVIRONMENT VERIFICATION COMPLETE ---');
