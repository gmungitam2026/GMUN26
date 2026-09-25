import type { Metadata } from "next";
import { contact } from "@/config/contact";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { gmunPhotos } from "@/config/photos";
import { Reveal } from "@/components/ui/Reveal";
import { ProfilePhoto } from "@/components/ui/ProfilePhoto";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact the GMUN 5.0 organising team.",
};

export default function ContactPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageHeader photo={gmunPhotos.p6} eyebrow="Contact Us" title="Questions about GMUN 5.0?">
        Reach the Organising team directly, or write to the general conference inbox for any
        query about registration, committees, or {site.venue.name}.
      </PageHeader>

      <Container className="mt-16 md:mt-20">
        <div className="grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">General Enquiries</p>
            <a href={`mailto:${contact.email}`} className="mt-3 block font-display text-xl text-ivory hover:text-gold">
              {contact.email}
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory-dim">
              For registration, committees, payments, or partnerships, write to us and the team will get back to you.
            </p>
          </Reveal>

          {contact.team.map((p, i) => (
            <Reveal key={p.name} delay={(i + 1) * 0.08}>
              <ProfilePhoto name={p.name} src={p.photo} />
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">{p.role}</p>
              <p className="mt-2 font-display text-xl text-ivory">{p.name}</p>
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
