import axios from "axios";
import { BriefcaseBusiness, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

import useAuth from "../auth/useAuth";

interface LocationState {
  from?: { pathname?: string };
  message?: string;
}

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as LocationState | null;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn({ username, password });
      navigate(routeState?.from?.pathname ?? "/", { replace: true });
    } catch (requestError) {
      if (
        axios.isAxiosError(requestError) &&
        typeof requestError.response?.data?.detail === "string"
      ) {
        setError(requestError.response.data.detail);
      } else {
        setError("Could not sign in. Please try again.");
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
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[#66716c] dark:text-[#aab5af]">
            Sign in to manage your applications.
          </p>

          {routeState?.message && (
            <p className="mt-5 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-2.5 text-sm text-emerald-800 backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              {routeState.message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200/60 bg-red-50/80 px-3.5 py-2.5 text-sm text-red-700 backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-[#29332f] dark:text-[#dce5e0]">
              Username
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#d0d8d4]/70 bg-white/60 px-3.5 py-2.5 text-[#18201d] outline-none backdrop-blur-sm transition-all placeholder:text-[#9ca5a0] focus:border-emerald-500 focus:glow-ring dark:border-[#3a4840]/70 dark:bg-[#111815]/60 dark:text-[#edf3f0] dark:placeholder:text-[#6b7a73] dark:focus:border-emerald-500"
              />
            </label>

            <label className="block text-sm font-medium text-[#29332f] dark:text-[#dce5e0]">
              Password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#d0d8d4]/70 bg-white/60 px-3.5 py-2.5 text-[#18201d] outline-none backdrop-blur-sm transition-all placeholder:text-[#9ca5a0] focus:border-emerald-500 focus:glow-ring dark:border-[#3a4840]/70 dark:bg-[#111815]/60 dark:text-[#edf3f0] dark:placeholder:text-[#6b7a73] dark:focus:border-emerald-500"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 font-semibold text-white btn-glow transition-all hover:from-emerald-500 hover:to-teal-500 hover:btn-glow-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-emerald-600 disabled:hover:to-teal-600 disabled:active:scale-100"
            >
              <LogIn size={18} aria-hidden="true" />
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#66716c] dark:text-[#aab5af]">
            New to JobTrail?{" "}
            <Link
              to="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}