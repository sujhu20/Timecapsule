import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// SQL script to create the capsules table
const SETUP_SQL = `
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

export async function POST() {
  try {
    // First, check if we already have the table (to avoid errors)
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'capsules')
      .eq('table_schema', 'public')
      .maybeSingle();
    
    if (tableCheckError) {
      console.error("Error checking if capsules table exists:", tableCheckError);
      return NextResponse.json(
        { error: "Database error", details: tableCheckError.message },
        { status: 500 }
      );
    }
    
    if (tableExists) {
      return NextResponse.json(
        { 
          status: "success",
          message: "Capsules table already exists",
          created: false
        },
        { status: 200 }
      );
    }
    
    // Execute the setup SQL
    const { error: setupError } = await supabase.rpc('pgcrypto', {
      sql_query: SETUP_SQL
    });
    
    // If pgcrypto function doesn't exist, use raw SQL instead
    if (setupError) {
      console.log("Trying to run SQL directly via REST API");
      
      // Try the direct SQL approach
      const { error } = await supabase.from('capsules').select('id').limit(1);
      
      if (error && error.code === "42P01") { // Table doesn't exist error code
        return NextResponse.json(
          { 
            status: "error",
            message: "Unable to create table automatically. Please run the SQL script manually in Supabase SQL Editor.",
            sql: SETUP_SQL,
            error: setupError.message
          },
          { status: 500 }
        );
      }
    }
    
    // Verify the table was created
    const { data: verifyTable, error: verifyError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'capsules')
      .eq('table_schema', 'public')
      .maybeSingle();
    
    if (verifyError) {
      console.error("Error verifying capsules table:", verifyError);
      return NextResponse.json(
        { 
          status: "error",
          message: "Error verifying table creation",
          error: verifyError.message
        },
        { status: 500 }
      );
    }
    
    if (!verifyTable) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Failed to create the capsules table. Please run the SQL script manually in Supabase SQL Editor.",
          sql: SETUP_SQL
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        status: "success",
        message: "Capsules table created successfully",
        created: true
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to set up database",
        error: error instanceof Error ? error.message : String(error),
        sql: SETUP_SQL
      },
      { status: 500 }
    );
  }
} 