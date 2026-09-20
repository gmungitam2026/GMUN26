import type { RegistrationPackage } from "@/types";

/**
 * Registration pricing is configuration/database data, never a hardcoded UI
 * string, and the server is always the source of truth for the amount charged.
 *
 * The single value below reflects the GMUN 5.0 client requirements document
 * as it stands today (₹600 per delegate). It is not a final business decision
 * baked into the app — it lives here as one row so it can be replaced by a
 * `registration_packages` table lookup, or edited to add further packages,
 * without touching registration/payment/UI code anywhere else.
 */
export const registrationPackages: RegistrationPackage[] = [
  {
    id: "gmun-5-delegate",
    name: "GMUN 5.0 Delegate Registration",
    description: "Conference participation for GMUN 5.0, 24–25 October 2026.",
    price: 600,
    currency: "INR",
    active: true,
    displayOrder: 1,
    includes: ["Conference participation"],
    capacity: null,
  },
];

export function getActiveRegistrationPackage(): RegistrationPackage {
  const active = registrationPackages.find((p) => p.active);
  if (!active) {
    throw new Error("No active registration package is configured.");
  }
  return active;
}

export function getRegistrationPackageById(id: string): RegistrationPackage | undefined {
  return registrationPackages.find((p) => p.id === id && p.active);
}
