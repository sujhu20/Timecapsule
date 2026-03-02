"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Lock, Eye, Plus, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Capsule } from "@/lib/server-db";

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'all' | 'private' | 'public'>('all');
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Fetch user capsules from server API
  useEffect(() => {
    async function fetchCapsules() {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        // Redirect to login page if not authenticated
        window.location.href = "/signin";
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use the session from next-auth directly
        const userId = session?.user?.id || session?.user?.sub;

        // If id/sub is missing but email exists, use email as userId for display
        let displayUserId = userId;
        if (!displayUserId && session?.user?.email) {
          displayUserId = `email:${session.user.email}`;
          console.log(`Client: Using email-based ID for display: ${displayUserId}`);
        }

        const sessionInfo = session;

        // Log the session we're using
        console.log("Session data:", {
          hasUser: !!sessionInfo?.user,
          userId: displayUserId,
          idType: sessionInfo?.user?.id ? 'id property' : sessionInfo?.user?.sub ? 'sub property' : session?.user?.email ? 'email' : 'unknown',
          email: sessionInfo?.user?.email ? `${sessionInfo.user.email.substring(0, 3)}...` : 'missing'
        });

        // Create debug info for troubleshooting
        const sessionDebug = {
          hasUser: !!sessionInfo?.user,
          hasId: !!displayUserId,
          userId: displayUserId,
          idSource: sessionInfo?.user?.id ? 'id property' : sessionInfo?.user?.sub ? 'sub property' : session?.user?.email ? 'email' : 'missing',
          email: sessionInfo?.user?.email ? `${sessionInfo.user.email.substring(0, 3)}...` : 'missing',
          mode: process.env.NODE_ENV
        };

        setDebugInfo(sessionDebug);

        if (!userId && !session?.user?.email) {
          setError(`Error fetching capsules: User ID not found in session`);
          setLoading(false);
          return;
        }

        // Fetch capsules from our server API route
        const response = await fetch('/api/capsules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // If we have a real userId, send it directly
            // Otherwise if we have email-based ID, send as a fallback
            ...(userId ? { 'userId': userId } : {}),
            ...(displayUserId ? { 'displayUserId': displayUserId } : {})
          }
        });

        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            // Handle various API error formats
            if (typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            } else if (errorData.error?.message) {
              errorMessage = errorData.error.message;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else {
              errorMessage = `Server returned ${response.status}: ${response.statusText}`;
            }
          } catch (e) {
            errorMessage = `Server returned ${response.status}: ${response.statusText}`;
          }

          console.error("API Error:", errorMessage);
          setError(`Error fetching capsules: ${errorMessage}`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        // Handle new nested API response structure
        // API returns: { success: true, data: { capsules: [...] } }
        const userCapsules = data.data?.capsules || data.capsules || [];

        console.log(`Found ${userCapsules.length} capsules for user ${displayUserId}`);

        if (userCapsules.length === 0) {
          console.log("No capsules found for user", { userId: displayUserId });
        } else {
          console.log("Sample capsule data:", userCapsules[0]);
        }

        setCapsules(userCapsules as Capsule[]);

      } catch (error) {
        console.error("Error fetching capsules:", error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    }

    fetchCapsules();
  }, [session, status]);

  // Filter capsules based on active tab
  const filteredCapsules = activeTab === 'all'
    ? capsules
    : capsules.filter(capsule => capsule.privacy === activeTab);

  if (status === "loading" || loading) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h2 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error Loading Capsules</h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <div className="mt-3 text-sm text-red-600 dark:text-red-400">
            <p>Debug info: User ID = {session?.user?.id || session?.user?.sub || 'missing'}</p>
            {debugInfo && (
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (capsules.length === 0) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Your Time Capsules</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage and track all your time capsules
            </p>
          </div>
          <Link
            href="/capsules/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Capsule
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center py-12 max-w-2xl mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10" />
            </div>

            {/* Heading */}
            <h3 className="text-2xl font-bold mb-3 gradient-text">Welcome to TimeCapsule!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              You haven't created any time capsules yet. Start preserving and sharing your memories with the community.
            </p>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Link
                href="/capsules/create"
                className="p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Create Capsule</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Share your first memory</p>
              </Link>

              <Link
                href="/explore"
                className="p-6 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
              >
                <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Explore Community</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Discover others' stories</p>
              </Link>

              <Link
                href="/write-to-self"
                className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg hover:border-green-400 dark:hover:border-green-600 transition-all group"
              >
                <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-xl">✨</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Write to Self</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Send a future message</p>
              </Link>
            </div>

            {/* Tips */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">💡</span>
                Getting Started Tips
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Create your first capsule and choose "Public" to share with the community</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Explore others' capsules and follow interesting creators</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Set a future unlock date to surprise yourself later</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Your Time Capsules</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and track all your time capsules
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/capsules/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Capsule
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 p-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'all'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
            >
              All Capsules
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'private'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
            >
              <Lock className="w-4 h-4 inline mr-1" />
              Private
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'public'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Public
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {filteredCapsules.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">No {activeTab !== 'all' ? activeTab : ''} capsules found.</p>
              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-sm max-w-2xl mx-auto">
                <p className="font-medium mb-1">Debug information:</p>
                <pre className="whitespace-pre-wrap text-xs text-slate-600 dark:text-slate-400 overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            filteredCapsules.map((capsule) => (
              <div key={capsule.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <Link href={`/capsules/${capsule.id}`} className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {capsule.title}
                    </Link>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm line-clamp-2">{capsule.description || capsule.content}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {capsule.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${capsule.privacy === 'private'
                        ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                        {capsule.privacy === 'private' ? (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {(capsule.scheduledDate || capsule.unlockTime) && (
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="block font-medium">Opens</span>
                        <span>{new Date(capsule.scheduledDate || capsule.unlockTime!).toLocaleDateString()}</span>
                      </div>
                    )}
                    <Link
                      href={`/capsules/${capsule.id}`}
                      className="text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 