export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export type RegistrationStatus = "PENDING" | "PAID" | "CANCELLED";

export type ParticipantType = "Delegate" | "Executive Board" | "Faculty Advisor" | "Observer" | "Press Corps";

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
  email: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  city: string;
  participantType: ParticipantType;
  committeePreference: string;
  countryPreference?: string;
  munExperience: "First-time delegate" | "Experienced delegate";
  munsAttended: number;
  tshirtSize?: string | null;
  accommodation?: boolean | null;
  foodPreference?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  referralSource?: string | null;
  specialRequirements?: string | null;
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
