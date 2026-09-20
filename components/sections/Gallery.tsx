import Image from "next/image";
import { galleryCategories } from "@/config/gallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Gallery() {
  const hasImages = galleryCategories.some((c) => c.images.length > 0);

  return (
    <section className="border-t border-line bg-surface py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Gallery" title="Moments from the conference floor." />
        </Reveal>

        {hasImages ? (
          <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
            {galleryCategories
              .flatMap((c) => c.images)
              .map((img, i) => (
                <Reveal key={img.src} delay={(i % 4) * 0.05}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-line">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Reveal>
              ))}
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {galleryCategories.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.04}>
                <div className="group flex aspect-[4/5] flex-col justify-end border border-line p-5 transition-colors hover:border-gold">
                  <p className="font-display text-lg text-ivory">{c.label}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ivory-faint">
                    Photographs to be added
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
