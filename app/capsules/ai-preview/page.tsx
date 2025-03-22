"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AIPreviewPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Get parameters from URL
  const dateParam = searchParams.get('date');
  const locationParam = searchParams.get('location') || 'urban cityscape';
  
  // Only calculate year client-side to avoid hydration mismatch
  const [yearParam, setYearParam] = useState<number | null>(null);
  
  // Mark component as mounted on client-side
  useEffect(() => {
    setMounted(true);
    // Now that we're on the client, we can calculate the year
    setYearParam(dateParam ? new Date(dateParam).getFullYear() : new Date().getFullYear() + 50);
  }, [dateParam]);
  
  // This would normally call an AI image generation API
  // For demo purposes, we're simulating the response
  useEffect(() => {
    // Only run this effect when component is mounted (client-side)
    if (!mounted) return;
    
    const generateAIPreview = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // In a real implementation, this would be a call to an AI image generation service
        // We're using placeholder images for the demo
        const demoImages = [
          '/ai-future-1.jpg',
          '/ai-future-2.jpg',
          '/ai-future-city.jpg',
          '/ai-future-nature.jpg',
        ];
        
        // Use a stable image to avoid server/client mismatch (for demo purposes)
        // In production with real API, this would be a unique image per request
        const imageIndex = 0; // Always use the first image for consistency
        const selectedImage = demoImages[imageIndex];
        setImageUrl(selectedImage);
        
      } catch (err) {
        console.error('Error generating AI preview:', err);
        setError('Failed to generate future visualization. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    generateAIPreview();
  }, [dateParam, locationParam, mounted]);
  
  // Don't render actual content until client-side
  if (!mounted) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link href="/capsules/new">
              <ArrowLeft className="h-4 w-4" /> 
              Back to Capsule Creation
            </Link>
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Future Visualization</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            See how the world might look in the future, when your time capsule is scheduled to be opened.
          </p>
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center h-[400px] bg-slate-100">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link href="/capsules/new">
            <ArrowLeft className="h-4 w-4" /> 
            Back to Capsule Creation
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Future Visualization</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          See how the world might look in {yearParam}, when your time capsule is scheduled to be opened.
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-slate-100">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Generating future visualization...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-slate-100">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="relative">
              {imageUrl && (
                <>
                  <img 
                    src={imageUrl} 
                    alt={`AI visualization of ${locationParam} in the year ${yearParam}`}
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-xl font-bold">
                      {locationParam.charAt(0).toUpperCase() + locationParam.slice(1)} in {yearParam}
                    </h3>
                    <p className="text-white/80 text-sm">
                      AI-generated visualization of the future when your time capsule will be opened
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h2 className="text-xl font-semibold mb-2">About This Visualization</h2>
        <p className="text-muted-foreground mb-4">
          This AI-generated image represents a potential future based on current trends, environmental factors, and technological forecasts. While no one can predict the future with certainty, this visualization provides a glimpse of how the world might look when your time capsule is opened.
        </p>
        <p className="text-muted-foreground">
          This image will be stored alongside your time capsule, allowing future recipients to compare our prediction with their reality.
        </p>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button asChild>
          <Link href="/capsules/new">
            Include With My Capsule
          </Link>
        </Button>
      </div>
    </div>
  );
} 