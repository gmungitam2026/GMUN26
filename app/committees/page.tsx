import type { Metadata } from "next";
import { committees } from "@/config/committees";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CommitteeCard } from "@/components/committees/CommitteeCard";

export const metadata: Metadata = {
  title: "Committees",
  description: "The committees, agendas, and formats at GMUN 5.0.",
};

export default function CommitteesPage() {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Committees</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl text-ivory md:text-5xl">
          Seven committees. Seven arenas for diplomacy.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-dim">
          Executive Board details and study guides will be published here as they are finalised.
        </p>
      </Container>

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
