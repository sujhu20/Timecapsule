"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase, checkSupabaseConnection } from "@/lib/supabase";

export default function UserInfoDebugPage() {
  const { data: session, status } = useSession();
  const [capsules, setCapsules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixMessage, setFixMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("checking");

  // Check Supabase connection
  useEffect(() => {
    async function checkConnection() {
      try {
        const isConnected = await checkSupabaseConnection();
        setConnectionStatus(isConnected ? "connected" : "error");
        if (!isConnected) {
          setError("Failed to connect to Supabase. Please check your environment variables.");
        }
      } catch (err) {
        console.error('Connection check error:', err);
        setConnectionStatus("error");
        setError(`Connection check failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    
    checkConnection();
  }, []);

  // Fetch user data
  useEffect(() => {
    async function fetchData() {
      if (connectionStatus !== "connected") {
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Fetch all capsules directly
        const { data: capsulesData, error: capsulesError } = await supabase
          .from('capsules')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (capsulesError) {
          console.error('Error fetching capsules:', capsulesError);
          setError(`Error fetching capsules: ${capsulesError.message}`);
        } else {
          console.log('Capsules fetched successfully:', capsulesData);
          setCapsules(capsulesData || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Error fetching data: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    }
    
    if (status === "authenticated" && connectionStatus === "connected") {
      fetchData();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, connectionStatus]);

  // Fix the user ID for a capsule
  const fixCapsuleUserId = async (capsuleId: string) => {
    if (!session?.user?.id) {
      setError("No user ID available in session");
      return;
    }
    
    try {
      setFixMessage(`Fixing capsule ${capsuleId}...`);
      
      const { data, error } = await supabase
        .from('capsules')
        .update({ user_id: session.user.id })
        .eq('id', capsuleId)
        .select();
      
      if (error) {
        setError(`Error updating capsule: ${error.message}`);
        return;
      }
      
      setFixMessage(`Capsule ${capsuleId} updated successfully!`);
      
      // Refresh capsules list
      const { data: refreshedData, error: refreshError } = await supabase
        .from('capsules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (refreshError) {
        console.error('Error refreshing capsules:', refreshError);
      } else {
        setCapsules(refreshedData || []);
      }
    } catch (err) {
      setError(`Error updating capsule: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">User Info Debug</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">User Info Debug</h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-red-500">Not authenticated. Please sign in first.</p>
          <button
            onClick={() => window.location.href = "/signin"}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">User Info Debug</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {fixMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
          <p>{fixMessage}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === "connected" ? "bg-green-500" :
              connectionStatus === "error" ? "bg-red-500" :
              "bg-yellow-500"
            }`} />
            <span className="font-medium">
              {connectionStatus === "connected" ? "Connected to Supabase" :
               connectionStatus === "error" ? "Connection Error" :
               "Checking Connection..."}
            </span>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium">Status:</span> {status}
            </div>
            <div>
              <span className="font-medium">Name:</span> {session?.user?.name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {session?.user?.email || 'N/A'}
            </div>
            <div>
              <span className="font-medium">User ID:</span> <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">{session?.user?.id || 'N/A'}</code>
            </div>
            <div>
              <span className="font-medium">User Sub:</span> <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">{session?.user?.sub || 'N/A'}</code>
            </div>
            <div>
              <span className="font-medium">Session Expires:</span> {session?.expires ? new Date(session.expires).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
        
        {/* All Capsules */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">All Capsules ({capsules.length})</h2>
          
          {capsules.length === 0 ? (
            <p>No capsules found in the database.</p>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {capsules.map((capsule) => (
                      <tr key={capsule.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{capsule.title}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-xs">
                            {capsule.user_id}
                          </code>
                          <br />
                          <span className="text-xs">
                            {capsule.user_id === session?.user?.id 
                              ? '✅ Matches session ID' 
                              : capsule.user_id === session?.user?.sub 
                                ? '✅ Matches session sub' 
                                : '❌ No match with session'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {new Date(capsule.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {capsule.status}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {capsule.user_id !== session?.user?.id && (
                            <button
                              onClick={() => fixCapsuleUserId(capsule.id)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Fix User ID
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 