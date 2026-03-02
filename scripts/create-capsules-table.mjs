#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = dotenv.parse(envContent);

// Extract Supabase connection details
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase environment variables are not set');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to create capsules table
const sql = `
-- Create extensions if not exists
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
  WITH CHECK (true);
`;

// Execute SQL using Supabase's rpc function
async function createCapsulesTable() {
  console.log('Connecting to Supabase...');
  
  try {
    // First check if the table exists by trying to query it
    console.log('Checking if capsules table exists...');
    
    try {
      const { data, error } = await supabase
        .from('capsules')
        .select('id')
        .limit(1);
        
      if (!error) {
        console.log('The capsules table already exists.');
        process.exit(0);
      }
      
      // If table doesn't exist, error.code will be '42P01'
      if (error && error.code !== '42P01') {
        console.error('Unexpected error checking table:', error);
        process.exit(1);
      }
      
      console.log('Table does not exist, creating it now...');
    } catch (checkError) {
      console.log('Error checking table, assuming it does not exist:', checkError.message);
    }
    
    // Create the table
    console.log('Creating capsules table directly...');
    
    // Split the SQL into individual statements for direct execution
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
      
    // Execute each statement directly
    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        
        // Using direct fetch to execute the SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            query: statement
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log(`Warning: ${errorText}`);
        }
      } catch (stmtError) {
        console.log(`Warning executing statement: ${stmtError.message}`);
      }
    }
    
    // Verify the table was created
    console.log('Verifying table creation...');
    const { data, error } = await supabase
      .from('capsules')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.error('Failed to create the capsules table.');
      console.error('Please use the Supabase dashboard to run this SQL:');
      console.log(sql);
      process.exit(1);
    }
    
    console.log('Capsules table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    console.log('Please run this SQL manually in the Supabase SQL Editor:');
    console.log(sql);
    process.exit(1);
  }
}

// Execute the function
createCapsulesTable(); 