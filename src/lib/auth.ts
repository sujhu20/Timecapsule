
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

// Singleton Prisma instance to avoid "too many connections" in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function createUser(userData: {
  name: string | null;
  email: string;
  password: string;
}) {
  try {
    const { hash } = await import('bcryptjs');

    // Check if user exists
    const existing = await getUserByEmail(userData.email);
    if (existing) {
      console.log('User already exists');
      return null;
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        emailVerified: process.env.NODE_ENV === 'development' ? new Date() : null,
      },
    });

    console.log(`Created user: ${user.id}`);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);
    if (!user || !user.password) return null;

    const isValid = await compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function handleOAuthUser(userData: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
}) {
  try {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name || undefined,
        image: userData.image || undefined,
        emailVerified: new Date(),
      },
      create: {
        email: userData.email,
        name: userData.name,
        image: userData.image,
        emailVerified: new Date(),
      },
    });
    return user;
  } catch (error) {
    console.error('Error handling OAuth user:', error);
    throw error;
  }
}