"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface AccommodationNoticeModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccommodationNoticeModal({ open, onClose }: AccommodationNoticeModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="accommodation-notice-title"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === dialog.current) {
          onClose();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(92vw,520px)] border border-gold bg-surface p-0 text-ivory shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-7 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded p-2 text-ivory-dim transition-colors hover:bg-gold/10 hover:text-ivory"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-gold" />
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
            Accommodation &amp; Travel Notice
          </p>
        </div>

        <h2 id="accommodation-notice-title" className="mt-3 font-display text-2xl text-ivory sm:text-3xl">
          Important Travel Advisory
        </h2>

        <div className="mt-5 border-l-2 border-gold bg-gold/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            NOTE:
          </p>
          <p className="mt-1.5 font-display text-base font-semibold uppercase leading-snug tracking-wide text-ivory sm:text-lg">
            PLAN YOUR TRAVEL LIKE YOU REACH GITAM UNIVERSITY ON 24TH MORNING AND LEAVING ON 25TH NIGHT.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ivory-dim">
            If any queries reach out to the organising team for extended stay only then arrangements will be made.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => {
              dialog.current?.close();
              onClose();
            }}
          >
            I Understand &amp; Agree
          </Button>
        </div>
      </div>
    </dialog>
  );
}
