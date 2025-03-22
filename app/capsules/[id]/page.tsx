"use client";

import { ViewCapsule } from '@/components/encryption/ViewCapsule';
import { KeySetup } from '@/components/encryption/KeySetup';
import { useEncryption } from '@/lib/encryptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CapsulePageProps {
  params: {
    id: string;
  };
}

export default function CapsulePage({ params }: CapsulePageProps) {
  const { keys } = useEncryption();
  const { id } = params;
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Time Capsule</h1>
      
      <div className="max-w-4xl mx-auto">
        {!keys ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Set Up Encryption</CardTitle>
              <CardDescription>
                You need to set up encryption before you can view encrypted time capsules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeySetup />
            </CardContent>
          </Card>
        ) : (
          <ViewCapsule capsuleId={id} />
        )}
      </div>
    </div>
  );
} 