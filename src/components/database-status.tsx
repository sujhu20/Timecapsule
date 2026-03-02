"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, Check, Database, XCircle } from 'lucide-react';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'success' | 'warning' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking database connection...');
  const [details, setDetails] = useState<any>(null);
  
  useEffect(() => {
    async function checkDatabaseStatus() {
      try {
        const response = await fetch('/api/database-check');
        const data = await response.json();
        
        setStatus(data.status);
        setMessage(data.message);
        setDetails(data);
        
        if (data.status === 'error') {
          console.error("Database error:", data);
        }
      } catch (error) {
        console.error("Error checking database status:", error);
        setStatus('error');
        setMessage('Failed to check database status.');
      }
    }
    
    checkDatabaseStatus();
  }, []);
  
  // Status icon components
  const statusIcons = {
    loading: <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />,
    success: <Check className="h-5 w-5 text-green-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />
  };
  
  return (
    <div className="border rounded-md p-4 bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Database className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Database Status</h3>
      </div>
      
      <div className="flex items-center space-x-2 mb-2 text-sm">
        {statusIcons[status]}
        <span>{message}</span>
      </div>
      
      {status !== 'loading' && details && (
        <div className="mt-3 text-xs space-y-1 border-t pt-2">
          <p>Connection: <span className={details.connection === 'success' ? 'text-green-500' : 'text-red-500'}>{details.connection}</span></p>
          
          {details.tables && (
            <div>
              <p>Tables:</p>
              <ul className="ml-4 list-disc">
                {Object.entries(details.tables).map(([table, exists]) => (
                  <li key={table} className={exists ? 'text-green-500' : 'text-red-500'}>
                    {table}: {exists ? 'Exists' : 'Missing'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {details.error && (
            <p className="text-red-500">Error: {details.error}</p>
          )}
        </div>
      )}
      
      {status === 'warning' && (
        <div className="mt-3">
          <button 
            onClick={() => window.open('https://app.supabase.com/project/_/sql', '_blank')}
            className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md"
          >
            Open Supabase SQL Editor
          </button>
        </div>
      )}
    </div>
  );
} 