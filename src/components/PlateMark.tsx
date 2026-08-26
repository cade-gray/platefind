import type { CSSProperties } from "react";

interface PlateMarkProps {
  className?: string;
}

/**
 * The PlateFind wordmark, set as an embossed license plate.
 *
 * Everything scales off one custom property so the mark shrinks on a phone
 * without needing a second copy in the DOM — display lives in the .platemark
 * class so callers can't collide with it.
 */
export function PlateMark({ className = "" }: PlateMarkProps) {
  return (
    <div
      className={`platemark ${className}`}
      style={
        {
          "--pm": "clamp(16px, 4.2vw, 25px)",
          padding: "calc(var(--pm) * 0.24) calc(var(--pm) * 0.72) calc(var(--pm) * 0.28)",
        } as CSSProperties
      }
    >
      <div
        className="font-semibold text-plate-ink/70"
        style={{ fontSize: "max(6.5px, calc(var(--pm) * 0.32))", letterSpacing: "0.2em" }}
      >
        U · S · A ROAD TRIP
      </div>
      <div className="platemark-word" style={{ fontSize: "var(--pm)" }}>
        PLATEFIND
      </div>
    </div>
  );
}
