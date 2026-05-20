/**
 * In-memory sliding window rate limiter for Next.js Edge middleware.
 * No external dependencies — works on Vercel Edge out of the box.
 *
 * For multi-instance production deployments (many serverless workers)
 * replace the Map store with Upstash Redis for shared state:
 * https://github.com/upstash/ratelimit
 */

interface Window {
  count: number;
  resetAt: number; // unix ms
}

// Module-level Map persists across requests within the same Edge worker instance.
const store = new Map<string, Window>();

// Prune stale entries every ~100 checks to keep memory bounded.
let pruneCounter = 0;
function maybePrune() {
  if (++pruneCounter % 100 !== 0) return;
  const now = Date.now();
  for (const [key, win] of store) {
    if (win.resetAt < now) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Max requests allowed within the window */
  limit: number;
  /** Window duration in seconds */
  windowSecs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in this window */
  remaining: number;
  /** Unix ms when the window resets */
  resetAt: number;
}

/**
 * Check and increment the rate limit for a given key.
 * The key should include both the route bucket and the caller identity (IP).
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  maybePrune();

  const now = Date.now();
  const existing = store.get(key);

  // Start a fresh window if none exists or previous window expired
  if (!existing || existing.resetAt < now) {
    const resetAt = now + config.windowSecs * 1000;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: config.limit - 1, resetAt };
  }

  if (existing.count >= config.limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Rate limit buckets by route pattern.
 * Auth endpoints are tightest — brute force protection.
 * Mutation endpoints are moderate.
 * Read endpoints are loose.
 */
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // 5 attempts per minute — login / register brute force protection
  auth: { limit: 5, windowSecs: 60 },
  // 20 writes per minute — profile/employment updates
  write: { limit: 20, windowSecs: 60 },
  // 60 reads per minute — search, analytics
  read: { limit: 60, windowSecs: 60 },
};

/** Pick the right bucket for a given API pathname */
export function getBucket(pathname: string): keyof typeof RATE_LIMIT_CONFIGS {
  if (pathname.startsWith('/api/auth/')) return 'auth';
  if (pathname.startsWith('/api/user/') || pathname.startsWith('/api/employment/')) return 'write';
  return 'read';
}

/** Extract the best available caller identity from a request */
export function getCallerKey(request: Request): string {
  // Vercel sets x-forwarded-for; fall back to a constant for local dev
  const forwarded = (request.headers as Headers).get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'local';
  return ip;
}