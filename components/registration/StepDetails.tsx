import { indianStates } from "@/config/states";
import { genderOptions, type DetailsInput } from "@/lib/validation/registration";
import { Field, TextInput, Select, ChoiceButtons } from "./fields";
import { ProfilePhotoField } from "./ProfilePhotoField";

const GITAM_INSTITUTION = "GITAM (Deemed to be University)";

export function StepDetails({
  data,
  errors,
  onChange,
  photo,
}: {
  data: DetailsInput;
  errors: Partial<Record<keyof DetailsInput, string>>;
  onChange: <K extends keyof DetailsInput>(key: K, value: DetailsInput[K]) => void;
  /** Profile photo upload — omitted in the admin edit form. */
  photo?: { file: File | null; error?: string; processing?: boolean; onSelect: (file: File | null) => void };
}) {
  function setGitamStudent(value: DetailsInput["gitamStudent"]) {
    onChange("gitamStudent", value);
    // Save GITAM students typing their own institution; clear it again if they switch back.
    if (value === "Yes" && !data.institution.trim()) onChange("institution", GITAM_INSTITUTION);
    if (value === "No" && data.institution === GITAM_INSTITUTION) onChange("institution", "");
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Name (as per Govt. ID)" htmlFor="fullName" error={errors.fullName} className="sm:col-span-2">
        <TextInput
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          autoComplete="name"
        />
      </Field>
      <Field label="Are you a GITAM student?" htmlFor="gitamStudent" error={errors.gitamStudent} className="sm:col-span-2">
        <ChoiceButtons
          idPrefix="gitamStudent"
          label="Are you a GITAM student?"
          options={[
            { label: "Yes", value: "Yes" as const },
            { label: "No", value: "No" as const },
          ]}
          value={data.gitamStudent}
          onChange={setGitamStudent}
        />
      </Field>
      <Field label="Age" htmlFor="age" error={errors.age}>
        <TextInput
          id="age"
          type="number"
          min={12}
          max={23}
          value={Number.isNaN(data.age) ? "" : data.age}
          onChange={(e) => onChange("age", Number(e.target.value))}
        />
      </Field>
      <Field label="Gender" htmlFor="gender" error={errors.gender}>
        <Select id="gender" value={data.gender} onChange={(e) => onChange("gender", e.target.value as DetailsInput["gender"])}>
          {genderOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Mobile Number" htmlFor="phone" error={errors.phone}>
        <TextInput
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          autoComplete="tel"
          placeholder="10-digit mobile number"
        />
      </Field>
      <Field label="Mail ID" htmlFor="email" error={errors.email}>
        <TextInput
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          autoComplete="email"
        />
      </Field>
      <Field label="Institution Name" htmlFor="institution" error={errors.institution} className="sm:col-span-2">
        <TextInput id="institution" value={data.institution} onChange={(e) => onChange("institution", e.target.value)} />
      </Field>
      <Field label="State" htmlFor="state" error={errors.state}>
        <Select
          id="state"
          value={data.state}
          onChange={(e) => onChange("state", e.target.value as DetailsInput["state"])}
        >
          <option value="" disabled>
            Select your state
          </option>
          {indianStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="City" htmlFor="city" error={errors.city}>
        <TextInput id="city" value={data.city} onChange={(e) => onChange("city", e.target.value)} />
      </Field>
      {photo && (
        <div className="border-t border-line pt-6 sm:col-span-2">
          <ProfilePhotoField {...photo} />
        </div>
      )}

    </div>
  );
}
