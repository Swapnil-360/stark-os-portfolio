-- ==============================================================================
-- SWAPNIL IRON MAN / STARK-OS THEME PORTFOLIO
-- FULL SUPABASE DATABASE SCHEMA, POLICIES & SEED DATA SCRIPT
-- ==============================================================================
-- Instructions:
-- 1. Log in to your Supabase Project (https://supabase.com)
-- 2. In the left sidebar, click on "SQL Editor"
-- 3. Click "New Query", paste this entire script, and click "RUN"
-- 4. In "Project Settings" -> "API", copy:
--      - Project URL -> NEXT_PUBLIC_SUPABASE_URL
--      - anon public key -> NEXT_PUBLIC_SUPABASE_ANON_KEY
-- 5. Paste them into your .env.local and Vercel Environment Variables.
-- ==============================================================================

-- 1. HERO CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.hero_config (
    id TEXT PRIMARY KEY DEFAULT 'default_hero',
    name TEXT DEFAULT 'Md. Miftahur Rahman Swapnil',
    label TEXT DEFAULT 'FULL-STACK ENGINEER & CREATIVE TECHNOLOGIST',
    subtitle TEXT DEFAULT 'BUBT CSE // CREATIVE TECHNOLOGIST // FRONTEND ARCHITECT',
    description TEXT DEFAULT 'Specializing in next-generation web applications, responsive user interfaces, and cloud architectures. Currently pursuing BSc in Computer Science & Engineering at BUBT.',
    status_badge TEXT DEFAULT 'SYS.ONLINE // READY',
    cta_primary_text TEXT DEFAULT 'EXPLORE PROJECTS',
    cta_secondary_text TEXT DEFAULT 'COMMENCE DIALOGUE',
    video_url TEXT DEFAULT '/videos/bg_video.mp4',
    mobile_video_url TEXT DEFAULT '/videos/bg_video.mp4',
    poster_url TEXT DEFAULT '/images/bg_static_desktop.jpg',
    mobile_fallback_url TEXT DEFAULT '/images/bg_static_mobile.jpg',
    static_desktop_bg TEXT DEFAULT '/images/bg_static_desktop.jpg',
    static_mobile_bg TEXT DEFAULT '/images/bg_static_mobile.jpg',
    portrait_url TEXT DEFAULT '/images/pfp.png',
    resume_url TEXT DEFAULT '/resume.pdf',
    video_speed NUMERIC DEFAULT 1.0,
    overlay_opacity NUMERIC DEFAULT 0.65,
    blur_amount NUMERIC DEFAULT 0,
    video_enabled BOOLEAN DEFAULT TRUE,
    background_videos JSONB DEFAULT '[]'::jsonb,
    mobile_background_videos JSONB DEFAULT '[]'::jsonb,
    selected_video_id TEXT DEFAULT 'vid-default-1',
    selected_mobile_video_id TEXT DEFAULT 'vid-mobile-default-1',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    thumbnail_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    description TEXT,
    accent_color TEXT DEFAULT '#ff1e38',
    live_url TEXT,
    github_url TEXT,
    stars INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    metrics JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT,
    location TEXT,
    type TEXT,
    summary TEXT,
    technologies JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
    id TEXT PRIMARY KEY DEFAULT 'default_education',
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    period TEXT,
    grade TEXT,
    status TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    icon TEXT,
    technologies JSONB DEFAULT '[]'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    label TEXT,
    highlight BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    author TEXT DEFAULT 'Md. Miftahur Rahman Swapnil',
    email TEXT DEFAULT 'miftahurr503@gmail.com',
    admin_email TEXT DEFAULT 'miftahurr503@gmail.com',
    whatsapp TEXT DEFAULT '+8801318090383',
    coordinates TEXT DEFAULT '23.8103° N, 90.4125° E // DHAKA',
    availability TEXT DEFAULT 'AVAILABLE FOR COMMISSION & ROLES',
    system_version TEXT DEFAULT 'STARK-OS v4.2.0',
    build_year TEXT DEFAULT '2026',
    resume_url TEXT DEFAULT '/resume.pdf',
    analytics_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MESSAGES (CONTACT INBOX) TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- STORAGE BUCKETS (Public buckets for uploaded media & background videos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('portfolio-media', 'portfolio-media', true),
    ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DO $$
BEGIN
    -- Allow public to read objects
    DROP POLICY IF EXISTS "Public Media Read" ON storage.objects;
    CREATE POLICY "Public Media Read" ON storage.objects
        FOR SELECT USING (bucket_id IN ('portfolio-media', 'videos'));

    -- Allow authenticated and anon to upload
    DROP POLICY IF EXISTS "Public Media Upload" ON storage.objects;
    CREATE POLICY "Public Media Upload" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id IN ('portfolio-media', 'videos'));

    -- Allow authenticated and anon to update
    DROP POLICY IF EXISTS "Public Media Update" ON storage.objects;
    CREATE POLICY "Public Media Update" ON storage.objects
        FOR UPDATE USING (bucket_id IN ('portfolio-media', 'videos'));
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.hero_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow Public Read Hero" ON public.hero_config;
    CREATE POLICY "Allow Public Read Hero" ON public.hero_config FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow Public Read Projects" ON public.projects;
    CREATE POLICY "Allow Public Read Projects" ON public.projects FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow Public Read Experiences" ON public.experiences;
    CREATE POLICY "Allow Public Read Experiences" ON public.experiences FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow Public Read Education" ON public.education;
    CREATE POLICY "Allow Public Read Education" ON public.education FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow Public Read Services" ON public.services;
    CREATE POLICY "Allow Public Read Services" ON public.services FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow Public Read Skills" ON public.skills;
    CREATE POLICY "Allow Public Read Skills" ON public.skills FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow Public Read Socials" ON public.social_links;
    CREATE POLICY "Allow Public Read Socials" ON public.social_links FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Allow Public Read Settings" ON public.site_settings;
    CREATE POLICY "Allow Public Read Settings" ON public.site_settings FOR SELECT USING (true);

    -- Contact form: Anyone can send a message
    DROP POLICY IF EXISTS "Allow Public Insert Messages" ON public.messages;
    CREATE POLICY "Allow Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);

    -- Admin full access policies (allows anon key / service role to upsert from admin console)
    DROP POLICY IF EXISTS "Allow Admin Upsert Hero" ON public.hero_config;
    CREATE POLICY "Allow Admin Upsert Hero" ON public.hero_config FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Manage Projects" ON public.projects;
    CREATE POLICY "Allow Admin Manage Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Manage Experiences" ON public.experiences;
    CREATE POLICY "Allow Admin Manage Experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Manage Education" ON public.education;
    CREATE POLICY "Allow Admin Manage Education" ON public.education FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Manage Services" ON public.services;
    CREATE POLICY "Allow Admin Manage Services" ON public.services FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Manage Skills" ON public.skills;
    CREATE POLICY "Allow Admin Manage Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Manage Socials" ON public.social_links;
    CREATE POLICY "Allow Admin Manage Socials" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Manage Settings" ON public.site_settings;
    CREATE POLICY "Allow Admin Manage Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow Admin Read Messages" ON public.messages;
    CREATE POLICY "Allow Admin Read Messages" ON public.messages FOR SELECT USING (true);
END $$;

-- ==============================================================================
-- INITIAL SEED DATA (Populate default portfolio state immediately)
-- ==============================================================================

-- Seed Hero
INSERT INTO public.hero_config (
    id, name, label, subtitle, description, status_badge,
    cta_primary_text, cta_secondary_text, video_url, mobile_video_url,
    poster_url, mobile_fallback_url, static_desktop_bg, static_mobile_bg,
    portrait_url, resume_url, video_speed, overlay_opacity, blur_amount,
    video_enabled, background_videos, mobile_background_videos,
    selected_video_id, selected_mobile_video_id
) VALUES (
    'default_hero',
    'Md. Miftahur Rahman Swapnil',
    'FULL-STACK ENGINEER & CREATIVE TECHNOLOGIST',
    'BUBT CSE // CREATIVE TECHNOLOGIST // FRONTEND ARCHITECT',
    'Specializing in next-generation web applications, responsive user interfaces, and cloud architectures. Currently pursuing BSc in Computer Science & Engineering at BUBT.',
    'SYS.ONLINE // READY',
    'EXPLORE PROJECTS',
    'COMMENCE DIALOGUE',
    '/videos/bg_video.mp4',
    '/videos/bg_video.mp4',
    '/images/bg_static_desktop.jpg',
    '/images/bg_static_mobile.jpg',
    '/images/bg_static_desktop.jpg',
    '/images/bg_static_mobile.jpg',
    '/images/pfp.png',
    '/resume.pdf',
    1.0,
    0.65,
    0,
    true,
    '[{"id":"vid-default-1","name":"Iron Man Holographic Core (Default)","url":"/videos/bg_video.mp4","deviceType":"desktop"}]'::jsonb,
    '[{"id":"vid-mobile-default-1","name":"Mobile Cyber Stream (9:16)","url":"/videos/bg_video.mp4","deviceType":"mobile"}]'::jsonb,
    'vid-default-1',
    'vid-mobile-default-1'
) ON CONFLICT (id) DO NOTHING;

-- Seed Settings
INSERT INTO public.site_settings (
    id, author, email, admin_email, whatsapp,
    coordinates, availability, system_version, build_year, resume_url, analytics_enabled
) VALUES (
    'default_settings',
    'Md. Miftahur Rahman Swapnil',
    'miftahurr503@gmail.com',
    'miftahurr503@gmail.com',
    '+8801318090383',
    '23.8103° N, 90.4125° E // DHAKA',
    'AVAILABLE FOR COMMISSION & ROLES',
    'STARK-OS v4.2.0',
    '2026',
    '/resume.pdf',
    true
) ON CONFLICT (id) DO NOTHING;

-- Seed Education
INSERT INTO public.education (
    id, institution, degree, field, period, grade, status, highlights
) VALUES (
    'default_education',
    'Bangladesh University of Business and Technology (BUBT)',
    'Bachelor of Science (BSc)',
    'Computer Science & Engineering (CSE)',
    '2023 - Present',
    'Intake 51',
    'Currently Pursuing (Full-Time)',
    '["Core Focus: Algorithms, Software Architecture & Human-Computer Interaction","Built Edu51Portal for departmental communication and exam schedule automation","Active participant in university tech seminars, hackathons, and creative prototyping"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (
    id, title, tagline, slug, category, thumbnail_url, featured, display_order,
    description, accent_color, live_url, github_url, stars, tags, metrics, gallery
) VALUES
(
    'proj-1',
    'Edu51Portal (BUBT Full Dept)',
    'Comprehensive Academic & Department Management Portal for BUBT CSE',
    'edu51portal-bubt',
    'Full-Stack Academic Platform',
    '/images/projects/edu51_bubt_real.png',
    true,
    1,
    'The full-department edition of Edu51Portal expanded for the entire BUBT CSE department. Incorporates multi-intake schedule tracking, centralized faculty syllabus archives, campus event dispatch, and real-time class routine updates.',
    '#00f0ff',
    'https://bubt.edu51portal.live/',
    'https://github.com/Swapnil-360/Edu51Portal/tree/full-version',
    64,
    '["Next.js","TypeScript","Tailwind CSS","Supabase","Vercel"]'::jsonb,
    '[{"label":"Intakes Supported","value":"All BUBT"},{"label":"Active Students","value":"2,000+"},{"label":"Uptime","value":"99.9%"}]'::jsonb,
    '["/images/projects/edu51_bubt_real.png","/images/projects/edu51_real.jpeg"]'::jsonb
),
(
    'proj-2',
    'Edu51Five (Intake 51)',
    'Specialized Student Hub & Academic Routine Tracker for Intake 51',
    'edu51five',
    'Academic Web System',
    '/images/projects/edu51_real.jpeg',
    true,
    2,
    'Dedicated academic hub built specifically for BUBT CSE Intake 51 students. Provides instant, high-speed access to semester schedules, class routines, course notes, exam updates, and peer collaboration links.',
    '#ff1e38',
    'https://edu51portal.live/',
    'https://github.com/Swapnil-360/Edu51Portal.git',
    52,
    '["React","Next.js 14","TailwindCSS","TypeScript","Framer Motion"]'::jsonb,
    '[{"label":"Target Cohort","value":"Intake 51"},{"label":"Daily Visits","value":"500+"},{"label":"Latency","value":"< 120ms"}]'::jsonb,
    '["/images/projects/edu51_real.jpeg","/images/projects/edu51_bubt_real.png"]'::jsonb
),
(
    'proj-3',
    'MuteBD',
    'High-End Fashion & Streetwear E-Commerce Experience',
    'mutebd',
    'E-Commerce & Digital Retail',
    '/images/projects/mutebd.png',
    true,
    3,
    'A modern, minimalist e-commerce storefront for MuteBD streetwear brand. Features lightning-fast catalogue browsing, interactive size guide modal, instant cart calculation, and responsive mobile-first checkout.',
    '#ffffff',
    'https://mutebd.vercel.app/',
    'https://github.com/Swapnil-360',
    38,
    '["Next.js","Tailwind CSS","Zustand","Stripe","Framer Motion"]'::jsonb,
    '[{"label":"Conversion Lift","value":"+34%"},{"label":"Lighthouse Perf","value":"98/100"},{"label":"Mobile First","value":"100%"}]'::jsonb,
    '["/images/projects/mutebd.png"]'::jsonb
),
(
    'proj-4',
    'Escape Room Dhaka',
    'Immersive Thrill Booking & Experience Platform',
    'escape-room-dhaka',
    'Interactive Entertainment',
    '/images/projects/escaperoom.png',
    true,
    4,
    'Cinematic booking platform for Dhaka first premier real-life escape room experience. Built with dark atmospheric lighting, interactive room teasers, dynamic time-slot reservation, and instant SMS ticket confirmation.',
    '#ff9900',
    'https://escaperoomdhaka.com/',
    'https://github.com/Swapnil-360',
    45,
    '["React","Node.js","PostgreSQL","Tailwind CSS","GSAP"]'::jsonb,
    '[{"label":"Completed Bookings","value":"4,500+"},{"label":"Average Session","value":"4.2 min"},{"label":"Rating","value":"4.9 / 5"}]'::jsonb,
    '["/images/projects/escaperoom.png"]'::jsonb
),
(
    'proj-5',
    'OpusGen',
    'AI-Powered Audio & Musical Creativity Suite',
    'opusgen',
    'AI & Creative Tech',
    '/images/projects/opusgen.png',
    true,
    5,
    'Next-gen web application enabling creators to compose, generate, and master custom audio compositions using modern generative AI models. Integrates visual audio spectrograms and real-time stem extraction.',
    '#a855f7',
    'https://opusgen.ai/',
    'https://github.com/Swapnil-360',
    89,
    '["Next.js","Web Audio API","Python FastAPI","PyTorch","Tailwind CSS"]'::jsonb,
    '[{"label":"Audio Render Time","value":"< 3.5s"},{"label":"Active Creators","value":"1,200+"},{"label":"Stems Supported","value":"4-Track"}]'::jsonb,
    '["/images/projects/opusgen.png"]'::jsonb
),
(
    'proj-6',
    'Prince Agro Tech',
    'Smart Agricultural IoT Monitoring & Distribution System',
    'prince-agro-tech',
    'Agritech & IoT Solutions',
    '/images/projects/prince.png',
    false,
    6,
    'Industrial dashboard system monitoring soil moisture, atmospheric telemetry, greenhouse climate control, and cold-chain supply tracking for commercial farming operations across Bangladesh.',
    '#22c55e',
    'https://princeagrotech.com/',
    'https://github.com/Swapnil-360',
    31,
    '["React","TypeScript","MQTT IoT","Tailwind CSS","Chart.js"]'::jsonb,
    '[{"label":"Sensor Nodes","value":"150+"},{"label":"Crop Yield Gain","value":"+22%"},{"label":"Telemetry Interval","value":"5 sec"}]'::jsonb,
    '["/images/projects/prince.png"]'::jsonb
),
(
    'proj-7',
    'Pawfect Match',
    'Modern Pet Adoption, Veterinary Directory & Care Network',
    'pawfect-match',
    'Social & Community Platform',
    '/images/projects/pawfect.png',
    false,
    7,
    'Compassionate pet adoption web application featuring smart compatibility questionnaires, certified veterinary clinic listings, pet health record tracking, and direct foster-parent messaging.',
    '#f59e0b',
    'https://pawfectmatch.life/',
    'https://github.com/Swapnil-360',
    27,
    '["Next.js","Firebase Auth","Tailwind CSS","Lucide Icons"]'::jsonb,
    '[{"label":"Successful Adoptions","value":"320+"},{"label":"Shelters Partnered","value":"18"},{"label":"User Rating","value":"5.0"}]'::jsonb,
    '["/images/projects/pawfect.png"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed Social Links
INSERT INTO public.social_links (id, platform, url, icon, label, highlight)
VALUES
    ('soc-email', 'Email', 'https://mail.google.com/mail/?view=cm&fs=1&to=miftahurr503@gmail.com', 'Mail', 'Open Gmail Inbox', true),
    ('soc-whatsapp', 'WhatsApp', 'https://wa.me/8801318090383', 'MessageSquare', 'Open WhatsApp Inbox', true),
    ('soc-linkedin', 'LinkedIn', 'https://www.linkedin.com/in/mr-swapnil/', 'Linkedin', 'linkedin.com/in/mr-swapnil', true),
    ('soc-github', 'GitHub', 'https://github.com/Swapnil-360', 'Github', 'github.com/Swapnil-360', true),
    ('soc-x', 'X (Twitter)', 'https://x.com/thomascryptoxx', 'Twitter', '@thomascryptoxx', false),
    ('soc-telegram', 'Telegram', 'https://t.me/thomascryptoxx', 'Send', 't.me/thomascryptoxx', false)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- SCHEMA COMPLETED SUCCESSFULLY
-- ==============================================================================
