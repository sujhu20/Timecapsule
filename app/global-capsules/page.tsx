import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Globe, Landmark, GraduationCap, Clock, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Global Capsules - TimeCapsule",
  description: "Join collective time capsules documenting our world for future generations",
};

export default function GlobalCapsulesPage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Global Capsules</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join collective time capsules documenting our world for future generations.
            Make your contribution to these global archives of human experience.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                  <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  <Clock className="h-3 w-3 mr-1" /> Opens 2050
                </Badge>
              </div>
              <CardTitle className="text-xl mt-4">Climate Action 2050</CardTitle>
              <CardDescription>
                Document climate challenges and solutions of our time for future generations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>750+ contributors</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>60+ countries represented</span>
                </div>
              </div>
              <p className="mt-4 mb-6">
                Share climate stories, sustainable initiatives, environmental data, and personal experiences
                with climate change for future researchers and citizens.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/global-capsules/climate">
                  View Climate Capsule
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg">
                  <Landmark className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                  <Clock className="h-3 w-3 mr-1" /> Opens 2075
                </Badge>
              </div>
              <CardTitle className="text-xl mt-4">Cultural Heritage Preservation</CardTitle>
              <CardDescription>
                Preserve cultural traditions, languages, and practices for future generations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>520+ contributors</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>85+ cultures documented</span>
                </div>
              </div>
              <p className="mt-4 mb-6">
                Document cultural stories, traditions, languages, and practices to create a
                comprehensive archive of humanity's diverse cultural heritage.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/global-capsules/heritage">
                  View Heritage Capsule
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                  <Clock className="h-3 w-3 mr-1" /> Opens 2050
                </Badge>
              </div>
              <CardTitle className="text-xl mt-4">Education Evolution</CardTitle>
              <CardDescription>
                Document educational approaches for future understanding of how we learned
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>500+ contributors</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>40+ countries represented</span>
                </div>
              </div>
              <p className="mt-4 mb-6">
                Share educational experiences, teaching methods, and learning approaches
                to document how education evolved in the early 21st century.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/global-capsules/education">
                  View Education Capsule
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-muted/40 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">About Global Capsules</h2>
            <p>
              Global Capsules are collective time capsules that bring together contributions from 
              people worldwide around specific themes that matter to humanity. Unlike personal
              time capsules, these are collaborative archives designed to preserve knowledge,
              experiences, and insights for future generations.
            </p>
            <p>
              Each global capsule focuses on an important aspect of our current world—climate change,
              cultural heritage, educational approaches, and more. Your contributions to these capsules
              will help future researchers, historians, and citizens understand our time period.
            </p>
            <div className="pt-2">
              <Button variant="outline" asChild>
                <Link href="/about">Learn More About TimeCapsule</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Join the Movement</h2>
            <p>
              Your experiences, knowledge, and perspective are valuable. By contributing to global
              capsules, you're helping preserve a diverse record of our time for future generations.
            </p>
            <p>
              All contributions are encrypted and securely stored until the capsule's opening date, 
              when they'll be made available for historical, educational, and research purposes.
            </p>
            <div className="pt-2">
              <Button asChild>
                <Link href="/signup">Create an Account to Contribute</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 