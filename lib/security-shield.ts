/**
 * SOHAN PIPELINES — Enterprise Security & Bulk Traffic Protection Shield
 * Provides strict input sanitization, XSS/SQLi payload neutralization,
 * client/server rate-limit guards, and request origin verification.
 */

// Control characters, null bytes, and bidirectional override characters
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;

// Dangerous HTML/JS vectors and script payloads
const DANGEROUS_VECTORS_REGEX =
  /(<\s*\/?\s*(script|iframe|object|embed|applet|meta|link|style|svg|math|base|form)\b[^>]*>|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|on[a-z]+\s*=)/gi;

// Common SQL injection & command execution probe patterns
const SQLI_PROBE_REGEX =
  /(\b(union\s+all\s+select|union\s+select|drop\s+table|alter\s+table|insert\s+into|delete\s+from|xp_cmdshell|information_schema|pg_sleep|benchmark\s*\()\b|--\s|;\s*--)/gi;

/**
 * Sanitizes any untrusted string input by stripping control characters,
 * HTML tags, XSS event handlers, script protocols, and SQLi probes.
 */
export function sanitizePlainText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(DANGEROUS_VECTORS_REGEX, '')
    .replace(/[<>]/g, '')
    .replace(SQLI_PROBE_REGEX, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes a customer name (letters, spaces, periods, hyphens, apostrophes).
 */
export function sanitizeCustomerName(input: unknown, maxLength = 80): string {
  const clean = sanitizePlainText(input, maxLength);
  return clean.replace(/[^\p{L}\p{M}\s.'-]/gu, '').trim().slice(0, maxLength);
}

/**
 * Sanitizes a phone number to safe digits and optional leading '+'.
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') return '';
  const stripped = input.replace(/[^\d+]/g, '').slice(0, 16);
  return stripped;
}

/**
 * Sanitizes a booking ID (alphanumeric and hyphens only).
 */
export function sanitizeBookingId(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 36);
}

/**
 * Detects whether a raw URL path or query string contains known hacker/scanner exploit probes.
 */
export function isMaliciousRequestProbe(pathname: string, search: string): boolean {
  const decoded = (() => {
    try {
      return decodeURIComponent(`${pathname}${search}`).toLowerCase();
    } catch {
      return `${pathname}${search}`.toLowerCase();
    }
  })();

  // Path traversal or null byte injection
  if (
    decoded.includes('../') ||
    decoded.includes('..\\') ||
    decoded.includes('%00') ||
    decoded.includes('\0')
  ) {
    return true;
  }

  // Known scanner/exploit targets
  const blockedPrefixes = [
    '/.env',
    '/.git',
    '/.svn',
    '/.aws',
    '/.ssh',
    '/wp-admin',
    '/wp-login',
    '/wp-content',
    '/wp-includes',
    '/xmlrpc.php',
    '/phpmyadmin',
    '/pma',
    '/admin.php',
    '/config.php',
    '/cgi-bin',
    '/actuator',
    '/vendor/phpunit',
    '/boaform',
    '/hnap1',
  ];

  const lowerPath = pathname.toLowerCase();
  for (const prefix of blockedPrefixes) {
    if (lowerPath === prefix || lowerPath.startsWith(`${prefix}/`) || lowerPath.startsWith(`${prefix}.`)) {
      return true;
    }
  }

  // XSS / SQLi in query parameters
  if (
    decoded.includes('<script') ||
    decoded.includes('javascript:') ||
    decoded.includes('union select') ||
    decoded.includes('pg_sleep(') ||
    decoded.includes('1=1--') ||
    decoded.includes('etc/passwd') ||
    decoded.includes('win.ini')
  ) {
    return true;
  }

  return false;
}

// --- Client-Side Action Cooldown Guard (Anti-Spam / Bulk Bot Submission Protection) ---
const clientActionTimestamps = new Map<string, number[]>();

/**
 * Protects client-side mutations (e.g., booking creation, review submission)
 * from rapid-fire automated script abuse while allowing normal user operation.
 */
export function checkClientActionCooldown(
  actionKey: string,
  maxActionsPerWindow = 5,
  windowMs = 60_000
): { allowed: boolean; waitSeconds: number } {
  const now = Date.now();
  const history = (clientActionTimestamps.get(actionKey) || []).filter(
    (ts) => now - ts < windowMs
  );

  if (history.length >= maxActionsPerWindow) {
    const oldest = history[0] || now;
    const waitSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    return { allowed: false, waitSeconds };
  }

  history.push(now);
  clientActionTimestamps.set(actionKey, history);
  return { allowed: true, waitSeconds: 0 };
}
