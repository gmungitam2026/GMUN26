import { testimonials } from "@/config/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Continuously scrolling cards (shared `.marquee` CSS, see globals.css):
 * pauses on hover, and becomes a manually scrollable row under
 * prefers-reduced-motion. Items are rendered twice for a seamless loop.
 */
function Marquee({
  children,
  count,
}: {
  children: (copy: number) => React.ReactNode;
  count: number;
}) {
  return (
    <div className="marquee-viewport relative z-40 overflow-hidden">
      <div
        className="marquee flex w-max"
        style={{ animationDuration: `${count * 8}s` }}
      >
        {[0, 1].map((copy) => children(copy))}
      </div>
    </div>
  );
}

const cardClass =
  "mr-4 flex w-[300px] flex-none flex-col border border-line bg-surface-raised p-7 sm:w-[360px]";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="In Their Words" title="What Delegates Say" />
        </Reveal>
      </Container>

      <div className="mt-16">
        <Marquee count={testimonials.length}>
          {(copy) =>
            testimonials.map((t) => (
              <blockquote key={`${copy}-${t.name}`} aria-hidden={copy === 1 || undefined} className={cardClass}>
                <span className="font-display text-4xl leading-none text-gold" aria-hidden>
                  &ldquo;
                </span>
                <p className="mt-2 flex-1 font-display text-lg leading-snug text-ivory">{t.quote}</p>
                <footer className="mt-6 flex items-center text-sm text-ivory-faint">
                  {t.name}
                  <Glyph className="mx-2.5" />
                  {t.role}
                </footer>
              </blockquote>
            ))
          }
        </Marquee>
      </div>
    </section>
  );
}
