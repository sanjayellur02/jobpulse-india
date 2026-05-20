import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { password, token } = await request.json();

    if (!password || !token) {
      return NextResponse.json({ error: 'Password and token are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const supabase = createClient();

    // Update password with the recovery token
    const { data, error } = await supabase.auth.updateUser(
      { password },
      {
        // Set the recovery token in the session to authenticate the update
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
