"use client";

import { useState } from 'react';
import { Copy, Database, Server, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DatabaseStatus from '@/components/database-status';
import DatabaseSetupHelper from '@/components/database-setup-helper';

const CapsuleTableSQL = `-- Create extensions if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the capsules table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.capsules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video', 'audio', 'mixed', 'ar')),
  privacy TEXT NOT NULL CHECK (privacy IN ('private', 'public', 'specific', 'generational')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  is_blockchain_secured BOOLEAN DEFAULT false,
  user_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'delivered', 'opened')) DEFAULT 'pending'
);

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS capsules_user_id_idx ON public.capsules (user_id);
CREATE INDEX IF NOT EXISTS capsules_privacy_idx ON public.capsules (privacy);
CREATE INDEX IF NOT EXISTS capsules_status_idx ON public.capsules (status);

-- Grant permissions to the anonymous role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.capsules TO anon;

-- Enable Row Level Security (RLS)
ALTER TABLE public.capsules ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations
CREATE POLICY capsules_api_policy ON public.capsules 
  FOR ALL 
  TO anon 
  USING (true) 
  WITH CHECK (true);`;

export default function SetupPage() {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(CapsuleTableSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Server className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Database Setup</h1>
      </div>
      
      <div className="mb-8">
        <DatabaseStatus />
      </div>
      
      <div className="mb-8">
        <DatabaseSetupHelper />
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Setup Instructions</h2>
          
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              If the automatic setup didn't work, you can manually set up the required database tables in your Supabase project.
              Follow these steps to create the necessary tables:
            </p>
            
            <ol className="list-decimal ml-5 space-y-3 text-slate-700 dark:text-slate-300">
              <li>
                <span className="font-medium">Go to your Supabase project dashboard</span>
                <div className="mt-1">
                  <a 
                    href="https://app.supabase.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
                  >
                    Open Supabase Dashboard
                  </a>
                </div>
              </li>
              
              <li>
                <span className="font-medium">Navigate to the SQL Editor</span>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Click on "SQL Editor" in the left sidebar
                </div>
              </li>
              
              <li>
                <span className="font-medium">Create a new query</span>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Click on the "+" button to create a new SQL query
                </div>
              </li>
              
              <li>
                <span className="font-medium">Copy and paste the following SQL</span>
                <div className="relative mt-2">
                  <div className="absolute right-2 top-2">
                    <button 
                      onClick={copyToClipboard}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md"
                      aria-label="Copy SQL"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto text-xs max-h-96">
                    {CapsuleTableSQL}
                  </pre>
                </div>
              </li>
              
              <li>
                <span className="font-medium">Run the SQL query</span>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Click the "Run" button to execute the SQL and create the tables
                </div>
              </li>
              
              <li>
                <span className="font-medium">Refresh this page</span>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  After running the SQL, refresh this page to verify the database setup
                </div>
              </li>
            </ol>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium">Having Trouble?</h3>
          </div>
          
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            If you're encountering issues with the database setup, make sure:
          </p>
          
          <ul className="list-disc ml-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Your Supabase project is active and not paused</li>
            <li>You have the correct Supabase URL and API key in your .env.local file</li>
            <li>You have administrator access to the Supabase project</li>
            <li>The SQL query executed without errors</li>
          </ul>
          
          <div className="mt-6 flex justify-end">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 