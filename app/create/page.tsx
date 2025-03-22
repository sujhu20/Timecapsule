'use client';

import React from 'react';
import { CapsuleForm } from '@/components/capsule/CapsuleForm';
import { toast } from 'sonner';
import { CapsuleFormData } from '@/lib/types';

export default function CreateCapsulePage() {
  const handleSubmit = (data: CapsuleFormData) => {
    // This would typically save to a database
    console.log('Form submitted:', data);
    toast.success('Time capsule created successfully!');
    // You could redirect here after successful submission
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Create New Time Capsule</h1>
      <p className="text-muted-foreground mb-8">
        Craft your message for the future. Fill in the details below to create your time capsule.
      </p>
      
      <CapsuleForm 
        onSubmit={handleSubmit} 
        defaultValues={{
          title: "",
          description: "",
          content: "",
          type: "text", // Default to text content type
          privacy: "private",
          scheduledFor: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default to 1 year from now
          isBlockchainSecured: false,
          useAIFutureVisual: false,
          useConditionalLock: false,
          allowReplies: false,
          isPartOfChallenge: false,
          use3DMemoryScrapbook: false,
          useARPlacement: false,
          useTimeTravelEffect: false,
          useMemorySoundscape: false,
        }}
      />
    </div>
  );
} 