'use client';

import { useState } from 'react';
import { Database, Play, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export default function DatabaseSetupHelper() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    sql?: string;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const runAutoSetup = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      setResult({
        success: response.ok && (data.status === 'success'),
        message: data.message,
        sql: data.sql,
        error: data.error
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to execute setup',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSqlScript = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/setup-database/sql');
      const data = await response.json();
      
      setResult({
        success: response.ok,
        message: data.message,
        sql: data.sql
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to retrieve SQL script',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.sql) {
      navigator.clipboard.writeText(result.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Database Setup Helper</h3>
      </div>
      
      <p className="text-slate-700 dark:text-slate-300 mb-6">
        The capsules table is missing in your database. You can set it up automatically or get the SQL script to run manually.
      </p>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={runAutoSetup}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Setting Up...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Setup Automatically
            </>
          )}
        </button>
        
        <button
          onClick={getSqlScript}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-slate-700 dark:border-slate-200 border-t-transparent"></div>
              Loading...
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Get SQL Script
            </>
          )}
        </button>
        
        <a
          href="https://app.supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Supabase Dashboard
        </a>
      </div>
      
      {result && (
        <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} mb-4`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {result.message}
              </h3>
              {result.error && (
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {result.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {result?.sql && (
        <div className="relative mt-4">
          <div className="absolute right-2 top-2">
            <button 
              onClick={copyToClipboard}
              className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-md"
              aria-label="Copy SQL"
            >
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto text-xs max-h-96">
            {result.sql}
          </pre>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Copy this SQL and run it in the Supabase SQL Editor to create the capsules table.
          </p>
        </div>
      )}
    </div>
  );
} 