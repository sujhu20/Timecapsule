import { createClient } from '@supabase/supabase-js';

// Debug environment variables
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'timecapsul'
      },
      fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
        const fetchOptions: RequestInit = {
          ...options,
          credentials: 'include' as RequestCredentials,
          mode: 'cors' as RequestMode,
        };
        return fetch(url, fetchOptions);
      }
    }
  }
);

// Debug function to check connection
export async function checkSupabaseConnection() {
  try {
    console.log('Checking Supabase connection...');
    // First try a simpler request to see if we can reach Supabase
    console.log('Testing Supabase connection with basic request...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Basic Supabase connection test failed:', response.status, response.statusText);
      return false;
    }

    console.log('Basic connection test successful, now testing database query...');
    const { data, error } = await supabase.from('capsules').select('count');
    if (error) {
      console.error('Supabase database query error:', error);
      return false;
    }
    console.log('Supabase connection successful, data:', data);
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
}

// Types for our database schema
export type Capsule = {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  content: string;
  media_url?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'mixed' | 'ar';
  user_id: string;
  privacy: 'public' | 'private';
  scheduled_date?: string;
  opened_at?: string;
  updated_at: string;
};

export type CapsuleInsert = Omit<Capsule, 'id' | 'created_at'>; 