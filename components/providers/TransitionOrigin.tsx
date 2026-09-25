"use client";

import { useEffect } from "react";

/**
 * Records where the visitor last pressed, as CSS variables on <html>, so the
 * page transition (globals.css, "Page transitions") can open the next page as
 * a circle from that exact point. --vt-oy adds the scroll offset, for scaling
 * the outgoing page (whose snapshot starts at the top of the document).
 */
export function TransitionOrigin() {
  useEffect(() => {
    const root = document.documentElement;
    const set = (x: number, y: number) => {
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty("--vt-oy", `${y + window.scrollY}px`);
    };
    const onPointer = (e: PointerEvent) => set(e.clientX, e.clientY);
    // Keyboard navigation: open from the focused element's centre.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const el = document.activeElement?.getBoundingClientRect();
      if (el) set(el.left + el.width / 2, el.top + el.height / 2);
    };
    document.addEventListener("pointerdown", onPointer, { capture: true, passive: true });
    document.addEventListener("keydown", onKey, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onPointer, { capture: true });
      document.removeEventListener("keydown", onKey, { capture: true });
    };
  }, []);
  return null;
}
