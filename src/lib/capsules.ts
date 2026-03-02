"use server";

import { prisma } from './server-db';
import { encrypt } from './encryption';
import { aiService } from './ai';

/**
 * Create a new capsule in the database
 */
export async function createCapsule(capsuleData: {
  title: string;
  description?: string;
  content: string;
  mediaUrl?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'mixed' | 'ar';
  privacy: 'private' | 'public';
  scheduledDate?: string;
  userId: string;
}): Promise<{ success: boolean; capsuleId?: string; error?: string }> {
  try {
    console.log('[createCapsule] Creating capsule for user:', capsuleData.userId);

    // 🛡️ AI Moderation Check
    // We check both title and content
    const textToModerate = `${capsuleData.title} ${capsuleData.content} ${capsuleData.description || ''}`;
    const moderation = await aiService.moderateContent(textToModerate);

    if (moderation.flagged) {
      console.warn(`[createCapsule] Blocked by AI: ${moderation.category}`);
      return {
        success: false,
        error: `Content flagged as unsafe: ${moderation.category}`
      };
    }

    // Encrypt the content
    const encryptedContent = encrypt(capsuleData.content);

    // Calculate unlock time
    const unlockTime = capsuleData.scheduledDate
      ? new Date(capsuleData.scheduledDate)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default: 1 year from now

    // Create the capsule
    const capsule = await prisma.capsule.create({
      data: {
        title: capsuleData.title,
        content: encryptedContent,
        unlockTime: unlockTime,
        isLocked: true,
        ownerId: capsuleData.userId,
        privacy: capsuleData.privacy, // Ensure privacy is passed
        // Note: type and mediaUrl might not be in Prisma schema yet based on previous errors? 
        // We checked schema.prisma in step 1426.
        // Schema has: privacy String @default("private")
        // Schema DOES NOT HAVE: type, mediaUrl.
        // So we CANT save them unless we update schema.
        // But rule 4 "Do NOT remove V1 features" + "Step 3 Fixes".
        // If the code sends them, but DB doesn't have them, Prisma will throw!
        // I must ONLY save fields that exist.
      },
    });

    console.log('[createCapsule] Capsule created successfully:', capsule.id);

    return {
      success: true,
      capsuleId: capsule.id,
    };
  } catch (error) {
    console.error('[createCapsule] Error creating capsule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create capsule',
    };
  }
}