# Supabase Setup - Step-by-Step Walkthrough

## 🎯 Your Task

Set up your Supabase project and database schema so your JobPulse India application can store and manage data.

**Time Required:** 10-15 minutes

---

## ✅ STEP 1: Verify Your Supabase Project

### What You Need
- Your Supabase account (already created)
- Project URL: `https://veyymwbtqyuyoxmrhbjx.supabase.co`

### Action Items

**1. Visit Supabase Dashboard**
```
Go to: https://app.supabase.com
```

**2. Log in with your email/password**
- You should see your project in the list
- Look for the one with URL: `veyymwbtqyuyoxmrhbjx`

**3. Click to open your project**
- Click on the project name or URL
- You'll see the main dashboard

### ✅ Checkpoint
You should see:
- Project name at the top
- Left sidebar with menu options
- "SQL Editor" option in the sidebar

---

## ✅ STEP 2: Create Your Database Tables

### Open SQL Editor

**In your Supabase project:**

1. Click **SQL Editor** in the left sidebar
2. Click **New Query** button (top right)
3. You'll see an empty text editor

### Copy the Database Schema

**In your local project:**

1. Open file: `database.sql`
   - Location: `c:\Projects\jobpluse india\jobpulse\database.sql`
2. Open it with any text editor (VS Code, Notepad, etc.)
3. Select all text: `Ctrl+A`
4. Copy: `Ctrl+C`

### Paste and Execute

**Back in Supabase SQL Editor:**

1. Paste the SQL code: `Ctrl+V`
2. You should see ~500+ lines of SQL code
3. Click **Run** button (play icon, top right)
4. Or press: `Ctrl+Enter`

### Wait for Completion

The system will execute the SQL. You should see:
```
Query Completed Successfully
(No rows returned)
```

**This means:** ✅ All tables, policies, and triggers are created!

---

## ✅ STEP 3: Verify Tables Were Created

### Check Table Editor

**In Supabase:**

1. Click **Table Editor** in the left sidebar
2. You should see under the database schema:
   - ✅ `users` table
   - ✅ `employment_history` table
   - ✅ `analytics_cache` table

3. Click on `users` table to view it
4. You should see columns: id, full_name, email, phone, state, etc.

### ✅ Checkpoint
All 3 tables are created and visible in the Table Editor.

---

## ✅ STEP 4: Configure Authentication

### Enable Email Authentication

**In Supabase:**

1. Click **Authentication** in the left sidebar
2. Click **Settings** (gear icon)
3. Look for **Providers** section
4. Find **Email** provider
5. Verify it shows: **Enabled** ✅

### Set Redirect URLs

**Still in Authentication > Settings:**

1. Scroll down to **Redirect URLs** section
2. You'll see a text area with redirect URLs
3. Add these URLs (one per line):
   ```
   http://localhost:3000
   http://localhost:3000/auth/login
   http://localhost:3000/auth/register
   http://localhost:3000/dashboard
   ```

4. Click **Save** button

### ✅ Checkpoint
Email authentication is enabled and redirect URLs are configured.

---

## ✅ STEP 5: Verify Environment Variables

### Check Your .env.local

**In your local project:**

1. Open file: `.env.local`
   - Location: `c:\Projects\jobpluse india\jobpulse\.env.local`

2. Verify it has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://veyymwbtqyuyoxmrhbjx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ph91KTV6nAJhRjY80QGE7Q_YOAgxCcE
   NEXTAUTH_SECRET=e9d4c8f2b1a6d3e7f9c2b4a8d1e6f3c7b9a2d5e8f1c4a7d9e2b5f8c1a4d7
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. Save the file: `Ctrl+S`

### ✅ Checkpoint
All environment variables are properly configured.

---

## ✅ STEP 6: Start Your Application

### Start Development Server

**In your terminal:**

```bash
cd "c:\Projects\jobpluse india\jobpulse"
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - Ready in: 2.5s
```

### Open in Browser

1. Go to: `http://localhost:3000`
2. You should see the JobPulse India home page
3. All styling and layout should look correct

### ✅ Checkpoint
Your app is running locally at http://localhost:3000

---

## ✅ STEP 7: Test User Registration

### Create a Test User

**In your browser:**

1. Navigate to: `http://localhost:3000/auth/register`
2. You should see the registration form
3. Fill in:
   ```
   Full Name:  Test User
   Email:      test@example.com
   Phone:      9876543210
   ```
