"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";

const paymentStatuses = ["PENDING", "PAID", "CANCELLED"];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-wrap items-end gap-4 border-b border-line pb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("q", query);
        }}
        className="flex-1 min-w-[220px]"
      >
        <label htmlFor="admin-search" className="mb-1.5 block text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
          Search
        </label>
        <input
          id="admin-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, email, phone, or registration ID"
          className="h-10 w-full border border-line bg-transparent px-3 text-sm text-ivory placeholder:text-ivory-faint focus-visible:border-gold"
        />
      </form>

      <div>
        <label htmlFor="committee-filter" className="mb-1.5 block text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
          Committee
        </label>
        <select
          id="committee-filter"
          defaultValue={searchParams.get("committee") ?? ""}
          onChange={(e) => updateParam("committee", e.target.value)}
          className="h-10 border border-line bg-ink px-3 text-sm text-ivory"
        >
          <option value="">All</option>
          {committees.map((c) => (
            <option key={c.id} value={c.id}>
              {c.shortName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status-filter" className="mb-1.5 block text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
          Status
        </label>
        <select
          id="status-filter"
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="h-10 border border-line bg-ink px-3 text-sm text-ivory"
        >
          <option value="">All</option>
          {paymentStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="package-filter" className="mb-1.5 block text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
          Package
        </label>
        <select
          id="package-filter"
          defaultValue={searchParams.get("package") ?? ""}
          onChange={(e) => updateParam("package", e.target.value)}
          className="h-10 border border-line bg-ink px-3 text-sm text-ivory"
        >
          <option value="">All</option>
          {registrationPackages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
