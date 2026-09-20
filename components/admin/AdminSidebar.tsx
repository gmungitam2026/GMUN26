"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { signOutAdmin } from "@/lib/admin/actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/committees", label: "Committees" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col justify-between border-r border-line px-6 py-8">
      <div>
        <Link href="/admin" className="font-display text-lg text-ivory">
          GMUN <span className="text-gold">Admin</span>
        </Link>
        <nav className="mt-10">
          <ul className="space-y-1">
            {links.map((link) => {
              const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-3 py-2 text-[13px] uppercase tracking-[0.08em] text-ivory-dim transition-colors hover:text-ivory",
                      active && "border-l border-gold bg-surface-raised pl-[11px] text-gold hover:text-gold"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div>
        <p className="mb-3 truncate text-xs text-ivory-faint">{adminName}</p>
        <form action={signOutAdmin}>
          <button type="submit" className="text-[13px] uppercase tracking-[0.08em] text-ivory-dim hover:text-gold">
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
