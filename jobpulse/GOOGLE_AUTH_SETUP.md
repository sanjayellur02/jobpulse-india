# Google OAuth Setup Guide for JobPulse India

## 🎯 Overview

Add Google login to your JobPulse India application with just a few configuration steps.

---

## 📋 Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit: https://console.cloud.google.com
2. If you don't have a project, click **Create Project**
3. Enter project name: `JobPulse India`
4. Click **Create**
5. Wait for project creation (~30 seconds)

### 1.2 Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Click **Create**
4. Fill in the form:
   - **App name:** `JobPulse India`
   - **User support email:** Your email
   - **Developer contact:** Your email
5. Click **Save and Continue**

### 1.3 Add OAuth Scopes

1. Click **Save and Continue** (Scopes section - use defaults)
2. Click **Save and Continue** (Test users section)
3. You're done! Go to **Credentials** tab

---

## 🔑 Step 2: Create OAuth 2.0 Client ID

### 2.1 Create Credentials

1. In the **Credentials** tab, click **+ Create Credentials**
2. Select **OAuth 2.0 Client ID**
3. If prompted, configure OAuth consent screen first
4. Application type: **Web application**
5. Name: `JobPulse India Web Client`

### 2.2 Add Authorized Redirect URIs

Add these URIs (one per line in the "Authorized redirect URIs" section):

```
http://localhost:3001/auth/callback
http://localhost:3000/auth/callback
https://veyymwbtqyuyoxmrhbjx.supabase.co/auth/v1/callback?provider=google
https://your-domain.vercel.app/auth/callback
```

**Note:** Replace `your-domain` with your actual Vercel domain (you'll add this after deployment)

### 2.3 Get Your Credentials

1. Click **Create**
2. You'll see a popup with:
   - **Client ID** (copy this)
   - **Client Secret** (copy this)
3. Save these securely!

---

## 🔐 Step 3: Configure Supabase

### 3.1 Add Google Provider

1. Go to: https://app.supabase.com
2. Select your project
3. Go to **Authentication** > **Providers**
4. Find **Google** and click to expand
5. Toggle **Enable** to ON

### 3.2 Add Credentials

1. Paste your **Client ID** from Google Cloud
2. Paste your **Client Secret** from Google Cloud
3. Click **Save**

---

## ✅ Step 4: Test Locally

### 4.1 Restart Dev Server

Your dev server should be running. If not:

```bash
npm run dev
```

### 4.2 Test Google Login

1. Go to: http://localhost:3001/auth/login
2. Click **"Continue with Google"** button
3. You'll be redirected to Google login
4. Sign in with your Google account
5. Authorize the app
6. You should be redirected to `/dashboard` automatically

### 4.3 Verify User Created

1. Go to Supabase: https://app.supabase.com
2. Select your project
3. Go to **Table Editor** > **users**
4. You should see a new user row with:
   - Your Google email
   - Your Google name
   - employment_status: `Unemployed` (default)

---

## 🚀 Step 5: Deploy to Vercel

After deploying to Vercel, you need to update your Google OAuth credentials:

### 5.1 Add Vercel Domain

1. Go back to Google Cloud Console
2. Go to **APIs & Services** > **Credentials**
3. Find your OAuth 2.0 Client ID
4. Click **Edit**
5. Add your Vercel domain to **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/auth/callback
   ```
6. Click **Save**

### 5.2 Update Supabase (if needed)

No changes needed in Supabase - it already handles redirects correctly.

---

## 🔗 How It Works

```
User clicks "Continue with Google"
    ↓
Redirected to Google login page
    ↓
User signs in with Google account
    ↓
Google redirects to /auth/callback
    ↓
Supabase exchanges code for user session
    ↓
App creates user profile in database (if new user)
    ↓
Redirected to /dashboard
    ↓
User is logged in! ✓
```

---

## 📱 Code Implementation

### Login Page
- ✅ Added "Continue with Google" button
- ✅ Integrated with Supabase OAuth
- ✅ Handles errors gracefully

### Callback Handler
- ✅ Exchanges OAuth code for session
- ✅ Creates user profile automatically
- ✅ Redirects to dashboard on success

---

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution:**
- Make sure the redirect URI in Google Cloud matches exactly
- Check for typos and trailing slashes
- Both should be: `https://veyymwbtqyuyoxmrhbjx.supabase.co/auth/v1/callback?provider=google`

### Issue: "Invalid client"
**Solution:**
- Verify Client ID and Client Secret are correct in Supabase
- Make sure you copied from the right credentials in Google Cloud
- Go to Google Cloud > Credentials and verify they're the same

### Issue: Stuck on Google login
**Solution:**
- Check browser console (F12) for errors
- Make sure localhost:3001 is accessible
- Verify the callback handler is running

### Issue: User not created in database
**Solution:**
- Check Supabase RLS policies are configured correctly
- Go to Table Editor > users > RLS policies
- Make sure INSERT policy allows authenticated users

---

## 🎯 What's Next?

Your Google OAuth is now fully integrated!

### Features:
- ✅ Users can sign up with Google
- ✅ Users can sign in with Google
- ✅ User profiles created automatically
- ✅ Email and password login still works

### Next Steps:
1. **Test locally** - Sign up with Google account
2. **Deploy to Vercel** - Push to GitHub, deploy via Vercel
3. **Add more providers** (optional) - GitHub, Microsoft, etc.
4. **Monitor users** - Check Supabase dashboard for user signups

---

## 📚 Additional Resources

- **Google Cloud Console:** https://console.cloud.google.com
- **Supabase Auth Docs:** https://supabase.io/docs/guides/auth
- **OAuth 2.0 Flow:** https://tools.ietf.org/html/rfc6749

---

## ✨ You're All Set!

Google OAuth is now configured! Users can sign up and log in with their Google accounts. 🎉

Test it now:
```bash
npm run dev
```

Then visit: http://localhost:3001/auth/login

Click **"Continue with Google"** to test! 🚀
