"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * Native scroll-snap + IntersectionObserver (no Framer Motion). The
 * IntersectionObserver here only tracks which slide is centered for the
 * dot indicator — it never gates an entrance animation, so it doesn't run
 * into the whileInView/hard-load issue documented on the hero.
 */
export function GalleryCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) {
          const index = slides.indexOf(mostVisible.target as HTMLElement);
          if (index !== -1) setActive(index);
        }
      },
      { root: track, threshold: [0.6] }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div className="relative z-40 mt-16">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img) => (
          <div
            key={img.src}
            className="relative z-40 aspect-[4/5] w-[78%] flex-none snap-center overflow-hidden border border-line sm:w-[46%] lg:w-[30%]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 78vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="relative z-50 mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous photo"
          className="flex h-8 w-8 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
        >
          ‹
        </button>

        <div className="flex items-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-gold" : "w-1.5 bg-line-strong"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(images.length - 1, active + 1))}
          disabled={active === images.length - 1}
          aria-label="Next photo"
          className="flex h-8 w-8 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  );
}
