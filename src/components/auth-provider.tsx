"use client";

import { SessionProvider, useSession, signIn } from "next-auth/react";
import { ReactNode, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

// Debug component to log session information and inject mock user ID in development
function SessionDebug() {
  const { data: session, status, update } = useSession();
  
  useEffect(() => {
    console.log("Auth Status:", status);
    if (session) {
      console.log("Session User:", session.user);
      console.log("User ID:", session.user?.id);
      console.log("User Sub:", session.user?.sub);
      
      // In development, inject the mock user ID if missing
      if (process.env.NODE_ENV === 'development' && 
          !session.user?.id && 
          !session.user?.sub) {
        
        console.log("[DEV] Injecting mock user ID into session");
        
        // Force update the session with mock data
        const mockUserId = '254067f1-ddd6-4376-bbad-35a75f5df44d';
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            id: mockUserId,
            sub: mockUserId
          }
        };
        
        // Update the session
        update(updatedSession);
      }
    }
  }, [session, status, update]);
  
  return null;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {process.env.NODE_ENV === 'development' && <SessionDebug />}
      {children}
    </SessionProvider>
  );
} 