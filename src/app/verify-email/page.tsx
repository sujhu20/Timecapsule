"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || null;
  const email = searchParams?.get("email") || null;
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">(
    token ? "loading" : "no-token"
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        // In development, if we have an email but no token, try to auto-verify
        if (process.env.NODE_ENV === 'development' && email) {
          try {
            const response = await fetch("/api/auth/verify-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }), // Send email without token for dev auto-creation
            });

            const data = await response.json();

            if (response.ok) {
              setStatus("success");
              setMessage(data.message || "Email verified automatically in development mode!");
              
              // Redirect to signin page after a delay
              setTimeout(() => {
                router.push("/signin");
              }, 3000);
              return;
            }
          } catch (error) {
            console.error("Error auto-verifying in development:", error);
          }
        }
        return; // No token, so don't try to verify
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          
          // Redirect to signin page after a delay
          setTimeout(() => {
            router.push("/signin");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email. The link may be invalid or expired.");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    }

    verifyToken();
  }, [token, email, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Email Verification
          </h2>
          
          <div className="mt-8 flex flex-col items-center justify-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Verifying your email...
                </p>
              </>
            )}
            
            {status === "success" && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting you to sign in page...
                </p>
              </>
            )}
            
            {status === "error" && (
              <>
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {message}
                </p>
                <div className="mt-4">
                  <Link
                    href="/signin"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Sign In
                  </Link>
                </div>
              </>
            )}
            
            {status === "no-token" && (
              <>
                <AlertTriangle className="h-16 w-16 text-yellow-500" />
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
                  No verification token found in the URL
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400 text-center mt-2">
                  You need a verification token to confirm your email address. This usually happens when:
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-6 text-left">
                  <li>You accessed this page directly without clicking a verification link</li>
                  <li>Your verification link is missing the token parameter</li>
                  <li>The token may have been removed from the URL</li>
                </ul>
                
                {email && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      We notice you're trying to verify <strong>{email}</strong>. Please check your email inbox for a verification link, including your spam/junk folder.
                    </p>
                  </div>
                )}
                
                <div className="flex gap-4 mt-4">
                  <Link
                    href="/signup"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign Up Again
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 