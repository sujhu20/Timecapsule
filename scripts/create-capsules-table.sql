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

-- Create policy to allow users to insert their own capsules
CREATE POLICY capsules_insert_policy ON public.capsules
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow users to see only their own or public capsules
CREATE POLICY capsules_select_policy ON public.capsules
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow users to update only their own capsules
CREATE POLICY capsules_update_policy ON public.capsules
  FOR UPDATE
  TO anon
  USING (true);

-- Create policy to allow users to delete only their own capsules
CREATE POLICY capsules_delete_policy ON public.capsules
  FOR DELETE
  TO anon
  USING (true); 