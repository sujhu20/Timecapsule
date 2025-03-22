"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  Globe2, 
  Users, 
  CalendarClock, 
  Leaf, 
  BookOpen, 
  Rocket, 
  HeartHandshake,
  ChevronRight
} from "lucide-react";
import { Challenge } from '@/lib/types';

// Mock data for challenges
const challenges: Challenge[] = [
  {
    id: "climate-2050",
    name: "Climate Action 2050",
    description: "Document environmental changes and share solutions for future generations. A collective effort to address climate change.",
    participants: 3548,
    category: "climate",
    endDate: new Date("2050-01-01"),
  },
  {
    id: "heritage-project",
    name: "Cultural Heritage Preservation",
    description: "Help preserve endangered languages, traditions, and cultural knowledge from communities worldwide.",
    participants: 1872,
    category: "culture",
    endDate: new Date("2075-12-31"),
  },
  {
    id: "future-tech",
    name: "Future Technology Predictions",
    description: "Share your predictions about technology, innovation, and human progress for future generations to evaluate.",
    participants: 2735,
    category: "technology",
    endDate: new Date("2045-06-15"),
  },
  {
    id: "peace-initiative",
    name: "Global Peace Initiative",
    description: "Contribute messages of peace, unity, and cooperation to inspire future generations and foster global harmony.",
    participants: 5104,
    category: "peace",
    endDate: new Date("2100-01-01"),
  },
];

export default function ChallengesPage() {
  // Helper function to get the appropriate icon for each category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'climate':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'culture':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'technology':
        return <Rocket className="h-5 w-5 text-purple-500" />;
      case 'peace':
        return <HeartHandshake className="h-5 w-5 text-blue-500" />;
      default:
        return <Globe2 className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="container py-8 px-4 max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Globe2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Global Time Capsule Challenges</h1>
          <p className="text-muted-foreground max-w-3xl">
            Join worldwide initiatives to create collective time capsules on important global themes. 
            Contribute your thoughts, stories, and perspectives to these shared historical archives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Climate action and environmental preservation initiatives
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Culture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Heritage preservation and cultural knowledge initiatives
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Innovation predictions and technological development archives
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" />
                Peace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Global cooperation and peaceful coexistence efforts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Active Challenges</h2>
      
      <div className="grid gap-8 mb-12">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(challenge.category)}
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {challenge.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{challenge.name}</h3>
                <p className="text-muted-foreground mb-4">{challenge.description}</p>
                
                <div className="flex flex-wrap gap-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{challenge.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Opens {challenge.endDate.getFullYear()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col justify-center items-center md:w-48">
                <Button asChild>
                  <Link href={`/capsules/new?challenge=${challenge.id}`} className="w-full">
                    Contribute
                  </Link>
                </Button>
                <Link href={`/challenges/${challenge.id}`} className="mt-2 text-sm text-muted-foreground hover:text-slate-900 flex items-center">
                  Learn more
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Create Your Own Challenge</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Have an idea for a global challenge? Organizations and educators can propose new collective time capsule initiatives.
        </p>
        <Button asChild size="lg">
          <Link href="/challenges/propose">
            Propose a Challenge
          </Link>
        </Button>
      </div>
    </div>
  );
} 