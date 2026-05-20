import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role key for admin operations (registration)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Regular client for user operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { full_name, email, phone, password } = await request.json();

    // Validation: Required fields
    if (!full_name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation (Q6)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation (Q5): min 8 chars, 1 uppercase, 1 number
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      );
    }

    // Register user with Supabase Auth (auto-confirm, no email verification)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email - NO verification needed
    });

    // Check if user was created or already exists
    if (authError) {
      console.error('Auth signup error:', authError.message);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      console.error('Auth signup failed: No user returned');
      return NextResponse.json(
        { error: 'Email already registered or registration failed. Please try with a different email or login if you already have an account.' },
        { status: 400 }
      );
    }

    // Create user profile in users table (using admin client to bypass RLS)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user.id,
          full_name,
          email,
          phone,
          employment_status: 'Unemployed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Cleanup: delete auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile: ' + profileError.message },
        { status: 400 }
      );
    }

    // Immediately sign the user in to create a session and set HttpOnly cookies.
    // Use the regular anon client since the user is now confirmed.
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      // If we can't create a session, return success for registration but ask user to login.
      return NextResponse.json({ success: true, message: 'Registration successful. Please login to continue.', user: { id: authData.user.id, email: authData.user.email } }, { status: 201 });
    }

    // Set HttpOnly cookies for auth so middleware can use them.
    const response = NextResponse.json({ success: true, message: 'Registration successful.', user: { id: authData.user.id, email: authData.user.email } }, { status: 201 });

    const accessToken = signInData.session.access_token;
    const refreshToken = signInData.session.refresh_token;

    let accessMaxAge = undefined as number | undefined;
    if (signInData.session.expires_at) {
      const expiresMs = signInData.session.expires_at * 1000;
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
