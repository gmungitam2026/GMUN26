import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { committees } from "@/config/committees";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Registration Confirmation",
};

export default async function ConfirmationPage({
  params,
}: PageProps<"/confirmation/[registrationId]">) {
  const { registrationId } = await params;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return (
      <StatusShell
        heading="Registration storage is not configured"
        body="No Supabase project is connected in this environment yet, so registration status can't be looked up. This page will work once Supabase credentials are set."
      />
    );
  }

  const { data: registration } = await supabase
    .from("registrations")
    .select("id, registration_id, full_name, committee_preference, status")
    .eq("registration_id", registrationId)
    .maybeSingle();

  if (!registration) notFound();

  const committee = committees.find((c) => c.id === registration.committee_preference);

  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container className="max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Success</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          {registration.status === "PAYMENT_CONFIRMED" ? "Payment confirmed." : "Registration submitted."}
        </h1>
        <p className="mt-4 text-lg text-ivory-dim">{registration.full_name}</p>

        <div className="mt-10 divide-y divide-line border-y border-line">
          <Row label="Registration ID" value={registration.registration_id} />
          <Row label="Committee" value={committee?.shortName ?? registration.committee_preference} />
          <Row label="Payment Status" value={formatStatus(registration.status)} />
        </div>

        <div className="mt-10 space-y-4 text-sm leading-relaxed text-ivory-dim">
          <p>
            Your submission has been recorded against registration ID{" "}
            <span className="text-ivory">{registration.registration_id}</span>. Committee allocation,
            portfolio, study guides, and further conference instructions will be shared after the
            organising team verifies your payment.
          </p>
          <p>
            For any questions, contact the Organising team at{" "}
            <a href="mailto:gmun@gitam.in" className="text-gold">
              gmun@gitam.in
            </a>
            .
          </p>
        </div>

        <div className="mt-10">
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/^\w/, (character) => character.toUpperCase());
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-sm text-ivory-faint">{label}</span>
      <span className="font-display text-lg text-ivory">{value}</span>
    </div>
  );
}

function StatusShell({
  heading,
  body,
  registrationId,
}: {
  heading: string;
  body: string;
  registrationId?: string;
}) {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container className="max-w-xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
          {site.name} Registration
        </p>
        <h1 className="mt-4 font-display text-3xl text-ivory md:text-4xl">{heading}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ivory-dim">{body}</p>
        {registrationId && <p className="mt-4 text-sm text-ivory-faint">Registration ID: {registrationId}</p>}
        <div className="mt-10 flex gap-4">
          <Button href="/contact" variant="secondary">
            Contact Organisers
          </Button>
          <Link href="/" className="flex items-center text-sm text-ivory-dim hover:text-gold">
            Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
