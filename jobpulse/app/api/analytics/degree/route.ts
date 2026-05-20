import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type DegreeRow = {
  degree: string;
  total_users: number;
  employed_users: number;
};

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('get_degree_stats');
    if (error) throw error;

    const degreeData = (data ?? []) as DegreeRow[];

    return NextResponse.json({
      degree_data: degreeData
        .map((row) => {
          const total = row.total_users || 0;
          const employed = row.employed_users || 0;
          return {
            degree: row.degree,
            total_users: total,
            employed,
            unemployment_rate: total ? Number((((total - employed) / total) * 100).toFixed(1)) : 0,
          };
        })
        .sort((a, b) => b.total_users - a.total_users),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}