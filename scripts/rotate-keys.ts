import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from '../src/lib/encryption.js'; // Note: Adjust import for ts-node usage
// In a real script we might need to setup ts-node or compile.
// For now, we assume this is run with ts-node.

// Mock env if needed, or rely on dotenv
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function rotateKeys() {
    console.log('🔄 Starting Key Rotation Migration...');

    try {
        const capsules = await prisma.capsule.findMany();
        console.log(`Found ${capsules.length} capsules to check.`);

        let reencrypted = 0;
        let failed = 0;
        let skipped = 0;

        for (const capsule of capsules) {
            try {
                const content = capsule.content;

                // Check if already new format (check for version prefix)
                // New format: v1:iv:tag:enc (4 parts)
                // Old format: iv:tag:enc (3 parts)
                // Wait, our new format IS v1.
                // If we rotate to v2, we check for 'v2:'.
                // This script creates a GENERIC re-encyptor.
                // It decrypts with whatever key works (current decrypt handles v1 and legacy),
                // then encrypts with API_CURRENT_KEY_VERSION.

                // Let's assume we want to re-encrypt everything that is NOT using current logic.
                // Or just blindly re-encrypt everything to be safe and uniform.

                const decrypted = decrypt(content);
                const newEncrypted = encrypt(decrypted);

                if (newEncrypted !== content) {
                    await prisma.capsule.update({
                        where: { id: capsule.id },
                        data: { content: newEncrypted }
                    });
                    reencrypted++;
                    process.stdout.write('.');
                } else {
                    skipped++;
                }

            } catch (error) {
                console.error(`\n❌ Failed to rotate capsule ${capsule.id}:`, error);
                failed++;
            }
        }

        console.log('\n\n✨ Key Rotation Complete');
        console.log(`✅ Re-encrypted: ${reencrypted}`);
        console.log(`⏭️ Skipped (Unchanged): ${skipped}`);
        console.log(`❌ Failed: ${failed}`);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Check if running directly
if (require.main === module) {
    rotateKeys();
}
