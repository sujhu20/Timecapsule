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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Camera, Mic, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ContributeHeritagePage() {
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
      title: "Heritage contribution submitted!",
      description: "Thank you for contributing to the Cultural Heritage Preservation time capsule.",
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
              Thank you for helping preserve cultural heritage for future generations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <div className="text-center">
              <p className="mb-4">
                Your cultural heritage contribution has been securely encrypted and added to the time capsule.
              </p>
              <p className="text-muted-foreground mb-6">
                Your contribution will help preserve valuable cultural knowledge for future generations.
              </p>
              
              <div className="space-y-4">
                <Button asChild>
                  <Link href="/global-capsules/heritage">Return to Heritage Preservation Page</Link>
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
          <h1 className="text-3xl font-bold tracking-tight">Preserve Cultural Heritage</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share traditions, stories, languages, and cultural knowledge to create a
            living archive of humanity's diverse cultural heritage.
          </p>
        </div>
        
        <Tabs defaultValue="stories" className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="traditions">Traditions</TabsTrigger>
          </TabsList>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <TabsContent value="stories" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Cultural Stories & Folklore</span>
                  </CardTitle>
                  <CardDescription>
                    Share cultural stories, myths, legends, and oral histories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="story-title">Title</Label>
                    <Input id="story-title" placeholder="Give your story a title" required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="culture">Cultural Origin</Label>
                      <Input id="culture" placeholder="Which culture is this from?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region/Country</Label>
                      <Input id="region" placeholder="Geographic region" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="story-content">The Story</Label>
                    <Textarea 
                      id="story-content" 
                      placeholder="Share the story, myth, legend, or oral history as accurately as possible..." 
                      rows={8}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="story-context">Cultural Context (Optional)</Label>
                    <Textarea 
                      id="story-context" 
                      placeholder="Provide context about when this story is told, its significance, and any cultural meanings..." 
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type of Cultural Story</Label>
                    <RadioGroup defaultValue="folktale">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="folktale" id="folktale" />
                        <Label htmlFor="folktale">Folktale/Legend</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="myth" id="myth" />
                        <Label htmlFor="myth">Creation Myth</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="history" id="history" />
                        <Label htmlFor="history">Oral History</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other Story Type</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="visual" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    <span>Visual Cultural Heritage</span>
                  </CardTitle>
                  <CardDescription>
                    Document traditional clothing, architecture, art, ceremonies, and other visual aspects of culture
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
                      Upload Images
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visual-title">Title</Label>
                      <Input id="visual-title" placeholder="Title for your visual documentation" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visual-type">Visual Type</Label>
                      <Select defaultValue="traditional-clothing">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traditional-clothing">Traditional Clothing</SelectItem>
                          <SelectItem value="architecture">Architecture</SelectItem>
                          <SelectItem value="art">Traditional Art/Crafts</SelectItem>
                          <SelectItem value="ceremony">Cultural Ceremony</SelectItem>
                          <SelectItem value="dance">Traditional Dance</SelectItem>
                          <SelectItem value="other">Other Visual Heritage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visual-culture">Culture/Ethnic Group</Label>
                      <Input id="visual-culture" placeholder="Cultural or ethnic origin" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visual-region">Region/Country</Label>
                      <Input id="visual-region" placeholder="Geographic region" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visual-description">Description & Cultural Significance</Label>
                    <Textarea 
                      id="visual-description" 
                      placeholder="Describe what's shown, its cultural significance, and when/where it was documented..." 
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="language" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    <span>Language Preservation</span>
                  </CardTitle>
                  <CardDescription>
                    Document endangered languages, dialects, unique expressions, and linguistic elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language-name">Language/Dialect Name</Label>
                    <Input id="language-name" placeholder="Name of the language or dialect" required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language-family">Language Family</Label>
                      <Input id="language-family" placeholder="E.g., Indo-European, Sino-Tibetan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language-region">Region Spoken</Label>
                      <Input id="language-region" placeholder="Geographic region" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language-status">Current Status</Label>
                    <Select defaultValue="endangered">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critically-endangered">Critically Endangered</SelectItem>
                        <SelectItem value="endangered">Endangered</SelectItem>
                        <SelectItem value="vulnerable">Vulnerable</SelectItem>
                        <SelectItem value="safe">Safe</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language-content">Language Content</Label>
                    <Textarea 
                      id="language-content" 
                      placeholder="Include phrases, words, expressions, grammar notes, or other language features you wish to document..." 
                      rows={8}
                      required
                    />
                  </div>
                  
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <p className="text-sm mb-4 text-muted-foreground">
                      Upload audio recordings of the language (optional but highly recommended)
                    </p>
                    <Button type="button" variant="secondary" size="sm">
                      Upload Audio Recording
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="traditions" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Cultural Traditions & Practices</span>
                  </CardTitle>
                  <CardDescription>
                    Document cultural traditions, practices, skills, recipes, crafts, and other knowledge
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tradition-title">Title</Label>
                    <Input id="tradition-title" placeholder="Name of the tradition, practice, or skill" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tradition-type">Type of Tradition</Label>
                    <Select defaultValue="craft">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="craft">Traditional Craft/Art Form</SelectItem>
                        <SelectItem value="culinary">Culinary Tradition/Recipe</SelectItem>
                        <SelectItem value="music">Musical Tradition</SelectItem>
                        <SelectItem value="ceremony">Ceremony/Ritual</SelectItem>
                        <SelectItem value="knowledge">Traditional Knowledge</SelectItem>
                        <SelectItem value="other">Other Cultural Practice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tradition-culture">Cultural Origin</Label>
                      <Input id="tradition-culture" placeholder="Culture/ethnic group" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tradition-region">Region/Country</Label>
                      <Input id="tradition-region" placeholder="Geographic region" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tradition-description">Detailed Description</Label>
                    <Textarea 
                      id="tradition-description" 
                      placeholder="Describe the tradition or practice in detail, including materials, methods, occasions when it's practiced, etc..." 
                      rows={8}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tradition-significance">Cultural Significance</Label>
                    <Textarea 
                      id="tradition-significance" 
                      placeholder="Explain the cultural importance and meaning of this tradition..." 
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <RadioGroup defaultValue="practiced">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="practiced" id="practiced" />
                        <Label htmlFor="practiced">Still Widely Practiced</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="declining" id="declining" />
                        <Label htmlFor="declining">Declining Practice</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="endangered" id="endangered" />
                        <Label htmlFor="endangered">Endangered/Rare</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="revived" id="revived" />
                        <Label htmlFor="revived">Being Revived</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </TabsContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I confirm that I have the right to share this cultural information and that it does not contain 
                    protected or sacred knowledge that should not be widely shared.
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
                      Preserving your contribution...
                    </>
                  ) : "Submit Cultural Heritage Contribution"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Tabs>
      </div>
    </div>
  );
} 