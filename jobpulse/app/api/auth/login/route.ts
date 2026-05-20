import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Auth response:', { authError, userId: authData?.user?.id });

    if (authError || !authData.user) {
      console.error('Auth error:', authError?.message);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get user profile
    let userProfile = null;
    const { data: existingProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    console.log('Profile fetch:', { profileError, exists: !!existingProfile });

    if (profileError || !existingProfile) {
      // Profile doesn't exist - create it automatically
      console.log('Profile not found, creating one...');
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            id: authData.user.id,
            full_name: email.split('@')[0], // Default name from email
            email,
            phone: '',
            employment_status: 'Unemployed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error('Failed to create profile:', createError);
        return NextResponse.json(
          { error: 'Failed to complete login' },
          { status: 500 }
        );
      }

      userProfile = newProfile;
    } else {
      userProfile = existingProfile;
    }

    console.log('Login successful for:', email);

    return NextResponse.json(
      {
        success: true,
        user: userProfile,
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
