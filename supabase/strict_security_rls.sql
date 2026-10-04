-- ==============================================================================
-- SHUBHAM SAINI PORTFOLIO — STRICT PUBLIC / PRIVATE ADMIN SEPARATION RLS
-- ==============================================================================
-- This SQL script:
-- 1. Ensures all tables exist (CREATE TABLE IF NOT EXISTS)
-- 2. Creates the admin_roles authorization table
-- 3. Enables Row Level Security (RLS) across all tables
-- 4. Creates public.is_admin() SECURITY DEFINER function
-- 5. Removes any wide-open legacy policies
-- 6. Enforces strict Public vs Private Admin access:
--    - contact_messages: Public INSERT only with validation checks. Public SELECT/UPDATE/DELETE denied. Admin full access.
--    - projects: Public SELECT only published projects. Public writes denied. Admin full CRUD.
--    - catalog tables (profiles, skills, education, etc.): Public SELECT only. Public writes denied. Admin full CRUD.
-- 7. Auto-links damnitzshuham1406@gmail.com to admin_roles if already signed up in auth.users.
-- ==============================================================================

-- 1. BASE EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE ALL APPLICATION TABLES IF NOT YET CREATED

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  bio TEXT NOT NULL,
  short_bio TEXT,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profile_image TEXT,
  resume_url TEXT,
  availability_status TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  technologies TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  proficiency TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- EDUCATION
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  status TEXT,
  details TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  highlight TEXT,
  category TEXT DEFAULT 'GENERAL',
  date TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- EXPERIENCE
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  icon TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_url TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- SOCIAL LINKS
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  replies JSONB DEFAULT '[]'::jsonb
);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT NOT NULL,
  site_description TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  availability TEXT,
  footer_text TEXT,
  profile_image TEXT,
  resume_url TEXT,
  og_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- SOCIAL & PLATFORM POSTS (GitHub / LinkedIn / Updates feed)
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL DEFAULT 'linkedin',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  author TEXT DEFAULT 'Shubham Saini',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ADMIN ROLES (Authoritative admin authorization)
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 3. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 4. DEFINE SERVER-SIDE is_admin() SECURITY DEFINER FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 5. DROP ANY LEGACY POLICIES
DROP POLICY IF EXISTS "Full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Full access to projects" ON public.projects;
DROP POLICY IF EXISTS "Full access to skills" ON public.skills;
DROP POLICY IF EXISTS "Full access to education" ON public.education;
DROP POLICY IF EXISTS "Full access to achievements" ON public.achievements;
DROP POLICY IF EXISTS "Full access to experience" ON public.experience;
DROP POLICY IF EXISTS "Full access to services" ON public.services;
DROP POLICY IF EXISTS "Full access to certifications" ON public.certifications;
DROP POLICY IF EXISTS "Full access to social_links" ON public.social_links;
DROP POLICY IF EXISTS "Full access to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Full access to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Full access to social_posts" ON public.social_posts;

-- Also clean up duplicate/previous policies
DROP POLICY IF EXISTS "Public select published projects" ON public.projects;
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
DROP POLICY IF EXISTS "Public insert contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin select contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public select active social links" ON public.social_links;
DROP POLICY IF EXISTS "Admin full access social links" ON public.social_links;
DROP POLICY IF EXISTS "Users can read own admin role" ON public.admin_roles;
DROP POLICY IF EXISTS "Admin manage admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Public select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public select skills" ON public.skills;
DROP POLICY IF EXISTS "Admin manage skills" ON public.skills;
DROP POLICY IF EXISTS "Public select education" ON public.education;
DROP POLICY IF EXISTS "Admin manage education" ON public.education;
DROP POLICY IF EXISTS "Public select achievements" ON public.achievements;
DROP POLICY IF EXISTS "Admin manage achievements" ON public.achievements;
DROP POLICY IF EXISTS "Public select experience" ON public.experience;
DROP POLICY IF EXISTS "Admin manage experience" ON public.experience;
DROP POLICY IF EXISTS "Public select services" ON public.services;
DROP POLICY IF EXISTS "Admin manage services" ON public.services;
DROP POLICY IF EXISTS "Public select certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admin manage certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public select site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public select social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admin manage social posts" ON public.social_posts;

-- 6. STRICT SECURITY POLICIES

-- ADMIN ROLES POLICIES
CREATE POLICY "Users can read own admin role"
ON public.admin_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin manage admin roles"
ON public.admin_roles FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CONTACT MESSAGES:
-- Public can INSERT with length/content validation.
-- Public CANNOT SELECT, UPDATE, OR DELETE. Private inbox is safe.
CREATE POLICY "Public insert contact message"
ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(name)) >= 2 AND length(trim(name)) <= 100 AND
  length(trim(email)) >= 5 AND length(trim(email)) <= 100 AND
  length(trim(message)) >= 10 AND length(trim(message)) <= 3000
);

CREATE POLICY "Admin select contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (public.is_admin());

-- PROJECTS:
-- Public SELECT only published projects. Drafts are invisible.
-- Admin has full CRUD over all projects.
CREATE POLICY "Public select published projects"
ON public.projects FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Admin full access projects"
ON public.projects FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SOCIAL LINKS:
CREATE POLICY "Public select active social links"
ON public.social_links FOR SELECT TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admin full access social links"
ON public.social_links FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CATALOG READ-ONLY FOR PUBLIC, FULL CRUD FOR ADMIN
CREATE POLICY "Public select profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage skills" ON public.skills FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select education" ON public.education FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage education" ON public.education FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage achievements" ON public.achievements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select experience" ON public.experience FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage experience" ON public.experience FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select certifications" ON public.certifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage certifications" ON public.certifications FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public select social posts" ON public.social_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage social posts" ON public.social_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. AUTO-GRANT ADMIN ROLE TO PRIMARY ADMIN
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = 'damnitzshuham1406@gmail.com' LIMIT 1;
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.admin_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
