import { NextRequest, NextResponse } from "next/server";
import { productionGuard } from "@/lib/production-guard";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  const guard = productionGuard();
  if (guard) return guard;

  try {
    const session = await getServerSession();

    const debugSession = session
      ? {
        ...session,
        user: session.user
          ? {
            ...session.user,
            email: session.user.email
              ? `${session.user.email.substring(0, 3)}...`
              : undefined,
          }
          : null,
        expires: session.expires
          ? new Date(session.expires).toISOString()
          : undefined,
      }
      : null;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: debugSession,
      auth: {
        isAuthenticated: !!session?.user,
        userId: (session?.user as any)?.id ?? null,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        SESSION_CONFIGURED: !!process.env.NEXTAUTH_SECRET,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}