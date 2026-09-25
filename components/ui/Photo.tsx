import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { Photo as PhotoData } from "@/config/photos";
import { PhotoCredit } from "@/components/ui/PhotoCredit";

/**
 * A framed photo that fills its box (give it an aspect ratio or height via
 * className). Slowly zooms on hover, drifts with scroll where supported, and
 * shows the licence credit when the photo has one.
 */
export function Photo({
  photo,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  parallax = true,
}: {
  photo: PhotoData;
  className?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: boolean;
}) {
  return (
    <div className={cn("group relative overflow-hidden border border-line bg-surface", className)}>
      <div className={cn("absolute inset-0", parallax && "photo-parallax")}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </div>
      {photo.credit && <PhotoCredit credit={photo.credit} className="right-0 bottom-0" />}
    </div>
  );
}
