"use client";

import { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Inject mock user ID into session during development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Check if we need to patch the session
      const session = localStorage.getItem('next-auth.session-token');
      if (!session) {
        console.log('[DEV] No session found, skipping mock injection');
        return;
      }

      // Access the session API state
      const mockUserId = '254067f1-ddd6-4376-bbad-35a75f5df44d';
      
      // Set a flag to remember we've patched the session
      const hasPatched = localStorage.getItem('timecapsul-patched-session');
      
      if (!hasPatched) {
        console.log('[DEV] Injecting mock user ID into client-side session');
        localStorage.setItem('timecapsul-patched-session', 'true');
      }
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
} 