
/**
 * @jest-environment node
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./test.db', // Ensure this matches jest.setup.ts
        },
    },
});

describe('Delete Cascade Integration', () => {
    let userId: string;
    let capsuleId: string;

    beforeAll(async () => {
        // Clean up
        await prisma.auditLog.deleteMany();
        await prisma.comment.deleteMany();
        await prisma.capsule.deleteMany();
        await prisma.user.deleteMany();

        // Setup User
        const user = await prisma.user.create({
            data: {
                email: 'cascade-test@example.com',
                name: 'Cascade Tester',
            },
        });
        userId = user.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should delete related AuditLogs when a Capsule is deleted', async () => {
        // 1. Create Capsule
        const capsule = await prisma.capsule.create({
            data: {
                title: 'Cascade Test Capsule',
                content: 'Encrypted',
                unlockTime: new Date(),
                ownerId: userId,
                privacy: 'private',
            },
        });
        capsuleId = capsule.id;

        // 2. Create Audit Logs
        await prisma.auditLog.create({
            data: {
                action: 'CREATE',
                capsuleId: capsule.id,
                userId: userId,
                details: 'Created',
            },
        });

        await prisma.auditLog.create({
            data: {
                action: 'UNLOCK',
                capsuleId: capsule.id,
                userId: userId,
                details: 'Unlocked',
            },
        });

        // Verify logs exist
        const logsBefore = await prisma.auditLog.count({
            where: { capsuleId: capsule.id },
        });
        expect(logsBefore).toBe(2);

        // 3. Delete Capsule
        await prisma.capsule.delete({
            where: { id: capsule.id },
        });

        // 4. Verify Logs are GONE
        const logsAfter = await prisma.auditLog.count({
            where: { capsuleId: capsule.id },
        });
        expect(logsAfter).toBe(0);

        // 5. Verify Capsule is GONE
        const capsuleAfter = await prisma.capsule.findUnique({
            where: { id: capsule.id },
        });
        expect(capsuleAfter).toBeNull();
    });
});
