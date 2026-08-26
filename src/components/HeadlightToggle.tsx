import { HeadlightIcon, SunIcon } from "./Icons";
import type { Theme } from "../types";

interface HeadlightToggleProps {
  theme: Theme;
  onToggle: () => void;
  /** Track width in px. The knob and its travel are derived from it. */
  width?: number;
  height?: number;
}

/** Dark mode, as the headlight switch it effectively is. */
export function HeadlightToggle({ theme, onToggle, width = 82, height = 44 }: HeadlightToggleProps) {
  const dark = theme === "dark";
  const knob = height - 8;
  const travel = width - knob - 8;

  return (
    <button
      type="button"
      className="headlight shrink-0"
      data-mode={theme}
      style={{ width, height }}
      onClick={onToggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Headlights on — switch to light mode" : "Headlights off — switch to dark mode"}
      title={dark ? "Headlights on" : "Headlights off"}
    >
      <span
        className="headlight-knob"
        style={{ width: knob, height: knob, transform: `translateX(${dark ? travel : 0}px)` }}
      >
        {dark ? <HeadlightIcon size={knob * 0.56} /> : <SunIcon size={knob * 0.5} />}
      </span>
    </button>
  );
}
