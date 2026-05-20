import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = supabaseCreateClient(supabaseUrl, supabaseAnonKey);

// Export createClient function for use in pages
export function createClient() {
  return supabaseCreateClient(supabaseUrl, supabaseAnonKey);
}

// Types for the database
export interface User {
  id: string;
  full_name: string;
  profile_photo: string | null;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  district: string;
  city: string;
  degree: string;
  branch: string;
  college: string;
  passout_year: number;
  percentage: number;
  skills: string[];
  employment_status: string;
  experience: number;
  expected_salary: number;
  created_at: string;
  updated_at: string;
}

export interface EmploymentHistory {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  salary_range: string;
  joining_date: string;
  end_date: string | null;
  created_at: string;
}

export interface Analytics {
  total_users: number;
  total_unemployed: number;
  total_employed: number;
  employment_rate: number;
  state_data: Record<string, any>;
  degree_data: Record<string, any>;
  skills_data: Record<string, any>;
}
