# JobPulse India - Deployment Guide

## 🚀 Deploy to Vercel

This guide will help you deploy JobPulse India to Vercel with just a few clicks.

## Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up (or log in) with your GitHub account

## Step 3: Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `jobpulse-india` repository
4. Click "Import"

## Step 4: Configure Environment Variables

In the Vercel dashboard:

1. Go to Settings > Environment Variables
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
NEXTAUTH_SECRET = your_secret_key_here
NEXTAUTH_URL = https://your-deployment.vercel.app
```

3. Click "Save"

### Getting Supabase Values

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to Settings > API
4. Copy the values:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Generate NEXTAUTH_SECRET

```bash
# On your local machine
openssl rand -base64 32
```

## Step 5: Set Database

On Supabase:

1. Go to SQL Editor
2. Copy all SQL from `database.sql` in the project root
3. Paste and execute in SQL Editor
4. Wait for all queries to complete

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for deployment to complete (usually 1-2 minutes)
3. Your site is now live!

## Step 7: Verify Deployment

Visit your deployment URL and verify:

- [ ] Home page loads
- [ ] Navigation works
- [ ] Can access login/register pages
- [ ] Can access dashboard and other pages

## Post-Deployment

### Update Supabase Settings

If you used email verification in Supabase:

1. Go to Supabase > Authentication > Email Templates
2. Update the redirect URL to your Vercel deployment URL

### Enable Supabase Email Confirmations (Optional)

1. Go to Authentication > Settings
2. Enable "Email Confirmations"
3. Configure email templates with your Vercel URL

### Setup Custom Domain (Optional)

In Vercel:

1. Go to Project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## 🔐 Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] NEXTAUTH_SECRET is strong and random
- [ ] Supabase RLS policies are enabled
- [ ] No sensitive keys are exposed in git

## 📊 Monitoring

### View Logs

```bash
vercel logs
```

### Redeploy

```bash
vercel --prod
```

### Rollback

In Vercel dashboard:
1. Go to Deployments
2. Select a previous deployment
3. Click "Promote to Production"

## 🐛 Troubleshooting

### "Build Error"

1. Check build logs in Vercel
2. Ensure all dependencies are installed locally
3. Run `npm run build` locally to verify
4. Check for TypeScript errors: `npm run lint`

### "Database Connection Error"

1. Verify environment variables are correct
2. Check Supabase project is active
3. Verify network access is allowed

### "Authentication Failed"

1. Confirm Supabase credentials in Vercel
2. Check NEXTAUTH_URL matches deployment domain
3. Verify RLS policies allow operations

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.io/docs
- Next.js Docs: https://nextjs.org/docs

## 🎉 Success!

Your JobPulse India application is now live!

Share your deployment URL and start tracking unemployment analytics across India.

---

**Next Steps:**
- Monitor analytics and user signups
- Collect feedback from users
- Plan Phase 2 features
- Consider upgrading Supabase for production data
