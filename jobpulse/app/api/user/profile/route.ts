import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Whitelist of fields a user is allowed to update — prevents mass assignment (C5)
const ALLOWED_UPDATE_FIELDS = [
  'full_name', 'gender', 'dob', 'phone', 'state', 'district', 'city',
  'degree', 'branch', 'college', 'passout_year', 'percentage', 'skills',
  'employment_status', 'company_name', 'job_role', 'salary_range',
  'expected_salary', 'bio', 'profile_photo',
];

// Extract the token from the HttpOnly cookie (set server-side at login).
// Falls back to Authorization header for backwards compatibility during migration.
function getToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth_token')?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);

  return null;
}

// GET /api/user/profile
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const rawUpdates = await request.json();

    // Strip any fields not in the whitelist — fixes C5 (mass assignment)
    const updates = Object.fromEntries(
      Object.entries(rawUpdates).filter(([key]) => ALLOWED_UPDATE_FIELDS.includes(key))
    );

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', authData.user.id);

    if (error) {
      console.error('Profile update failed:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 });
    }

    const { data: updatedProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return NextResponse.json({ success: true, user: updatedProfile });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
