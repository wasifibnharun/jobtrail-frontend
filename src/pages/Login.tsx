import axios from "axios";
import { BriefcaseBusiness, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
    <main className="flex min-h-screen items-center justify-center bg-[#f4f6f5] px-4 py-10">
      <section className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-[#17211d]"
        >
          <BriefcaseBusiness size={24} aria-hidden="true" />
          JobTrail
        </Link>

        <div className="rounded-lg border border-[#dce3df] bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-[#17211d]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[#66716c]">
            Sign in to manage your applications.
          </p>

          {routeState?.message && (
            <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {routeState.message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-[#29332f]">
              Username
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#cfd8d3] px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block text-sm font-medium text-[#29332f]">
              Password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#cfd8d3] px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} aria-hidden="true" />
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#66716c]">
            New to JobTrail?{" "}
            <Link
              to="/register"
              className="font-medium text-emerald-700 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}