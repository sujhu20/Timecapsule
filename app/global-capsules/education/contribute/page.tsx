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
import { GraduationCap, School, Lightbulb, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ContributeEducationPage() {
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
      title: "Education contribution submitted!",
      description: "Thank you for contributing to the Education Evolution time capsule.",
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
              Thank you for helping document educational evolution for future generations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <div className="text-center">
              <p className="mb-4">
                Your education contribution has been securely encrypted and added to the time capsule.
              </p>
              <p className="text-muted-foreground mb-6">
                Your insights will help future generations understand how education evolved in our time.
              </p>
              
              <div className="space-y-4">
                <Button asChild>
                  <Link href="/global-capsules/education">Return to Education Evolution Page</Link>
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
          <h1 className="text-3xl font-bold tracking-tight">Document Education Evolution</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your educational experiences, teaching methods, or observations about
            how education is transforming in our time.
          </p>
        </div>
        
        <Tabs defaultValue="experiences" className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-xl mx-auto">
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="methods">Methods</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="future">Future Vision</TabsTrigger>
          </TabsList>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <TabsContent value="experiences" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Educational Experiences</span>
                  </CardTitle>
                  <CardDescription>
                    Share your personal educational journey and experiences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exp-title">Title</Label>
                    <Input id="exp-title" placeholder="Give your experience a descriptive title" required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edu-role">Your Role</Label>
                      <Select defaultValue="student">
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="educator">Educator/Teacher</SelectItem>
                          <SelectItem value="administrator">School Administrator</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="researcher">Education Researcher</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country/Region</Label>
                      <Input id="country" placeholder="Where did this take place?" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time-period">Time Period</Label>
                    <Input id="time-period" placeholder="When did this experience occur? (e.g., 2010-2020)" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exp-content">Your Experience</Label>
                    <Textarea 
                      id="exp-content" 
                      placeholder="Describe your educational experience, including what worked well, challenges you faced, and how it shaped your understanding..." 
                      rows={8}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type of Educational Experience</Label>
                    <RadioGroup defaultValue="formal">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="formal" id="formal" />
                        <Label htmlFor="formal">Traditional Formal Education</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alternative" id="alternative" />
                        <Label htmlFor="alternative">Alternative Education Model</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="digital" id="digital" />
                        <Label htmlFor="digital">Digital/Remote Learning</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self" id="self" />
                        <Label htmlFor="self">Self-Directed Learning</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-exp" id="other-exp" />
                        <Label htmlFor="other-exp">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="methods" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    <span>Teaching Methods & Approaches</span>
                  </CardTitle>
                  <CardDescription>
                    Document innovative or traditional teaching methods and educational approaches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="method-title">Title of Method/Approach</Label>
                    <Input id="method-title" placeholder="Name of the teaching method or approach" required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="method-type">Type of Method</Label>
                      <Select defaultValue="pedagogy">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pedagogy">Pedagogical Approach</SelectItem>
                          <SelectItem value="classroom">Classroom Management</SelectItem>
                          <SelectItem value="assessment">Assessment Method</SelectItem>
                          <SelectItem value="curriculum">Curriculum Design</SelectItem>
                          <SelectItem value="specialized">Specialized Instruction</SelectItem>
                          <SelectItem value="other-method">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="method-level">Educational Level</Label>
                      <Select defaultValue="k12">
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="early">Early Childhood</SelectItem>
                          <SelectItem value="primary">Primary/Elementary</SelectItem>
                          <SelectItem value="secondary">Secondary/High School</SelectItem>
                          <SelectItem value="higher">Higher Education</SelectItem>
                          <SelectItem value="adult">Adult Education</SelectItem>
                          <SelectItem value="professional">Professional Training</SelectItem>
                          <SelectItem value="all">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="method-description">Description of Method</Label>
                    <Textarea 
                      id="method-description" 
                      placeholder="Describe the teaching method or educational approach in detail..." 
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="method-effectiveness">Effectiveness & Outcomes</Label>
                    <Textarea 
                      id="method-effectiveness" 
                      placeholder="Describe how effective this method is, what outcomes it achieves, and any evidence of its impact..." 
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="method-context">Cultural/Institutional Context</Label>
                    <Textarea 
                      id="method-context" 
                      placeholder="Describe the cultural, institutional, or regional context where this method is used..." 
                      rows={4}
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="technology" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Educational Technology</span>
                  </CardTitle>
                  <CardDescription>
                    Document technologies transforming education in our time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tech-name">Technology Name</Label>
                    <Input id="tech-name" placeholder="Name of the educational technology or platform" required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tech-category">Technology Category</Label>
                      <Select defaultValue="lms">
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lms">Learning Management System</SelectItem>
                          <SelectItem value="ai">AI/Adaptive Learning</SelectItem>
                          <SelectItem value="vr">Virtual/Augmented Reality</SelectItem>
                          <SelectItem value="mooc">MOOC/Online Course Platform</SelectItem>
                          <SelectItem value="assessment">Assessment Technology</SelectItem>
                          <SelectItem value="mobile">Mobile Learning App</SelectItem>
                          <SelectItem value="communication">Communication Tool</SelectItem>
                          <SelectItem value="other-tech">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tech-year">Year Introduced/Used</Label>
                      <Input id="tech-year" placeholder="When was this technology introduced or used?" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tech-description">Technology Description</Label>
                    <Textarea 
                      id="tech-description" 
                      placeholder="Describe the technology and how it's used in education..." 
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tech-impact">Educational Impact</Label>
                    <Textarea 
                      id="tech-impact" 
                      placeholder="How has this technology impacted teaching and learning? What changes has it enabled?" 
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tech-challenges">Challenges & Limitations</Label>
                    <Textarea 
                      id="tech-challenges" 
                      placeholder="What challenges or limitations exist with this technology?" 
                      rows={4}
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="future" className="mt-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Future of Education</span>
                  </CardTitle>
                  <CardDescription>
                    Share your vision for how education might evolve in the coming decades
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vision-title">Title of Your Vision</Label>
                    <Input id="vision-title" placeholder="Give your vision a descriptive title" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vision-timeframe">Timeframe</Label>
                    <Select defaultValue="2030-2040">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2030-2040">Near Future (2030-2040)</SelectItem>
                        <SelectItem value="2040-2060">Mid-term Future (2040-2060)</SelectItem>
                        <SelectItem value="2060-2100">Long-term Future (2060-2100)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vision-description">Your Vision</Label>
                    <Textarea 
                      id="vision-description" 
                      placeholder="Describe your vision for how education might transform in the future. What will change? What might remain the same?" 
                      rows={8}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vision-rationale">Rationale</Label>
                    <Textarea 
                      id="vision-rationale" 
                      placeholder="What trends, technologies, or social changes are driving your vision? Why do you believe education will evolve this way?" 
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Key Areas of Transformation</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="area-tech" />
                        <Label htmlFor="area-tech" className="text-sm">Technology Integration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="area-structure" />
                        <Label htmlFor="area-structure" className="text-sm">Institutional Structure</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="area-content" />
                        <Label htmlFor="area-content" className="text-sm">Learning Content</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="area-pedagogy" />
                        <Label htmlFor="area-pedagogy" className="text-sm">Teaching Methods</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="area-access" />
                        <Label htmlFor="area-access" className="text-sm">Accessibility & Equity</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="area-assessment" />
                        <Label htmlFor="area-assessment" className="text-sm">Assessment & Credentials</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I confirm that this contribution represents my own experiences, observations, or vision,
                    and that I have the right to share this information.
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
                  ) : "Submit Education Contribution"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </Tabs>
      </div>
    </div>
  );
} 