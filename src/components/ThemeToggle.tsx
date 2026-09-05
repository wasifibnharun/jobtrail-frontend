import { Moon, Sun } from "lucide-react";
import { useState } from "react";

import {
  applyTheme,
  saveTheme,
  type Theme,
} from "../theme/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  }

  const nextThemeLabel =
    theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextThemeLabel}
      title={nextThemeLabel}
      className="glass dark:glass-dark flex size-10 shrink-0 items-center justify-center rounded-lg text-[#36413c] transition-all hover:bg-white/80 hover:scale-105 active:scale-95 dark:text-[#dce5e0] dark:hover:bg-white/8"
    >
      {theme === "light" ? (
        <Moon size={18} aria-hidden="true" />
      ) : (
        <Sun size={18} aria-hidden="true" />
      )}
    </button>
  );
}