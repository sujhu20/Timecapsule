import 'server-only';
import { PrismaClient } from '@prisma/client';
import { decrypt } from './encryption';
import { logger } from './logger';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Capsule interface matching the UI expectations
// Capsule interface matching the UI expectations
export interface Capsule {
  id: string;
  title: string;
  description?: string;
  content: string;
  mediaUrl?: string; // Changed from media_url
  type: 'text' | 'image' | 'video' | 'audio' | 'mixed' | 'ar';
  userId: string; // Changed from user_id
  privacy: 'public' | 'private';
  scheduledDate: string; // Changed from scheduled_date
  openedAt?: string; // Changed from opened_at
  createdAt: string; // Changed from created_at
  updatedAt: string; // Changed from updated_at
  unlockTime?: string; // Add for compatibility
  isLocked?: boolean; // Add for compatibility
}

// Convert Prisma Capsule to UI Capsule format with camelCase fields
function convertPrismaCapsule(prismaCapsule: any): Capsule {
  return {
    id: prismaCapsule.id,
    title: prismaCapsule.title,
    description: undefined, // Not in Prisma schema
    content: prismaCapsule.content, // ✅ Return encrypted content (decryption moved to API layer)
    mediaUrl: undefined, // Not in Prisma schema
    type: 'text', // Default type
    userId: prismaCapsule.ownerId, // ✅ camelCase
    privacy: prismaCapsule.privacy || 'private', // ✅ Use actual privacy value
    scheduledDate: prismaCapsule.unlockTime.toISOString(), // ✅ camelCase
    openedAt: prismaCapsule.isLocked ? undefined : prismaCapsule.unlockTime.toISOString(), // ✅ camelCase
    createdAt: prismaCapsule.createdAt.toISOString(), // ✅ camelCase
    updatedAt: prismaCapsule.createdAt.toISOString(), // ✅ camelCase
    unlockTime: prismaCapsule.unlockTime.toISOString(), // For compatibility
    isLocked: prismaCapsule.isLocked, // For compatibility
  };
}

export async function getUserCapsules(userId: string): Promise<Capsule[]> {
  try {
    logger.info(`Fetching capsules for user: ${userId}`);

    const capsules = await prisma.capsule.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    logger.info(`Found ${capsules.length} capsules for user: ${userId}`);

    // Convert (content remains encrypted)
    return capsules.map(capsule => convertPrismaCapsule(capsule));
  } catch (error) {
    logger.error('Error fetching capsules', error as Error, { userId });
    return [];
  }
}

export async function getCapsuleById(id: string): Promise<Capsule | null> {
  try {
    logger.info(`Fetching capsule: ${id}`);

    const capsule = await prisma.capsule.findUnique({
      where: { id },
    });

    if (!capsule) {
      logger.info(`Capsule not found: ${id}`);
      return null;
    }

    return convertPrismaCapsule(capsule);
  } catch (error) {
    logger.error('Error fetching capsule', error as Error, { capsuleId: id });
    return null;
  }
}

export async function createServerCapsule(capsuleData: Omit<Capsule, 'id' | 'created_at'>): Promise<Capsule | null> {
  try {
    logger.warn('createServerCapsule is deprecated — use createCapsule server action instead');
    throw new Error('Use createCapsule server action instead');
  } catch (error) {
    logger.error('Error in deprecated createServerCapsule', error as Error);
    return null;
  }
}