import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/server-db';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const capsuleId = params.id;
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if liked already
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_capsuleId: {
                    userId: user.id,
                    capsuleId: capsuleId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: user.id,
                    capsuleId: capsuleId,
                },
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error('Like error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
