import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { sessionOnly } from "@/lib/supabase/session-cookies";

/**
 * Refreshes the Supabase auth session cookie on every request and performs
 * an optimistic redirect for unauthenticated visits to /admin/*. This is a
 * fast, cookie-only check — the real authorization check (is this user in
 * admin_profiles?) happens server-side in the admin layout, per the Next.js
 * guidance that Proxy/Middleware is not a full session/authorization layer.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (request.nextUrl.pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    callbackUrl.searchParams.set("next", "/admin");
    return NextResponse.redirect(callbackUrl);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, sessionOnly(options)));
      },
    },
  });

  let user = null;
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch (error) {
    // A rotated or revoked refresh token must not block a fresh OAuth login.
    if (error instanceof Error && error.message.includes("Refresh Token")) {
      request.cookies.getAll().forEach(({ name }) => {
        if (name.startsWith("sb-") && name.includes("auth-token")) {
          response.cookies.set(name, "", { maxAge: 0, path: "/" });
        }
      });
    }
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
