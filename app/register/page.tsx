import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for GMUN 5.0.",
};

export default function RegisterPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <Container className="max-w-3xl">
        <RegistrationWizard />
      </Container>
    </div>
  );
}
