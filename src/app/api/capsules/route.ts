import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUserCapsules } from '@/lib/server-db';
import { logger } from '@/lib/logger';
import { apiResponse, apiError } from '@/lib/api-response';
import { checkRateLimit, userRateLimiter } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return apiError('Authentication required', 401);
    }

    // Rate Limit: 20 reqs per minute per user
    const rateLimitResult = await checkRateLimit(session.user.email, userRateLimiter);
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Get user from database by email
    const { prisma } = await import('@/lib/server-db');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return apiResponse([], 'No user found', 200);
    }

    // Note: getUserCapsules now returns capsules with ENCRYPTED content.
    // The frontend may display "Encrypted" or garbage in previews.
    // This is intentional for security hardening.
    const capsules = await getUserCapsules(user.id);

    // Optional: We could mask the content field here to avoid sending large encrypted blobs
    // capsules.forEach(c => c.content = ''); 

    return apiResponse({ capsules });

  } catch (error) {
    logger.error('Error fetching capsules', error);
    return apiError('Failed to fetch capsules', 500, error);
  }
}

// POST is handled by the createCapsule server action
// This endpoint is kept for backwards compatibility but should not be used
export async function POST(req: Request) {
  return NextResponse.json(
    { error: 'Use the createCapsule server action instead' },
    { status: 410 } // Gone
  );
}