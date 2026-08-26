import { useCallback, useEffect, useState } from "react";
import type { Theme } from "../types";

const KEY = "platefind:theme";

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // private mode, or storage disabled — fall through to the system setting
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Theme lives on <html data-theme>. Until the user picks one explicitly we
 * follow the system setting, including when it changes mid-session.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [explicit, setExplicit] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved === "light" || saved === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (explicit) return;
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [explicit]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // not being able to remember the choice is survivable
      }
      return next;
    });
    setExplicit(true);
  }, []);

  return { theme, toggle };
}
