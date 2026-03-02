import { NextRequest, NextResponse } from 'next/server';
import { productionGuard } from '@/lib/production-guard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/server-db';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const guard = productionGuard();
  if (guard) return guard;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const capsules = await prisma.capsule.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      capsuleCount: capsules.length,
      capsules: capsules.map((c) => ({
        id: c.id,
        title: c.title,
        isLocked: c.isLocked,
        createdAt: c.createdAt,
        unlockTime: c.unlockTime,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('db-test route error', error as Error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}