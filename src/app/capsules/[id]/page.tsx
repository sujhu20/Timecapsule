"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, Lock, ArrowLeft, MessageSquare, Download, Share2, Trash } from "lucide-react";

export default function CapsuleViewPage() {
  const params = useParams();
  const router = useRouter();
  const capsuleId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [capsule, setCapsule] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the capsule data
  useEffect(() => {
    async function fetchCapsule() {
      if (!capsuleId) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching capsule with ID: ${capsuleId}`);

        const response = await fetch(`/api/capsules/${capsuleId}`, {
          // Add cache: 'no-store' to prevent caching of failed responses
          cache: 'no-store'
        });

        if (!response.ok) {
          let errorText;
          try {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            errorText = errorData.error || `Failed to fetch capsule: ${response.status} ${response.statusText}`;

            // Set additional debug info if available
            if (errorData.debug) {
              console.log('Debug info from API:', errorData.debug);
            }
          } catch (e) {
            errorText = `Failed to fetch capsule: ${response.status} ${response.statusText}`;
          }

          throw new Error(errorText);
        }

        const data = await response.json();
        console.log('Fetched capsule data:', data);

        // Handle new nested API response structure
        // API returns: { success: true, data: { capsule: {...} } }
        const capsuleData = data.data?.capsule || data.capsule;

        if (!capsuleData) {
          throw new Error('Invalid response: Capsule data missing');
        }

        setCapsule(capsuleData);
      } catch (error) {
        console.error('Error fetching capsule:', error);

        // For mock-id errors, provide a more helpful message
        if (capsuleId.startsWith('mock-') && process.env.NODE_ENV === 'development') {
          const mockNum = capsuleId.replace('mock-', '');
          setError(`This mock capsule (${capsuleId}) may not exist. In development mode, only mock-1 through mock-4 are available by default.`);
        } else {
          setError(error instanceof Error ? error.message : 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCapsule();
  }, [capsuleId]);

  const [isDeleting, setIsDeleting] = useState(false);

  // Handle capsule deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this capsule? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/capsules/${capsuleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete capsule");
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting capsule:", error);
      alert("Failed to delete capsule. Please try again.");
      setIsDeleting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading capsule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Capsule</h1>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <p className="text-slate-600 dark:text-slate-400 mb-3">Capsule ID: {capsuleId}</p>

          {capsuleId.startsWith('mock-') && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-md mb-4">
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                <strong>Development Note:</strong> You're trying to access a mock capsule. In development mode, capsules are stored in memory and may not persist between server restarts.
                Try viewing one of the mock capsules from your dashboard or create a new capsule.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>

            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h1 className="text-xl font-bold mb-2">Capsule Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The capsule you're looking for could not be found. It may have been deleted or you don't have permission to view it.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold gradient-text mb-2">{capsule.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {capsule.description || capsule.content}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Created: {formatDate(capsule.created_at)}</span>
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>Scheduled: {formatDate(capsule.scheduled_date)}</span>
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Lock className="h-4 w-4 mr-1.5" />
              <span>
                {capsule.privacy === 'private' ? 'Private' : 'Public'}
              </span>
            </div>
          </div>

          {/* Digital Trustee Info */}
          {(capsule.recipientName || capsule.recipientEmail) && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Digital Trustee:</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {capsule.recipientName || 'Unspecified'}
                  {capsule.recipientEmail && <span className="text-slate-400 ml-1">({capsule.recipientEmail})</span>}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Capsule Contents</h2>

          <div className="space-y-6">
            {capsule.media_url ? (
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-md mb-2 overflow-hidden">
                  <img
                    src={capsule.media_url}
                    alt={capsule.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-medium">{capsule.title}</p>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {capsule.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3">
            <Link
              href={`/capsules/${capsuleId}/edit`}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              Edit Capsule
            </Link>
            <button
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ${isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isDeleting ? (
              <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"></div>
            ) : (
              <Trash className="h-4 w-4 mr-2" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
} 