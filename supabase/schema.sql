-- ==============================================================================
-- DATABASE SCHEMA: Md. Miftahur Rahman Swapnil Command Portfolio
-- Target: Supabase / PostgreSQL with Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  availability TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  location TEXT NOT NULL,
  system_version TEXT DEFAULT 'v4.2.0-STARK',
  build_year TEXT DEFAULT '2026',
  coordinates TEXT DEFAULT '23.8103° N, 90.4125° E',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Hero Configuration Table
CREATE TABLE IF NOT EXISTS hero_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL DEFAULT 'CREATIVE PROFESSIONAL',
  name TEXT NOT NULL DEFAULT 'SWAPNIL',
  subtitle TEXT NOT NULL DEFAULT 'DEVELOPER / DESIGNER / CREATOR',
  description TEXT NOT NULL,
  cta_primary_text TEXT DEFAULT 'VIEW WORK',
  cta_primary_link TEXT DEFAULT '#projects',
  cta_secondary_text TEXT DEFAULT 'CONTACT ME',
  cta_secondary_link TEXT DEFAULT '#contact',
  portrait_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  mobile_fallback_url TEXT NOT NULL,
  video_enabled BOOLEAN DEFAULT true,
  video_speed NUMERIC DEFAULT 1.0,
  overlay_opacity NUMERIC DEFAULT 0.65,
  blur_amount NUMERIC DEFAULT 0,
  location_label TEXT DEFAULT 'DHAKA, BANGLADESH',
  status_badge TEXT DEFAULT 'SYS.ONLINE // AVAILABLE FOR HIRE',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Projects Showcase Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('web', 'mobile', 'ai', 'design')),
  category_label TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Live',
  hero_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  live_url TEXT,
  secondary_live_url TEXT,
  secondary_live_label TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  year TEXT NOT NULL,
  key_features TEXT[] DEFAULT '{}',
  challenges TEXT,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);

-- 4. Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  period TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  is_current BOOLEAN DEFAULT false,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Education Table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  coursework TEXT[] DEFAULT '{}',
  research_interests JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Services / Capabilities Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0
);

-- 7. Skills & Groups Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 8. Social Links Table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  label TEXT NOT NULL,
  highlight BOOLEAN DEFAULT false
);

-- 9. Contact Messages Inbound
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can read all portfolio content
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Config" ON hero_config FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public Read Education" ON education FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public Read Social Links" ON social_links FOR SELECT USING (true);

-- Public can insert messages (inbound transmission)
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT WITH CHECK (true);

-- Authenticated users (Admin) can perform all operations
CREATE POLICY "Admin Full Access Site Settings" ON site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Hero Config" ON hero_config FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Experiences" ON experiences FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Education" ON education FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Services" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Skills" ON skills FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Social Links" ON social_links FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Messages" ON messages FOR ALL TO authenticated USING (true);
