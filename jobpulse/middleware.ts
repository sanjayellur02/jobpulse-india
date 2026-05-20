import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  getBucket,
  getCallerKey,
  RATE_LIMIT_CONFIGS,
} from '@/lib/rate-limit';

const protectedRoutes = ['/profile', '/dashboard', '/employment'];
const isProduction = process.env.NODE_ENV === 'production';

function buildCsp(nonce: string) {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    'https://cdn.vercel-analytics.com',
  ];
  const styleSrc = [
    "'self'",
    `'nonce-${nonce}'`,
  ];

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://cdn.vercel-analytics.com https://vercel-analytics.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

function nextResponseWithSecurityHeaders(request: NextRequest) {
  if (!isProduction) return NextResponse.next();

  const nonce = crypto.randomUUID().replace(/-/g, '');
  const requestHeaders = new Headers(request.headers);
  const csp = buildCsp(nonce);

  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ─────────────────────────────────────────────
  // C4: Rate limiting — applied to ALL /api routes
  // ─────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const bucket = getBucket(pathname);
    const config = RATE_LIMIT_CONFIGS[bucket];
    const callerIp = getCallerKey(request);
    const key = `${bucket}:${callerIp}`;

    const result = checkRateLimit(key, config);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please slow down.',
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(config.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
          },
        }
      );
    }

    // Attach rate limit headers to passing responses too (good API practice)
    const response = nextResponseWithSecurityHeaders(request);
    response.headers.set('X-RateLimit-Limit', String(config.limit));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));
    return response;
  }

  // ─────────────────────────────────────────────
  // C3: Auth guard — protected page routes only
  // ─────────────────────────────────────────────
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if (!isProtected) return nextResponseWithSecurityHeaders(request);

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('auth_refresh', '', { maxAge: 0, path: '/' });
      return response;
    }
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return nextResponseWithSecurityHeaders(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
