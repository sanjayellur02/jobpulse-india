import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  // Handle errors from OAuth provider
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error_description || error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=No authorization code provided', request.url)
    );
  }

  try {
    const supabase = createClient();

    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
      );
    }

    if (!data?.user?.id || !data?.session) {
      return NextResponse.redirect(
        new URL('/auth/login?error=Failed to authenticate', request.url)
      );
    }

    // Check if user profile exists in database
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // If user doesn't exist, create profile from OAuth data
    if (profileError && profileError.code === 'PGRST116') {
      const email = data.user.email || '';
      const full_name = data.user.user_metadata?.full_name || email.split('@')[0];

      await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name,
        employment_status: 'Unemployed',
      });
    }

    // Create response and set HttpOnly auth cookies
    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    // Set auth_token cookie (access token)
    response.cookies.set('auth_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in || 3600, // expires_in is typically 3600 (1 hour)
      path: '/',
    });

    // Set auth_refresh cookie (refresh token) with longer expiry
    response.cookies.set('auth_refresh', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800 * 2, // 2 weeks (refresh tokens last ~2 weeks with Supabase)
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.redirect(
      new URL('/auth/login?error=Authentication failed', request.url)
    );
  }
}
