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

// Function to check if a table exists
async function checkTable(tableName) {
  console.log(`Checking if the "${tableName}" table exists...`);
  
  try {
    // Method 1: Direct query with simple select
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log(`Table "${tableName}" does not exist (from direct query).`);
        return false;
      }
      console.log(`Error querying ${tableName}:`, error);
    } else {
      console.log(`Table "${tableName}" exists! (from direct query)`);
      return true;
    }
  } catch (directError) {
    console.log('Error with direct query:', directError.message);
  }
  
  // Method 2: REST API
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}?limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.ok) {
      console.log(`Table "${tableName}" exists! (from REST API)`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`Error checking ${tableName} via REST API:`, errorText);
    }
  } catch (restError) {
    console.log('Error with REST API:', restError.message);
  }
  
  return false;
}

// List of tables to check
const tables = ['users', 'capsules'];

// Check all tables
async function checkAllTables() {
  const results = {};
  for (const table of tables) {
    results[table] = await checkTable(table);
    console.log('------------------------');
  }
  
  // Print summary
  console.log('\nSummary:');
  Object.entries(results).forEach(([table, exists]) => {
    console.log(`${table}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  });
  
  // Exit with appropriate code
  const allExist = Object.values(results).every(exists => exists);
  process.exit(allExist ? 0 : 1);
}

checkAllTables(); 