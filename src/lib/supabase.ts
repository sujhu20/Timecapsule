import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase is optional — the primary DB is Prisma/PostgreSQL.
// If env vars are not set we export null and callers must guard.

// Create a single supabase client for interacting with your database
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(
    supabaseUrl,
    supabaseAnonKey,
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
  )
  : null;

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
    const { data, error } = await supabase!.from('capsules').select('count');
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