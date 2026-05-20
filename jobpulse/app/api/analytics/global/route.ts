import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    // Efficient counts using PostgREST head queries (COUNT only) to avoid
    // loading all rows into Node memory. This issues several lightweight
    // COUNT(*) queries rather than a single large data fetch.

    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const statuses = ['Employed', 'Unemployed', 'Internship', 'Freelancing', 'Part-time'];

    const statusCounts = await Promise.all(
      statuses.map(async (s) => {
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('employment_status', s);
        return { status: s, count: count || 0 };
      })
    );

    const employed = statusCounts.find((c) => c.status === 'Employed')?.count || 0;
    const unemployed = statusCounts.find((c) => c.status === 'Unemployed')?.count || 0;
    const internship = statusCounts.find((c) => c.status === 'Internship')?.count || 0;
    const freelancing = statusCounts.find((c) => c.status === 'Freelancing')?.count || 0;
    const partTime = statusCounts.find((c) => c.status === 'Part-time')?.count || 0;

    const employmentRate = totalUsers ? ((employed / totalUsers) * 100).toFixed(1) : '0';

    // Top states — count per known state using lib/utils.indianStates to bound queries
    const { indianStates } = await import('@/lib/utils');

    const stateCounts = await Promise.all(
      indianStates.map(async (st) => {
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('state', st);
        return { state: st, count: count || 0 };
      })
    );

    const topStates = stateCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      total_users: totalUsers || 0,
      total_employed: employed,
      total_unemployed: unemployed,
      total_internship: internship,
      total_freelancing: freelancing,
      total_part_time: partTime,
      employment_rate: parseFloat(employmentRate),
      unemployment_rate: totalUsers ? ((unemployed / totalUsers) * 100).toFixed(1) : '0',
      top_states: topStates,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
