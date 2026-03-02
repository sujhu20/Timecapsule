#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import readline from 'readline';

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

// Get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// List all users from the auth schema
async function listAllUsers() {
  console.log('Listing all users in the database...');
  
  try {
    // First check if we have direct access to auth.users
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .limit(10);
    
    if (!authError) {
      console.log('Users found in auth schema:', authUsers);
      return;
    }
    
    // If we don't have direct access, try the public users table
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(10);
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    
    console.log('Users found in public schema:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email || 'No email'}`);
    });
  } catch (error) {
    console.error('Error listing users:', error);
  }
}

// Check capsules for a specific user
async function checkUserCapsules(userId) {
  console.log(`Checking capsules for user ID: ${userId}`);
  
  try {
    const { data, error } = await supabase
      .from('capsules')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching capsules:', error);
      return;
    }
    
    console.log(`Found ${data.length} capsules for user ${userId}`);
    
    if (data.length > 0) {
      data.forEach((capsule, index) => {
        console.log(`\nCapsule ${index + 1}:`);
        console.log(`ID: ${capsule.id}`);
        console.log(`Title: ${capsule.title}`);
        console.log(`Type: ${capsule.type}`);
        console.log(`Privacy: ${capsule.privacy}`);
        console.log(`Created at: ${capsule.created_at}`);
        console.log(`User ID: ${capsule.user_id}`);
      });
    } else {
      console.log('No capsules found for this user.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Main function to run the script
async function main() {
  // First list all users
  await listAllUsers();
  
  // Then ask for a user ID to check capsules
  rl.question('\nEnter a user ID to check their capsules: ', async (userId) => {
    await checkUserCapsules(userId);
    rl.close();
  });
}

main(); 