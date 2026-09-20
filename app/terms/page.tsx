import type { Metadata } from "next";
import { termsIntro, termsSections } from "@/config/terms";
import { Container } from "@/components/ui/Container";
import { Glyph } from "@/components/ui/Glyph";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for GMUN 5.0.",
};

export default function TermsPage() {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container className="max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Legal</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">
          GMUN 5.0<Glyph />Terms and Conditions
        </h1>
        <p className="mt-3 text-sm text-ivory-faint">
          GITAM Model United Nations (GMUN), GITAM (Deemed to be University), Visakhapatnam
        </p>
        <p className="mt-8 text-[15px] leading-relaxed text-ivory-dim">{termsIntro}</p>

        <div className="mt-14 space-y-12">
          {termsSections.map((section, i) => (
            <div key={i} className="border-t border-line pt-8">
              {section.title && (
                <h2 className="font-display text-xl text-ivory">
                  {section.number}. {section.title}
                </h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="mt-4 text-sm leading-relaxed text-ivory-dim">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ivory-dim">
                  {section.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
