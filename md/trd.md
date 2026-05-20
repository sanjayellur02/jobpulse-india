# TECHNICAL REQUIREMENTS DOCUMENT (TRD)

# PROJECT: JOBPULSE INDIA

---

# 1. TECH STACK

## FRONTEND

**Framework:** Next.js  
**Language:** JavaScript  
**UI Framework:** Tailwind CSS  
**Components:** shadcn/ui  

---

## BACKEND

**Backend Platform:** Supabase  

---

## DATABASE

**Database:** PostgreSQL  

---

## CHARTS

**Chart Library:** Recharts  

---

## HOSTING

**Deployment:** Vercel  

---

# 2. SYSTEM ARCHITECTURE

```
Frontend (Next.js)
       ↓
   Supabase APIs
       ↓
  PostgreSQL Database
       ↓
   Analytics Engine
       ↓
  Charts Dashboard
```

---

# 3. DATABASE DESIGN

# TABLE: users

| Column            | Type      | Description |
| ----------------- | --------- | ----------- |
| id                | UUID      | Primary key |
| full_name         | VARCHAR   | User's full name |
| profile_photo     | TEXT      | URL to profile photo |
| gender            | VARCHAR   | Gender |
| dob               | DATE      | Date of birth |
| phone             | VARCHAR   | Phone number |
| email             | VARCHAR   | Email address |
| country           | VARCHAR   | Country |
| state             | VARCHAR   | State |
| district          | VARCHAR   | District |
| city              | VARCHAR   | City |
| degree            | VARCHAR   | Degree (B.Tech, B.A., etc.) |
| branch            | VARCHAR   | Branch/Major |
| college           | VARCHAR   | College name |
| passout_year      | INTEGER   | Year of graduation |
| percentage        | FLOAT     | Percentage/CGPA |
| skills            | TEXT[]    | Array of skills |
| employment_status | VARCHAR   | Current status |
| experience        | INTEGER   | Years of experience |
| expected_salary   | INTEGER   | Expected salary in rupees |
| created_at        | TIMESTAMP | Account creation date |
| updated_at        | TIMESTAMP | Last update date |

---

# TABLE: employment_history

| Column       | Type      | Description |
| ------------ | --------- | ----------- |
| id           | UUID      | Primary key |
| user_id      | UUID      | Foreign key to users |
| company_name | VARCHAR   | Company name |
| role         | VARCHAR   | Job role |
| salary_range | VARCHAR   | Salary range |
| joining_date | DATE      | Employment joining date |
| end_date     | DATE      | Employment end date (nullable) |
| created_at   | TIMESTAMP | Record creation date |

---

# TABLE: analytics_cache

| Column     | Type      | Description |
| ---------- | --------- | ----------- |
| id         | UUID      | Primary key |
| key        | VARCHAR   | Cache key |
| value      | JSONB     | Cached analytics data |
| updated_at | TIMESTAMP | Last update |
| ttl        | INTEGER   | Time to live in seconds |

---

# 4. API STRUCTURE

## Authentication APIs

```
POST /api/auth/register
  - Register new user

POST /api/auth/login
  - User login with email

POST /api/auth/logout
  - User logout

POST /api/auth/google
  - Google OAuth login
```

---

## User APIs

```
GET /api/user
  - Get current user profile

PUT /api/user/update
  - Update user profile

PUT /api/user/employment/update
  - Update employment status

GET /api/user/:id
  - Get public user profile

DELETE /api/user
  - Delete user account
```

---

## Analytics APIs

```
GET /api/analytics/global
  - Get global statistics
  - Returns: total users, employed, unemployed, rate

GET /api/analytics/state
  - Get state-wise statistics
  - Returns: state-wise user count and unemployment rate

GET /api/analytics/degree
  - Get degree-wise statistics
  - Returns: degree distribution

GET /api/analytics/skills
  - Get skills distribution
  - Returns: top skills and frequency

GET /api/analytics/growth
  - Get registration and employment growth
  - Returns: time-series data for charts

GET /api/analytics/heatmap
  - Get state heatmap data
  - Returns: state coordinates and unemployment density
```

---

## Search APIs

```
GET /api/search/users
  - Search users by name, degree, skills, state
  - Query params: name, state, degree, skills, college
  - Returns: list of public user profiles
```

---

# 5. FRONTEND PAGES

## Public Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page |
| Dashboard | `/dashboard` | Analytics dashboard |
| Analytics | `/analytics` | Detailed analytics |
| State Rankings | `/rankings/states` | State-wise rankings |
| Degree Rankings | `/rankings/degrees` | Degree-wise rankings |
| Search | `/search` | Search and filter users |

---

## Auth Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/auth/login` | User login |
| Register | `/auth/register` | User registration |

---

## User Pages

| Page | Route | Purpose |
|------|-------|---------|
| Profile | `/profile` | User profile view |
| Edit Profile | `/profile/edit` | Edit profile information |
| Employment Update | `/employment/update` | Update employment status |
| Settings | `/settings` | Account settings |

---

# 6. UI COMPONENTS

## shadcn/ui Components to Use

* Button
* Card
* Input
* Select
* Checkbox
* Dialog
* Tabs
* Table
* Badge
* Progress
* Toast
* Navbar/Header
* Sidebar
* Footer

---

## Custom Components

* AnalyticsCard (Summary cards)
* ChartContainer (Recharts wrapper)
* UserCard (Profile card)
* SearchFilter (Search and filter component)
* Heatmap (India unemployment map)
* ActivityFeed (Live feed)
* Leaderboard (Rankings)

---

# 7. ANALYTICS SYSTEM

## Core Metrics

