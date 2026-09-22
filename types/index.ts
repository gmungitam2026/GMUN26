export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export type RegistrationStatus =
  | "PENDING_VERIFICATION"
  | "UNDER_VERIFICATION"
  | "PAYMENT_CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export interface RegistrationPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "INR";
  active: boolean;
  displayOrder: number;
  includes: string[];
  capacity: number | null;
}

export interface Committee {
  id: string;
  shortName: string;
  name: string;
  governingBody?: string;
  agenda: string;
  description: string;
  type: "General" | "Crisis" | "Special" | "Specialized";
  displayOrder: number;
  studyGuideUrl?: string | null;
  executiveBoard?: { name: string; role: string }[] | null;
}

export interface RegistrationRecord {
  id: string;
  registrationId: string;
  fullName: string;
  age: number;
  gender: Gender;
  email: string;
  phone: string;
  institution: string;
  state: string;
  city: string;
  committeePreference: string;
  munExperience: "Yes" | "No";
  munExperienceDetail?: string | null;
  packageId: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  registrationId: string;
  provider: string;
  orderId: string;
  paymentId: string | null;
  amount: number;
  currency: "INR";
  status: PaymentStatus;
  method: string | null;
  providerReference: string | null;
  createdAt: string;
  updatedAt: string;
}
