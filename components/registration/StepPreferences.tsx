import { registrationPackages } from "@/config/pricing";
import type { PreferencesInput } from "@/lib/validation/registration";
import { committees } from "@/config/committees";
import { Field, Select, TextArea, TextInput, ChoiceButtons } from "./fields";
import { cn } from "@/lib/utils/cn";

function wordCount(value: string) {
  return value.trim().length === 0 ? 0 : value.trim().split(/\s+/).filter(Boolean).length;
}

export function StepPreferences({
  data,
  errors,
  onChange,
}: {
  data: PreferencesInput;
  errors: Partial<Record<keyof PreferencesInput, string>>;
  onChange: <K extends keyof PreferencesInput>(key: K, value: PreferencesInput[K]) => void;
}) {
  const words = wordCount(data.munExperienceDetail ?? "");

  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold sm:col-span-2">
          Committee &amp; Country Preferences
        </p>
        <Field label="1st Committee Preference" htmlFor="committeePreference" error={errors.committeePreference}>
          <Select
            id="committeePreference"
            value={data.committeePreference}
            onChange={(e) => {
              onChange("committeePreference", e.target.value);
              // Picking the committee already chosen as 2nd clears the 2nd.
              if (e.target.value === data.committeePreference2) onChange("committeePreference2", "");
            }}
          >
            <option value="" disabled>
              Select a committee
            </option>
            {committees.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="2nd Committee Preference" htmlFor="committeePreference2" error={errors.committeePreference2}>
          <Select
            id="committeePreference2"
            value={data.committeePreference2}
            onChange={(e) => onChange("committeePreference2", e.target.value)}
          >
            <option value="" disabled>
              Select a committee
            </option>
            {committees
              .filter((c) => c.id !== data.committeePreference)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.shortName}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="Country Preference" htmlFor="countryPreference" error={errors.countryPreference} className="sm:col-span-2">
          <TextInput
            id="countryPreference"
            value={data.countryPreference}
            onChange={(e) => onChange("countryPreference", e.target.value)}
            placeholder="e.g. India, France — or a character / portfolio for MCU, IFI and FIFA"
          />
        </Field>
      </div>

      <Field label="Any prior MUN experience?" htmlFor="hasMunExperience">
        <ChoiceButtons
          idPrefix="hasMunExperience"
          label="Any prior MUN experience?"
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ]}
          value={data.hasMunExperience}
          onChange={(value) => {
            onChange("hasMunExperience", value);
            if (!value) onChange("munExperienceDetail", "");
          }}
        />
      </Field>

      {data.hasMunExperience && (
        <Field
          label="Briefly describe your MUN experience"
          htmlFor="munExperienceDetail"
          error={errors.munExperienceDetail}
        >
          <TextArea
            id="munExperienceDetail"
            rows={5}
            value={data.munExperienceDetail ?? ""}
            onChange={(e) => onChange("munExperienceDetail", e.target.value)}
            placeholder="Conferences attended, committees, awards, roles — max 200 words."
          />
          <p className={cn("mt-2 text-xs", words > 200 ? "text-danger" : "text-ivory-faint")}>
            {words} / 200 words
          </p>
        </Field>
      )}

      <div>
        <p className="mb-3 text-[13px] uppercase tracking-[0.08em] text-ivory-dim">Package</p>
        <div className="space-y-3">
          {registrationPackages.map((pkg) => (
            <label
              key={pkg.id}
              htmlFor={`package-${pkg.id}`}
              className={cn(
                "flex cursor-pointer items-start justify-between gap-4 border p-4 transition-colors",
                data.packageId === pkg.id ? "border-gold" : "border-line hover:border-line-strong"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id={`package-${pkg.id}`}
                  name="packageId"
                  checked={data.packageId === pkg.id}
                  onChange={() => onChange("packageId", pkg.id)}
                  className="mt-1 h-4 w-4 accent-[#b7924e]"
                />
                <div>
                  <p className="font-display text-lg text-ivory">{pkg.name}</p>
                  <p className="mt-1 text-sm text-ivory-faint">{pkg.includes.join(" · ")}</p>
                </div>
              </div>
              <p className="shrink-0 font-display text-xl text-gold">₹{pkg.price}</p>
            </label>
          ))}
        </div>
        {errors.packageId && <p className="mt-2 text-xs text-danger">{errors.packageId}</p>}
      </div>
    </div>
  );
}