| Metric | Calculation |
|--------|------------|
| Total Users | COUNT(users.id) |
| Total Unemployed | COUNT(users WHERE employment_status = 'Unemployed') |
| Total Employed | COUNT(users WHERE employment_status = 'Employed') |
| Employment Rate | (Total Employed / Total Users) * 100 |
| Internship Count | COUNT(users WHERE employment_status = 'Internship') |
| Freelance Count | COUNT(users WHERE employment_status = 'Freelancing') |
| Part-time Count | COUNT(users WHERE employment_status = 'Part-time') |

---

## Aggregated Views

### State-wise Analytics

```sql
SELECT 
  state,
  COUNT(*) as total_users,
  COUNT(CASE WHEN employment_status = 'Employed' THEN 1 END) as employed,
  COUNT(CASE WHEN employment_status = 'Unemployed' THEN 1 END) as unemployed
FROM users
GROUP BY state
```

---

### Degree-wise Analytics

```sql
SELECT 
  degree,
  COUNT(*) as total_users,
  COUNT(CASE WHEN employment_status = 'Employed' THEN 1 END) as employed
FROM users
GROUP BY degree
```

---

### Skills Distribution

```sql
SELECT 
  skill,
  COUNT(*) as count
FROM users, UNNEST(skills) as skill
GROUP BY skill
ORDER BY count DESC
```

---

## Chart Types

| Chart Type | Data Source | Purpose |
|-----------|-------------|---------|
| Pie Chart - Employment Status | Global metrics | Show employment distribution |
| Pie Chart - Degree | Degree-wise analytics | Show degree distribution |
| Pie Chart - Gender | User profiles | Show gender distribution |
| Bar Chart - States | State-wise analytics | Compare unemployment by state |
| Bar Chart - Districts | District-wise analytics | District-level comparison |
| Bar Chart - Degrees | Degree-wise analytics | Degree comparison |
| Bar Chart - Skills | Skills distribution | Top skills |
| Line Chart - Registration | Growth analytics | Registration trend |
| Line Chart - Employment | Growth analytics | Employment conversion trend |
| Heatmap - India Map | State-wise data | Unemployment density visualization |

---

# 8. SECURITY

## Authentication

* **Provider:** Supabase Auth
* **Methods:** Email/Password, Google OAuth
* **JWT:** Session tokens for API requests
* **Rate Limiting:** 100 requests per minute per IP

---

## Database Security

* **Row-Level Security (RLS):** Enabled on all tables
* **User Data Access:**
  - Users can only edit their own profile
  - Public profiles visible to all (configurable)
  - Sensitive data hidden from public view
* **Admin Access:** Limited to analytics queries

---

## API Protection

* **CORS:** Enabled for Vercel domain
* **Rate Limiting:** Implemented at API level
* **Input Validation:** Server-side validation for all inputs
* **SQL Injection Prevention:** Parameterized queries via Supabase

---

## Data Privacy

* Phone numbers and emails not shown publicly
* Exact addresses hidden
* Users can toggle public profile visibility
* Delete account functionality to remove data

---

# 9. DEPLOYMENT PIPELINE

```
Developer Push to GitHub
        ↓
GitHub Webhook Trigger
        ↓
Vercel Auto-Deploy
        ↓
Build Next.js App
        ↓
Run Tests
        ↓
Deploy to Production
        ↓
Live Website
```

---

# 10. FREE SERVICES USED

| Service | Cost | Tier |
|---------|------|------|
| Next.js | Free | Open source |
| React | Free | Open source |
| Supabase | Free | Generous free tier |
| PostgreSQL | Free | Included in Supabase |
| Recharts | Free | Open source |
| Tailwind CSS | Free | Open source |
| shadcn/ui | Free | Open source |
| Vercel | Free | Generous free tier |

---

## Cost Estimate

**Monthly Cost (Initial):** ₹0

**Scaling to 100,000 users:**
* Database: ~₹1,000-2,000/month (Supabase paid tier)
* Hosting: ~₹500-1,000/month (Vercel pro)
* Storage: ~₹500/month (images)

**Total scaling cost:** ~₹2,000-4,000/month

---

# 11. MVP DEVELOPMENT PHASES

## Phase 1: Core Features (Weeks 1-4)

- [ ] Project setup (Next.js, Supabase, Vercel)
- [ ] Database schema and RLS policies
- [ ] User registration and login
- [ ] User profile management
- [ ] Basic analytics queries
- [ ] Dashboard with summary cards and pie charts

---

## Phase 2: Analytics & Filtering (Weeks 5-7)

- [ ] State-wise analytics
- [ ] Degree-wise analytics
- [ ] Skills distribution
- [ ] Bar charts and line charts
- [ ] Search and filter functionality
- [ ] Heatmap visualization

---

## Phase 3: Advanced Features (Weeks 8-10)

- [ ] Live activity feed
- [ ] Leaderboards
- [ ] Admin panel basics
- [ ] Performance optimization
- [ ] Testing and bug fixes
- [ ] Deployment and monitoring

---

# 12. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Dashboard Load Time | < 3 seconds |
| API Response Time | < 500ms |
| Database Query Time | < 200ms |
| Page Size | < 2MB |
| SEO Score | > 90 |
| Lighthouse Score | > 85 |

---

# 13. FINAL TECH STACK SUMMARY

1. **Frontend:** React + Next.js
2. **Language:** JavaScript
3. **Backend:** Supabase
4. **Database:** PostgreSQL
5. **Charts:** Recharts
6. **Styling:** Tailwind CSS
7. **Components:** shadcn/ui
8. **Hosting:** Vercel

**This is a production-ready, scalable stack used by top companies.**
