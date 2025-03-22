"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockCapsule = {
  id: "123",
  title: "A Message to the Future",
  content: "I wonder what the world is like when you're reading this. I hope we've solved climate change and found a way to live in harmony with our planet. I'm writing this in 2023, a time of both great challenge and great opportunity. What changes have you seen? What remains the same?",
  createdBy: "Alex Johnson",
  createdAt: new Date("2023-05-15"),
  scheduledFor: new Date("2043-05-15"),
};

export default function CapsuleEchoPage() {
  const params = useParams();
  const router = useRouter();
  const [responseContent, setResponseContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitResponse = async () => {
    if (!responseContent.trim()) {
      toast.error("Please enter a response");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Your response has been recorded");
      
      // Redirect back to the capsule view
      router.push(`/capsules/${params.id}`);
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit your response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link href={`/capsules/${params.id}`}>
            <ArrowLeft className="h-4 w-4" /> 
            Back to Capsule
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create an Echo</h1>
        <p className="text-muted-foreground mt-2">
          Record your response to this time capsule, creating a conversation across time with the original sender.
        </p>
      </div>
      
      <Card className="mb-8 bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle>{mockCapsule.title}</CardTitle>
          <CardDescription>
            Originally created by {mockCapsule.createdBy} on {mockCapsule.createdAt.toLocaleDateString()}, 
            opened {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-md border border-slate-200">
            <p className="text-slate-700">{mockCapsule.content}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Your Response
          </CardTitle>
          <CardDescription>
            Share your thoughts, reflections, or reactions to this message from the past.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Write your response here..."
            className="min-h-[200px] resize-none focus-visible:ring-1"
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => setResponseContent('')}
          >
            Clear
          </Button>
          <Button 
            onClick={handleSubmitResponse}
            disabled={isSubmitting || !responseContent.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending...' : 'Send Echo'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-md">
        <h3 className="font-medium text-blue-800 mb-1">About Capsule Echoes</h3>
        <p className="text-blue-700 text-sm">
          Your response will be stored alongside the original time capsule, creating a conversation that spans across time. 
          The original sender will be notified that you've responded to their message from the past.
        </p>
      </div>
    </div>
  );
} 