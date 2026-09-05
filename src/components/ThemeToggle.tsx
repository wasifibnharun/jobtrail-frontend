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
      className="flex size-10 shrink-0 items-center justify-center rounded-md border border-[#cfd8d3] bg-white text-[#36413c] transition-colors hover:bg-[#f1f4f2] dark:border-[#3b4842] dark:bg-[#19211d] dark:text-[#dce5e0] dark:hover:bg-[#26312c]"
    >
      {theme === "light" ? (
        <Moon size={18} aria-hidden="true" />
      ) : (
        <Sun size={18} aria-hidden="true" />
      )}
    </button>
  );
}