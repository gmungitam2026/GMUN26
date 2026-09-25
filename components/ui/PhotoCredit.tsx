import { cn } from "@/lib/utils/cn";
import type { PhotoCreditInfo } from "@/config/photos";

/** Attribution overlay for openly licensed photos — required by CC BY / BY-SA. */
export function PhotoCredit({ credit, className }: { credit: PhotoCreditInfo; className?: string }) {
  return (
    <a
      href={credit.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "absolute z-10 bg-black/45 px-2 py-1 text-[10px] tracking-wide text-white/75 backdrop-blur-sm transition-colors hover:text-white",
        className
      )}
    >
      Photo: {credit.author} · {credit.license}
    </a>
  );
}
