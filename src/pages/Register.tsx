import axios from "axios";
import { BriefcaseBusiness, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

import {
  register as registerRequest,
  type RegisterPayload,
} from "../api/auth";

type RegisterErrors = Partial<
  Record<keyof RegisterPayload | "detail", string[]>
>;

const inputClass =
  "mt-2 w-full rounded-md border border-[#cfd8d3] bg-white px-3 py-2.5 " +
  "text-[#18201d] outline-none focus:border-emerald-600 focus:ring-2 " +
  "focus:ring-emerald-100 dark:border-[#435149] dark:bg-[#111815] " +
  "dark:text-[#edf3f0] dark:focus:border-emerald-500 dark:focus:ring-emerald-950";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof RegisterPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await registerRequest(form);
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. You can now sign in.",
        },
      });
    } catch (requestError) {
      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.status === 400
      ) {
        setErrors(requestError.response.data as RegisterErrors);
      } else {
        setErrors({
          detail: ["Could not create your account. Please try again."],
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f4f6f5] px-4 py-10 text-[#18201d] dark:bg-[#101513] dark:text-[#edf3f0]">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <section className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-[#17211d] dark:text-[#edf3f0]"
        >
          <BriefcaseBusiness size={24} aria-hidden="true" />
          JobTrail
        </Link>

        <div className="rounded-lg border border-[#dce3df] bg-white p-6 shadow-sm dark:border-[#34413b] dark:bg-[#18201d] sm:p-8">
          <h1 className="text-2xl font-semibold text-[#17211d] dark:text-[#edf3f0]">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-[#66716c] dark:text-[#aab5af]">
            Start keeping every opportunity organized.
          </p>

          {errors.detail?.[0] && (
            <p
              role="alert"
              className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            >
              {errors.detail[0]}
            </p>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-[#29332f] dark:text-[#dce5e0]">
              Username
              <input
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(event) =>
                  updateField("username", event.target.value)
                }
                aria-invalid={Boolean(errors.username)}
                className={inputClass}
              />
              {errors.username?.[0] && (
                <span className="mt-1 block text-sm text-red-600 dark:text-red-400">
                  {errors.username[0]}
                </span>
              )}
            </label>

            <label className="block text-sm font-medium text-[#29332f] dark:text-[#dce5e0]">
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                aria-invalid={Boolean(errors.email)}
                className={inputClass}
              />
              {errors.email?.[0] && (
                <span className="mt-1 block text-sm text-red-600 dark:text-red-400">
                  {errors.email[0]}
                </span>
              )}
            </label>

            <label className="block text-sm font-medium text-[#29332f] dark:text-[#dce5e0]">
              Password
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                aria-invalid={Boolean(errors.password)}
                className={inputClass}
              />
              {errors.password?.[0] ? (
                <span className="mt-1 block text-sm text-red-600 dark:text-red-400">
                  {errors.password[0]}
                </span>
              ) : (
                <span className="mt-1 block text-xs text-[#74807a] dark:text-[#97a49d]">
                  Use at least 6 characters.
                </span>
              )}
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <UserPlus size={18} aria-hidden="true" />
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#66716c] dark:text-[#aab5af]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}