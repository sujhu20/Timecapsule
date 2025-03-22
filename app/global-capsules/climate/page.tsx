import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Globe, Leaf, Users, Calendar } from "lucide-react";

export const metadata = {
  title: "Climate Action 2050 - Global Capsules",
  description: "Join the global initiative to document climate change and actions for future generations",
};

export default function ClimateGlobalCapsulePage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <Leaf className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Climate Action 2050</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a global initiative to document climate change and climate action for future generations.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                <span>12,453</span>
              </CardTitle>
              <CardDescription>Global contributors</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                <span>197</span>
              </CardTitle>
              <CardDescription>Countries represented</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                <span>January 1, 2050</span>
              </CardTitle>
              <CardDescription>Scheduled unveiling date</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">About this Global Capsule</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                The Climate Action 2050 Time Capsule is a collaborative global project aimed at documenting 
                the climate crisis and humanity's response to it for future generations. By contributing to this 
                time capsule, you're adding your voice to a historical record that will be opened in 2050.
              </p>
              <p>
                Each contribution will be encrypted and securely stored until the unveiling date. This project 
                serves both as a call to action for today and as an educational resource for the future.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">How to Contribute</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share Your Climate Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Document climate changes you've witnessed in your region or share your personal climate action journey.
                  </p>
                  <Button asChild>
                    <Link href="/global-capsules/climate/contribute">Contribute Story</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contribute Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Submit photos, videos, or audio recordings that document environmental conditions or climate action.
                  </p>
                  <Button asChild>
                    <Link href="/global-capsules/climate/contribute">Upload Media</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scientific Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Researchers can submit scientific data, observations, or models for long-term preservation.
                  </p>
                  <Button asChild>
                    <Link href="/global-capsules/climate/contribute">Submit Data</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/global-capsules/climate/contribute">Join the Initiative</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 