"use server";

import { z } from "zod";
import { prisma } from "@/lib/server-db";
import { createSafeAction } from "@/lib/safe-action";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { encrypt } from "@/lib/encryption";
import { aiService } from "@/lib/ai";
import { logger } from "@/lib/logger";

const createCapsuleSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    content: z.string().min(1, "Content is required"),
    unlockTime: z.string().refine((val) => {
        const date = new Date(val);
        return date > new Date();
    }, "Unlock time must be in the future"),
});

export const createCapsule = createSafeAction(createCapsuleSchema, async (data) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            throw new Error("Unauthorized");
        }

        // 🛡️ AI Moderation Check
        const moderation = await aiService.moderateContent(data.content);
        if (moderation.flagged) {
            logger.warn(`Capsule creation blocked by AI moderation: ${moderation.category}`, { user: session.user.email });
            throw new Error(`Content flagged as unsafe: ${moderation.category}`);
        }

        const user = await prisma.user.upsert({
            where: { email: session.user.email },
            update: {},
            create: {
                email: session.user.email,
                name: session.user.name,
            },
        });

        const capsule = await prisma.capsule.create({
            data: {
                title: data.title,
                content: encrypt(data.content), // Synchronous encryption
                unlockTime: new Date(data.unlockTime),
                ownerId: user.id,
                // AI Metadata could be added here if schema supported it
            },
        });

        logger.info(`Capsule created successfully: ${capsule.id}`);

        return capsule;
    } catch (error) {
        logger.error("Failed to create capsule", error);
        throw error;
    }
});
