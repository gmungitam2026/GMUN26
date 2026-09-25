import type { Metadata } from "next";
import { committees } from "@/config/committees";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { gmunPhotos } from "@/config/photos";
import { Reveal } from "@/components/ui/Reveal";
import { CommitteeCard } from "@/components/committees/CommitteeCard";

export const metadata: Metadata = {
  title: "Committees",
  description: "The committees, agendas, and formats at GMUN 5.0.",
};

export default function CommitteesPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageHeader photo={gmunPhotos.p7} eyebrow="Committees" title="Seven committees. Seven arenas for diplomacy.">
        Executive Board details and study guides will be published here as they are finalised.
      </PageHeader>

      <Container className="mt-16 md:mt-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {committees.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.06}>
              <CommitteeCard committee={c} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
