import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { capsuleId, email, shareUrl } = await req.json();

        if (!capsuleId || !email || !shareUrl) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // TODO: Implement email sending logic
        // For now, we'll just log it
        logger.info('Share capsule email request', {
            from: session.user.email,
            to: email,
            capsuleId,
        });

        // In production, integrate with email service (SendGrid, Resend, etc.)
        // Example:
        // await sendEmail({
        //   to: email,
        //   subject: `${session.user.name} shared a time capsule with you`,
        //   html: `
        //     <h1>You've been invited to view a time capsule!</h1>
        //     <p>${session.user.name} has shared a time capsule with you.</p>
        //     <a href="${shareUrl}">View Capsule</a>
        //   `,
        // });

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('Error sharing capsule', error);
        return NextResponse.json(
            { error: 'Failed to share capsule' },
            { status: 500 }
        );
    }
}
