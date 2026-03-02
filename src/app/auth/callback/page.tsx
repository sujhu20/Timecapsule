"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("Verifying your email...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        if (!searchParams) {
          setError('Could not load verification parameters');
          return;
        }

        // Get parameters from URL
        const error = searchParams.get("error");
        const error_description = searchParams.get("error_description");

        if (error) {
          setError(`${error}: ${error_description}`);
          return;
        }

        // If there's no error but no auth code either, something went wrong
        const authCode = searchParams.get("code");
        if (!authCode) {
          setError("No verification code found in the URL");
          return;
        }

        // Exchange the auth code for a session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);

        if (exchangeError) {
          setError(`Failed to verify email: ${exchangeError.message}`);
          return;
        }

        setMessage("Email verified successfully! Redirecting...");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

      } catch (err) {
        console.error("Error during email verification:", err);
        setError("An unexpected error occurred during email verification");
      }
    };

    handleEmailVerification();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-lg bg-white dark:bg-slate-800 p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          {error ? (
            <>
              <div className="text-red-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
                <p>{error}</p>
              </div>
              <button
                onClick={() => router.push("/signin")}
                className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Sign In
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                {message === "Email verified successfully! Redirecting..." ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                )}
                <h2 className="text-xl font-semibold mb-2">
                  {message === "Email verified successfully! Redirecting..."
                    ? "Email Verified!"
                    : "Verifying Email"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">{message}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 