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
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        : "text-[#59645f] hover:bg-[#f1f4f2] hover:text-[#17211d] dark:text-[#aab5af] dark:hover:bg-[#26312c] dark:hover:text-white",
    ].join(" ");

  return (
    <header className="sticky top-0 z-20 border-b border-[#dce3df] bg-white/95 backdrop-blur dark:border-[#34413b] dark:bg-[#151c19]/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="order-1 flex items-center gap-2 text-lg font-semibold text-[#17211d] dark:text-[#edf3f0]"
        >
          <BriefcaseBusiness size={22} aria-hidden="true" />
          JobTrail
        </NavLink>

        <nav
          aria-label="Main navigation"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-[#edf0ee] pt-3 dark:border-[#2b3731] md:order-2 md:w-auto md:border-0 md:pt-0"
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
            className="flex items-center gap-1.5 rounded-md border border-[#cfd8d3] bg-white px-3 py-2 text-sm font-medium text-[#36413c] transition-colors hover:bg-[#f4f6f5] dark:border-[#3b4842] dark:bg-[#19211d] dark:text-[#dce5e0] dark:hover:bg-[#26312c]"
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}