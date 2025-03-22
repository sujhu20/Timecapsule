"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success
    setIsEmailSent(true);
    toast.success("Password reset instructions sent to your email");
    
    setIsSubmitting(false);
  };

  return (
    <div className="container flex h-[calc(100vh-14rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            {!isEmailSent 
              ? "Enter your email address and we'll send you a link to reset your password" 
              : "Check your email for password reset instructions"}
          </CardDescription>
        </CardHeader>

        {!isEmailSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : "Send Reset Link"}
              </Button>
              <div className="text-center text-sm">
                <Link href="/signin" className="text-muted-foreground hover:text-foreground underline">
                  Back to Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6">
            <div className="rounded-full w-12 h-12 bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <div className="text-center">
              <p className="mb-4">
                We've sent an email to <strong>{email}</strong> with instructions to reset your password.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                If you don't receive an email within a few minutes, please check your spam folder
                or try again with a different email address.
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEmailSent(false)}
                >
                  Try another email
                </Button>
                <Link href="/signin" className="text-sm text-muted-foreground hover:text-foreground">
                  Return to sign in
                </Link>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 