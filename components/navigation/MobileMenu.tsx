"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { primaryNav, registerNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 bg-ink/98 md:hidden"
        >
          <motion.nav
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full flex-col justify-between px-6 pt-28 pb-10"
          >
            <ul className="flex flex-col gap-1">
              {primaryNav.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block border-b border-line py-4 font-display text-3xl text-ivory transition-colors",
                      pathname === item.href && "text-gold"
                    )}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-6">
              <Link
                href={registerNav.href}
                className="flex h-14 items-center justify-center bg-gold text-[13px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                {registerNav.label} Now
              </Link>
              <p className="text-center text-xs text-ivory-faint">
                GMUN 5.0 · 24–25 October 2026 · GITAM, Visakhapatnam
              </p>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
