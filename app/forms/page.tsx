import type { Metadata } from "next";
import Link from "next/link";
import { delegateForms } from "@/config/forms";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { gmunPhotos } from "@/config/photos";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Forms & Documents",
  description: "Mandatory forms and documents for GMUN 5.0 delegates.",
};

export default function FormsPage() {
  return (
    <div className="pb-24 md:pb-32">
      <PageHeader photo={gmunPhotos.p3} eyebrow="Forms & Documents" title="Read before you register.">
        Every delegate is expected to read and agree to the following. You confirm your
        agreement to both during registration — this page just makes them easy to read, print,
        or save on their own.
      </PageHeader>

      <Container className="mt-16 md:mt-20">
        <div className="grid gap-3 sm:grid-cols-2">
          {delegateForms.map((form, i) => (
            <Reveal key={form.id} delay={i * 0.06}>
              <Link
                href={`/forms/${form.id}`}
                className="group flex min-h-[200px] flex-col justify-between border border-line p-7 transition-colors hover:border-gold"
              >
                <div>
                  <h2 className="font-display text-2xl text-ivory group-hover:text-gold">{form.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ivory-dim">{form.summary}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-gold">
                  View Document <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
