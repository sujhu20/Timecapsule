import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/server-db";
import { logger } from "@/lib/logger";
import crypto from "crypto";

function generateVerificationToken(): { raw: string; hashed: string } {
  const raw = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create user (sets emailVerified = new Date() in dev, null in prod)
    const user = await createUser({ name, email, password });

    if (!user) {
      return NextResponse.json(
        { error: "User already exists or could not be created" },
        { status: 400 }
      );
    }

    // In development, user is auto-verified — nothing else needed
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        {
          success: true,
          message: "Account created and auto-verified in development mode. You can now sign in.",
        },
        { status: 201 }
      );
    }

    // In production: generate a verification token, store it, and email the user
    const { raw, hashed } = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        token: hashed,
        userId: user.id,
        expiresAt,
      },
    });

    const emailSent = await sendVerificationEmail(email, raw);

    if (!emailSent) {
      logger.error("Failed to send verification email", new Error(`Could not send to ${email}`));
      // Still return 201 — user was created, they can request a new email later
      return NextResponse.json(
        {
          success: true,
          message: "Account created, but we couldn't send a verification email. Please contact support.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating user", error as Error);
    return NextResponse.json(
      { error: "Failed to create user account" },
      { status: 500 }
    );
  }
}