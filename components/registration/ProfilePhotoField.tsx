"use client";

import { useEffect, useMemo } from "react";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/registration/photo";

/** Object URL for a local file, revoked when the file changes or on unmount. */
export function useFilePreview(file: File | null) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);
  return url;
}

export function ProfilePhotoField({
  file,
  error,
  processing,
  onSelect,
}: {
  file: File | null;
  error?: string;
  processing?: boolean;
  onSelect: (file: File | null) => void;
}) {
  const preview = useFilePreview(file);

  return (
    <div>
      <p className="mb-2 text-[13px] uppercase tracking-[0.08em] text-ivory-dim">Profile Photo</p>
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-line-strong bg-surface-raised">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
            <img src={preview} alt="Your profile photo" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 96 96" className="h-full w-full text-ivory/10" fill="currentColor" aria-hidden>
              <circle cx="48" cy="38" r="16" />
              <path d="M16 90c0-18 14-30 32-30s32 12 32 30z" />
            </svg>
          )}
        </div>
        <div>
          <label
            htmlFor="profilePhoto"
            className="inline-flex h-10 cursor-pointer items-center border border-gold px-5 text-[12px] font-medium uppercase tracking-[0.1em] text-gold transition-colors hover:bg-gold-fill hover:text-ink"
          >
            {processing ? "Processing…" : file ? "Change Photo" : "Upload Photo"}
          </label>
          <input
            id="profilePhoto"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              onSelect(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          <p className="mt-2 text-xs text-ivory-faint">A clear, front-facing photo · JPG, PNG or WebP · under 5 MB</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
