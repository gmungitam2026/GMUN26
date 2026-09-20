import { committees } from "@/config/committees";
import { participantTypes, munExperienceOptions, type PreferencesInput } from "@/lib/validation/registration";
import { Field, TextInput, TextArea, Select, CheckboxField } from "./fields";

export function StepPreferences({
  data,
  errors,
  onChange,
}: {
  data: PreferencesInput;
  errors: Partial<Record<keyof PreferencesInput, string>>;
  onChange: <K extends keyof PreferencesInput>(key: K, value: PreferencesInput[K]) => void;
}) {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Participant Type" htmlFor="participantType" error={errors.participantType}>
          <Select
            id="participantType"
            value={data.participantType}
            onChange={(e) => onChange("participantType", e.target.value as PreferencesInput["participantType"])}
          >
            {participantTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Committee Preference" htmlFor="committeePreference" error={errors.committeePreference}>
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
                {c.shortName}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Country Preference" htmlFor="countryPreference" optional error={errors.countryPreference}>
          <TextInput
            id="countryPreference"
            value={data.countryPreference ?? ""}
            onChange={(e) => onChange("countryPreference", e.target.value)}
            placeholder="Subject to allocation"
          />
        </Field>

        <Field label="MUN Experience" htmlFor="munExperience" error={errors.munExperience}>
          <Select
            id="munExperience"
            value={data.munExperience}
            onChange={(e) => onChange("munExperience", e.target.value as PreferencesInput["munExperience"])}
          >
            {munExperienceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Number of MUNs Attended" htmlFor="munsAttended" error={errors.munsAttended}>
          <TextInput
            id="munsAttended"
            type="number"
            min={0}
            value={data.munsAttended}
            onChange={(e) => onChange("munsAttended", Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="border-t border-line pt-8">
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Additional Details</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="T-Shirt Size" htmlFor="tshirtSize" optional error={errors.tshirtSize}>
            <Select id="tshirtSize" value={data.tshirtSize ?? ""} onChange={(e) => onChange("tshirtSize", e.target.value)}>
              <option value="">Prefer not to say</option>
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Food Preference" htmlFor="foodPreference" optional error={errors.foodPreference}>
            <Select id="foodPreference" value={data.foodPreference ?? ""} onChange={(e) => onChange("foodPreference", e.target.value)}>
              <option value="">Not specified</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </Select>
          </Field>

          <Field label="Emergency Contact Name" htmlFor="emergencyContactName" optional error={errors.emergencyContactName}>
            <TextInput
              id="emergencyContactName"
              value={data.emergencyContactName ?? ""}
              onChange={(e) => onChange("emergencyContactName", e.target.value)}
            />
          </Field>

          <Field label="Emergency Contact Phone" htmlFor="emergencyContactPhone" optional error={errors.emergencyContactPhone}>
            <TextInput
              id="emergencyContactPhone"
              type="tel"
              value={data.emergencyContactPhone ?? ""}
              onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
            />
          </Field>

          <Field label="How did you hear about GMUN?" htmlFor="referralSource" optional error={errors.referralSource}>
            <TextInput
              id="referralSource"
              value={data.referralSource ?? ""}
              onChange={(e) => onChange("referralSource", e.target.value)}
            />
          </Field>

          <div className="flex items-end pb-3">
            <CheckboxField
              id="accommodation"
              checked={Boolean(data.accommodation)}
              onChange={(checked) => onChange("accommodation", checked)}
            >
              I would like to be contacted about accommodation
            </CheckboxField>
          </div>

          <Field
            label="Special Requirements"
            htmlFor="specialRequirements"
            optional
            error={errors.specialRequirements}
            className="sm:col-span-2"
          >
            <TextArea
              id="specialRequirements"
              value={data.specialRequirements ?? ""}
              onChange={(e) => onChange("specialRequirements", e.target.value)}
              placeholder="Dietary restrictions, accessibility needs, etc."
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
