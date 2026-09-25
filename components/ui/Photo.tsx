import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { Photo as PhotoData } from "@/config/photos";

/**
 * A framed photo that fills its box (give it an aspect ratio or height via
 * className). Slowly zooms on hover and drifts with scroll where supported.
 * Photo credits are listed on the /credits page, not on the photo.
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
    </div>
  );
}
