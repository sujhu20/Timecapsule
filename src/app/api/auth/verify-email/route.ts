import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server-db";
import { logger } from "@/lib/logger";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();

    // Development auto-verify: mark emailVerified without a token
    if (!token) {
      if (process.env.NODE_ENV === "development" && email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          await prisma.user.update({
            where: { email },
            data: { emailVerified: new Date() },
          });
          return NextResponse.json({
            success: true,
            message: `Email verified automatically in development mode for ${email}`,
          });
        }
      }
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Hash the incoming raw token to compare against the stored hash
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const stored = await prisma.verificationToken.findUnique({
      where: { token: hashed },
      include: { user: true },
    });

    if (!stored) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (stored.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({ where: { token: hashed } });
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark user as verified and delete the token (single-use)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: stored.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({ where: { token: hashed } }),
    ]);

    logger.info("Email verified successfully", { userId: stored.userId });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (error) {
    logger.error("Error verifying email", error as Error);
    return NextResponse.json(
      { error: "An error occurred while verifying your email" },
      { status: 500 }
    );
  }
}