import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Check Supabase connection and users table by directly querying it
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError && usersError.code !== '42P01') {
      console.error("Supabase connection error:", usersError);
      return NextResponse.json(
        { 
          status: "error", 
          connection: "failed", 
          error: usersError.message,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured" : "missing"
        },
        { status: 500 }
      );
    }
    
    // Check if the capsules table exists by directly querying it
    const { data: capsulesData, error: capsulesError } = await supabase
      .from('capsules')
      .select('id')
      .limit(1);
    
    const tablesExist = {
      users: !usersError,
      capsules: !capsulesError
    };
    
    if (!tablesExist.capsules) {
      return NextResponse.json(
        { 
          status: "warning", 
          connection: "success", 
          tables: tablesExist,
          message: "The 'capsules' table doesn't exist. Please run the database setup script."
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        status: "success", 
        connection: "success", 
        tables: tablesExist,
        message: "Database configuration is valid"
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Database check error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to check database configuration",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 