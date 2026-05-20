import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('skills');

    if (error) {
      throw error;
    }

    // Count skill occurrences
    const skillCounts = new Map();
    users?.forEach((user) => {
      if (user.skills && Array.isArray(user.skills)) {
        user.skills.forEach((skill: string) => {
          skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
        });
      }
    });

    // Sort and return top 15 skills
    const topSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([skill, count]) => ({ skill, count }));

    return NextResponse.json({
      total_skills: skillCounts.size,
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
