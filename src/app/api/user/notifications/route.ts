import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/server-db';
import { logger } from '@/lib/logger';

const DEFAULT_PREFS = {
    emailNotifications: true,
    unlockReminders: true,
    weeklyDigest: false,
    marketingEmails: false,
};

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                emailNotifications: true,
                unlockReminders: true,
                weeklyDigest: true,
                marketingEmails: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ preferences: user });
    } catch (error) {
        logger.error('Failed to fetch notification preferences', error as Error);
        return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await req.json();

        // Only allow the 4 known fields — strip everything else
        const updates: Partial<typeof DEFAULT_PREFS> = {};
        if (typeof body.emailNotifications === 'boolean') updates.emailNotifications = body.emailNotifications;
        if (typeof body.unlockReminders === 'boolean') updates.unlockReminders = body.unlockReminders;
        if (typeof body.weeklyDigest === 'boolean') updates.weeklyDigest = body.weeklyDigest;
        if (typeof body.marketingEmails === 'boolean') updates.marketingEmails = body.marketingEmails;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const updated = await prisma.user.update({
            where: { email: session.user.email },
            data: updates,
            select: {
                emailNotifications: true,
                unlockReminders: true,
                weeklyDigest: true,
                marketingEmails: true,
            },
        });

        logger.info('Notification preferences updated', { email: session.user.email });
        return NextResponse.json({ preferences: updated });
    } catch (error) {
        logger.error('Failed to update notification preferences', error as Error);
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }
}
