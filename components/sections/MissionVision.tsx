import { missionVision } from "@/config/about";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function MissionVision() {
  return (
    <section className="border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Mission &amp; Vision" title="A platform for young minds to engage, debate, and lead." />
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="space-y-6">
            {missionVision.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-[15px] leading-relaxed text-ivory-dim md:text-base">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="lg:sticky lg:top-32">
              <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
                What we value
              </p>
              <ul className="space-y-0 border-t border-line">
                {missionVision.highlights.map((h) => (
                  <li key={h} className="border-b border-line py-4 font-display text-xl text-ivory">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
