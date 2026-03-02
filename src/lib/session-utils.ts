"use client";

/**
 * Get user ID from session
 */
export function getUserId(session: any): string | null {
    console.log('Getting user ID from session:', session);

    if (!session?.user) {
        console.log('No user in session');
        return null;
    }

    // First try to get ID from standard fields
    if (session.user.id) {
        console.log('Using id field from session');
        return session.user.id;
    }

    if (session.user.sub) {
        console.log('Using sub field from session');
        return session.user.sub;
    }

    // Use email as a fallback
    if (session.user.email) {
        console.log('Using email as fallback ID');
        return `email:${session.user.email}`;
    }

    console.log('No suitable ID found in session');
    console.log('Session user object:', session.user);

    return null;
}
