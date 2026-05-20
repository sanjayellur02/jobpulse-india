# JobPulse India - Supabase Setup Guide

## 📋 Your Current Configuration

Your `.env.local` already has Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://veyymwbtqyuyoxmrhbjx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ph91KTV6nAJhRjY80QGE7Q_YOAgxCcE
```

✅ **Good!** Your Supabase project is already connected.

---

## Step 1: Verify Supabase Project

### Access Your Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in with your account
3. You should see your project (URL ending in `veyymwbtqyuyoxmrhbjx`)
4. Click on your project to open it

### Verify Your Credentials

In your Supabase dashboard:

1. Go to **Settings** > **API**
2. You should see:
   - **Project URL:** `https://veyymwbtqyuyoxmrhbjx.supabase.co`
   - **Anon public key:** `sb_publishable_Ph91KTV6nAJhRjY80QGE7Q_YOAgxCcE`

These match your `.env.local` file ✅

---

## Step 2: Setup Database Schema

Your application needs database tables. Follow these steps:

### Open SQL Editor

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query** button
3. You'll see an empty SQL editor

### Copy Database Schema

Open the `database.sql` file from your project root and copy **ALL** the SQL code.

**File location:** `c:\Projects\jobpluse india\jobpulse\database.sql`

### Paste and Run SQL

1. Paste all the SQL code into the Supabase SQL Editor
2. You should see the complete schema (tables, indexes, policies, etc.)
3. Click the **Run** button (or press `Ctrl+Enter`)
4. Wait for it to complete (should take 10-30 seconds)

### Verify Tables Were Created

After running the SQL, you should see:
- ✅ `users` table created
- ✅ `employment_history` table created
- ✅ `analytics_cache` table created
- ✅ Indexes created (6 total)
- ✅ Row-Level Security (RLS) enabled
- ✅ Policies created
- ✅ Functions created
- ✅ Triggers created

To verify, go to **Table Editor** and you should see these 3 tables listed.

---

## Step 3: Configure Authentication

### Enable Email Provider

1. Go to **Authentication** > **Settings**
2. Look for **Email** option (should be enabled by default)
3. Verify it shows "✓ Email enabled"

### Configure Redirect URLs

1. Still in **Authentication** > **Settings**
2. Scroll to **Redirect URLs**
3. Add these URLs:
   ```
   http://localhost:3000
   http://localhost:3000/auth/login
   http://localhost:3000/auth/register
   https://your-deployment.vercel.app
   https://your-deployment.vercel.app/auth/login
   ```

(Replace `your-deployment` with your actual Vercel domain once deployed)

---

## Step 4: Update Environment Variables

### Generate NEXTAUTH_SECRET

In your terminal, run one of these commands:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

You'll get output like: `xyz1234567890abcdefghijklmnopqrstuvwxyz==`

### Update .env.local

Edit your `.env.local` file and replace:

```
NEXTAUTH_SECRET=your_nextauth_secret_here
```

With your generated secret:

```
NEXTAUTH_SECRET=xyz1234567890abcdefghijklmnopqrstuvwxyz==
```

**Complete .env.local should look like:**
```
NEXT_PUBLIC_SUPABASE_URL=https://veyymwbtqyuyoxmrhbjx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ph91KTV6nAJhRjY80QGE7Q_YOAgxCcE
NEXTAUTH_SECRET=xyz1234567890abcdefghijklmnopqrstuvwxyz==
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Step 5: Test the Connection

### Start Development Server

```bash
npm run dev
```

Should output: `Ready in 2.5s`

### Test Registration

1. Open [http://localhost:3000](http://localhost:3000)
2. Click **Sign Up**
3. Fill in the form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `9876543210`
4. Click **Continue**
5. Enter password: `password123`
6. Click **Sign Up**

### Verify in Supabase

1. Go to Supabase > **Table Editor**
2. Click **users** table
3. You should see your newly created user row with all the data

✅ **Success!** Your database is working.

---

## Step 6: Test Login

1. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Enter your email: `john@example.com`
3. Enter your password: `password123`
4. Click **Sign In**
5. You should be redirected to `/dashboard`

✅ **Success!** Authentication is working.

---

## Common Issues & Solutions

### Issue: "Connection refused" Error

**Solution:**
- Verify Supabase project is active
- Check `.env.local` credentials are correct
- Restart dev server: `npm run dev`

### Issue: "Table 'public.users' does not exist"

**Solution:**
- Open SQL Editor in Supabase
- Copy all SQL from `database.sql`
- Run it in SQL Editor
- Wait for completion message

### Issue: RLS Policy Error

**Solution:**
- Go to **Authentication** > **Settings**
- Confirm Email/Password auth is enabled
- Check **Row Level Security** policies in SQL Editor
- Policies should be created automatically by database.sql

### Issue: Can't Login

**Solution:**
- Verify user exists in `users` table
- Check password is correct
- Try registering a new user first
- Check browser console for error messages (F12)

---

## What's Next?

✅ **Database is ready!**

Now you can:
1. Test all API endpoints (see [API.md](API.md))
2. Explore the dashboard at `/dashboard`
3. Try the search feature at `/search`
4. View your profile at `/profile`
5. Deploy to Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md))

---

## Production Checklist

Before deploying to production:

- [ ] Database schema is created in Supabase
- [ ] RLS policies are enabled
- [ ] Authentication is configured
- [ ] Redirect URLs are set
- [ ] NEXTAUTH_SECRET is strong (32+ chars)
- [ ] Test user registration and login work
- [ ] Test API endpoints with token
- [ ] Browser dev tools console has no errors

---

## Useful Supabase Resources

- **Dashboard:** https://app.supabase.com
- **Documentation:** https://supabase.io/docs
- **Database Guide:** https://supabase.io/docs/guides/database
- **Auth Guide:** https://supabase.io/docs/guides/auth

---

## Database Schema Overview

### users Table
- Stores user profile information
- Fields: id, full_name, email, phone, state, city, degree, skills, employment_status, etc.
- 20+ fields for comprehensive user data

### employment_history Table
- Tracks user employment changes
- Links to users via user_id
- Fields: company_name, role, salary_range, joining_date, etc.

### analytics_cache Table
- Caches aggregated analytics for performance
- Stores JSON data with TTL

### Security Features
- ✅ Row-Level Security (RLS) enabled
- ✅ Policies prevent unauthorized access
- ✅ Password hashing via Supabase Auth
- ✅ Automatic timestamp management

---

## Next Steps

1. **Local Testing** ✅ (You're here)
   - Test registration and login
   - Verify database connection
   - Test API endpoints

2. **Production Deployment** (Next)
   - Deploy to Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md))
   - Configure production environment variables
   - Setup custom domain (optional)

3. **Monitor & Iterate**
   - Collect user feedback
   - Monitor analytics in Supabase
   - Plan Phase 3 features

---

**Your Supabase setup is complete! Your database is ready for production! 🚀**

Go to [DEPLOYMENT.md](DEPLOYMENT.md) to deploy your application to Vercel.
