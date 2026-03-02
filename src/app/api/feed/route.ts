import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/server-db';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { aiService } from "@/lib/ai";
import { apiResponse, apiError } from "@/lib/api-response";
import { Prisma, Capsule } from '@prisma/client';
import { decrypt } from '@/lib/encryption';

type CapsuleWithRelations = Capsule & {
    owner: {
        name: string | null;
        image: string | null;
        id: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    likes: {
        id: string;
    }[];
};

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return apiError('Unauthorized', 401);
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!currentUser) {
            return apiError('User not found', 404);
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'featured'; // 'featured' or 'following'

        // Get list of users the current user follows
        const following = await prisma.follows.findMany({
            where: { followerId: currentUser.id },
            select: { followingId: true },
        });
        const followingIds = new Set(following.map(f => f.followingId));

        let whereClause: Prisma.CapsuleWhereInput = {
            privacy: 'public',
        };

        if (type === 'following') {
            if (following.length === 0) {
                return apiResponse({ items: [] });
            }
            whereClause = {
                ...whereClause,
                ownerId: {
                    in: Array.from(followingIds)
                }
            };
        }

        // Fetch capsules based on filter (fetch more to rank them)
        const capsules = (await prisma.capsule.findMany({
            where: whereClause,
            include: {
                owner: {
                    select: {
                        name: true,
                        image: true,
                        id: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
                likes: {
                    where: {
                        userId: currentUser.id,
                    },
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50, // Fetch top 50 candidates for AI ranking
        })) as unknown as CapsuleWithRelations[];

        // 🧠 AI Ranking
        const scoredItems = await Promise.all(capsules.map(async (capsule) => {
            const score = await aiService.calculateFeedScore({
                createdAt: capsule.createdAt,
                likesCount: capsule._count.likes,
                commentsCount: capsule._count.comments,
                // In production, we'd analyze content sentiment here too
                sentimentScore: 0.8 // Placeholder for now to save compute/API calls
            });
            return { capsule, score };
        }));

        // Sort by AI score
        scoredItems.sort((a, b) => b.score - a.score);

        // Format for frontend
        const feedItems = scoredItems.map(({ capsule }) => {
            let content = capsule.content;

            // Decrypt content for feed if present
            if (capsule.content) {
                try {
                    content = decrypt(capsule.content);
                } catch (error) {
                    // Fail silently for feed
                    console.error(`Failed to decrypt feed item ${capsule.id}`);
                    content = '[Encrypted Content]';
                }
            }

            return {
                id: capsule.id,
                title: capsule.title,
                description: content,
                author: {
                    id: capsule.owner.id,
                    name: capsule.owner.name || 'Anonymous',
                    image: capsule.owner.image || '/placeholder-user.jpg',
                    username: 'user', // Placeholder
                },
                createdAt: capsule.createdAt,
                likes: capsule._count.likes,
                comments: capsule._count.comments,
                isLiked: capsule.likes.length > 0,
                isLocked: capsule.isLocked,
                unlockTime: capsule.unlockTime,
                isFollowing: followingIds.has(capsule.owner.id),
            };
        });

        return apiResponse({ items: feedItems });
    } catch (error) {
        console.error('Feed fetch error:', error);
        return apiError('Internal Server Error', 500, error);
    }
}