4. Click **Continue** button
5. Fill in password:
   ```
   Password:           SecurePassword123
   Confirm Password:   SecurePassword123
   ```
6. Click **Sign Up** button

### What Happens

- You'll see success message
- You'll be redirected to login page
- The user is now created in your Supabase database

### ✅ Checkpoint
User registration works!

---

## ✅ STEP 8: Test User Login

### Login with Your Test User

**In your browser:**

1. You should already be on login page
2. Or navigate to: `http://localhost:3000/auth/login`
3. Fill in:
   ```
   Email:    test@example.com
   Password: SecurePassword123
   ```
4. Click **Sign In** button

### What Happens

- You're logged in
- Redirected to dashboard page
- You can see your profile and analytics

### ✅ Checkpoint
Login works! Your authentication is configured correctly.

---

## ✅ STEP 9: Verify Data in Supabase

### Check User Data

**In Supabase:**

1. Click **Table Editor**
2. Click **users** table
3. You should see your test user with:
   - id (UUID)
   - full_name: "Test User"
   - email: "test@example.com"
   - phone: "9876543210"
   - employment_status: "Unemployed" (default)
   - Other fields populated

### ✅ Checkpoint
Data is successfully stored in Supabase!

---

## ✅ STEP 10: Test More Features

### Try Profile Page

1. Click on your name/profile icon in navbar
2. Go to `/profile`
3. You should see your profile information

### Try Update Employment

1. Click "Update Employment" button
2. Fill in employment details
3. Submit the form
4. Check Supabase > employment_history table
5. Your employment record should be there

### Try Search

1. Go to `/search`
2. Try searching for other users (there's mock data)
3. Filter by state, degree, etc.

### Try Dashboard

1. Go to `/dashboard`
2. You should see analytics:
   - Total Users count
   - Employment statistics
   - State breakdown
   - Top skills

### ✅ Checkpoint
All major features are working!

---

## 🎉 Setup Complete!

You have successfully:

✅ Connected to Supabase  
✅ Created database schema with 3 tables  
✅ Enabled authentication  
✅ Configured environment variables  
✅ Started development server  
✅ Registered a test user  
✅ Logged in successfully  
✅ Verified data in Supabase  
✅ Tested all major features  

---

## 🚀 Next Steps

Your application is now **fully functional locally**!

### Option A: Continue Development
- Add more features
- Customize styling
- Create more test data

### Option B: Deploy to Production
- Follow [DEPLOYMENT.md](DEPLOYMENT.md)
- Deploy to Vercel in 5 minutes
- Share your live URL

---

## ❓ Troubleshooting

### If Registration Fails

**Check:**
1. Email format is valid
2. Phone is 10 digits (India format)
3. Check browser console (F12) for errors
4. Verify NEXTAUTH_SECRET in `.env.local`

### If Login Fails

**Check:**
1. User exists in Supabase users table
2. Email and password are correct
3. No typos in email
4. Check browser console for errors

### If Tables Don't Appear

**Solution:**
1. Go back to SQL Editor
2. Copy database.sql again
3. Paste into SQL Editor
4. Run again
5. Wait for completion

### If Dashboard is Empty

**This is normal!**
- Analytics need data to display
- Create more test users first
- Then analytics will show data

---

## 📊 What's Now Available

After completing these steps, you have:

| Feature | Status | Location |
|---------|--------|----------|
| User Registration | ✅ Working | `/auth/register` |
| User Login | ✅ Working | `/auth/login` |
| Profile Page | ✅ Working | `/profile` |
| Edit Profile | ✅ Working | `/profile/edit` |
| Dashboard | ✅ Working | `/dashboard` |
| Search Users | ✅ Working | `/search` |
| Rankings | ✅ Working | `/rankings` |
| Employment Update | ✅ Working | `/employment/update` |

---

## 📚 Documentation

- Next steps: [DEPLOYMENT.md](DEPLOYMENT.md)
- API reference: [API.md](API.md)
- Full setup guide: [SETUP.md](SETUP.md)
- Quick start: [QUICKSTART.md](QUICKSTART.md)

---

**Congratulations! Your Supabase setup is complete! 🎉**

Now you're ready to deploy to production or continue development.

Check [DEPLOYMENT.md](DEPLOYMENT.md) to go live on Vercel!
