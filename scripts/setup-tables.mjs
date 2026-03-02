import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTables() {
  try {
    // Create profiles table
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError && profilesError.code !== '42P01') { // 42P01 is "relation does not exist"
      console.error('Error checking profiles table:', profilesError);
      return;
    }

    if (profilesError) {
      console.log('Creating profiles table...');
      const { error: createProfilesError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID REFERENCES auth.users(id) PRIMARY KEY,
            display_name TEXT,
            bio TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
          );

          -- Enable Row Level Security
          ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

          -- Create policies
          CREATE POLICY "Users can view their own profile"
            ON profiles FOR SELECT
            USING (auth.uid() = id);

          CREATE POLICY "Users can update their own profile"
            ON profiles FOR UPDATE
            USING (auth.uid() = id);

          CREATE POLICY "Users can insert their own profile"
            ON profiles FOR INSERT
            WITH CHECK (auth.uid() = id);
        `
      });

      if (createProfilesError) {
        console.error('Error creating profiles table:', createProfilesError);
        return;
      }
    }

    // Create user_settings table
    const { error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1);

    if (settingsError && settingsError.code !== '42P01') { // 42P01 is "relation does not exist"
      console.error('Error checking user_settings table:', settingsError);
      return;
    }

    if (settingsError) {
      console.log('Creating user_settings table...');
      const { error: createSettingsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_settings (
            user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
            email_notifications BOOLEAN DEFAULT true,
            dark_mode BOOLEAN DEFAULT false,
            language TEXT DEFAULT 'en',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
          );

          -- Enable Row Level Security
          ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

          -- Create policies
          CREATE POLICY "Users can view their own settings"
            ON user_settings FOR SELECT
            USING (auth.uid() = user_id);

          CREATE POLICY "Users can update their own settings"
            ON user_settings FOR UPDATE
            USING (auth.uid() = user_id);

          CREATE POLICY "Users can insert their own settings"
            ON user_settings FOR INSERT
            WITH CHECK (auth.uid() = user_id);
        `
      });

      if (createSettingsError) {
        console.error('Error creating user_settings table:', createSettingsError);
        return;
      }
    }

    console.log('Successfully created all tables and policies');
  } catch (error) {
    console.error('Error setting up tables:', error);
  }
}

setupTables(); 