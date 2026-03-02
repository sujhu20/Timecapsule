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

console.log('Supabase URL:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCapsules() {
  console.log('Checking capsules table...');
  
  try {
    // Fetch all capsules
    const { data, error } = await supabase
      .from('capsules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching capsules:', error);
      return;
    }
    
    console.log('Total capsules found:', data.length);
    
    if (data.length > 0) {
      console.log('\nFirst few capsules:');
      data.slice(0, 3).forEach((capsule, index) => {
        console.log(`\nCapsule ${index + 1}:`);
        console.log(`ID: ${capsule.id}`);
        console.log(`Title: ${capsule.title}`);
        console.log(`User ID: ${capsule.user_id}`);
        console.log(`Type: ${capsule.type}`);
        console.log(`Privacy: ${capsule.privacy}`);
        console.log(`Created at: ${capsule.created_at}`);
        console.log(`Scheduled for: ${capsule.scheduled_for}`);
      });
    } else {
      console.log('\nNo capsules found in the database.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkCapsules(); 