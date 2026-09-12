# Supabase & Vercel Deployment Guide

This guide will walk you through setting up your **Supabase database** and deploying your portfolio to **Vercel** in under 5 minutes.

---

## Part 1: Setup Supabase Database & Storage (2 Minutes)

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Choose a project name (e.g., `swapnil-portfolio`), database password, and region (e.g., Singapore or closest to you).
4. Wait ~1 minute for Supabase to provision your project.

### 2. Run Database Schema & Seed Data
1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar.
2. Click **"New Query"**.
3. Open the [`supabase_schema.sql`](file:///d:/Projects/Ironmanthemeportfolio/supabase_schema.sql) file located in your project root.
4. Copy the entire content of [`supabase_schema.sql`](file:///d:/Projects/Ironmanthemeportfolio/supabase_schema.sql), paste it into the SQL Editor, and click **"Run"** (or press `Ctrl + Enter`).
5. **Done!** This script automatically creates:
   - All 9 tables (`hero_config`, `projects`, `experiences`, `education`, `services`, `skills`, `social_links`, `site_settings`, `messages`)
   - 2 Public Storage Buckets (`portfolio-media`, `videos`)
   - Row Level Security (RLS) policies allowing public viewing and admin updates
   - Pre-seeded data with all your real projects (`Edu51Five`, `Edu51Portal BUBT`, `MuteBD`, etc.)

### 3. Copy Your API Keys
1. In Supabase, go to **Project Settings** (gear icon) -> **API**.
2. Find the following values:
   - **Project URL** (e.g., `https://xyzabc.supabase.co`)
   - **anon public key** (e.g., `eyJhbGciOi...`)

---

## Part 2: Configure Local Environment

Open [`.env.local`](file:///d:/Projects/Ironmanthemeportfolio/.env.local) in your project root and replace the placeholders with your actual keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

Your local application will now automatically connect live to Supabase!

---

## Part 3: Deploy to Vercel (3 Minutes)

### Option A: Via GitHub (Recommended)

1. **Initialize Git & Push to GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "feat: complete iron man portfolio with supabase & vercel readiness"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [https://vercel.com](https://vercel.com) and click **"Add New..."** -> **"Project"**.
   - Select your GitHub repository.

3. **Add Environment Variables in Vercel**:
   - Under the **Environment Variables** section in the Vercel import screen, add:
     - `NEXT_PUBLIC_SUPABASE_URL` = `your-supabase-project-url`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
   - Click **"Deploy"**.

---

### Option B: Deploy Directly via Vercel CLI (Instant)

If you have Vercel CLI installed or want to deploy directly from terminal:

```powershell
npx vercel
```
- Follow the prompts to log in and select your Vercel account.
- When asked for environment variables or after deployment, link the same two Supabase variables in your Vercel project dashboard under **Settings -> Environment Variables**, then run:
```powershell
npx vercel --prod
```

---

## Part 4: What Happens After Deployment

- **Live Database Sync**: Any change you make in the Secret Admin Panel (`/admin`) will automatically sync directly to your Supabase database and update instantly for all visitors worldwide!
- **Media & Videos**: Video uploads and media files are stored directly in Supabase Storage with global CDN delivery.
- **Contact Inquiries**: Contact messages submitted on the landing page are saved directly into the `messages` table in your Supabase database.
