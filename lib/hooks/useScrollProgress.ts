"use client";

import { useSyncExternalStore } from "react";

// Cached at module scope and only recomputed from the scroll/resize
// listener — never fresh inside getSnapshot. useSyncExternalStore calls
// getSnapshot several times per render to detect changes, so a value
// that's fresh every call reads as a constantly-changing store and loops
// (this is what broke TimelineBar's clock before it was fixed the same
// way).
let cachedProgress = 0;
const listeners = new Set<() => void>();
let rafId: number | null = null;
let bound = false;

function computeProgress() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function scheduleUpdate() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    cachedProgress = computeProgress();
    listeners.forEach((listener) => listener());
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (!bound) {
    bound = true;
    cachedProgress = computeProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && bound) {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      bound = false;
    }
  };
}

function getSnapshot() {
  return cachedProgress;
}

function getServerSnapshot() {
  return 0;
}

/** 0 at the top of the page, 1 at the bottom. */
export function useScrollProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
