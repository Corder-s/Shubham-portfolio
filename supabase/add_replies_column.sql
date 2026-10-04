-- Add replied_at and replies column to contact_messages so replies are persisted in Supabase
ALTER TABLE public.contact_messages 
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.contact_messages 
ADD COLUMN IF NOT EXISTS replies JSONB DEFAULT '[]'::jsonb;
