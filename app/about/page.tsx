import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { gmunPhotos } from "@/config/photos";
import { AboutTabs } from "@/components/sections/AboutTabs";

export const metadata: Metadata = {
  title: "About",
  description:
    "About GMUN, GITAM Deemed to be University, Visakhapatnam, and Model United Nations.",
};

export default function AboutPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageHeader photo={gmunPhotos.p5} eyebrow="About" title="The people, institution, and format behind GMUN 5.0." />

      <Container className="mt-16 md:mt-20">
        <AboutTabs />
      </Container>
    </div>
  );
}
