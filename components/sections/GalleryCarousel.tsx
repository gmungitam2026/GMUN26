import Image from "next/image";
import type { GalleryImage } from "@/config/gallery";

/**
 * Continuous, hands-off photo strip. Every photo shares one row height and
 * keeps its own aspect ratio, so nothing is cropped. The list is rendered
 * twice and the track slides left by exactly one copy (-50%) per cycle, so
 * the loop is seamless. Pure CSS (see `.gallery-marquee` in globals.css):
 * pauses on hover, and under prefers-reduced-motion it becomes a plain
 * horizontally scrollable row instead.
 */
export function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  // Roughly 6s per photo keeps the pace calm regardless of how many there are.
  const duration = `${images.length * 6}s`;

  return (
    <div className="gallery-marquee-viewport relative mt-16 overflow-hidden">
      <div className="gallery-marquee flex w-max" style={{ animationDuration: duration }}>
        {[0, 1].map((copy) =>
          images.map((img) => (
            <figure
              key={`${copy}-${img.src}`}
              aria-hidden={copy === 1 || undefined}
              className="relative mr-3 h-[220px] flex-none overflow-hidden border border-line sm:h-[300px] lg:h-[380px]"
              style={{ aspectRatio: `${img.width} / ${img.height}` }}
            >
              <Image
                src={img.src}
                alt={copy === 0 ? img.alt : ""}
                fill
                sizes="(min-width: 1024px) 680px, (min-width: 640px) 540px, 400px"
                className="object-cover"
              />
            </figure>
          ))
        )}
      </div>
    </div>
  );
}
