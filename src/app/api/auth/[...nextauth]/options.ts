import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { getUserByEmail, authenticateUser, handleOAuthUser } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Authenticate with MongoDB auth
          const user = await authenticateUser(
            credentials.email,
            credentials.password
          );

          if (!user) {
            console.error("Authentication failed for user:", credentials.email);
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          // Re-throw email confirmation errors so we can handle them specially in the UI
          if (error instanceof Error && error.message === "Email not confirmed") {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin",
    newUser: "/dashboard",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only handle OAuth accounts here
      if (account && account.provider && account.provider !== 'credentials') {
        if (!user.email) {
          console.error(`OAuth sign in failed: No email provided by ${account.provider}`);
          return false;
        }

        try {
          console.log(`Processing OAuth sign-in for ${user.email} via ${account.provider}`);

          // Create or link the OAuth account in our database
          const dbUser = await handleOAuthUser({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            provider: account.provider
          });

          if (!dbUser) {
            // Log but DON'T block sign-in — the JWT callback will re-fetch the user
            console.error(`DB upsert failed for OAuth user from ${account.provider} — allowing sign-in anyway`);
          } else {
            console.log(`OAuth sign-in successful for user: ${dbUser.email}`);
          }

          return true;
        } catch (error) {
          // Log but allow — a DB error shouldn't lock the user out entirely
          console.error('Error during OAuth sign in (non-blocking):', error);
          return true;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        console.log('JWT initial sign in with user data:', {
          hasId: !!user.id,
          hasSub: !!(user as any).sub,
          email: user.email ? user.email.substring(0, 3) + '...' : 'none',
          provider: account?.provider || 'credentials'
        });

        token.id = user.id;
        token.sub = user.id; // Ensure sub is set to user.id

        // In development mode, set a fallback ID if none exists
        if ((!token.id || !token.sub) && process.env.NODE_ENV === 'development') {
          const mockId = '254067f1-ddd6-4376-bbad-35a75f5df44d';
          console.log(`[DEV] Setting fallback user ID in JWT: ${mockId}`);
          token.id = mockId;
          token.sub = mockId;
        }

        // Generate ID from email if missing
        if (!token.id && !token.sub && user.email) {
          console.log('Generating user ID from email');
          const crypto = require('crypto');
          // Use a simple hash of the email to create a consistent ID
          const emailHash = crypto.createHash('md5').update(user.email).digest('hex');
          const generatedId = emailHash.slice(0, 8) + '-' + emailHash.slice(8, 12) + '-' +
            emailHash.slice(12, 16) + '-' + emailHash.slice(16, 20) + '-' +
            emailHash.slice(20, 32);

          token.id = generatedId;
          token.sub = generatedId;
          console.log(`Generated user ID: ${generatedId} for email: ${user.email.substring(0, 3)}...`);
        }
      }

      // OAuth sign in
      if (account && account.provider) {
        console.log(`JWT: OAuth sign-in via ${account.provider}`);
        token.provider = account.provider;

        // For OAuth logins, ensure we have the user data from our DB
        if (token.email) {
          const dbUser = await getUserByEmail(token.email as string);
          if (dbUser) {
            console.log(`JWT: Found existing user in DB for ${token.email}`);
            token.id = dbUser.id;
            token.sub = dbUser.id;
          } else if (process.env.NODE_ENV === 'development') {
            // In development, if we don't find the user in the DB, create a fallback
            console.log(`[DEV] Using backup user ID in JWT for OAuth user`);
            if (!token.id && !token.sub) {
              const mockId = '254067f1-ddd6-4376-bbad-35a75f5df44d';
              token.id = mockId;
              token.sub = mockId;
            }
          }
        }
      }

      console.log('JWT token after processing:', {
        hasId: !!token.id,
        hasSub: !!token.sub,
        provider: token.provider || 'none'
      });

      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', {
        hasUser: !!session?.user,
        tokenId: token?.id,
        tokenSub: token?.sub
      });

      if (session.user) {
        // Set the user ID from token
        session.user.id = token.id as string || token.sub as string;
        session.user.sub = token.sub as string || token.id as string;

        // If still no ID but we have email, generate one
        if ((!session.user.id || !session.user.sub) && session.user.email) {
          console.log('No ID in token but email exists, generating ID');
          const crypto = require('crypto');
          const emailHash = crypto.createHash('md5').update(session.user.email).digest('hex');
          const generatedId = emailHash.slice(0, 8) + '-' + emailHash.slice(8, 12) + '-' +
            emailHash.slice(12, 16) + '-' + emailHash.slice(16, 20) + '-' +
            emailHash.slice(20, 32);

          session.user.id = generatedId;
          session.user.sub = generatedId;
          console.log(`Generated session user ID: ${generatedId}`);
        }

        // Use mock user ID for development if no ID exists
        if ((!session.user.id || !session.user.sub) && process.env.NODE_ENV === 'development') {
          const mockId = '254067f1-ddd6-4376-bbad-35a75f5df44d';
          console.log(`Using mock user ID for development: ${mockId}`);
          session.user.id = mockId;
          session.user.sub = mockId;
        }

        // Log final session state
        console.log('Final session state:', {
          hasId: !!(session.user.id || session.user.sub),
          id: session.user.id,
          sub: session.user.sub
        });
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}; 