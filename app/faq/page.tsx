import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { gmunPhotos } from "@/config/photos";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about registration, payment, committees, and the GMUN 5.0 conference.",
};

export default function FaqPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageHeader photo={gmunPhotos.p2} eyebrow="FAQs" title="Everything you need to know." />

      <Container className="mt-16 max-w-4xl md:mt-20">
        <FaqAccordion />
      </Container>
    </div>
  );
}
