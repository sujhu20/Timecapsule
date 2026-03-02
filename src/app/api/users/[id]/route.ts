import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from '@/lib/server-db';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const targetUserId = params.id;
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user?.id;

        // Fetch user basic info
        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                name: true,
                image: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        capsules: {
                            where: {
                                privacy: 'public'
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if current user is following this user
        let isFollowing = false;
        if (currentUserId && currentUserId !== targetUserId) {
            const follow = await prisma.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: targetUserId,
                    },
                },
            });
            isFollowing = !!follow;
        }

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                image: user.image,
                joinedAt: user.createdAt,
                stats: {
                    followers: user._count.followers,
                    following: user._count.following,
                    publicCapsules: user._count.capsules,
                },
                isFollowing,
                isOwnProfile: currentUserId === targetUserId
            }
        });

    } catch (error) {
        logger.error('Error fetching user profile', error, { userId: params.id });
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
