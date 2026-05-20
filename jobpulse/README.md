# JobPulse India - Live Unemployment Analytics Platform

India's largest live unemployment transparency and analytics website for tracking employment status of students and graduates across India.

## 📚 Documentation

- **[Setup Guide](SETUP.md)** - Complete development setup instructions
- **[API Documentation](API.md)** - All API endpoints and usage
- **[Database Schema](database.sql)** - SQL schema and migrations
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to Vercel

## Tech Stack

- **Frontend**: Next.js 16+ with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication)
- **Database**: PostgreSQL via Supabase
- **Charts**: Recharts
- **UI**: Tailwind CSS + Lucide Icons
- **Hosting**: Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Setup Database

Run all SQL from `database.sql` in Supabase SQL Editor.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Page | URL | Status |
|------|-----|--------|
| Home | `/` | ✅ Complete |
| Dashboard | `/dashboard` | ✅ Complete |
| Search | `/search` | ✅ Complete |
| Rankings | `/rankings` | ✅ Complete |
| Login | `/auth/login` | ✅ Complete |
| Register | `/auth/register` | ✅ Complete |
| Profile | `/profile` | ✅ Complete |
| Edit Profile | `/profile/edit` | ✅ Complete |

## Features Implemented

### ✅ Frontend (Phase 1)
- [x] Responsive UI with Tailwind CSS
- [x] Home page with feature showcase
- [x] Authentication pages (login/register)
- [x] Analytics dashboard
- [x] User search interface
- [x] Rankings & leaderboards
- [x] User profiles
- [x] Employment status updates
- [x] Mobile-first responsive design

### ✅ Backend (Phase 2)
- [x] Auth API (register, login)
- [x] User API (profile, update)
- [x] Employment API
- [x] Analytics API (global, state, skills)
- [x] Search API
- [x] Supabase integration
- [x] RLS policies
- [x] Database schema

### 🔄 Phase 3 (Planned)
- [ ] Real-time analytics updates
- [ ] Charts with Recharts
- [ ] Email notifications
- [ ] Activity feed
- [ ] Advanced recommendations
- [ ] Mobile app

## Project Structure

```
jobpulse/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages
│   ├── dashboard/        # Dashboard
│   ├── search/           # Search
│   ├── profile/          # Profile
│   ├── rankings/         # Rankings
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home
├── components/           # Reusable components
├── lib/                  # Utilities
├── public/               # Static assets
├── database.sql          # Database schema
├── API.md                # API documentation
├── SETUP.md              # Setup guide
└── DEPLOYMENT.md         # Deployment guide
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check for errors
```

## API Endpoints

All endpoints documented in [API.md](API.md)

**Key Endpoints:**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `POST /user/employment` - Update employment
- `GET /analytics/global` - Global analytics
- `GET /search/users` - Search users

## Environment Variables

See `.env.example` for all required variables.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXTAUTH_SECRET
NEXTAUTH_URL
```

## Deployment

Deploy to Vercel in minutes! See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Step-by-step deployment instructions
- Environment variable setup
- Database configuration
- Custom domain setup
- Monitoring and troubleshooting

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Lint code
```

## Troubleshooting

### Common Issues

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind CSS not working:**
```bash
npm run build
rm -rf .next
npm run dev
```

**Database connection error:**
- Verify `.env.local` credentials
- Check Supabase project is active
- Confirm RLS policies are correct

See [SETUP.md](SETUP.md) for more troubleshooting tips.

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Create Pull Request

## Security

- ✅ Row-Level Security (RLS) enabled
- ✅ Environment variables protected
- ✅ No sensitive data in code
- ✅ HTTPS in production
- ✅ Secure password hashing

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)

## License

MIT License

## Contact

For questions or support, please create an issue on GitHub.

---

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** May 19, 2026

✨ **Ready to launch your unemployment analytics platform!** ✨
