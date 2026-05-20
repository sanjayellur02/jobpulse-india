import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  // Handle errors from OAuth provider
  if (error) {
    console.error('Auth callback error:', error, error_description);
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
      console.error('Token exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
      );
    }

    if (!data?.user?.id) {
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

    // Redirect to dashboard on success
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=Authentication failed', request.url)
    );
  }
}
