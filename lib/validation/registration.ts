import { z } from "zod";

export const participantTypes = [
  "Delegate",
  "Executive Board",
  "Faculty Advisor",
  "Observer",
  "Press Corps",
] as const;

export const munExperienceOptions = ["First-time delegate", "Experienced delegate"] as const;

export const detailsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  college: z.string().trim().min(2, "Enter your college or university.").max(160),
  course: z.string().trim().min(1, "Enter your course.").max(120),
  year: z.string().trim().min(1, "Enter your year of study.").max(40),
  city: z.string().trim().min(1, "Enter your city.").max(80),
});

export const preferencesSchema = z.object({
  participantType: z.enum(participantTypes),
  committeePreference: z.string().min(1, "Select a committee preference."),
  countryPreference: z.string().trim().max(120).optional().or(z.literal("")),
  munExperience: z.enum(munExperienceOptions),
  munsAttended: z.coerce.number().int().min(0).max(200),
  tshirtSize: z.string().trim().max(10).optional().or(z.literal("")),
  accommodation: z.boolean().optional(),
  foodPreference: z.string().trim().max(60).optional().or(z.literal("")),
  emergencyContactName: z.string().trim().max(120).optional().or(z.literal("")),
  emergencyContactPhone: z.string().trim().max(20).optional().or(z.literal("")),
  referralSource: z.string().trim().max(120).optional().or(z.literal("")),
  specialRequirements: z.string().trim().max(500).optional().or(z.literal("")),
});

export const consentSchema = z.object({
  termsAccepted: z.literal(true, { error: "You must accept the Terms and Conditions to register." }),
});

export const registrationSchema = detailsSchema.extend(preferencesSchema.shape).extend(consentSchema.shape).extend({
  packageId: z.string().min(1),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type DetailsInput = z.infer<typeof detailsSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
