import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role key for admin operations (registration)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Anon key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

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

    console.log('Register request:', { full_name, email, phone });

    // Validation
    if (!full_name || !email || !phone || !password) {
      console.log('Missing fields:', { full_name, email, phone, password });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Register user with Supabase Auth (auto-confirm, no email verification)
    console.log('Attempting Supabase auth signup for:', email);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email - NO verification needed
    });

    console.log('Auth signup response:', { authError, userId: authData?.user?.id });

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

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please login to continue.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
