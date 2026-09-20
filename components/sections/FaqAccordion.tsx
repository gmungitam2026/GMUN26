"use client";

import { useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqItems } from "@/config/faq";
import { cn } from "@/lib/utils/cn";

export function FaqAccordion() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const inputId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqItems;
    return faqItems.filter(
      (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <div className="relative max-w-md">
        <label htmlFor={inputId} className="sr-only">
          Search frequently asked questions
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="h-12 w-full border border-line bg-transparent px-4 text-sm text-ivory placeholder:text-ivory-faint focus-visible:border-gold"
        />
      </div>

      <p className="mt-4 text-xs text-ivory-faint">
        {filtered.length} of {faqItems.length} questions
      </p>

      <div className="mt-6 border-t border-line">
        {filtered.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.question} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-lg text-ivory">{item.question}</span>
                  <span
                    className={cn(
                      "shrink-0 text-xl text-gold transition-transform duration-300",
                      isOpen && "rotate-45"
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ivory-dim">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-10 text-sm text-ivory-faint">No questions match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
