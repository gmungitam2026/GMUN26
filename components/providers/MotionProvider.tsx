"use client";

import { MotionConfig } from "framer-motion";

/**
 * Automatically reduces/disables Framer Motion animations for visitors with
 * prefers-reduced-motion set, on top of the CSS-level reduction in
 * globals.css (which only covers CSS transitions, not JS-driven ones).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
