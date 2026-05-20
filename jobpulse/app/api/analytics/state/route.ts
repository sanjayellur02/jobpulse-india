import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type StateRow = {
  state: string;
  total_users: number;
  employed_users: number;
};

type StateBreakdownRow = {
  employment_status: string;
  count: number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');

    if (state) {
      const { data, error } = await supabase.rpc('get_state_breakdown', {
        target_state: state,
      });

      if (error) throw error;

      const breakdown = (data ?? []) as StateBreakdownRow[];
      const total = breakdown.reduce((acc, row) => acc + row.count, 0);

      return NextResponse.json({
        state,
        total_users: total,
        breakdown: breakdown.map((row) => ({ status: row.employment_status, count: row.count })),
      });
    }

    const { data, error } = await supabase.rpc('get_state_stats');
    if (error) throw error;

    const stateRows = (data ?? []) as StateRow[];
    const state_data = stateRows
      .map((row) => {
        const total = row.total_users || 0;
        const employed = row.employed_users || 0;
        return {
          state: row.state,
          total,
          employed,
          employment_rate: total ? ((employed / total) * 100).toFixed(1) : '0',
        };
      })
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({ state_data });
  } catch (error) {
    console.error('Error fetching state analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
