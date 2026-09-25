import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { committees } from "@/config/committees";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { committeeLogos, committeePhotos, gmunPhotos } from "@/config/photos";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  return committees.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/committees/[id]">): Promise<Metadata> {
  const { id } = await params;
  const committee = committees.find((c) => c.id === id);
  if (!committee) return {};
  return {
    title: committee.shortName,
    description: committee.agenda,
  };
}

export default async function CommitteeDetailPage({ params }: PageProps<"/committees/[id]">) {
  const { id } = await params;
  const committee = committees.find((c) => c.id === id);
  if (!committee) notFound();

  return (
    <div className="pb-24 md:pb-32">
      <PageHeader
        photo={committeePhotos[committee.id] ?? gmunPhotos.p7}
        eyebrow={committee.type + " Committee"}
        title={committee.shortName}
        logo={committeeLogos[committee.id] ? { src: committeeLogos[committee.id], alt: `${committee.shortName} emblem` } : undefined}
      >
        <p className="text-lg text-ivory">{committee.name}</p>
        {committee.governingBody && <p className="mt-1 text-sm text-ivory-faint">{committee.governingBody}</p>}
      </PageHeader>

      <Container>
        <Link href="/committees" className="text-[11px] uppercase tracking-[0.14em] text-ivory-faint hover:text-gold">
          ← All Committees
        </Link>

        <div className="mt-10 border-t border-line pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Agenda</p>
          <p className="mt-3 max-w-2xl font-display text-xl leading-snug text-ivory">{committee.agenda}</p>
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
          <div className="border-t border-line pt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Overview</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ivory-dim">{committee.description}</p>
          </div>

          <div className="space-y-8 border-t border-line pt-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Committee Type</p>
              <p className="mt-2 text-ivory">{committee.type}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Study Guide</p>
              <p className="mt-2 text-sm text-ivory-faint">
                {committee.studyGuideUrl ?? "To be released closer to the conference."}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Executive Board</p>
              <p className="mt-2 text-sm text-ivory-faint">To be announced.</p>
            </div>
            <Button href={`/register?committee=${committee.id}`} size="md" className="w-full">
              Register for this Committee
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
