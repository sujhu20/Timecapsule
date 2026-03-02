import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique identifier */
      id: string;
      /** The user's unique identifier (alternate) */
      sub: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  /** Interface for the user object during auth */
  interface User {
    /** The user's unique identifier */
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
} 