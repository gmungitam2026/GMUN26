import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AboutTabs } from "@/components/sections/AboutTabs";

export const metadata: Metadata = {
  title: "About",
  description:
    "About GMUN, GITAM Deemed to be University, Visakhapatnam, and Model United Nations.",
};

export default function AboutPage() {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">About</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl text-ivory md:text-5xl">
          The people, institution, and format behind GMUN 5.0.
        </h1>
      </Container>

      <Container className="mt-16 md:mt-20">
        <AboutTabs />
      </Container>
    </div>
  );
}
