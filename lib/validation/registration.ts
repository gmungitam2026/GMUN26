import { z } from "zod";
import { indianStates } from "@/config/states";
import { registrationPackages } from "@/config/pricing";

export const genderOptions = ["Male", "Female", "Other", "Prefer not to say"] as const;

const packageIds = registrationPackages.map((p) => p.id) as [string, ...string[]];

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export const detailsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name as per your government ID.").max(120),
  age: z.coerce.number().int().min(12, "Minimum age for GMUN 5.0 is 12.").max(22, "Maximum age for GMUN 5.0 is 22."),
  gender: z.enum(genderOptions),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  email: z.email("Enter a valid email address."),
  institution: z.string().trim().min(2, "Enter your institution name.").max(160),
  state: z.enum(indianStates, { error: "Select your state." }),
  city: z.string().trim().min(1, "Enter your city.").max(80),
});

export const preferencesSchema = z.object({
  hasMunExperience: z.boolean(),
  munExperienceDetail: z.string().trim().max(1600).optional().or(z.literal("")),
  committeePreference: z.string().min(1, "Select a committee preference."),
  packageId: z.enum(packageIds, { error: "Select a registration package." }),
});

export const consentSchema = z.object({
  termsAccepted: z.literal(true, { error: "You must accept the Terms and Conditions to register." }),
});

function withMunExperienceRules<T extends z.ZodType<{ hasMunExperience: boolean; munExperienceDetail?: string }>>(
  schema: T
) {
  return schema.superRefine((data, ctx) => {
    const detail = data.munExperienceDetail?.trim() ?? "";
    if (data.hasMunExperience && detail.length === 0) {
      ctx.addIssue({ code: "custom", message: "Briefly describe your prior MUN experience.", path: ["munExperienceDetail"] });
    }
    if (detail.length > 0 && wordCount(detail) > 200) {
      ctx.addIssue({
        code: "custom",
        message: "Keep your MUN experience description to 200 words or fewer.",
        path: ["munExperienceDetail"],
      });
    }
  });
}

export const preferencesSchemaValidated = withMunExperienceRules(preferencesSchema);

export const registrationSchema = withMunExperienceRules(
  detailsSchema.extend(preferencesSchema.shape).extend(consentSchema.shape)
);

/** Same participant/MUN fields as registration, without the consent checkbox — used by the admin edit form. */
export const adminEditSchema = withMunExperienceRules(detailsSchema.extend(preferencesSchema.shape));

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type DetailsInput = z.infer<typeof detailsSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type AdminEditInput = z.infer<typeof adminEditSchema>;
