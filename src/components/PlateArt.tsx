import { useMemo } from "react";
import type { CSSProperties } from "react";

/**
 * Renders the plate artwork the API ships in `svg_code`.
 *
 * The markup is inlined rather than dropped into an <img src="data:...">, so
 * the SVG's <text> picks up real system fonts and the plate stays crisp at any
 * size. Inlining means trusting the markup, so we strip the handful of things
 * that could execute if the API or the row behind it were ever tampered with.
 * The `id`s inside each design are namespaced by state, so 51 of these can
 * share one document without their gradients cross-wiring.
 */
const EXECUTABLE = /<\s*(script|foreignObject)\b[\s\S]*?<\s*\/\s*\1\s*>/gi;
const SELF_CLOSING = /<\s*(script|foreignObject)\b[^>]*\/\s*>/gi;
const EVENT_ATTRS = /\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URLS = /\s(?:xlink:)?href\s*=\s*("|')\s*javascript:[^"']*\1/gi;

function sanitisePlateSvg(svg: string): string | null {
  const cleaned = svg
    .replace(EXECUTABLE, "")
    .replace(SELF_CLOSING, "")
    .replace(EVENT_ATTRS, "")
    .replace(JS_URLS, "");
  return cleaned.includes("<svg") ? cleaned : null;
}

interface PlateArtProps {
  svg: string;
  className?: string;
  /** Sizes the box; the SVG inside is width/height 100%. */
  style?: CSSProperties;
}

export function PlateArt({ svg, className = "", style }: PlateArtProps) {
  const markup = useMemo(() => sanitisePlateSvg(svg), [svg]);
  if (!markup) return null;
  return (
    <div className={className} style={style} dangerouslySetInnerHTML={{ __html: markup }} />
  );
}
