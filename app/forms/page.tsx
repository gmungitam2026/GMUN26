import type { Metadata } from "next";
import Link from "next/link";
import { delegateForms } from "@/config/forms";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Forms & Documents",
  description: "Mandatory forms and documents for GMUN 5.0 delegates.",
};

export default function FormsPage() {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Forms &amp; Documents</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl text-ivory md:text-5xl">
          Read before you register.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-dim">
          Every delegate is expected to read and agree to the following. You confirm your
          agreement to both during registration — this page just makes them easy to read, print,
          or save on their own.
        </p>
      </Container>

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
