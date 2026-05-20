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

    if (authError || !authData.user) {
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

    if (profileError || !existingProfile) {
      // Profile doesn't exist - create it automatically
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
        return NextResponse.json(
          { error: 'Failed to complete login' },
          { status: 500 }
        );
      }

      userProfile = newProfile;
    } else {
      userProfile = existingProfile;
    }

    // Set HttpOnly, Secure cookies for access and refresh tokens so middleware
    // can validate sessions server-side without exposing tokens to JS.
    const response = NextResponse.json({ success: true, user: userProfile }, { status: 200 });

    const accessToken = authData.session?.access_token;
    const refreshToken = authData.session?.refresh_token;

    // Determine maxAge from expires_at if available (expires_at is epoch seconds)
    let accessMaxAge = undefined as number | undefined;
    if (authData.session?.expires_at) {
      const expiresMs = authData.session.expires_at * 1000;
      const maxAgeSeconds = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
      accessMaxAge = maxAgeSeconds || undefined;
    }

    if (accessToken) {
      response.cookies.set('auth_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: accessMaxAge,
      });
    }

    if (refreshToken) {
      // Refresh token usually has longer lifetime; use a safe default 30 days if expires unknown
      response.cookies.set('auth_refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
