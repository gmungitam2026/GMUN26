import type { Metadata } from "next";
import { site } from "@/config/site";
import { venueAndAccommodation, travel } from "@/config/conference";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ConferenceTimeline } from "@/components/sections/ConferenceTimeline";
import { PageHeader } from "@/components/ui/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { gmunPhotos, gitamCampusPhoto } from "@/config/photos";
import { aboutVizag } from "@/config/about";

export const metadata: Metadata = {
  title: "Conference",
  description: "Conference proceedings, venue, accommodation, and travel information for GMUN 5.0.",
};

export default function ConferencePage() {
  return (
    <div className="relative overflow-hidden pb-24 md:pb-32">
      <PageHeader photo={gmunPhotos.p4} eyebrow="Conference" title="GMUN 5.0">
        <span className="font-display text-lg">
          {site.dates.display} · {site.venue.name}, {site.venue.line2}
        </span>
      </PageHeader>

      <Container className="mt-20 md:mt-24">
        <Reveal>
          <SectionHeading eyebrow="Proceedings" title="A two-day arc, session by session." />
        </Reveal>
        <div className="mt-12">
          <ConferenceTimeline />
        </div>
      </Container>

      <Container className="mt-24 border-t border-line pt-20 md:mt-32 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1fr] md:gap-16">
          <Reveal>
            <Photo photo={gitamCampusPhoto} className="aspect-[4/5]" sizes="(min-width: 768px) 45vw, 100vw" />
          </Reveal>
          <div className="space-y-12">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
                {venueAndAccommodation.venue.heading}
              </p>
              <p className="mt-4 max-w-md font-display text-2xl text-ivory">
                {venueAndAccommodation.venue.body}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
                {venueAndAccommodation.accommodation.heading}
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ivory-dim">
                {venueAndAccommodation.accommodation.body}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>

      <Container className="mt-24 border-t border-line pt-20 md:mt-32 md:pt-24">
        <Reveal>
          <SectionHeading eyebrow="Getting Here" title={travel.heading} />
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-dim">{travel.intro}</p>
        </Reveal>
        <Reveal>
          <Photo
            photo={aboutVizag.landmarks[0].image}
            className="mt-12 aspect-[16/9] md:aspect-[21/8]"
            sizes="(min-width: 1400px) 1300px, 100vw"
          />
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {travel.items.map((item, i) => (
            <Reveal key={item.label} delay={(i % 3) * 0.05} className="h-full">
              <div className="flex h-full flex-col border border-line p-6 transition-colors hover:border-gold">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold">{item.label}</p>
                <p className="mt-3 font-display text-xl leading-snug text-ivory">{item.name}</p>
                {item.distance && (
                  <p className="mt-2 text-xs uppercase tracking-[0.08em] text-ivory-faint">{item.distance}</p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-ivory-dim">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
