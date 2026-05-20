# JobPulse India - Setup & Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free at supabase.com)
- Code editor (VS Code recommended)

### Step 1: Installation

```bash
cd jobpulse
npm install
```

Expected output: "added 419 packages"

### Step 2: Environment Setup

Create `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# NextAuth Configuration  
NEXTAUTH_SECRET=your_random_secret_32_chars_or_more
NEXTAUTH_URL=http://localhost:3000
```

**How to get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy "URL" and "anon public" key

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Run Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure Explained

```
jobpulse/
├── app/
│   ├── page.tsx              # Home page (/)
│   ├── layout.tsx            # Root layout with Navbar
│   ├── auth/
│   │   ├── login/page.tsx    # Login page (/auth/login)
│   │   └── register/page.tsx # Registration page (/auth/register)
│   ├── dashboard/page.tsx    # Analytics dashboard (/dashboard)
│   ├── search/page.tsx       # User search (/search)
│   ├── profile/
│   │   ├── page.tsx          # View profile (/profile)
│   │   └── edit/page.tsx     # Edit profile (/profile/edit)
│   ├── employment/
│   │   └── update/page.tsx   # Update employment (/employment/update)
│   ├── rankings/page.tsx     # Rankings (/rankings)
│   └── globals.css           # Global Tailwind styles
│
├── components/               # Reusable components
│   ├── Navbar.tsx           # Navigation bar
│   └── StatCard.tsx         # Statistics card
│
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   └── utils.ts             # Utility functions and constants
│
├── public/                  # Static files (images, icons)
│
└── Configuration Files:
    ├── package.json         # Dependencies and scripts
    ├── tsconfig.json        # TypeScript configuration
    ├── tailwind.config.ts   # Tailwind CSS configuration
    ├── next.config.ts       # Next.js configuration
    ├── .env.local           # Local environment variables
    └── .gitignore           # Git ignore rules
```

---

## 🎨 Available Pages

### Public Pages (No Login Required)
| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with features |
| Dashboard | `/dashboard` | Live analytics dashboard |
| Search | `/search` | Search and filter users |
| Rankings | `/rankings` | State & degree leaderboards |

### Authentication Pages
| Page | URL | Purpose |
|------|-----|---------|
| Login | `/auth/login` | User login form |
| Register | `/auth/register` | New user registration |

### Protected Pages (Coming Soon)
| Page | URL | Purpose |
|------|-----|---------|
| Profile | `/profile` | View user profile |
| Edit Profile | `/profile/edit` | Edit personal information |
| Update Employment | `/employment/update` | Update job status |

---

## 🔧 Development Workflow

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Check for linting errors
npm run lint

# Format code (if Prettier is configured)
npm run format
```

### File Structure Pattern

**New Page Example:**
```typescript
'use client';  // Must be at the top for client-side state

import { useState } from 'react';
import Link from 'next/link';
import { YourIcon } from 'lucide-react';

export default function PageName() {
  const [state, setState] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Your content */}
      </div>
    </div>
  );
}
```

---

## 🗄️ Database Setup (Supabase)

### Create Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone VARCHAR UNIQUE,
  state VARCHAR,
  city VARCHAR,
  degree VARCHAR,
  branch VARCHAR,
  college VARCHAR,
  passout_year INTEGER,
  percentage FLOAT,
  skills TEXT[],
  employment_status VARCHAR DEFAULT 'Unemployed',
  company_name VARCHAR,
  job_role VARCHAR,
  salary_range VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employment history table
CREATE TABLE employment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR,
  role VARCHAR,
  salary_range VARCHAR,
  joining_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics cache table
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR UNIQUE,
  value JSONB,
  ttl INTEGER DEFAULT 3600,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Enable Row Level Security

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to insert own data
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🎯 Key Features Implemented

### ✅ Phase 1 - Frontend Complete
- [x] Home page with feature showcase
- [x] Responsive navigation bar
- [x] Login form with validation
- [x] 2-step registration form
- [x] Analytics dashboard UI
- [x] User search interface
- [x] User profiles
- [x] Employment update form
- [x] Rankings & leaderboards
- [x] Tailwind CSS styling

### 🔄 Phase 2 - Backend Integration (In Progress)
- [ ] Supabase authentication
- [ ] API endpoints for auth
- [ ] User registration API
- [ ] Profile management API
- [ ] Employment status API
- [ ] Analytics queries

### 📋 Phase 3 - Advanced Features (Planned)
- [ ] Real-time analytics
- [ ] Charts and graphs
- [ ] Search filtering
- [ ] User recommendations
- [ ] Activity feed
- [ ] Email notifications

---

## 🐛 Troubleshooting

### Issue: Module not found error

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind CSS not working

**Solution:**
```bash
# Rebuild Tailwind
npm run build

# If still not working, clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Supabase connection error

**Checklist:**
- [ ] Verify `.env.local` has correct values
- [ ] Check Supabase project is active
- [ ] Confirm API key has correct permissions
- [ ] Network connection is stable

### Issue: Form validation not working

**Solution:**
Check `lib/utils.ts` for validation functions:
```typescript
validateEmail(email)  // Email validation
validatePhone(phone)  // Phone number validation (India)
```

---

## 📱 Responsive Design

The app is built mobile-first with Tailwind breakpoints:

| Breakpoint | Width | Device |
|------------|-------|--------|
| `sm` | 640px | Small phone |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small laptop |
| `xl` | 1280px | Desktop |

Example:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 🎨 Styling Guide

### Colors
- **Primary**: Blue (`from-blue-600`)
- **Success**: Green (`text-green-600`)
- **Warning**: Yellow (`text-yellow-600`)
- **Error**: Red (`text-red-600`)

### Components
- **Buttons**: `px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700`
- **Cards**: `bg-white rounded-lg shadow-md p-6`
- **Forms**: `border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Connect GitHub repository
4. Add environment variables
5. Deploy

```bash
# Or use CLI
npm i -g vercel
vercel
```

### Environment Variables for Production

Add these in Vercel Dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourdomain.com
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📝 Notes

- All API endpoints need to be created in `/app/api/` directory
- Use Supabase client from `lib/supabase.ts`
- Always use TypeScript interfaces from `lib/supabase.ts`
- Keep components small and reusable
- Test responsive design on mobile

---

**Happy Coding! 🎉**
