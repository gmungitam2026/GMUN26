# GMUN 5.0 — GITAM Model United Nations

Public website and registration/payment/admin platform for GMUN 5.0
(24–25 October 2026, GITAM Deemed to be University, Visakhapatnam).

Next.js (App Router) + TypeScript + Tailwind CSS, with Supabase Postgres,
a pluggable payment-provider abstraction, and an admin dashboard.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. No Supabase project or payment gateway is
required to browse the public site or click through the registration UI —
registration/payment/admin features degrade to clear "not configured"
states until real credentials are supplied (see below).

## Configuring Supabase

1. Create a Supabase project.
2. Run the migration in `supabase/migrations/0001_init.sql` against it
   (via `supabase db push`, or paste it into the SQL editor). It creates the
   schema, RLS policies, and seeds committees + the current registration
   package.
3. Copy `.env.example` to `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` (server-only — never commit it).
4. Create an admin user in Supabase Auth, then insert a matching row into
   `admin_profiles` (id must match the auth user's id) so that account can
   sign in at `/admin/login`.

## Payments

No payment gateway has been finalized for GMUN 5.0. The app defaults to a
built-in **mock provider** (`lib/payments/mock.ts`) so the registration flow
can be exercised end-to-end without any gateway. Real adapters exist for
Razorpay, Cashfree, and a Payment Link fallback (`lib/payments/`), built
against each provider's interface but not "selected" — set `PAYMENT_PROVIDER`
in the environment (`razorpay` | `cashfree` | `payment-link`) and the
matching credentials once a provider is chosen. Registration/payment code
depends only on the shared `PaymentProvider` interface
(`lib/payments/types.ts`), so switching providers never touches registration
logic.

The registration fee itself is configuration, not a hardcoded UI string —
see `config/pricing.ts`. It currently reflects the client requirements
document (₹600); update that file (or migrate pricing to the
`registration_packages` table) once pricing is finalized.

## Project layout

- `app/` — routes (public site, `/register`, `/confirmation/[id]`, `/admin`, API routes)
- `components/` — UI, navigation, hero, sections, registration, committees, admin
- `config/` — all client-supplied content (site, nav, committees, FAQ, conference, terms, pricing, contact)
- `lib/supabase/` — browser/server/admin Supabase clients + admin auth DAL
- `lib/payments/` — payment provider abstraction + adapters
- `lib/email/` — email provider abstraction (no provider wired yet)
- `lib/excel/` — Excel export (SheetJS)
- `supabase/migrations/` — SQL schema, RLS, seed data

## What's intentionally left TBD

Gallery photography, testimonials, Executive Board names, exact session
timings, accommodation pricing, and social media URLs were not supplied by
the client and are represented as configurable/"TBA" states
(`config/gallery.ts`, `config/testimonials.ts`, `config/conference.ts`,
`config/contact.ts`) rather than invented.

## Commands

```bash
npm run dev     # start dev server
npm run build   # production build
npm run lint    # ESLint
```
