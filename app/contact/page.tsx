"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { MailIcon, MessageSquare, Building2, Users, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, inquiryType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiryType: "general"
    });
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="container py-10 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about TimeCapsule? We're here to help. Get in touch with our team.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MailIcon className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-sm text-muted-foreground">support@timecapsule.app</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Headquarters</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Innovation Way<br />
                      Tech City, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our support team is available Monday through Friday from 9:00 AM to 6:00 PM PST.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="inquiryType" className="block mb-2">Inquiry Type</Label>
                      <RadioGroup 
                        value={formData.inquiryType} 
                        onValueChange={handleRadioChange}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general" className="cursor-pointer flex items-center gap-1">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>General</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="support" id="support" />
                          <Label htmlFor="support" className="cursor-pointer flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Support</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="business" id="business" />
                          <Label htmlFor="business" className="cursor-pointer flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>Business</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partnership" id="partnership" />
                          <Label htmlFor="partnership" className="cursor-pointer flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>Partnership</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide as much detail as possible..." 
                        rows={5} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 