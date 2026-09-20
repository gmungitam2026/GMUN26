import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { GoogleSignInButton } from "./GoogleSignInButton";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

const errorMessages: Record<string, string> = {
  not_configured: "No Supabase project is connected in this environment yet, so admin sign-in isn't available.",
  not_authorized: "That Google account is not authorized for admin access.",
  oauth_failed: "Google sign-in failed. Please try again.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <Container className="max-w-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">GMUN 5.0</p>
        <h1 className="mt-3 font-display text-3xl text-ivory">Admin Sign In</h1>
        <p className="mt-3 text-sm text-ivory-dim">
          Sign in with a Google account that has been authorized for admin access.
        </p>

        <div className="mt-10">
          <GoogleSignInButton redirectError={error ? errorMessages[error] : undefined} />
        </div>
      </Container>
    </div>
  );
}
