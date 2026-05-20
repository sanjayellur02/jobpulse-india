import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get employment status breakdown
    const { data: statusBreakdown } = await supabase
      .from('users')
      .select('employment_status');

    // Get state-wise count
    const { data: stateBreakdown } = await supabase
      .from('users')
      .select('state');

    // Calculate statistics
    const employed = statusBreakdown?.filter(u => u.employment_status === 'Employed').length || 0;
    const unemployed = statusBreakdown?.filter(u => u.employment_status === 'Unemployed').length || 0;
    const internship = statusBreakdown?.filter(u => u.employment_status === 'Internship').length || 0;
    const freelancing = statusBreakdown?.filter(u => u.employment_status === 'Freelancing').length || 0;
    const partTime = statusBreakdown?.filter(u => u.employment_status === 'Part-time').length || 0;

    const employmentRate = totalUsers ? ((employed / totalUsers) * 100).toFixed(1) : '0';

    // State-wise summary
    const stateStats = new Map();
    stateBreakdown?.forEach((user) => {
      if (user.state) {
        stateStats.set(user.state, (stateStats.get(user.state) || 0) + 1);
      }
    });

    return NextResponse.json({
      total_users: totalUsers || 0,
      total_employed: employed,
      total_unemployed: unemployed,
      total_internship: internship,
      total_freelancing: freelancing,
      total_part_time: partTime,
      employment_rate: parseFloat(employmentRate),
      unemployment_rate: totalUsers
        ? ((unemployed / totalUsers) * 100).toFixed(1)
        : '0',
      top_states: Array.from(stateStats.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([state, count]) => ({ state, count })),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
