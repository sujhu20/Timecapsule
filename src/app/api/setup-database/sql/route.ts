import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import postgres from "postgres"; // This requires installing postgres package

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

export async function GET() {
  try {
    // Return the SQL script for manual execution
    return NextResponse.json(
      { 
        status: "success", 
        message: "Copy this SQL and run it in your Supabase SQL Editor",
        sql: SETUP_SQL
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving SQL:", error);
    return NextResponse.json(
      { error: "Failed to retrieve SQL script" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // First check if we need to create the table
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
    
    // Attempt direct SQL execution
    try {
      // Make sure we have postgres connection details
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json(
          { 
            status: "error",
            message: "Missing database connection details",
            sql: SETUP_SQL
          },
          { status: 500 }
        );
      }
      
      // Extract connection details from Supabase URL
      // Expected format: https://[project-ref].supabase.co
      const urlMatch = supabaseUrl.match(/https:\/\/([^\.]+)\.supabase\.co/);
      if (!urlMatch) {
        return NextResponse.json(
          { 
            status: "error",
            message: "Invalid Supabase URL format",
            sql: SETUP_SQL
          },
          { status: 500 }
        );
      }
      
      const projectRef = urlMatch[1];
      
      // Try to execute SQL directly via Supabase REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          query: SETUP_SQL
        })
      });
      
      if (!response.ok) {
        return NextResponse.json(
          { 
            status: "error",
            message: "Failed to execute SQL directly. Please run the SQL script manually in Supabase SQL Editor.",
            sql: SETUP_SQL,
            responseStatus: response.status,
            responseText: await response.text()
          },
          { status: 500 }
        );
      }
      
      // Verify the table was created
      const { data: verifyTable, error: verifyError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'capsules')
        .eq('table_schema', 'public')
        .maybeSingle();
      
      if (verifyError || !verifyTable) {
        return NextResponse.json(
          { 
            status: "error",
            message: "Failed to verify table creation. Please run the SQL script manually in Supabase SQL Editor.",
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
    } catch (sqlError) {
      console.error("SQL execution error:", sqlError);
      return NextResponse.json(
        { 
          status: "error",
          message: "Error executing SQL. Please run the SQL script manually in Supabase SQL Editor.",
          error: sqlError instanceof Error ? sqlError.message : String(sqlError),
          sql: SETUP_SQL
        },
        { status: 500 }
      );
    }
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