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
  "mt-2 w-full rounded-xl border border-[#d0d8d4]/70 bg-white/60 px-3.5 py-2.5 " +
  "text-[#18201d] outline-none backdrop-blur-sm transition-all placeholder:text-[#9ca5a0] " +
  "focus:border-emerald-500 focus:glow-ring " +
  "dark:border-[#3a4840]/70 dark:bg-[#111815]/60 dark:text-[#edf3f0] " +
  "dark:placeholder:text-[#6b7a73] dark:focus:border-emerald-500";

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-[#18201d] dark:text-[#edf3f0]">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-[100px] animate-float dark:bg-emerald-600/15" />
        <div className="absolute -right-24 top-1/4 h-[400px] w-[400px] rounded-full bg-teal-300/20 blur-[90px] animate-float-slow dark:bg-teal-500/10" />
        <div className="absolute -bottom-20 left-1/3 h-[450px] w-[450px] rounded-full bg-cyan-300/15 blur-[100px] animate-float-slower dark:bg-emerald-700/10" />
        <div className="absolute right-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-emerald-200/20 blur-[80px] animate-pulse-glow dark:bg-teal-800/10" />
      </div>

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <section className="w-full max-w-md animate-fade-in-up">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2.5 text-xl font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
            <BriefcaseBusiness size={20} aria-hidden="true" />
          </div>
          JobTrail
        </Link>

        <div className="glass-card dark:glass-card-dark rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-[#66716c] dark:text-[#aab5af]">
            Start keeping every opportunity organized.
          </p>

          {errors.detail?.[0] && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200/60 bg-red-50/80 px-3.5 py-2.5 text-sm text-red-700 backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
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
                <span className="mt-1.5 block text-sm text-red-600 dark:text-red-400">
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
                <span className="mt-1.5 block text-sm text-red-600 dark:text-red-400">
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
                <span className="mt-1.5 block text-sm text-red-600 dark:text-red-400">
                  {errors.password[0]}
                </span>
              ) : (
                <span className="mt-1.5 block text-xs text-[#74807a] dark:text-[#97a49d]">
                  Use at least 6 characters.
                </span>
              )}
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 font-semibold text-white btn-glow transition-all hover:from-emerald-500 hover:to-teal-500 hover:btn-glow-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-emerald-600 disabled:hover:to-teal-600 disabled:active:scale-100"
            >
              <UserPlus size={18} aria-hidden="true" />
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#66716c] dark:text-[#aab5af]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}