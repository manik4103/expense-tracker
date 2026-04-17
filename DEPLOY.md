# Deployment Guide

## Step 1: Create Supabase Project (Free)

1. Go to https://supabase.com and sign up
2. Click **New Project** → choose a name (e.g. "expense-tracker") and region (Singapore for India)
3. Wait ~2 minutes for setup
4. Go to **Settings → API** and copy:
   - `Project URL` → your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click **Run**
4. You should see "Success" for all statements

## Step 3: Create Your Admin User

1. In Supabase dashboard, go to **Authentication → Users**
2. Click **Add User → Create new user**
3. Enter your email and a strong password
4. After creation, go to **SQL Editor** and run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = '<paste-your-user-id-here>';
   ```
   (Get the user ID from Authentication → Users)

## Step 4: Add Staff Users

Staff can sign themselves up, OR you can create them from:
**Authentication → Users → Add User**

They will automatically get `role = 'staff'`. You can promote them to admin later via `/admin/users` in the app.

## Step 5: Deploy to Netlify (Free)

1. Push this project to a GitHub repository (private is fine)
2. Go to https://netlify.com and sign up
3. Click **Add new site → Import from Git**
4. Select your GitHub repo
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click **Add environment variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
7. Click **Deploy site**
8. After deploy, copy your Netlify URL (e.g. `https://your-app.netlify.app`)

## Step 6: Configure Supabase Auth Redirect

1. In Supabase dashboard, go to **Authentication → URL Configuration**
2. Add your Netlify URL to **Redirect URLs**:
   - `https://your-app.netlify.app/**`
3. Set **Site URL** to `https://your-app.netlify.app`

## Step 7: Add PWA Icons (Optional)

To allow staff to "Add to Home Screen" on their phones:
1. Create a square logo image (any size)
2. Go to https://realfavicongenerator.net/
3. Upload your logo and download the generated icons
4. Place `icon-192.png` and `icon-512.png` in the `public/` folder
5. Redeploy

---

## Keeping Free Tier Active

Supabase free tier **pauses after 7 days of inactivity**.

To prevent this, set up a free cron job to ping the app weekly:
1. Go to https://cron-job.org (free)
2. Create a job: GET `https://your-app.netlify.app/` every 3 days
3. This keeps the Supabase project active

---

## Sharing with Staff

1. Share your Netlify URL with staff
2. They visit the URL and sign up with their email
3. They automatically get `staff` role and can start adding expenses
4. You (admin) can manage their roles from `/admin/users`

---

## Upgrading (When Ready)

If the business grows and you need guaranteed uptime:
- Supabase Pro: $25/month — removes inactivity pause, adds backups
- Netlify Pro: $19/month — custom domain, more bandwidth
