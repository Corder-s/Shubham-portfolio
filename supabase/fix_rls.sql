-- ==============================================================================
-- FIX ROW LEVEL SECURITY (RLS) FOR ADMIN CMS MANAGEMENT
-- ==============================================================================
-- Run this script in your Supabase SQL Editor so that your Admin CMS
-- can create, update, and delete all portfolio content without RLS blocking.

-- 1. SOCIAL LINKS
DROP POLICY IF EXISTS "Public social_links are viewable by everyone" ON public.social_links;
DROP POLICY IF EXISTS "Admin full access to social_links" ON public.social_links;
DROP POLICY IF EXISTS "Full access to social_links" ON public.social_links;
CREATE POLICY "Full access to social_links" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

-- 2. PROJECTS
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;
DROP POLICY IF EXISTS "Admin full access to projects" ON public.projects;
DROP POLICY IF EXISTS "Full access to projects" ON public.projects;
CREATE POLICY "Full access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- 3. SKILLS
DROP POLICY IF EXISTS "Public skills are viewable by everyone" ON public.skills;
DROP POLICY IF EXISTS "Admin full access to skills" ON public.skills;
DROP POLICY IF EXISTS "Full access to skills" ON public.skills;
CREATE POLICY "Full access to skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);

-- 4. PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Full access to profiles" ON public.profiles;
CREATE POLICY "Full access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 5. EDUCATION
DROP POLICY IF EXISTS "Public education are viewable by everyone" ON public.education;
DROP POLICY IF EXISTS "Admin full access to education" ON public.education;
DROP POLICY IF EXISTS "Full access to education" ON public.education;
CREATE POLICY "Full access to education" ON public.education FOR ALL USING (true) WITH CHECK (true);

-- 6. ACHIEVEMENTS
DROP POLICY IF EXISTS "Public achievements are viewable by everyone" ON public.achievements;
DROP POLICY IF EXISTS "Admin full access to achievements" ON public.achievements;
DROP POLICY IF EXISTS "Full access to achievements" ON public.achievements;
CREATE POLICY "Full access to achievements" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

-- 7. EXPERIENCE
DROP POLICY IF EXISTS "Public experience are viewable by everyone" ON public.experience;
DROP POLICY IF EXISTS "Admin full access to experience" ON public.experience;
DROP POLICY IF EXISTS "Full access to experience" ON public.experience;
CREATE POLICY "Full access to experience" ON public.experience FOR ALL USING (true) WITH CHECK (true);

-- 8. SERVICES
DROP POLICY IF EXISTS "Public services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Admin full access to services" ON public.services;
DROP POLICY IF EXISTS "Full access to services" ON public.services;
CREATE POLICY "Full access to services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- 9. CERTIFICATIONS
DROP POLICY IF EXISTS "Public certifications are viewable by everyone" ON public.certifications;
DROP POLICY IF EXISTS "Admin full access to certifications" ON public.certifications;
DROP POLICY IF EXISTS "Full access to certifications" ON public.certifications;
CREATE POLICY "Full access to certifications" ON public.certifications FOR ALL USING (true) WITH CHECK (true);

-- 10. SITE SETTINGS
DROP POLICY IF EXISTS "Public site_settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Admin full access to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Full access to site_settings" ON public.site_settings;
CREATE POLICY "Full access to site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 11. CONTACT MESSAGES
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public CANNOT read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin full access to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Full access to contact_messages" ON public.contact_messages;
CREATE POLICY "Full access to contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- 12. SOCIAL & LINKEDIN FEED POSTS TABLE & POLICY
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL DEFAULT 'linkedin',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  author TEXT DEFAULT 'Shubham Saini',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access to social_posts" ON public.social_posts;
CREATE POLICY "Full access to social_posts" ON public.social_posts FOR ALL USING (true) WITH CHECK (true);

-- 13. STORAGE POLICIES
DROP POLICY IF EXISTS "Admin upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;
DROP POLICY IF EXISTS "Allow media uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow media updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow media deletes" ON storage.objects;
CREATE POLICY "Allow media uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('portfolio-media', 'resumes'));
CREATE POLICY "Allow media updates" ON storage.objects FOR UPDATE USING (bucket_id IN ('portfolio-media', 'resumes'));
CREATE POLICY "Allow media deletes" ON storage.objects FOR DELETE USING (bucket_id IN ('portfolio-media', 'resumes'));
