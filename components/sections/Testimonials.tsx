import { testimonials } from "@/config/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Glyph } from "@/components/ui/Glyph";

export function Testimonials() {
  return (
    <section className="border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="In Their Words" title="From delegates, chairs, and the GMUN community." />
        </Reveal>

        {testimonials.length > 0 ? (
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <blockquote className="border-t border-gold pt-6">
                  <p className="font-display text-lg leading-snug text-ivory">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-4 flex items-center text-sm text-ivory-faint">
                    {t.name}
                    <Glyph className="mx-2.5" />
                    {t.role}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <div className="mt-16 border-t border-line pt-10">
              <p className="max-w-xl text-[15px] leading-relaxed text-ivory-dim">
                Testimonials from delegates, chairs, and students are coming soon,
                shared once GMUN 5.0 has taken place.
              </p>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
