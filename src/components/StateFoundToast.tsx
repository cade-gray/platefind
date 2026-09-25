import { useEffect } from "react";
import { CheckIcon, CloseIcon } from "./Icons";
import type { BoardPlate } from "../types";

interface StateFoundToastProps {
  plate: BoardPlate;
  onUndo: () => void;
  onDismiss: () => void;
}

const DURATION_MS = 3000;

/** Confirms a find and offers a beat to undo a stray tap before it auto-dismisses. */
export function StateFoundToast({ plate, onUndo, onDismiss }: StateFoundToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-sm sm:-translate-x-1/2"
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="flex items-center gap-3 p-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-soft text-accent">
            <CheckIcon size={18} />
          </span>
          <div className="min-w-0 grow">
            <p className="truncate text-[14.5px] font-bold leading-tight">{plate.state} found!</p>
            <p className="truncate text-[12px] text-ink-2">{plate.design_name}</p>
          </div>
          <button
            type="button"
            onClick={onUndo}
            className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-line-2 bg-surface px-3 text-[13px] font-semibold transition-colors hover:bg-surface-2"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <CloseIcon size={15} />
          </button>
        </div>
        <div className="h-1 w-full bg-surface-2">
          <div
            key={plate.id}
            className="h-full origin-left bg-accent"
            style={{ animation: `toast-timer ${DURATION_MS}ms linear forwards` }}
          />
        </div>
      </div>
    </div>
  );
}
