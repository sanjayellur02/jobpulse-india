import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type EmploymentStat = {
  employment_status: string;
  count: number;
};

type StateStat = {
  state: string;
  count: number;
};

export async function GET() {
  try {
    const [{ data: employmentData, error: employmentError }, { data: stateData, error: stateError }] =
      await Promise.all([
        supabase.rpc('get_employment_stats'),
        supabase.rpc('get_state_stats'),
      ]);

    if (employmentError) throw employmentError;
    if (stateError) throw stateError;

    const employmentStats = (employmentData ?? []) as EmploymentStat[];
    const stateStats = (stateData ?? []) as StateStat[];

    const employed = employmentStats.find((item) => item.employment_status === 'Employed')?.count ?? 0;
    const unemployed = employmentStats.find((item) => item.employment_status === 'Unemployed')?.count ?? 0;
    const internship = employmentStats.find((item) => item.employment_status === 'Internship')?.count ?? 0;
    const freelancing = employmentStats.find((item) => item.employment_status === 'Freelancing')?.count ?? 0;
    const partTime = employmentStats.find((item) => item.employment_status === 'Part-time')?.count ?? 0;
    const totalUsers = employmentStats.reduce((sum, item) => sum + item.count, 0);

    const topStates = stateStats
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => ({ state: item.state, count: item.count }));

    const employmentRate = totalUsers ? ((employed / totalUsers) * 100).toFixed(1) : '0';
    const unemploymentRate = totalUsers ? ((unemployed / totalUsers) * 100).toFixed(1) : '0';

    return NextResponse.json({
      total_users: totalUsers,
      total_employed: employed,
      total_unemployed: unemployed,
      total_internship: internship,
      total_freelancing: freelancing,
      total_part_time: partTime,
      employment_rate: parseFloat(employmentRate),
      unemployment_rate: unemploymentRate,
      top_states: topStates,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
