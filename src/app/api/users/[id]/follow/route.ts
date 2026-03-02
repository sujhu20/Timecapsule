import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from '@/lib/server-db';
import { logger } from '@/lib/logger';

// Follow a user
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const targetUserId = params.id;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const currentUserId = session.user.id;

        if (currentUserId === targetUserId) {
            return NextResponse.json(
                { error: 'You cannot follow yourself' },
                { status: 400 }
            );
        }

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Create follow relationship
        await prisma.follows.create({
            data: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        });

        return NextResponse.json({ success: true, isFollowing: true });
    } catch (error: any) {
        // Check for unique constraint violation (already following)
        if (error.code === 'P2002') {
            return NextResponse.json({ success: true, isFollowing: true }); // Treat as success
        }

        logger.error('Error following user', error, { targetUserId: params.id });
        return NextResponse.json(
            { error: 'Failed to follow user' },
            { status: 500 }
        );
    }
}

// Unfollow a user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const targetUserId = params.id;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const currentUserId = session.user.id;

        // Remove follow relationship
        await prisma.follows.delete({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        return NextResponse.json({ success: true, isFollowing: false });
    } catch (error: any) {
        if (error.code === 'P2025') {
            // Record not found, already unfollowed
            return NextResponse.json({ success: true, isFollowing: false });
        }

        logger.error('Error unfollowing user', error, { targetUserId: params.id });
        return NextResponse.json(
            { error: 'Failed to unfollow user' },
            { status: 500 }
        );
    }
}
