import type { RegistrationPackage } from "@/types";

/**
 * Registration pricing is configuration/database data, never a hardcoded UI
 * string, and the server is always the source of truth for the amount
 * charged — the client submits a package id, never an amount.
 */
export const registrationPackages: RegistrationPackage[] = [
  {
    id: "gmun-only",
    name: "GMUN Only",
    description: "Two-day conference entry.",
    price: 600,
    currency: "INR",
    active: true,
    displayOrder: 1,
    includes: ["Two-day conference entry (both days)"],
    capacity: null,
  },
  {
    id: "gmun-lunch",
    name: "GMUN + Lunch",
    description: "Two-day conference entry with lunch included.",
    price: 800,
    currency: "INR",
    active: true,
    displayOrder: 2,
    includes: ["Two-day conference entry (both days)", "Lunch"],
    capacity: null,
  },
  {
    id: "gmun-lunch-accommodation",
    name: "GMUN + Lunch + Accommodation",
    description: "Two-day conference entry with lunch and accommodation included.",
    price: 1200,
    currency: "INR",
    active: true,
    displayOrder: 3,
    includes: ["Two-day conference entry (both days)", "Lunch", "Accommodation"],
    capacity: null,
  },
];

export function getActiveRegistrationPackages(): RegistrationPackage[] {
  return registrationPackages.filter((p) => p.active).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getRegistrationPackageById(id: string): RegistrationPackage | undefined {
  return registrationPackages.find((p) => p.id === id && p.active);
}
