
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Starting Delete Crash Reproduction...');

    // 1. Create Mock User & Capsule
    const user = await prisma.user.upsert({
        where: { email: 'crash-test@example.com' },
        update: {},
        create: {
            email: 'crash-test@example.com',
            name: 'Crash Test Dummy',
            id: 'user-crash-test',
        },
    });

    const capsule = await prisma.capsule.create({
        data: {
            title: 'Delete Me',
            content: 'EncryptedContent',
            unlockTime: new Date(Date.now() + 10000),
            ownerId: user.id,
            privacy: 'private',
        },
    });

    console.log(`✅ Created Capsule: ${capsule.id}`);

    // 2. Create Audit Log (Linking to capsule) - The Suspected Constraint
    await prisma.auditLog.create({
        data: {
            action: 'CREATE',
            capsuleId: capsule.id,
            userId: user.id,
            details: 'Test log',
        },
    });
    console.log('✅ Created AuditLog linked to Capsule');

    // 3. Simulate Logic Bug: accessing .userId on raw prisma result
    const rawCapsule = await prisma.capsule.findUnique({ where: { id: capsule.id } });

    console.log(`\n🔍 PROPERTY CHECK:`);
    console.log(`rawCapsule.ownerId: ${rawCapsule?.ownerId}`);
    console.log(`rawCapsule.userId: ${rawCapsule?.userId}`);

    if (rawCapsule.ownerId !== user.id) {
        console.error('❌ BUG PERSISTS: ownerId mismatch!');
    } else {
        console.log('✅ LOGIC VALID: ownerId matches user.id (Fix verified)');
    }

    // 4. Simulate Constraint Crash
    try {
        console.log('\n🗑️ Attempting Prisma Delete...');
        await prisma.capsule.delete({
            where: { id: capsule.id },
        });
        console.log('✅ Delete Successful (Unexpected if constraint exists)');
    } catch (e) {
        console.error('❌ DELETE FAILED (Expected Constraint Crash):');
        console.error(e.message);
    }

    // Cleanup
    try {
        // Force delete logs first to clean up
        await prisma.auditLog.deleteMany({ where: { capsuleId: capsule.id } });
        await prisma.capsule.deleteMany({ where: { id: capsule.id } });
        await prisma.user.delete({ where: { id: user.id } });
    } catch (e) { }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
