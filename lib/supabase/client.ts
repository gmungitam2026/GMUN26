"use client";

import { createBrowserClient } from "@supabase/ssr";
import { sessionOnly } from "@/lib/supabase/session-cookies";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  // Custom cookie handling only to drop the 400-day expiry (see sessionOnly).
  return createBrowserClient(url, anonKey, {
    cookies: {
      getAll() {
        return document.cookie
          .split("; ")
          .filter(Boolean)
          .map((pair) => {
            const i = pair.indexOf("=");
            return { name: pair.slice(0, i), value: decodeURIComponent(pair.slice(i + 1)) };
          });
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          const o = sessionOnly(options);
          let cookie = `${name}=${encodeURIComponent(value)}; Path=${o.path ?? "/"}; SameSite=${typeof o.sameSite === "string" ? o.sameSite : "Lax"}`;
          if (o.maxAge === 0) cookie += "; Max-Age=0";
          if (o.domain) cookie += `; Domain=${o.domain}`;
          if (o.secure || location.protocol === "https:") cookie += "; Secure";
          document.cookie = cookie;
        }
      },
    },
  });
}
