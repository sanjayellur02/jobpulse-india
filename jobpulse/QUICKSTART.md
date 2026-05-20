# JobPulse India - Getting Started Guide

Welcome to JobPulse India! This guide will walk you through setting up and running the application locally.

## ⚙️ Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
- **npm or yarn** - Comes with Node.js
- **Git** - Download from [git-scm.com](https://git-scm.com)
- **Supabase Account** - Free at [supabase.com](https://supabase.com)
- **Code Editor** - VS Code recommended

## 🚀 Quick Start (5 minutes)

### Step 1: Clone Repository

```bash
git clone https://github.com/sanjayellur02/jobpulse-india.git
cd jobpulse
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all 400+ required packages.

### Step 3: Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create account
2. Create a new project
3. Go to Settings > API
4. Copy the URL and anon public key

### Step 4: Create Environment File

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

Generate NEXTAUTH_SECRET:
```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Mac/Linux
openssl rand -base64 32
```

### Step 5: Setup Database

1. Open [Supabase SQL Editor](https://app.supabase.com) for your project
2. Open the `database.sql` file in the project root
3. Copy all the SQL code
4. Paste it into the SQL Editor in Supabase
5. Click "Run" and wait for it to complete

### Step 6: Start Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Step 7: Test the Application

1. Navigate to the home page - you should see the JobPulse India landing page
2. Click "Sign Up" and create an account
3. After registration, click "Sign In" and login
4. You should be redirected to the dashboard

**Congratulations! Your application is running! 🎉**

---

## 📁 Project Structure Overview

```
jobpulse/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── user/               # User management
│   │   ├── analytics/          # Analytics data
│   │   └── search/             # Search functionality
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── dashboard/page.tsx      # Analytics dashboard
│   ├── search/page.tsx         # User search
│   ├── profile/                # User profiles
│   ├── rankings/page.tsx       # Leaderboards
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   └── StatCard.tsx            # Stats card component
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # Utility functions
├── app/providers.tsx           # Auth context provider
├── middleware.ts               # Route protection (optional)
├── database.sql                # Database schema
├── API.md                       # API documentation
├── SETUP.md                     # Detailed setup guide
├── DEPLOYMENT.md               # Deployment instructions
└── README.md                    # This file
```

---

## 🔑 Key Features

### Authentication
- User registration with email/phone validation
- Login with email and password
- Secure session management
- Profile management

### Analytics
- Global employment statistics
- State-wise analytics
- Top skills trending
- Employment trends

### Search
- Search users by name
- Filter by state, degree, skills
- View public profiles
- See employment details

### Rankings
- State-wise leaderboards
- Degree-wise statistics
- Employment rate comparisons

---

## 📚 Documentation

### For Complete Setup Details
See [SETUP.md](SETUP.md) for:
- System requirements
- Detailed installation steps
- Troubleshooting guide
- Development best practices
- Styling guide

### For API Usage
See [API.md](API.md) for:
- All API endpoints
- Request/response examples
- Error handling
- Authentication
- Rate limiting

### For Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Deploy to Vercel
- Configure environment variables
- Setup custom domain
- Monitoring and logs

---

## 🛠️ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Check for errors
npm run lint

# Format code
npm run format
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process using port 3000
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Mac/Linux
kill -9 $(lsof -t -i:3000)

# Then restart
npm run dev
```

### Supabase Connection Error

1. Verify credentials in `.env.local`
2. Check Supabase project is active
3. Ensure email is verified on Supabase
4. Clear browser cookies and try again

### Database Setup Failed

1. Go back to SQL Editor in Supabase
2. Check for error messages in the output
3. Copy each query block individually and run
4. Verify all tables are created

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📖 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **React**: https://react.dev

---

## 🚀 Next Steps After Setup

1. **Explore the Code**
   - Review API endpoints in `app/api/`
   - Check component structure in `components/`
   - Understand authentication in `app/providers.tsx`

2. **Test the Features**
   - Register a new account
   - Login and view dashboard
   - Update your profile
   - Search for other users
   - View rankings

3. **Customize for Your Needs**
   - Update colors in `tailwind.config.ts`
   - Add more fields to profile
   - Create additional pages
   - Implement new features

4. **Deploy to Production**
   - Push code to GitHub
   - Connect to Vercel
   - Set environment variables
   - Deploy!

---

## 📞 Getting Help

### If You Get Stuck:

1. **Check the docs** - See [SETUP.md](SETUP.md) and [API.md](API.md)
2. **Check error messages** - Read what the error actually says
3. **Check browser console** - F12 to open developer tools
4. **Check Supabase logs** - Look for database errors
5. **Create an issue** - Add details and error messages

---

## ✨ You're All Set!

You now have:
- ✅ Full-stack Next.js application
- ✅ Supabase backend with PostgreSQL
- ✅ Authentication system
- ✅ API endpoints
- ✅ Beautiful UI with Tailwind CSS
- ✅ Ready for production deployment

**Happy coding! 🎉**

Start building unemployment analytics for India!

---

**Questions?** Check the documentation files or create an issue.

**Ready to deploy?** See [DEPLOYMENT.md](DEPLOYMENT.md)

**Need API help?** See [API.md](API.md)

**Want more details?** See [SETUP.md](SETUP.md)
