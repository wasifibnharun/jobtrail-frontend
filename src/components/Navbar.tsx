import { BriefcaseBusiness, LogOut, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

import useAuth from "../auth/useAuth";

export default function Navbar() {
  const { username, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login", { replace: true });
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition-all",
      isActive
        ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
        : "text-[#59645f] hover:bg-white/40 hover:text-[#17211d] dark:text-[#aab5af] dark:hover:bg-white/5 dark:hover:text-white",
    ].join(" ");

  return (
    <header className="sticky top-0 z-20 border-b border-[#dce3df]/50 bg-white/70 backdrop-blur-xl dark:border-[#34413b]/40 dark:bg-[#0a0f0c]/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="order-1 flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <BriefcaseBusiness size={18} aria-hidden="true" />
          </div>
          JobTrail
        </NavLink>

        <nav
          aria-label="Main navigation"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-[#edf0ee]/60 pt-3 dark:border-[#2b3731]/50 md:order-2 md:w-auto md:border-0 md:pt-0"
        >
          <NavLink to="/" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/applications" className={navClass}>
            Applications
          </NavLink>
          <NavLink
            to="/applications/new"
            className={({ isActive }) =>
              [
                navClass({ isActive }),
                "flex shrink-0 items-center gap-1.5",
              ].join(" ")
            }
          >
            <Plus size={16} aria-hidden="true" />
            Add application
          </NavLink>
        </nav>

        <div className="order-2 ml-auto flex min-w-0 items-center gap-2 md:order-3">
          <ThemeToggle />

          <span
            className="hidden max-w-40 truncate text-sm font-medium text-[#59645f] dark:text-[#aab5af] sm:block"
            title={username ?? "Account"}
          >
            {username ?? "Account"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="glass dark:glass-dark flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#36413c] transition-all hover:bg-white/80 active:scale-[0.97] dark:text-[#dce5e0] dark:hover:bg-white/8"
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}