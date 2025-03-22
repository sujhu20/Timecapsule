"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CapsuleForm } from '@/components/capsule/CapsuleForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CapsuleFormData } from '@/lib/types';

export default function NewCapsulePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreateCapsule = async (formData: CapsuleFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log('Creating new capsule with data:', formData);
      
      // Simulate delay for API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Time capsule created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating capsule:', error);
      toast.error('Failed to create time capsule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> 
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create a New Time Capsule</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          Craft a meaningful message to be delivered in the future. Share your thoughts, memories, or wisdom with someone special.
        </p>
      </div>
      
      <CapsuleForm onSubmit={handleCreateCapsule} isSubmitting={isSubmitting} />
    </div>
  );
} 