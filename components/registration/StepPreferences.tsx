import { committees } from "@/config/committees";
import { registrationPackages } from "@/config/pricing";
import type { PreferencesInput } from "@/lib/validation/registration";
import { Field, Select, TextArea } from "./fields";
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
      <Field label="Any prior MUN experience?" htmlFor="hasMunExperience-yes">
        <div className="flex gap-3">
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              id={opt.value ? "hasMunExperience-yes" : "hasMunExperience-no"}
              onClick={() => {
                onChange("hasMunExperience", opt.value);
                if (!opt.value) onChange("munExperienceDetail", "");
              }}
              aria-pressed={data.hasMunExperience === opt.value}
              className={cn(
                "h-11 flex-1 border text-sm uppercase tracking-[0.08em] transition-colors sm:flex-none sm:px-10",
                data.hasMunExperience === opt.value
                  ? "border-gold bg-gold text-ink"
                  : "border-line text-ivory-dim hover:border-line-strong"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
          <p className={cn("mt-2 text-xs", words > 200 ? "text-red-400" : "text-ivory-faint")}>
            {words} / 200 words
          </p>
        </Field>
      )}

      <Field label="Preferred Committee" htmlFor="committeePreference" error={errors.committeePreference}>
        <Select
          id="committeePreference"
          value={data.committeePreference}
          onChange={(e) => onChange("committeePreference", e.target.value)}
        >
          <option value="" disabled>
            Select a committee
          </option>
          {committees.map((c) => (
            <option key={c.id} value={c.id}>
              {c.shortName} — {c.name}
            </option>
          ))}
        </Select>
      </Field>

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
        {errors.packageId && <p className="mt-2 text-xs text-red-400">{errors.packageId}</p>}
      </div>
    </div>
  );
}
