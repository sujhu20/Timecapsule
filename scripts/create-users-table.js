const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Create a single supabase client for the entire app
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createUsersTable() {
  try {
    console.log('Checking if users table exists...');
    
    // Check if users table exists
    const { data: tables, error: listError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (listError) {
      console.error('Error checking tables:', listError);
      return;
    }
    
    const hasUsersTable = tables.some(table => table.tablename === 'users');
    
    if (hasUsersTable) {
      console.log('Users table already exists');
      return;
    }
    
    console.log('Creating users table...');
    
    // SQL to create the users table
    const { error: createError } = await supabase.rpc('create_users_table', {
      sql: `
        CREATE TABLE public.users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    });
    
    if (createError) {
      console.error('Error creating users table:', createError);
      return;
    }
    
    console.log('Users table created successfully');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createUsersTable(); 