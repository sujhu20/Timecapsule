"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, Image, FileVideo, Mic, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ContributeClimatePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSuccess(true);
    toast({
      title: "Contribution submitted!",
      description: "Thank you for contributing to the Climate Action 2050 time capsule.",
    });
    
    setIsSubmitting(false);
  };
  
  if (isSuccess) {
    return (
      <div className="container py-10 md:py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Contribution Received</CardTitle>
            <CardDescription className="text-center">
              Thank you for adding your voice to the Climate Action 2050 time capsule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <div className="text-center">
              <p className="mb-4">
                Your contribution has been securely encrypted and added to the Climate Action 2050 time capsule.
              </p>
              <p className="text-muted-foreground mb-6">
                Your message will be preserved until January 1, 2050, when it will be unlocked for future generations.
              </p>
              
              <div className="space-y-4">
                <Button asChild>
                  <Link href="/global-capsules/climate">Return to Climate Action Page</Link>
                </Button>
                <div>
                  <Link href="/global-capsules" className="text-sm text-muted-foreground hover:text-foreground">
                    Explore other global capsules
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Contribute to Climate Action 2050</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your contribution will be encrypted and preserved until 2050, creating a time
            capsule of climate awareness and action for future generations.
          </p>
        </div>
        
        <Tabs defaultValue="story" className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto">
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="photo">Photo</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <TabsContent value="story" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Share Your Climate Story</span>
                  </CardTitle>
                  <CardDescription>
                    Document your experiences, observations, or actions related to climate change
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Give your story a title" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Region/Location</Label>
                    <Input id="region" placeholder="Where is this story from?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="story">Your Climate Story</Label>
                    <Textarea 
                      id="story" 
                      placeholder="Share your observations about climate change in your region, actions you've taken, or your hopes for the future..." 
                      rows={8}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Story Type</Label>
                    <RadioGroup defaultValue="personal">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal">Personal Observation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="action" id="action" />
                        <Label htmlFor="action">Climate Action</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="community" id="community" />
                        <Label htmlFor="community">Community Initiative</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="message" id="message" />
                        <Label htmlFor="message">Message to the Future</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="photo" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    <span>Contribute Photos</span>
                  </CardTitle>
                  <CardDescription>
                    Upload photographs documenting environmental changes or climate action
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm mb-2 text-muted-foreground">
                      Drag and drop your images here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: JPG, PNG, WEBP. Max 10MB per image.
                    </p>
                    <Button type="button" variant="secondary" size="sm">
                      Upload Photos
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-title">Title</Label>
                    <Input id="photo-title" placeholder="Provide a title for your photo contribution" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-description">Description</Label>
                    <Textarea 
                      id="photo-description" 
                      placeholder="Describe the photos, when and where they were taken, and their significance..." 
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-location">Location</Label>
                    <Input id="photo-location" placeholder="Where were these photos taken?" required />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="video" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileVideo className="h-5 w-5" />
                    <span>Contribute Video or Audio</span>
                  </CardTitle>
                  <CardDescription>
                    Upload video or audio content related to climate change
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm mb-2 text-muted-foreground">
                      Drag and drop your media file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: MP4, MOV, MP3, WAV. Max 100MB.
                    </p>
                    <Button type="button" variant="secondary" size="sm">
                      Upload Media
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="media-title">Title</Label>
                      <Input id="media-title" placeholder="Title for your media" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="media-type">Media Type</Label>
                      <RadioGroup defaultValue="video" className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="video-type" />
                          <Label htmlFor="video-type">Video</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="audio" id="audio-type" />
                          <Label htmlFor="audio-type">Audio</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="media-description">Description</Label>
                    <Textarea 
                      id="media-description" 
                      placeholder="Describe your media contribution and its relevance to climate change..." 
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="data" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    <span>Contribute Scientific Data</span>
                  </CardTitle>
                  <CardDescription>
                    Upload datasets, observations, or research related to climate change
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm mb-2 text-muted-foreground">
                      Drag and drop your data files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: CSV, JSON, XLSX, PDF, ZIP. Max 50MB.
                    </p>
                    <Button type="button" variant="secondary" size="sm">
                      Upload Data Files
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-title">Research/Dataset Title</Label>
                    <Input id="data-title" placeholder="Title of your research or dataset" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-abstract">Abstract/Summary</Label>
                    <Textarea 
                      id="data-abstract" 
                      placeholder="Provide a summary of the data and its significance for climate research..." 
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-authors">Researchers/Authors</Label>
                    <Input id="data-authors" placeholder="Names of researchers or organizations" required />
                  </div>
                </CardContent>
              </TabsContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree that my contribution may be publicly displayed when the time capsule is opened in 2050,
                    and confirm that it does not contain personally identifiable information of others without their consent.
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Encrypting and submitting...
                    </>
                  ) : "Submit Contribution"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Tabs>
      </div>
    </div>
  );
} 