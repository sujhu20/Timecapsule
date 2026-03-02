'use client';

import { Suspense, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface ClientWrapperProps {
  children: ReactNode;
}

function ClientContent({ children }: ClientWrapperProps) {
  // This component uses useSearchParams to ensure it's available
  const searchParams = useSearchParams();
  
  return <>{children}</>;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full min-h-[50vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>}>
      <ClientContent>
        {children}
      </ClientContent>
    </Suspense>
  );
} 