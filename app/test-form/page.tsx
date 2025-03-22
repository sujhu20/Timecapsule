'use client';

import React from 'react';
import { CapsuleForm } from '@/components/capsule/CapsuleForm';
import { toast } from 'sonner';
import { CapsuleFormData } from '@/lib/types';

export default function TestFormPage() {
  const handleSubmit = (data: CapsuleFormData) => {
    // Log the form data to see what's being submitted
    console.log('Form submitted with data:', data);
    console.log('Content type:', data.type);
    toast.success(`Time capsule created with content type: ${data.type}`);
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Test Form</h1>
      <p className="text-muted-foreground mb-8">
        This is a test form to debug content type selection.
      </p>
      
      <CapsuleForm 
        onSubmit={handleSubmit} 
        defaultValues={{
          type: 'text', // Set default content type
        }}
      />
    </div>
  );
} 