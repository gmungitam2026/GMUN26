import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { getRegistrationOpen } from "@/lib/admin/queries";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for GMUN 5.0.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ committee?: string }>;
}) {
  const [{ committee }, registrationOpen] = await Promise.all([searchParams, getRegistrationOpen()]);

  if (!registrationOpen) {
    return (
      <div className="pt-32 pb-24 md:pt-40 md:pb-32">
        <Container className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Registration</p>
          <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">Registrations are closed.</h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory-dim">
            GMUN 5.0 registration is not currently open. Check back soon, or contact the Organising
            team if you believe this is an error.
          </p>
          <div className="mt-10">
            <Button href="/contact" variant="secondary">
              Contact Organisers
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container className="max-w-3xl">
        <RegistrationWizard initialCommittee={committee} />
      </Container>
    </div>
  );
}
