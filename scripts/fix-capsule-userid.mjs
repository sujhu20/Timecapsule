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

// List all users
async function listAllUsers() {
  console.log('Listing all users in the database...');
  
  try {
    // Try the public users table
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(10);
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    console.log('Users found in public schema:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}, Email: ${user.email || 'No email'}`);
    });
    
    return users;
  } catch (error) {
    console.error('Error listing users:', error);
    return [];
  }
}

// List all capsules
async function listAllCapsules() {
  console.log('\nListing all capsules in the database...');
  
  try {
    const { data, error } = await supabase
      .from('capsules')
      .select('id, title, user_id')
      .limit(20);
    
    if (error) {
      console.error('Error fetching capsules:', error);
      return [];
    }
    
    console.log(`Found ${data.length} capsules:`);
    data.forEach((capsule, index) => {
      console.log(`${index + 1}. ID: ${capsule.id}, Title: ${capsule.title}, User ID: ${capsule.user_id}`);
    });
    
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

// Update capsule user ID
async function updateCapsuleUserId(capsuleId, newUserId) {
  console.log(`Updating capsule ${capsuleId} with new user ID: ${newUserId}`);
  
  try {
    const { data, error } = await supabase
      .from('capsules')
      .update({ user_id: newUserId })
      .eq('id', capsuleId)
      .select();
    
    if (error) {
      console.error('Error updating capsule:', error);
      return false;
    }
    
    console.log('Capsule updated successfully:', data);
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    const users = await listAllUsers();
    const capsules = await listAllCapsules();
    
    if (users.length === 0 || capsules.length === 0) {
      console.log('No users or capsules found. Exiting.');
      rl.close();
      return;
    }
    
    rl.question('\nEnter the capsule ID you want to update: ', (capsuleId) => {
      const selectedCapsule = capsules.find(c => c.id === capsuleId);
      
      if (!selectedCapsule) {
        console.log(`Capsule with ID ${capsuleId} not found.`);
        rl.close();
        return;
      }
      
      console.log(`Selected capsule: ${selectedCapsule.title} (current user ID: ${selectedCapsule.user_id})`);
      
      rl.question('Enter the new user ID for this capsule: ', async (newUserId) => {
        const selectedUser = users.find(u => u.id === newUserId);
        
        if (!selectedUser) {
          console.log(`Warning: User with ID ${newUserId} was not found in the users list. Continue anyway?`);
          rl.question('Continue? (y/n): ', async (answer) => {
            if (answer.toLowerCase() === 'y') {
              await updateCapsuleUserId(capsuleId, newUserId);
            } else {
              console.log('Operation cancelled.');
            }
            rl.close();
          });
        } else {
          console.log(`Selected user: ${selectedUser.email} (ID: ${selectedUser.id})`);
          await updateCapsuleUserId(capsuleId, newUserId);
          rl.close();
        }
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    rl.close();
  }
}

main(); 