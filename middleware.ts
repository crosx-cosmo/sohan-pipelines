import { NextRequest, NextResponse } from 'next/server';
import { isMaliciousRequestProbe } from '@/lib/security-shield';

interface TrafficBucket {
  count: number;
  resetAt: number;
}

// High-capacity in-memory sliding window buckets for smooth user load + DDoS/bot flood defense
const pageTrafficMap = new Map<string, TrafficBucket>();
const apiMutationTrafficMap = new Map<string, TrafficBucket>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_PAGE_REQUESTS_PER_MINUTE = 240; // Smooth high-concurrency browsing capacity
const MAX_API_MUTATIONS_PER_MINUTE = 30; // Strict limit for POST/PATCH API mutations per IP
const MAX_TRACKED_IPS = 5000;

function extractClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const firstIp = xff.split(',')[0]?.trim();
    if (firstIp) return firstIp.slice(0, 64);
  }
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp.slice(0, 64);
  return 'anon-client';
}

function consumeRateLimit(
  store: Map<string, TrafficBucket>,
  key: string,
  limit: number
): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();

  // Periodic garbage collection to keep memory footprint minimal under bulk traffic
  if (store.size > MAX_TRACKED_IPS) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt <= now) {
        store.delete(k);
      }
    }
    if (store.size > MAX_TRACKED_IPS) {
      const firstKey = store.keys().next().value;
      if (firstKey) store.delete(firstKey);
    }
  }

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, retryAfter };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.count),
    retryAfter: 0,
  };
}

function applySecurityHeaders(res: NextResponse, isApiRoute: boolean): NextResponse {
  // Core anti-hacker hardening headers
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()'
  );
  // Content-Security-Policy hardening (preserves preview iframe compatibility while blocking object/base hijacks)
  res.headers.set(
    'Content-Security-Policy',
    "base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
  );

  if (isApiRoute) {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return res;
}

const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'DELETE']);

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const method = req.method.toUpperCase();
  const isApiRoute = pathname.startsWith('/api/');

  // 1. Block dangerous or non-standard HTTP methods immediately
  if (!ALLOWED_METHODS.has(method)) {
    return applySecurityHeaders(
      new NextResponse(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          Allow: 'GET, HEAD, OPTIONS, POST, PATCH, DELETE',
        },
      }),
      true
    );
  }

  // 2. WAF Check: Block automated vulnerability scanners, path traversal, and SQLi/XSS URL probes
  if (isMaliciousRequestProbe(pathname, search)) {
    return applySecurityHeaders(
      new NextResponse(JSON.stringify({ error: 'Forbidden Request' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
      true
    );
  }

  // 3. CSRF / Origin Verification & Payload Size Guard on Mutating API Requests
  if (isApiRoute && (method === 'POST' || method === 'PATCH' || method === 'DELETE')) {
    const contentLength = Number(req.headers.get('content-length') || '0');
    if (contentLength > 65_536) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: 'Payload too large. Request rejected.' },
          { status: 413 }
        ),
        true
      );
    }

    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host && !originHost.endsWith('.run.app')) {
          return applySecurityHeaders(
            NextResponse.json(
              { error: 'Cross-origin mutation rejected.' },
              { status: 403 }
            ),
            true
          );
        }
      } catch {
        return applySecurityHeaders(
          NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 }),
          true
        );
      }
    }
  }

  // 4. Rate Limiting (High capacity for smooth user traffic, strict cap for API abuse)
  const clientIp = extractClientIp(req);
  const isMutatingApi = isApiRoute && (method === 'POST' || method === 'PATCH');

  const rateCheck = isMutatingApi
    ? consumeRateLimit(apiMutationTrafficMap, `${clientIp}:${pathname}`, MAX_API_MUTATIONS_PER_MINUTE)
    : consumeRateLimit(pageTrafficMap, clientIp, MAX_PAGE_REQUESTS_PER_MINUTE);

  if (!rateCheck.allowed) {
    const res = NextResponse.json(
      {
        error: 'Too many requests from this network. Please wait a moment and try again.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfter),
        },
      }
    );
    return applySecurityHeaders(res, true);
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response, isApiRoute);
}

export const config = {
  matcher: [
    /*
     * Apply security middleware to all application routes and API endpoints
     * while bypassing static hashed media/chunks for maximum throughput.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)',
  ],
};
