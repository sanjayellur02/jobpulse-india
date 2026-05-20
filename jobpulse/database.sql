-- JobPulse India - Database Schema
-- Run these SQL queries in your Supabase SQL Editor
-- https://app.supabase.com/project/YOUR_PROJECT_ID/sql

-- ============================================
-- 1. CREATE USERS TABLE
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  profile_photo TEXT,
  gender VARCHAR(50),
  dob DATE,
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  state VARCHAR(100),
  district VARCHAR(100),
  city VARCHAR(100),
  degree VARCHAR(100),
  branch VARCHAR(100),
  college VARCHAR(255),
  passout_year INTEGER,
  percentage FLOAT,
  skills TEXT[] DEFAULT '{}',
  employment_status VARCHAR(50) DEFAULT 'Unemployed',
  experience INTEGER DEFAULT 0,
  company_name VARCHAR(255),
  job_role VARCHAR(255),
  salary_range VARCHAR(50),
  expected_salary INTEGER,
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- ============================================
-- 2. CREATE EMPLOYMENT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS employment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  salary_range VARCHAR(50),
  joining_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE employment_history ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE;

-- ============================================
-- 3. CREATE ANALYTICS CACHE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB,
  ttl INTEGER DEFAULT 3600,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_state ON users(state);
CREATE INDEX IF NOT EXISTS idx_users_degree ON users(degree);
CREATE INDEX IF NOT EXISTS idx_users_employment_status ON users(employment_status);
CREATE INDEX IF NOT EXISTS idx_users_college ON users(college);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_unique_not_null ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_users_state_status ON users(state, employment_status);
CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING GIN(full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_employment_history_user_id ON employment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_key ON analytics_cache(key);

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CREATE RLS POLICIES FOR USERS TABLE
-- ============================================

-- Policy: Users can read public profile information
DROP POLICY IF EXISTS "Public users can view all profiles" ON users;
CREATE POLICY "Public users can view all profiles" ON users
  FOR SELECT
  USING (true);

-- Policy: Users can only insert their own profile during registration
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can only update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 7. CREATE RLS POLICIES FOR EMPLOYMENT HISTORY
-- ============================================

-- Policy: Users can view employment history of all users (public data)
DROP POLICY IF EXISTS "Public employment history is readable" ON employment_history;
CREATE POLICY "Public employment history is readable" ON employment_history
  FOR SELECT
  USING (true);

-- Policy: Users can insert employment history for their own account
DROP POLICY IF EXISTS "Users can insert own employment history" ON employment_history;
CREATE POLICY "Users can insert own employment history" ON employment_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own employment history only
DROP POLICY IF EXISTS "Users can update own employment history" ON employment_history;
CREATE POLICY "Users can update own employment history" ON employment_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own employment history only
DROP POLICY IF EXISTS "Users can delete own employment history" ON employment_history;
CREATE POLICY "Users can delete own employment history" ON employment_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 8. CREATE FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aggregated analytics: employment status counts in one query
CREATE OR REPLACE FUNCTION get_employment_stats()
RETURNS TABLE (employment_status TEXT, count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(employment_status, 'Unknown') AS employment_status,
    COUNT(*)::BIGINT AS count
  FROM users
  WHERE COALESCE(is_active, TRUE)
  GROUP BY COALESCE(employment_status, 'Unknown')
  ORDER BY count DESC, employment_status ASC;
$$;

-- Aggregated analytics: state totals and employed counts in one query
CREATE OR REPLACE FUNCTION get_state_stats()
RETURNS TABLE (state TEXT, total_users BIGINT, employed_users BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(state, 'Unknown') AS state,
    COUNT(*)::BIGINT AS total_users,
    COUNT(*) FILTER (WHERE employment_status = 'Employed')::BIGINT AS employed_users
  FROM users
  WHERE COALESCE(is_active, TRUE)
  GROUP BY COALESCE(state, 'Unknown')
  ORDER BY total_users DESC, state ASC;
$$;

-- Aggregated analytics: detailed breakdown for a single state
CREATE OR REPLACE FUNCTION get_state_breakdown(target_state TEXT)
RETURNS TABLE (employment_status TEXT, count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(employment_status, 'Unknown') AS employment_status,
    COUNT(*)::BIGINT AS count
  FROM users
  WHERE state = target_state
    AND COALESCE(is_active, TRUE)
  GROUP BY COALESCE(employment_status, 'Unknown')
  ORDER BY count DESC, employment_status ASC;
$$;

-- Aggregated analytics: degree totals and employed counts in one query
CREATE OR REPLACE FUNCTION get_degree_stats()
RETURNS TABLE (degree TEXT, total_users BIGINT, employed_users BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(degree, 'Unknown') AS degree,
    COUNT(*)::BIGINT AS total_users,
    COUNT(*) FILTER (WHERE employment_status = 'Employed')::BIGINT AS employed_users
  FROM users
  WHERE COALESCE(is_active, TRUE)
  GROUP BY COALESCE(degree, 'Unknown')
  ORDER BY total_users DESC, degree ASC;
$$;

-- Aggregated analytics: top skills in one query
CREATE OR REPLACE FUNCTION get_skill_stats()
RETURNS TABLE (skill TEXT, count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT
    skill,
    COUNT(*)::BIGINT AS count
  FROM users,
  LATERAL unnest(COALESCE(skills, ARRAY[]::TEXT[])) AS skill
  WHERE COALESCE(is_active, TRUE)
  GROUP BY skill
  ORDER BY count DESC, skill ASC
  LIMIT 15;
$$;

-- ============================================
-- 9. CREATE TRIGGERS
-- ============================================

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for employment_history table
DROP TRIGGER IF EXISTS update_employment_history_updated_at ON employment_history;
CREATE TRIGGER update_employment_history_updated_at BEFORE UPDATE ON employment_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. SAMPLE DATA (OPTIONAL)
-- ============================================

-- Insert sample states data (reference)
-- Note: You can use this to pre-populate state information if needed

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================
-- Tables created: users, employment_history, analytics_cache
-- RLS Policies enabled for security
-- Indexes created for performance
-- Triggers configured for timestamp management
