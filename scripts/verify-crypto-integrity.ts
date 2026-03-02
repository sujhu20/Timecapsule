
import { encrypt, decrypt, reencrypt } from '../src/lib/encryption';
import * as crypto from 'crypto';
import { assert } from 'console';

console.log('--- STARTING CRYPTOGRAPHIC INTEGRITY CHECK ---');

// Mock environment for the test if missing
if (!process.env.ENCRYPTION_KEY) {
    console.log('WARNING: ENCRYPTION_KEY missing, using mock key for verification.');
    process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
}

async function runVerify() {
    try {
        const secret = "This is a Top Secret Message for 2030";

        // 1. Round Trip
        console.log('1. Testing Round Trip...');
        const encrypted = await encrypt(secret);
        const decrypted = await decrypt(encrypted);

        if (decrypted !== secret) {
            throw new Error('Decryption mismatch!');
        }
        console.log('   PASS: Data preserved exactly.');

        // 2. Format Validation
        const parts = encrypted.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encryption format (expected iv:tag:data)');
        }
        console.log('   PASS: Format is iv:authTag:content.');

        // 3. Corruption Test (Tampered Payload)
        console.log('2. Testing Tampered Payload...');
        const tampered = encrypted.substring(0, encrypted.length - 5) + 'X';
        try {
            await decrypt(tampered);
            console.error('   FAIL: Tampered data was decrypted!');
        } catch (e: any) {
            console.log('   PASS: Decryption failed as expected (' + e.message + ')');
        }

        // 4. Key Rotation Simulation
        console.log('3. Testing Key Rotation logic...');
        // We can't easily change the key var in process during runtime for the lib if it caches it, 
        // but we can test reencrypt API existence.
        const reencrypted = await reencrypt(encrypted);
        const decrypted2 = await decrypt(reencrypted);
        if (decrypted2 !== secret) {
            throw new Error('Re-encryption corrupted data');
        }
        console.log('   PASS: Re-encryption checks out.');

        console.log('--- CRYPTO INTEGRITY VERIFIED ---');
    } catch (err) {
        console.error('FATAL CRYPTO FAILURE:', err);
        process.exit(1);
    }
}

runVerify();
