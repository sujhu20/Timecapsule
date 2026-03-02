import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getCapsuleById, prisma } from '@/lib/server-db';
import { logger } from '@/lib/logger';
import { apiError, apiResponse } from '@/lib/api-response';
import { requireAuth, requireOwnership } from '@/lib/auth-middleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const capsuleId = params.id;

    if (!capsuleId) {
      return apiError('Capsule ID is required', 400);
    }

    // Require authentication
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    const { user } = authResult;

    logger.info(`Fetching capsule: ${capsuleId}`, { userId: user.id });

    const capsule = await getCapsuleById(capsuleId);

    if (!capsule) {
      logger.warn(`Capsule not found: ${capsuleId}`, { userId: user.id });
      return apiError('Capsule not found', 404);
    }

    // SECURITY: Check ownership for private capsules
    if (capsule.privacy === 'private') {
      const ownershipError = requireOwnership(user.id, capsule.userId, 'capsule'); // Fixed: user_id -> userId
      if (ownershipError) {
        logger.warn(`Access denied: user ${user.id} tried to access capsule owned by ${capsule.userId}`);
        return ownershipError;
      }
    }

    // SECURITY: Check if capsule is still locked
    const now = new Date();
    const unlockTime = new Date(capsule.scheduledDate || capsule.createdAt); // Used camelCase from server-db
    const isOwner = user.id === capsule.userId; // Used camelCase from server-db
    const isLocked = (() => {
      // Use isLocked if available, otherwise check time
      if (capsule.isLocked !== undefined) return capsule.isLocked;
      return unlockTime > now;
    })();

    // Check lock status for ALL capsules (Public AND Private)
    // Owner can always see their own capsules (unlocked or not? Usally yes, to edit/verify)
    // But for a true Time Capsule, maybe not?
    // Let's assume Owner can see content (edit mode).
    // If not owner, STRICT lock check.
    if (!isOwner && isLocked) {
      if (capsule.privacy === 'private') {
        // Private + Locked + Not Owner = 403 (Already checked ownership above, but double check)
        // requireOwnership checked earlier for private.
        // But let's be safe.
        logger.warn(`Capsule ${capsuleId} is locked`, { userId: user.id });
        return apiError(
          `This capsule is locked until ${unlockTime.toLocaleString()}`,
          403,
          { unlockTime: unlockTime.toISOString() }
        );
      } else {
        // Public + Locked + Not Owner = Return Metadata ONLY (Mask content)
        // We do NOT return 403 because we want them to see the countdown.
        // But we MUST NOT return content.
        capsule.content = '[Locked] Content is encrypted until unlock time';
      }
    } else {
      // Authorized to view content (Owner OR Unlocked)
      // Decrypt content
      const { decrypt } = await import('@/lib/encryption');
      try {
        capsule.content = decrypt(capsule.content);
      } catch (error) {
        logger.error(`Failed to decrypt capsule ${capsuleId}`, error);
        capsule.content = '[Error] Failed to decrypt content';
        // Note: In Phase 2 we will improve this error handling further
      }
    }

    logger.info(`Successfully fetched capsule ${capsuleId}`, { userId: user.id });

    return apiResponse({ capsule });
  } catch (error) {
    logger.error('Error fetching capsule detail', error, { capsuleId: params.id });
    return apiError(
      'Failed to fetch capsule',
      500,
      error
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const capsuleId = params.id;

    if (!capsuleId) {
      return apiError('Capsule ID is required', 400);
    }

    // Require authentication
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }
    const { user } = authResult;

    logger.info(`Attempting to delete capsule: ${capsuleId}`, { userId: user.id });

    const capsule = await prisma.capsule.findUnique({
      where: { id: capsuleId },
    });

    if (!capsule) {
      logger.warn(`Capsule not found for deletion: ${capsuleId}`, { userId: user.id });
      return apiError('Capsule not found', 404);
    }

    // Check ownership - ONLY owner can delete
    // Using requireOwnership helper but we need to pass parameters correctly
    // The helper might not be exported or usable this way if it returns NextResponse
    // Let's do manual check for clarity and safety here
    if (capsule.ownerId !== user.id) {
      logger.warn(`Delete denied: user ${user.id} tried to delete capsule owned by ${capsule.ownerId}`);
      return apiError('You do not have permission to delete this capsule', 403);
    }

    // Proceed with deletion
    await prisma.capsule.delete({
      where: { id: capsuleId },
    });

    logger.info(`Successfully deleted capsule ${capsuleId}`, { userId: user.id });

    return apiResponse({ success: true, message: 'Capsule deleted successfully' });

  } catch (error) {
    logger.error('Error deleting capsule', error, { capsuleId: params.id });
    return apiError('Failed to delete capsule', 500, error);
  }
}