import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Valid employment status values — reject anything else
const VALID_STATUSES = ['Unemployed', 'Internship', 'Freelancing', 'Part-time', 'Employed'] as const;
type EmploymentStatus = typeof VALID_STATUSES[number];

// Salary range whitelist — no free-text, pick from known values only
const VALID_SALARY_RANGES = [
  '0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA',
  '15-25 LPA', '25-50 LPA', '50+ LPA',
];

function sanitizeString(value: unknown, maxLength = 255): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  // Strip control characters
  return trimmed.replace(/[\x00-\x1F\x7F]/g, '').slice(0, maxLength);
}

function getToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth_token')?.value;
  if (cookieToken) return cookieToken;
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // ── Parse body ────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // ── Validate employment_status (C5: enum check, not free text) ───
    const employment_status = body.employment_status as string;
    if (!employment_status || !VALID_STATUSES.includes(employment_status as EmploymentStatus)) {
      return NextResponse.json(
        { error: `employment_status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Sanitize and whitelist every other field (C5) ─────
    const company_name = sanitizeString(body.company_name);
    const job_role = sanitizeString(body.job_role);

    // salary_range must be from the allowed list, not free text
    const rawSalary = typeof body.salary_range === 'string' ? body.salary_range : null;
    const salary_range =
      rawSalary && VALID_SALARY_RANGES.includes(rawSalary) ? rawSalary : null;

    // joined_date must be a valid ISO date string
    let joined_date: string | null = null;
    if (typeof body.joined_date === 'string') {
      const parsed = new Date(body.joined_date);
      if (!isNaN(parsed.getTime()) && parsed <= new Date()) {
        joined_date = parsed.toISOString().split('T')[0]; // store as YYYY-MM-DD
      }
    }

    // Enforce: employed status requires company + role
    if (employment_status === 'Employed' && (!company_name || !job_role)) {
      return NextResponse.json(
        { error: 'company_name and job_role are required when status is Employed' },
        { status: 400 }
      );
    }

    // ── Update users table (only explicit, validated fields) ─
    const { error: updateError } = await supabase
      .from('users')
      .update({
        employment_status,
        company_name: company_name ?? null,
        job_role: job_role ?? null,
        salary_range: salary_range ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // ── Insert employment history for Employed status ──────
    if (employment_status === 'Employed' && company_name && job_role && joined_date) {
      const { error: historyError } = await supabase
        .from('employment_history')
        .insert([{
          user_id: authData.user.id,
          company_name,
          role: job_role,
          salary_range: salary_range ?? null,
          joining_date: joined_date,
          created_at: new Date().toISOString(),
        }]);

      // Don't fail the whole request if history insert fails — log and continue
      if (historyError) {
        console.error('Employment history insert failed:', historyError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Employment status updated successfully',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}