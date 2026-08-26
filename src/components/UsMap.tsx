import { useMediaQuery } from "../hooks/useMediaQuery";
import { STATE_NAMES } from "../data/states";
import { STATE_PATHS } from "../data/usMap";

interface UsMapProps {
  /** Codes already spotted. */
  found: Set<string>;
  /** Codes the app thinks are around you right now. */
  nearby?: Set<string>;
  /** Codes that exist in the plate list — anything else is not clickable. */
  available: Set<string>;
  onToggle: (code: string) => void;
}

/**
 * Eight states are too small to hit on a real map, so they also get a labelled
 * tag out in the Atlantic on a leader line. Anchors are the projected centroids
 * from the same build step that generated the paths.
 */
const CALLOUTS: Array<{ code: string; from: [number, number]; y: number }> = [
  { code: "VT", from: [778.7, 136.5], y: 128 },
  { code: "NH", from: [794.7, 139.7], y: 158 },
  { code: "MA", from: [798.4, 166.4], y: 188 },
  { code: "RI", from: [804.3, 176.1], y: 218 },
  { code: "CT", from: [789.1, 181.4], y: 248 },
  { code: "NJ", from: [768.9, 214.2], y: 278 },
  { code: "DE", from: [762.2, 239.0], y: 308 },
  { code: "DC", from: [741.0, 245.6], y: 338 },
];

const CALLOUT_X = 910;
const CALLOUT_W = 62;
const CALLOUT_H = 26;

export function UsMap({ found, nearby, available, onToggle }: UsMapProps) {
  // Below tablet width the callout tags would render at about four pixels of
  // type, so the map crops to the mainland and the list handles the small ones.
  const roomForCallouts = useMediaQuery("(min-width: 768px)");
  const width = roomForCallouts ? 1000 : 870;

  const codes = Object.keys(STATE_PATHS);

  const label = (code: string) => {
    const name = STATE_NAMES[code] ?? code;
    if (!available.has(code)) return `${name} — not in the plate list`;
    return found.has(code) ? `${name} — found, tap to unmark` : `${name} — not found yet`;
  };

  return (
    <svg
      viewBox={`0 0 ${width} 560`}
      className="block h-auto w-full"
      role="group"
      aria-label="Map of the United States showing which plates you have found"
    >
      <g>
        {codes.map((code) => (
          <path
            key={code}
            className="state-shape"
            d={STATE_PATHS[code]}
            data-found={found.has(code)}
            data-nearby={nearby?.has(code) ?? false}
            onClick={available.has(code) ? () => onToggle(code) : undefined}
            style={available.has(code) ? undefined : { cursor: "default", opacity: 0.55 }}
            role="button"
            tabIndex={available.has(code) ? 0 : -1}
            aria-pressed={found.has(code)}
            onKeyDown={(event) => {
              if (!available.has(code)) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggle(code);
              }
            }}
          >
            <title>{label(code)}</title>
          </path>
        ))}
      </g>

      {roomForCallouts && (
        <g>
          <text x={CALLOUT_X + CALLOUT_W / 2} y={96} className="fill-ink-3 text-[10px] font-bold tracking-[0.11em]" textAnchor="middle">
            SMALL STATES
          </text>
          {CALLOUTS.map(({ code, from, y }) => (
            <g
              key={code}
              className="callout"
              data-found={found.has(code)}
              onClick={available.has(code) ? () => onToggle(code) : undefined}
              style={{ cursor: available.has(code) ? "pointer" : "default" }}
            >
              <title>{label(code)}</title>
              <line className="callout-line" x1={from[0]} y1={from[1]} x2={CALLOUT_X} y2={y} />
              <rect
                className="callout-box"
                x={CALLOUT_X}
                y={y - CALLOUT_H / 2}
                width={CALLOUT_W}
                height={CALLOUT_H}
                rx={7}
              />
              <text className="callout-label" x={CALLOUT_X + CALLOUT_W / 2} y={y}>
                {code}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
