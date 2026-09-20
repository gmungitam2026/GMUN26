import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about registration, payment, committees, and the GMUN 5.0 conference.",
};

export default function FaqPage() {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">FAQs</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl text-ivory md:text-5xl">
          Everything you need to know.
        </h1>
      </Container>

      <Container className="mt-16 max-w-4xl md:mt-20">
        <FaqAccordion />
      </Container>
    </div>
  );
}
