import { NearbyPanel } from "./NearbyPanel";
import { RefreshIcon } from "./Icons";
import type { Nearby } from "../hooks/useNearby";
import type { BoardPlate } from "../types";

interface ProgressPanelProps {
  found: number;
  total: number;
  lastFound: BoardPlate | null;
  nearby: Nearby;
  plateFor: (code: string) => BoardPlate | undefined;
  onToggle: (id: number) => void;
  onReset: () => void;
}

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressPanel({
  found,
  total,
  lastFound,
  nearby,
  plateFor,
  onToggle,
  onReset,
}: ProgressPanelProps) {
  const fraction = total > 0 ? found / total : 0;

  return (
    <div className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <p className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-ink-3">Your trip</p>

      <div className="relative mx-auto my-4 size-[168px]">
        <svg viewBox="0 0 168 168" className="size-full" aria-hidden="true">
          <circle cx="84" cy="84" r={RADIUS} className="fill-none stroke-surface-3" strokeWidth={14} />
          <circle
            cx="84"
            cy="84"
            r={RADIUS}
            className="fill-none stroke-accent"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            style={{ transform: "rotate(-90deg)", transformOrigin: "84px 84px", transition: "stroke-dashoffset .35s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[46px] font-bold leading-none">{found}</span>
          <span className="mt-0.5 text-[13px] font-semibold text-ink-3">of {total || "—"}</span>
        </div>
      </div>

      <p className="text-center text-[15.5px] font-semibold">
        {total > 0 && found >= total ? "Every plate found" : `${Math.max(total - found, 0)} plates to go`}
      </p>

      <div className="my-5 h-px bg-line" />

      <div className="flex items-baseline justify-between">
        <span className="text-[12.5px] font-semibold text-ink-3">Most recent</span>
        <span className="text-sm font-semibold">{lastFound ? lastFound.state : "Nothing yet"}</span>
      </div>

      <div className="mt-5">
        <NearbyPanel nearby={nearby} plateFor={plateFor} onToggle={onToggle} />
      </div>

      <div className="grow" />

      <button
        type="button"
        onClick={onReset}
        disabled={found === 0}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-danger-line bg-danger-soft text-sm font-semibold text-danger transition-colors hover:border-danger hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-danger-line disabled:hover:bg-danger-soft disabled:hover:text-danger"
      >
        <RefreshIcon />
        Reset progress
      </button>
    </div>
  );
}
