import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Education Evolution - Global Capsules",
  description: "Contribute to a collective time capsule documenting how education has evolved and how it might transform in the future",
};

export default function EducationGlobalCapsulePage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Education Evolution</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Document educational approaches from around the world and help future generations
            understand how we learned and taught in our time.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl">500+</CardTitle>
              <CardDescription className="text-center">Contributors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-100 dark:border-purple-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl">40+</CardTitle>
              <CardDescription className="text-center">Countries Represented</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Globe className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-100 dark:border-green-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl">2050</CardTitle>
              <CardDescription className="text-center">Unveiling Date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <BookOpen className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-10 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">About This Global Capsule</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The Education Evolution capsule aims to create a comprehensive archive of how education
                  systems, teaching methods, and learning approaches have evolved throughout the early 21st century.
                </p>
                <p className="mb-4">
                  By documenting current educational practices, technological advancements in learning, and different
                  cultural approaches to education, we create a valuable time capsule for future educators and students.
                </p>
                <p>
                  This capsule will be unveiled in 2050, allowing future generations to understand our 
                  educational journeys, challenges, and innovations—helping to inform their own pathways forward.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">How You Can Contribute</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Educational Experiences
                  </CardTitle>
                  <CardDescription>
                    Share your personal experiences with education
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Document your educational journey, unique learning experiences, 
                    or perspectives as a student or educator.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/global-capsules/education/contribute">Share Your Experience</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Teaching Methods
                  </CardTitle>
                  <CardDescription>
                    Document educational approaches and methodologies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Share innovative teaching methods, educational technologies, 
                    or unique institutional approaches to learning.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/global-capsules/education/contribute">Document Methods</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Featured Focus Areas</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Digital Learning Transformation</CardTitle>
                  <CardDescription>Documenting the shift to digital and hybrid learning environments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    How has the rise of digital learning platforms, virtual classrooms, and educational
                    technology transformed the educational experience? Share your observations on what
                    worked, what didn't, and how students and educators adapted.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/global-capsules/education/contribute" className="flex items-center gap-1">
                      Contribute <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Education Models</CardTitle>
                  <CardDescription>Exploring approaches beyond traditional classroom education</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    From homeschooling and unschooling to Montessori, Waldorf, and other alternative
                    approaches, document how different educational philosophies shaped learning
                    experiences outside conventional systems.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/global-capsules/education/contribute" className="flex items-center gap-1">
                      Contribute <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Global Educational Inequities</CardTitle>
                  <CardDescription>Addressing access and opportunity disparities worldwide</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Document the challenges, innovations, and initiatives aimed at reducing educational
                    inequalities across different regions, socioeconomic groups, and circumstances.
                    Share stories of progress and remaining challenges.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/global-capsules/education/contribute" className="flex items-center gap-1">
                      Contribute <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/global-capsules/education/contribute">
              Contribute to Education Evolution
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 