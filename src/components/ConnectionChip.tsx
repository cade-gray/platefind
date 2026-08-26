import { NoSignalIcon, RefreshIcon, SignalIcon, WarningIcon } from "./Icons";
import { savedAtLabel } from "../lib/savedAt";
import type { ConnectionStatus } from "../types";

interface ConnectionChipProps {
  status: ConnectionStatus;
  savedAt: number | null;
  onRetry: () => void;
}

const TONE: Record<ConnectionStatus, string> = {
  loading: "border-line-2 bg-surface-2 text-ink-2",
  updating: "border-line-2 bg-surface-2 text-ink-2",
  online: "border-accent-line bg-accent-soft text-accent",
  offline: "border-warn-line bg-warn-soft text-warn",
  stale: "border-danger-line bg-danger-soft text-danger",
  error: "border-danger-line bg-danger-soft text-danger",
};

/** The one place the app admits what it knows about the network. */
export function ConnectionChip({ status, savedAt, onRetry }: ConnectionChipProps) {
  const label = {
    loading: "Loading list…",
    updating: "Updating list…",
    online: "Online",
    offline: "Offline — cached",
    stale: `List from ${savedAtLabel(savedAt)}`,
    error: "Can't reach the list",
  }[status];

  const icon = {
    loading: <RefreshIcon />,
    updating: <RefreshIcon />,
    online: <SignalIcon />,
    offline: <NoSignalIcon />,
    stale: <WarningIcon />,
    error: <WarningIcon />,
  }[status];

  const retryable = status === "error" || status === "stale";

  return (
    <button
      type="button"
      onClick={retryable ? onRetry : undefined}
      disabled={!retryable}
      title={savedAt ? `Plate list saved ${savedAtLabel(savedAt)}` : undefined}
      className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[13.5px] font-semibold ${TONE[status]} ${
        retryable ? "cursor-pointer hover:brightness-95" : "cursor-default"
      }`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

/** The banner that sits under the header whenever the list is not live. */
export function ConnectionBanner({ status, savedAt, onRetry }: ConnectionChipProps) {
  if (status !== "offline" && status !== "stale" && status !== "error") return null;

  const tone =
    status === "offline"
      ? "border-warn-line bg-warn-soft text-warn"
      : "border-danger-line bg-danger-soft text-danger";

  const headline =
    status === "offline"
      ? `No signal — showing the plate list saved ${savedAtLabel(savedAt)}.`
      : status === "stale"
        ? `No signal, and the saved list is from ${savedAtLabel(savedAt)}.`
        : "Couldn't reach the plate list just now.";

  const detail =
    status === "offline"
      ? "Everything you check off is saved on this device and syncs when you get bars again."
      : status === "stale"
        ? "Newer plate designs may be missing. The game still counts."
        : "You're online, so this is on our end. Your progress is safe either way.";

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-3 sm:px-10 ${tone}`}>
      <WarningIcon />
      <span className="text-[13.5px] font-semibold">{headline}</span>
      <span className="text-[13.5px] opacity-80">{detail}</span>
      {status === "error" && (
        <button type="button" onClick={onRetry} className="text-[13.5px] font-semibold underline underline-offset-2">
          Try again
        </button>
      )}
    </div>
  );
}
