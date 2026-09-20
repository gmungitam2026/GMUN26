import { cn } from "@/lib/utils/cn";

/**
 * A small rotated-square mark used in place of an em dash wherever two
 * pieces of text are joined in a title or attribution line — a quiet
 * diplomatic-seal motif instead of a punctuation character.
 */
export function Glyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("mx-3 inline-block h-[7px] w-[7px] rotate-45 border border-gold align-middle", className)}
    />
  );
}
