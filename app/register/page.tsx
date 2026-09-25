import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { gmunPhotos } from "@/config/photos";
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
      <div className="pb-24 md:pb-32">
        <PageHeader photo={gmunPhotos.p1} eyebrow="Registration" title="Registrations are closed.">
          <p>
            GMUN 5.0 registration is not currently open. Check back soon, or contact the Organising
            team if you believe this is an error.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="secondary">
              Contact Organisers
            </Button>
          </div>
        </PageHeader>
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
