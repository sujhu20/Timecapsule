-- Create the users table if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- Grant permissions for the anonymous role (used by the anon key)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon;

-- For this specific case where we're handling auth in Next.js, we'll disable RLS
-- or create a simple policy that allows operations for our API
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
-- This is simpler for our use case where we manage auth in the Next.js API
CREATE POLICY users_api_policy ON public.users 
  FOR ALL 
  TO anon 
  USING (true) 
  WITH CHECK (true); 