import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Landmark, BookOpen, Camera, MapPin } from "lucide-react";

export const metadata = {
  title: "Cultural Heritage Preservation - Global Capsules",
  description: "Preserve cultural heritage, traditions, and stories for future generations",
};

export default function HeritageGlobalCapsulePage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
            <Landmark className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Cultural Heritage Preservation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our global initiative to document and preserve cultural heritage, traditions, languages, and stories.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Preserve</CardTitle>
              <CardDescription>Document cultural traditions before they're lost</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
                Many cultural practices, languages, and knowledge systems are at risk of disappearing. 
                This capsule creates a secure archive for future generations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Connect</CardTitle>
              <CardDescription>Bridge past, present, and future generations</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
                Create connections across time by preserving stories, knowledge, and cultural heritage.
                Future generations will understand their roots.
              </p>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Educate</CardTitle>
              <CardDescription>Share cultural knowledge with the world</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">
                Cultural diversity enriches humanity. Your contributions help create a comprehensive
                educational resource about global cultural heritage.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">How You Can Contribute</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-lg">Cultural Stories & Traditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Record cultural stories, folklore, songs, recipes, crafts, and traditional knowledge from your community.
                  </p>
                  <Button asChild>
                    <Link href="/global-capsules/heritage/contribute">Share Cultural Stories</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                    <Camera className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-lg">Visual Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Contribute photographs and videos of cultural practices, traditional clothing, architecture, and ceremonies.
                  </p>
                  <Button asChild>
                    <Link href="/global-capsules/heritage/contribute">Upload Visual Media</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
                    <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-lg">Language Preservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Record endangered languages, dialects, expressions, and linguist data that might otherwise be lost.
                  </p>
                  <Button asChild>
                    <Link href="/global-capsules/heritage/contribute">Document Language</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Featured Cultural Regions</h2>
              <p className="mb-6 max-w-3xl">
                Currently focusing on documenting these cultural regions that are undergoing rapid change.
                Your contributions from these areas are especially valuable.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="justify-start h-auto py-2 px-4 bg-white/80 dark:bg-background/80">
                  <span>Indigenous Cultures of the Amazon</span>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-2 px-4 bg-white/80 dark:bg-background/80">
                  <span>Traditional Villages of the Himalayas</span>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-2 px-4 bg-white/80 dark:bg-background/80">
                  <span>Pacific Island Cultures</span>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-2 px-4 bg-white/80 dark:bg-background/80">
                  <span>Nomadic Peoples of Central Asia</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/global-capsules/heritage/contribute">Preserve Your Heritage</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 