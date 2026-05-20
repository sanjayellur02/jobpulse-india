import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type SkillRow = {
  skill: string;
  count: number;
};

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('get_skill_stats');
    if (error) throw error;

    const topSkills = (data ?? []) as SkillRow[];

    return NextResponse.json({
      total_skills: topSkills.length,
      top_skills: topSkills,
    });
  } catch (error) {
    console.error('Error fetching skills analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
