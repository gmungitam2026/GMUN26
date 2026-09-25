/**
 * Admin sign-in must not persist. @supabase/ssr always writes its auth
 * cookies with a 400-day Max-Age (it overrides any cookieOptions we pass), so
 * every place that writes them runs the options through `sessionOnly` first.
 * Without Max-Age / Expires they become session cookies, which the browser
 * discards when it closes — the next visit asks for Google sign-in again.
 * Deletions (Max-Age 0) are passed through untouched.
 */
export function sessionOnly<T extends { maxAge?: number; expires?: Date }>(options: T): T {
  if (options.maxAge === 0) return options;
  const rest = { ...options };
  delete rest.maxAge;
  delete rest.expires;
  return rest;
}
