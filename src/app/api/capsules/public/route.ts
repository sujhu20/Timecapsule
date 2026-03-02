import { NextResponse } from "next/server";
import { prisma } from '@/lib/server-db';
import { apiResponse, apiError } from '@/lib/api-response';
import { logger } from '@/lib/logger';

/**
 * GET /api/capsules/public
 * 
 * Returns ONLY public capsules
 * SECURITY FIX: Added privacy filter to prevent IDOR vulnerability
 */
export async function GET() {
    try {
        // SECURITY: Only fetch capsules that are explicitly public
        const capsules = await prisma.capsule.findMany({
            where: {
                privacy: 'public', // ✅ CRITICAL: Only public capsules
                // Note: We don't filter by isLocked here because users should see
                // public capsules even if they're locked (with lock indicator)
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                isLocked: true,
                unlockTime: true,
                privacy: true, // Include actual privacy value
                ownerId: true, // For author info
                owner: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            // Limit to recent capsules for performance
            take: 50,
        });

        // Transform to match expected interface
        const transformedCapsules = capsules.map(capsule => ({
            id: capsule.id,
            title: capsule.title,
            createdAt: capsule.createdAt,
            isLocked: capsule.isLocked,
            unlockTime: capsule.unlockTime,
            type: 'text', // Default type since not in schema
            privacy: capsule.privacy, // ✅ Use actual privacy value
            description: capsule.title, // Use title as description
            author: capsule.owner.name || 'Anonymous',
            authorId: capsule.owner.id,
            authorImage: capsule.owner.image,
        }));

        return apiResponse({ capsules: transformedCapsules });
    } catch (error) {
        logger.error('Error fetching public capsules', error);
        return apiError('Failed to fetch capsules', 500, error);
    }
}
