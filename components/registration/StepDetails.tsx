import type { DetailsInput } from "@/lib/validation/registration";
import { Field, TextInput } from "./fields";

export function StepDetails({
  data,
  errors,
  onChange,
}: {
  data: DetailsInput;
  errors: Partial<Record<keyof DetailsInput, string>>;
  onChange: <K extends keyof DetailsInput>(key: K, value: DetailsInput[K]) => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Full Name" htmlFor="fullName" error={errors.fullName} className="sm:col-span-2">
        <TextInput
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          autoComplete="name"
        />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email}>
        <TextInput
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          autoComplete="email"
        />
      </Field>
      <Field label="Phone" htmlFor="phone" error={errors.phone}>
        <TextInput
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          autoComplete="tel"
          placeholder="10-digit mobile number"
        />
      </Field>
      <Field label="College / University" htmlFor="college" error={errors.college} className="sm:col-span-2">
        <TextInput id="college" value={data.college} onChange={(e) => onChange("college", e.target.value)} />
      </Field>
      <Field label="Course" htmlFor="course" error={errors.course}>
        <TextInput id="course" value={data.course} onChange={(e) => onChange("course", e.target.value)} />
      </Field>
      <Field label="Year" htmlFor="year" error={errors.year}>
        <TextInput id="year" value={data.year} onChange={(e) => onChange("year", e.target.value)} placeholder="e.g. 2nd Year" />
      </Field>
      <Field label="City" htmlFor="city" error={errors.city}>
        <TextInput id="city" value={data.city} onChange={(e) => onChange("city", e.target.value)} />
      </Field>
    </div>
  );
}
