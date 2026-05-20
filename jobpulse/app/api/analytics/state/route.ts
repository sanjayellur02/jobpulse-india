import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');

    let queryBuilder = supabase.from('users').select('employment_status, state');

    if (state) {
      queryBuilder = queryBuilder.eq('state', state);
    }

    const { data: users, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    // Calculate statistics
    const stateStats = new Map();
    users?.forEach((user) => {
      const key = user.state || 'Unknown';
      if (!stateStats.has(key)) {
        stateStats.set(key, {
          state: key,
          total: 0,
          employed: 0,
          unemployed: 0,
          internship: 0,
          freelancing: 0,
          part_time: 0,
        });
      }

      const stats = stateStats.get(key);
      stats.total += 1;

      if (user.employment_status === 'Employed') stats.employed += 1;
      else if (user.employment_status === 'Unemployed') stats.unemployed += 1;
      else if (user.employment_status === 'Internship') stats.internship += 1;
      else if (user.employment_status === 'Freelancing') stats.freelancing += 1;
      else if (user.employment_status === 'Part-time') stats.part_time += 1;
    });

    // Add employment rates
    const statesArray = Array.from(stateStats.values()).map((stats) => ({
      ...stats,
      employment_rate: stats.total
        ? ((stats.employed / stats.total) * 100).toFixed(1)
        : '0',
      unemployment_rate: stats.total
        ? ((stats.unemployed / stats.total) * 100).toFixed(1)
        : '0',
    }));

    return NextResponse.json({
      state_data: statesArray.sort((a, b) => b.total - a.total),
    });
  } catch (error) {
    console.error('Error fetching state analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
