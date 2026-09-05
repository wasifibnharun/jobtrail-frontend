import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createApplication,
  getApplication,
  updateApplication,
  type ApplicationPayload,
  type ApplicationStatus,
  type JobType,
} from "../api/applications";
import ApplicationFields, {
  type ApplicationFormErrors,
  type ApplicationFormValues,
} from "../components/ApplicationFields";
import { ErrorState, Loader } from "../components/AsyncState";

const emptyValues: ApplicationFormValues = {
  company: "",
  position: "",
  status: "WISHLIST",
  job_type: "ONSITE",
  applied_on: "",
  expected_salary: "",
  job_link: "",
  notes: "",
};

export default function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [values, setValues] =
    useState<ApplicationFormValues>(emptyValues);
  const [errors, setErrors] = useState<ApplicationFormErrors>({});
  const [loading, setLoading] = useState(isEditing);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    getApplication(id)
      .then((application) => {
        if (cancelled) return;

        setValues({
          company: application.company,
          position: application.position,
          status: application.status,
          job_type: application.job_type,
          applied_on: application.applied_on ?? "",
          expected_salary:
            application.expected_salary === null
              ? ""
              : String(application.expected_salary),
          job_link: application.job_link,
          notes: application.notes,
        });
        setLoadFailed(false);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, requestKey]);

  function updateField(
    field: keyof ApplicationFormValues,
    value: string,
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      detail: undefined,
    }));
  }

  function retryLoading() {
    setLoading(true);
    setLoadFailed(false);
    setRequestKey((current) => current + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSaving(true);

    const payload: ApplicationPayload = {
      company: values.company.trim(),
      position: values.position.trim(),
      status: values.status as ApplicationStatus,
      job_type: values.job_type as JobType,
      applied_on: values.applied_on || null,
      expected_salary:
        values.expected_salary === ""
          ? null
          : Number(values.expected_salary),
      job_link: values.job_link.trim(),
      notes: values.notes.trim(),
    };

    try {
      if (id) {
        await updateApplication(id, payload);
      } else {
        await createApplication(payload);
      }

      navigate("/applications", {
        state: {
          message: isEditing
            ? "Application updated successfully."
            : "Application added successfully.",
        },
      });
    } catch (requestError) {
      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.status === 400
      ) {
        setErrors(requestError.response.data as ApplicationFormErrors);
      } else {
        setErrors({
          detail: ["Something went wrong. Please try again."],
        });
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loader label="Loading application..." />;
  }

  if (loadFailed) {
    return (
      <ErrorState
        message="Could not load this application."
        onRetry={retryLoading}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      <Link
        to="/applications"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#59645f] transition-colors hover:text-emerald-600 dark:text-[#aab5af] dark:hover:text-emerald-400"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to applications
      </Link>

      <header className="mt-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]">
          {isEditing ? "Edit application" : "Add application"}
        </h1>
        <p className="mt-1.5 text-sm text-[#66716c] dark:text-[#aab5af]">
          {isEditing
            ? "Update the details of this opportunity."
            : "Record a new opportunity in your job search."}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-6 glass-card dark:glass-card-dark rounded-2xl p-5 sm:p-7"
      >
        {errors.detail?.[0] && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-200/60 bg-red-50/80 px-3.5 py-2.5 text-sm text-red-700 backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          >
            {errors.detail[0]}
          </p>
        )}

        <ApplicationFields
          values={values}
          errors={errors}
          onChange={updateField}
        />

        <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-[#e6ebe8]/50 pt-5 dark:border-[#2d3933]/50">
          <Link
            to="/applications"
            className="glass dark:glass-dark rounded-xl px-4 py-2.5 text-sm font-medium text-[#36413c] transition-all hover:bg-white/80 active:scale-[0.97] dark:text-[#dce5e0] dark:hover:bg-white/8"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white btn-glow transition-all hover:from-emerald-500 hover:to-teal-500 hover:btn-glow-hover active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-emerald-600 disabled:hover:to-teal-600 disabled:active:scale-100"
          >
            <Save size={17} aria-hidden="true" />
            {saving ? "Saving..." : "Save application"}
          </button>
        </div>
      </form>
    </div>
  );
}
