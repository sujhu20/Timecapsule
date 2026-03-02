import { NextResponse } from 'next/server';

/**
 * Returns a 403 response if the server is running in production mode.
 * Use at the top of any debug route handler.
 *
 * @example
 * export async function GET(req: NextRequest) {
 *   const guard = productionGuard();
 *   if (guard) return guard;
 *   // ... rest of handler
 * }
 */
export function productionGuard(): NextResponse | null {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'This endpoint is disabled in production.' },
            { status: 403 }
        );
    }
    return null;
}
