# JobPulse India - Live Unemployment Analytics Platform

India's live unemployment transparency and analytics platform for tracking employment status among students and graduates across India.

## Documentation

- [Setup Guide](SETUP.md) - Development setup instructions
- [Setup Checklist](SETUP_CHECKLIST.md) - Installation and verification checklist
- [Supabase Setup](SUPABASE_SETUP.md) - Supabase project configuration
- [Supabase Walkthrough](SUPABASE_WALKTHROUGH.md) - Database and auth walkthrough
- [API Documentation](API.md) - API endpoints and usage
- [Database Schema](database.sql) - SQL schema and migrations
- [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel
- [Quick Start](QUICKSTART.md) - Fast local startup guide
- [Completion Notes](COMPLETION.md) - Project completion summary

## Tech Stack

- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: Supabase Auth and PostgreSQL
- UI: Lucide Icons
- Hosting: Vercel

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Supabase

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Setup Database

Run `database.sql` in the Supabase SQL Editor.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Pages

| Page | URL | Status |
|------|-----|--------|
| Home | `/` | Complete |
| Dashboard | `/dashboard` | Complete |
| Search | `/search` | Complete |
| Rankings | `/rankings` | Complete |
| Login | `/auth/login` | Complete |
| Register | `/auth/register` | Complete |
| Profile | `/profile` | Complete |
| Edit Profile | `/profile/edit` | Complete |
| Employment Update | `/employment/update` | Complete |

## Features

### User Features

- User registration and authentication
- Profile management
- Employment status updates
- Public profile system
- Skills and education tracking

### Analytics Features

- Total registered users
- Total unemployed count
- Total employed count
- Employment success rate
- State-wise analytics
- Degree-wise analytics
- Skills distribution
- Live activity feed
- Interactive chart-ready UI

## Project Structure

```bash
jobpulse/
├── app/
│   ├── api/
│   ├── auth/
│   ├── dashboard/
│   ├── employment/
│   ├── profile/
│   ├── rankings/
│   └── search/
├── components/
├── lib/
├── public/
├── database.sql
├── API.md
├── SETUP.md
├── SETUP_CHECKLIST.md
├── SUPABASE_SETUP.md
├── SUPABASE_WALKTHROUGH.md
└── DEPLOYMENT.md
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check for errors
```

## API Endpoints

Key endpoints are documented in [API.md](API.md).

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/employment` - Update employment
- `GET /api/analytics/global` - Global analytics
- `GET /api/search/users` - Search users

## Troubleshooting

### Common Issues

**Module not found**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind CSS not working**

```bash
npm run build
rm -rf .next
npm run dev
```

**Database connection error**

- Verify `.env.local` credentials
- Check Supabase project is active
- Confirm RLS policies are correct

## Security

- Row-Level Security enabled
- Environment variables protected
- No sensitive data in code
- HTTPS in production
- Secure password hashing

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)

## License

MIT License

## Contact

For questions or support, please create an issue on GitHub.

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** May 20, 2026# JobPulse India - Live Unemployment Analytics Platform

India's live unemployment transparency and analytics platform for tracking employment status among students and graduates across India.

## Documentation

- [Setup Guide](SETUP.md) - Development setup instructions
- [Setup Checklist](SETUP_CHECKLIST.md) - Installation and verification checklist
- [Supabase Setup](SUPABASE_SETUP.md) - Supabase project configuration
- [Supabase Walkthrough](SUPABASE_WALKTHROUGH.md) - Database and auth walkthrough
- [API Documentation](API.md) - API endpoints and usage
- [Database Schema](database.sql) - SQL schema and migrations
- [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel
- [Quick Start](QUICKSTART.md) - Fast local startup guide
- [Completion Notes](COMPLETION.md) - Project completion summary

## Tech Stack

- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: Supabase Auth and PostgreSQL
- UI: Lucide Icons
- Hosting: Vercel

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Supabase

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Setup Database

Run `database.sql` in the Supabase SQL Editor.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Pages

| Page | URL | Status |
|------|-----|--------|
| Home | `/` | Complete |
| Dashboard | `/dashboard` | Complete |
| Search | `/search` | Complete |
| Rankings | `/rankings` | Complete |
| Login | `/auth/login` | Complete |
| Register | `/auth/register` | Complete |
| Profile | `/profile` | Complete |
| Edit Profile | `/profile/edit` | Complete |
| Employment Update | `/employment/update` | Complete |

## Features

### User Features

- User registration and authentication
- Profile management
- Employment status updates
- Public profile system
- Skills and education tracking

### Analytics Features

- Total registered users
- Total unemployed count
- Total employed count
- Employment success rate
- State-wise analytics
- Degree-wise analytics
- Skills distribution
- Live activity feed
- Interactive chart-ready UI

## Project Structure

```bash
jobpulse/
├── app/
│   ├── api/
│   ├── auth/
│   ├── dashboard/
│   ├── employment/
│   ├── profile/
│   ├── rankings/
│   └── search/
├── components/
├── lib/
├── public/
├── database.sql
├── API.md
├── SETUP.md
├── SETUP_CHECKLIST.md
├── SUPABASE_SETUP.md
├── SUPABASE_WALKTHROUGH.md
└── DEPLOYMENT.md
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check for errors
```

## API Endpoints

Key endpoints are documented in [API.md](API.md).

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/employment` - Update employment
- `GET /api/analytics/global` - Global analytics
- `GET /api/search/users` - Search users

## Troubleshooting

### Common Issues

**Module not found**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind CSS not working**

```bash
npm run build
rm -rf .next
npm run dev
```

**Database connection error**

- Verify `.env.local` credentials
- Check Supabase project is active
- Confirm RLS policies are correct

## Security

- Row-Level Security enabled
- Environment variables protected
- No sensitive data in code
- HTTPS in production
- Secure password hashing

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)

## License

MIT License

## Contact

For questions or support, please create an issue on GitHub.

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** May 20, 2026
#   j o b p u l s e - i n d i a  
 