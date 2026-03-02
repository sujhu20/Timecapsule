import postgres from 'postgres';

/**
 * Executes SQL commands on the Supabase Postgres database
 * @param sqlCommands SQL commands to execute
 * @returns Result of the execution
 */
export async function executeSql(sqlCommands: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract connection parameters from env variables
    const connectionString = process.env.DATABASE_URL || '';
    
    // If no direct database URL is provided, try to construct from Supabase credentials
    if (!connectionString) {
      throw new Error('No database connection string available. Set DATABASE_URL environment variable.');
    }
    
    // Create a connection
    const sql = postgres(connectionString, {
      max: 1, // Use only one connection for executing commands
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // 10 second timeout for connecting
    });
    
    try {
      // Execute the SQL commands
      await sql.unsafe(sqlCommands);
      return { success: true };
    } finally {
      // Always close the connection
      await sql.end();
    }
  } catch (error) {
    console.error('SQL execution error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Attempts to create the capsules table
 * @returns Result of the operation
 */
export async function createCapsulesTable(): Promise<{ success: boolean; error?: string }> {
  const capsuleTableSql = `
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
  
  return executeSql(capsuleTableSql);
} 