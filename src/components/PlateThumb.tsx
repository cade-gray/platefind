import { PlateArt } from "./PlateArt";
import type { BoardPlate } from "../types";

interface PlateThumbProps {
  plate: BoardPlate;
  /** Overall plate width in px; type scales from it. */
  width?: number;
}

/**
 * A plate at thumbnail size.
 *
 * When the API has artwork for the state we draw the real design; the colour
 * card below is the fallback for a plate whose SVG has not been authored yet.
 * Both are 2:1, the proportions of an actual 12x6in US plate.
 */
export function PlateThumb({ plate, width = 106 }: PlateThumbProps) {
  const height = width * 0.5;

  if (plate.svg_code) {
    return (
      <PlateArt
        svg={plate.svg_code}
        className="shrink-0 overflow-hidden rounded-md"
        style={{ width, height }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 flex-col items-center justify-between rounded-md shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)]"
      style={{
        width,
        height,
        padding: `${height * 0.09}px ${width * 0.06}px`,
        background: plate.face,
        border: `1.5px solid ${plate.edge}`,
      }}
    >
      <span
        className="font-semibold uppercase leading-none"
        style={{ fontSize: Math.max(5.5, width * 0.071), letterSpacing: "0.1em", color: plate.ink }}
      >
        {plate.state}
      </span>
      <span
        className="font-mono font-bold leading-none"
        style={{ fontSize: width * 0.19, letterSpacing: "0.06em", color: plate.ink }}
      >
        {plate.code ?? "—"}
      </span>
      <span
        className="truncate font-semibold leading-none opacity-80"
        style={{ fontSize: Math.max(5, width * 0.062), maxWidth: "100%", color: plate.ink }}
      >
        {plate.design_name}
      </span>
    </div>
  );
}
