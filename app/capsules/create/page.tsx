"use client";

import { CreateCapsuleForm } from '@/components/encryption/CreateCapsuleForm';
import { KeySetup } from '@/components/encryption/KeySetup';
import { useEncryption } from '@/lib/encryptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateCapsulePage() {
  const { keys } = useEncryption();
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Time Capsule</h1>
      
      <div className="max-w-4xl mx-auto">
        {!keys ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Set Up Encryption</CardTitle>
              <CardDescription>
                You need to set up encryption before you can create encrypted time capsules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeySetup />
            </CardContent>
          </Card>
        ) : (
          <CreateCapsuleForm />
        )}
      </div>
    </div>
  );
} 