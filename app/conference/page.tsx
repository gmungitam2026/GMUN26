import type { Metadata } from "next";
import { site } from "@/config/site";
import { venueAndAccommodation, travel } from "@/config/conference";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ConferenceTimeline } from "@/components/sections/ConferenceTimeline";
import { AssemblyHallMotif } from "@/components/sections/AssemblyHallMotif";

export const metadata: Metadata = {
  title: "Conference",
  description: "Conference proceedings, venue, accommodation, and travel information for GMUN 5.0.",
};

export default function ConferencePage() {
  return (
    <div className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <AssemblyHallMotif className="absolute inset-x-0 top-0 h-[560px] w-full opacity-[0.14]" />
      <Container className="relative">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Conference</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl text-ivory md:text-5xl">GMUN 5.0</h1>
        <p className="mt-4 font-display text-lg text-ivory-dim">
          {site.dates.display} · {site.venue.name}, {site.venue.line2}
        </p>
      </Container>

      <Container className="mt-20 md:mt-24">
        <Reveal>
          <SectionHeading eyebrow="Proceedings" title="A two-day arc, session by session." />
        </Reveal>
        <div className="mt-12">
          <ConferenceTimeline />
        </div>
      </Container>

      <Container className="mt-24 border-t border-line pt-20 md:mt-32 md:pt-24">
        <div className="grid gap-14 md:grid-cols-2 md:gap-10">
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
      </Container>

      <Container className="mt-24 border-t border-line pt-20 md:mt-32 md:pt-24">
        <Reveal>
          <SectionHeading eyebrow="Getting Here" title={travel.heading} />
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-dim">{travel.intro}</p>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {travel.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gold">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory-dim">{item.value}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
