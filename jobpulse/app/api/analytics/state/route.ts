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
    // If a specific state is requested, compute counts for that state only
    if (state) {
      const statuses = ['Employed', 'Unemployed', 'Internship', 'Freelancing', 'Part-time'];
      const counts = await Promise.all(
        statuses.map(async (s) => {
          const { count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('state', state)
            .eq('employment_status', s);
          return { status: s, count: count || 0 };
        })
      );

      const total = counts.reduce((acc, c) => acc + c.count, 0);

      return NextResponse.json({
        state: state,
        total_users: total,
        breakdown: counts,
      });
    }

    // No state specified: return per-state totals using a bounded list of states
    const { indianStates } = await import('@/lib/utils');

    const stateCounts = await Promise.all(
      indianStates.map(async (st) => {
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('state', st);
        return { state: st, total: count || 0 };
      })
    );

    // Attach simple employment/unemployment rates per state (optional, can be expanded)
    const statesWithRates = await Promise.all(
      stateCounts.map(async (s) => {
        const { count: employed } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('state', s.state)
          .eq('employment_status', 'Employed');
        const total = s.total || 0;
        return {
          state: s.state,
          total: total,
          employed: employed || 0,
          employment_rate: total ? ((employed || 0) / total * 100).toFixed(1) : '0',
        };
      })
    );

    return NextResponse.json({ state_data: statesWithRates.sort((a, b) => b.total - a.total) });
  } catch (error) {
    console.error('Error fetching state analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
