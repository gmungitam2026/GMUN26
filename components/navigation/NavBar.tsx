"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, registerNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || menuOpen ? "bg-ink/90 backdrop-blur-sm border-b border-line" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logos/gmun-club-logo.jpg" alt="GMUN Club" width={36} height={36} className="h-9 w-9 rounded-sm" />
          <span className="font-display text-xl tracking-wide text-ivory">
            GMUN <span className="text-gold">5.0</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-[13px] font-medium uppercase tracking-[0.12em] text-ivory-dim transition-colors hover:text-ivory",
                    pathname === item.href && "text-gold hover:text-gold"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link
            href={registerNav.href}
            className="hidden h-10 items-center justify-center border border-gold px-5 text-[13px] font-medium uppercase tracking-[0.12em] text-gold transition-colors hover:bg-gold-fill hover:text-ink md:inline-flex"
          >
            {registerNav.label}
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={cn(
                "h-px w-5 bg-ivory transition-transform duration-300",
                menuOpen && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={cn("h-px w-5 bg-ivory transition-opacity duration-200", menuOpen && "opacity-0")}
            />
            <span
              className={cn(
                "h-px w-5 bg-ivory transition-transform duration-300",
                menuOpen && "-translate-y-[6px] -rotate-45"
              )}
            />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
