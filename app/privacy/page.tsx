import type { Metadata } from "next";
import { privacySections } from "@/config/privacy";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for GMUN 5.0.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-36 pb-24 md:pt-44 md:pb-32">
      <Container className="max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">Legal</p>
        <h1 className="mt-4 font-display text-4xl text-ivory md:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-ivory-faint">
          GITAM Model United Nations (GMUN), GITAM (Deemed to be University), Visakhapatnam
        </p>

        <div className="mt-14 space-y-10">
          {privacySections.map((section) => (
            <div key={section.title} className="border-t border-line pt-8">
              <h2 className="font-display text-xl text-ivory">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-sm leading-relaxed text-ivory-dim">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
