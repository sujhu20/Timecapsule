"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Lock, Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { SocialFeed } from '@/components/social-feed';

export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto">
          <SocialFeed />
        </div>
      </div>
    );
  }

  return (
    <div className="page-content flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden">
        <div className="gradient-background absolute inset-0 -z-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
            {/* Left column - text content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                Share your memories with the world
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">
                Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Time Capsules</span> for the future
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Create and share time capsules with the community. Connect through memories, discover others' stories, and preserve moments together.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href={isLoggedIn ? "/capsules/create" : "/signup"}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                >
                  {isLoggedIn ? "Create a Capsule" : "Create Your First Capsule"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/write-to-self"
                  className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors flex items-center"
                >
                  <span className="mr-2">✨</span>
                  Write to Self
                </Link>

              </div>

              <div className="flex items-center space-x-4 pt-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white ring-2 ring-white dark:ring-slate-900">JD</div>
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white ring-2 ring-white dark:ring-slate-900">AS</div>
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs text-white ring-2 ring-white dark:ring-slate-900">MP</div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-800 dark:text-slate-200 ring-2 ring-white dark:ring-slate-900">+3k</div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Join 3,000+ community members sharing their memories
                </p>
              </div>
            </div>

            {/* Right column - feature image */}
            <div className="lg:w-1/2 relative">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 transform transition-all duration-500 hover:scale-105">
                <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center">
                      <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4"></div>
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6"></div>
                </div>
                <div className="mt-6 flex justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
                    Scheduled: Dec 25, 2025
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                    <span className="w-3 h-3 rounded-full bg-green-600"></span>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-xs animate-float">
                <Lock className="h-4 w-4 text-purple-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-xs animate-float animation-delay-1000">
                <Share2 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="w-full py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full opacity-10"></div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
              Start Preserving Your Memories Today
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 relative z-10">
              Join thousands of people who trust Timecapsul to preserve their most precious memories for the future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative z-10">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg shadow-blue-700/20"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg shadow-blue-700/20"
                  >
                    Sign Up for Free
                  </Link>
                  <Link
                    href="/signin"
                    className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
} 