import type { ReactNode } from "react";

import type { ApplicationPayload } from "../api/applications";

export type ApplicationFormValues = {
  [Field in keyof ApplicationPayload]: string;
};

export type ApplicationFormErrors = Partial<
  Record<keyof ApplicationFormValues | "detail", string[]>
>;

interface ApplicationFieldsProps {
  values: ApplicationFormValues;
  errors: ApplicationFormErrors;
  onChange: (
    field: keyof ApplicationFormValues,
    value: string,
  ) => void;
}

interface FieldProps {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({
  name,
  label,
  required,
  error,
  children,
}: FieldProps) {
  return (
    <label htmlFor={name} className="block">
      <span className="text-sm font-medium text-[#303b36] dark:text-[#dce5e0]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-sm text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

const inputClass = (hasError: boolean) =>
  [
    "mt-2 w-full rounded-xl border bg-white/60 px-3.5 py-2.5 text-[#18201d] outline-none",
    "backdrop-blur-sm transition-all",
    "focus:border-emerald-500 focus:glow-ring",
    "dark:bg-[#111815]/60 dark:text-[#edf3f0] dark:focus:border-emerald-500",
    hasError
      ? "border-red-400/70 dark:border-red-700/60"
      : "border-[#d0d8d4]/70 dark:border-[#3a4840]/70",
  ].join(" ");

export default function ApplicationFields({
  values,
  errors,
  onChange,
}: ApplicationFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        name="company"
        label="Company"
        required
        error={errors.company?.[0]}
      >
        <input
          id="company"
          type="text"
          required
          value={values.company}
          onChange={(event) => onChange("company", event.target.value)}
          aria-invalid={Boolean(errors.company)}
          className={inputClass(Boolean(errors.company))}
        />
      </Field>

      <Field
        name="position"
        label="Position"
        required
        error={errors.position?.[0]}
      >
        <input
          id="position"
          type="text"
          required
          value={values.position}
          onChange={(event) => onChange("position", event.target.value)}
          aria-invalid={Boolean(errors.position)}
          className={inputClass(Boolean(errors.position))}
        />
      </Field>

      <Field
        name="status"
        label="Status"
        error={errors.status?.[0]}
      >
        <select
          id="status"
          value={values.status}
          onChange={(event) => onChange("status", event.target.value)}
          aria-invalid={Boolean(errors.status)}
          className={inputClass(Boolean(errors.status))}
        >
          <option value="WISHLIST">Wishlist</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </Field>

      <Field
        name="job_type"
        label="Job type"
        error={errors.job_type?.[0]}
      >
        <select
          id="job_type"
          value={values.job_type}
          onChange={(event) => onChange("job_type", event.target.value)}
          aria-invalid={Boolean(errors.job_type)}
          className={inputClass(Boolean(errors.job_type))}
        >
          <option value="ONSITE">Onsite</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
        </select>
      </Field>

      <Field
        name="applied_on"
        label="Applied date"
        error={errors.applied_on?.[0]}
      >
        <input
          id="applied_on"
          type="date"
          value={values.applied_on}
          onChange={(event) =>
            onChange("applied_on", event.target.value)
          }
          aria-invalid={Boolean(errors.applied_on)}
          className={inputClass(Boolean(errors.applied_on))}
        />
      </Field>

      <Field
        name="expected_salary"
        label="Expected salary"
        error={errors.expected_salary?.[0]}
      >
        <input
          id="expected_salary"
          type="number"
          min="0"
          step="1"
          value={values.expected_salary}
          onChange={(event) =>
            onChange("expected_salary", event.target.value)
          }
          aria-invalid={Boolean(errors.expected_salary)}
          className={inputClass(Boolean(errors.expected_salary))}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field
          name="job_link"
          label="Job link"
          error={errors.job_link?.[0]}
        >
          <input
            id="job_link"
            type="url"
            placeholder="https://example.com/jobs/123"
            value={values.job_link}
            onChange={(event) =>
              onChange("job_link", event.target.value)
            }
            aria-invalid={Boolean(errors.job_link)}
            className={inputClass(Boolean(errors.job_link))}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field
          name="notes"
          label="Notes"
          error={errors.notes?.[0]}
        >
          <textarea
            id="notes"
            rows={5}
            value={values.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            aria-invalid={Boolean(errors.notes)}
            className={`${inputClass(Boolean(errors.notes))} resize-y`}
          />
        </Field>
      </div>
    </div>
  );
}
