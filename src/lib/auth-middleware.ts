import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/server-db';
import { apiError } from '@/lib/api-response';

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string | null;
}

/**
 * Centralized authentication middleware
 * Validates session and returns authenticated user
 * 
 * @param req - Next.js request object
 * @returns Authenticated user or null
 */
export async function getAuthenticatedUser(
    req: NextRequest
): Promise<AuthenticatedUser | null> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return null;
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('[Auth Middleware] Error:', error);
        return null;
    }
}

/**
 * Require authentication for API route
 * Returns 401 error if not authenticated
 * 
 * @param req - Next.js request object
 * @returns Authenticated user or error response
 */
export async function requireAuth(
    req: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
    const user = await getAuthenticatedUser(req);

    if (!user) {
        return apiError('Authentication required', 401);
    }

    return { user };
}

/**
 * Check if user owns a resource
 * 
 * @param userId - User ID from session
 * @param resourceOwnerId - Owner ID of the resource
 * @returns true if user owns resource
 */
export function isOwner(userId: string, resourceOwnerId: string): boolean {
    return userId === resourceOwnerId;
}

/**
 * Require ownership of a resource
 * Returns 403 error if user doesn't own resource
 * 
 * @param userId - User ID from session
 * @param resourceOwnerId - Owner ID of the resource
 * @param resourceType - Type of resource (for error message)
 * @returns void or error response
 */
export function requireOwnership(
    userId: string,
    resourceOwnerId: string,
    resourceType: string = 'resource'
): NextResponse | void {
    if (!isOwner(userId, resourceOwnerId)) {
        return apiError(
            `You do not have permission to access this ${resourceType}`,
            403
        );
    }
}

/**
 * Verify cron secret for scheduled jobs
 * 
 * @param req - Next.js request object
 * @returns true if cron secret is valid
 */
export function verifyCronSecret(req: NextRequest): boolean {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        console.warn('[Auth Middleware] CRON_SECRET not set');
        return false;
    }

    if (!authHeader) {
        return false;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || token !== cronSecret) {
        return false;
    }

    return true;
}
