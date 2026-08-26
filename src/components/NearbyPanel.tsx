import { CheckIcon, PinIcon } from "./Icons";
import { STATE_NAMES } from "../data/states";
import type { Nearby } from "../hooks/useNearby";
import type { BoardPlate } from "../types";

interface NearbyPanelProps {
  nearby: Nearby;
  plateFor: (code: string) => BoardPlate | undefined;
  onToggle: (id: number) => void;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-3">
        <PinIcon size={14} />
        Nearby
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const HINT = "text-[13px] leading-relaxed text-ink-2";

/**
 * Which plates are actually plausible from where you are: the state you are in
 * and everything it borders. Location comes from the device, so this is one of
 * the few things that still works with no signal.
 */
export function NearbyPanel({ nearby, plateFor, onToggle }: NearbyPanelProps) {
  if (nearby.status === "unsupported") return null;

  if (nearby.status === "idle") {
    return (
      <Shell>
        <p className={HINT}>See which plates you are likely to spot from where you are.</p>
        <button
          type="button"
          onClick={nearby.request}
          className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-line-2 bg-surface text-sm font-semibold transition-colors hover:bg-surface-2"
        >
          <PinIcon size={16} />
          Use my location
        </button>
      </Shell>
    );
  }

  if (nearby.status === "locating") {
    return (
      <Shell>
        <p className={HINT}>Finding you…</p>
      </Shell>
    );
  }

  if (nearby.status === "denied") {
    return (
      <Shell>
        <p className={HINT}>
          Location is switched off for this site. Turn it back on in your browser settings to see what is around
          you.
        </p>
      </Shell>
    );
  }

  if (nearby.status === "error") {
    return (
      <Shell>
        <p className={HINT}>Couldn’t get a fix on your location.</p>
        <button
          type="button"
          onClick={nearby.request}
          className="mt-2 text-[13px] font-semibold text-accent underline underline-offset-2"
        >
          Try again
        </button>
      </Shell>
    );
  }

  if (nearby.status === "outside" || !nearby.code) {
    return (
      <Shell>
        <p className={HINT}>You are off the map — no states within range of here.</p>
      </Shell>
    );
  }

  const entries = nearby.codes
    .map((code) => ({ code, plate: plateFor(code) }))
    .filter((entry): entry is { code: string; plate: BoardPlate } => Boolean(entry.plate))
    .sort((a, b) => Number(a.plate.found) - Number(b.plate.found) || a.code.localeCompare(b.code));

  const remaining = entries.filter((entry) => !entry.plate.found).length;

  return (
    <Shell>
      <p className="text-[13px] text-ink-2">
        You’re in <span className="font-semibold text-ink">{STATE_NAMES[nearby.code] ?? nearby.code}</span>
        {remaining > 0 ? (
          <>
            {" — "}
            <span className="font-semibold text-accent">{remaining}</span> still to find around here
          </>
        ) : (
          " — all caught up around here"
        )}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {entries.map(({ code, plate }) => (
          <button
            key={code}
            type="button"
            onClick={() => onToggle(plate.id)}
            aria-pressed={plate.found}
            aria-label={plate.found ? `Unmark ${plate.state}` : `Mark ${plate.state} as found`}
            title={plate.state}
            className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 font-display text-[12.5px] font-bold transition-colors ${
              plate.found
                ? "border-accent-line bg-accent-soft text-accent"
                : "border-line-2 bg-surface text-ink hover:border-accent hover:text-accent"
            }`}
          >
            {plate.found && <CheckIcon size={12} />}
            {code}
          </button>
        ))}
      </div>
    </Shell>
  );
}
