import type { Metadata } from "next";
import { contact } from "@/config/contact";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact the GMUN 5.0 organising team.",
};

export default function ContactPage() {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Contact Us</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl text-ivory md:text-5xl">
          Questions about GMUN 5.0?
        </h1>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory-dim">
          Reach the Organising team directly, or write to the general conference inbox for any
          query about registration, committees, or {site.venue.name}.
        </p>
      </Container>

      <Container className="mt-16 md:mt-20">
        <div className="grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">General Enquiries</p>
            <a href={`mailto:${contact.email}`} className="mt-3 block font-display text-xl text-ivory hover:text-gold">
              {contact.email}
            </a>
          </Reveal>

          {contact.team.map((p, i) => (
            <Reveal key={p.name} delay={(i + 1) * 0.08}>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">{p.role}</p>
              <p className="mt-3 font-display text-xl text-ivory">{p.name}</p>
              <a href={`tel:+91${p.phone}`} className="mt-1 block text-sm text-ivory-dim hover:text-gold">
                {p.phone}
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
