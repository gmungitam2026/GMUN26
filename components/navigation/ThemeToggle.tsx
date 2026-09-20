"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "gmun-theme";

const listeners = new Set<() => void>();
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function notify() {
  listeners.forEach((l) => l());
}
function getIsLightClient() {
  return document.documentElement.dataset.theme === "light";
}
function getIsLightServer() {
  return false;
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.5 12H2M22 12h-2.5M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const isLight = useSyncExternalStore(subscribe, getIsLightClient, getIsLightServer);

  function toggle() {
    const next = !isLight;
    document.documentElement.dataset.theme = next ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist.
    }
    notify();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="flex h-9 w-9 items-center justify-center border border-line-strong text-ivory-dim transition-colors hover:border-gold hover:text-gold"
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

/** Inline, blocking script for the document head — applies a saved theme
 * before first paint so there's no flash of the wrong theme on load. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;
