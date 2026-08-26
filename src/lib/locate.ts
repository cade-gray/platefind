import { STATE_NEIGHBORS, STATE_RINGS } from "../data/geo";

/** Even-odd ray cast against a flat [lon, lat, lon, lat, ...] ring. */
function ringContains(ring: number[], lon: number, lat: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
    const xi = ring[i];
    const yi = ring[i + 1];
    const xj = ring[j];
    const yj = ring[j + 1];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** Squared distance in degrees to the closest vertex of a state's outline. */
function squaredDistanceTo(code: string, lon: number, lat: number): number {
  const scale = Math.cos((lat * Math.PI) / 180); // stop longitude over-counting up north
  let best = Infinity;
  for (const ring of STATE_RINGS[code]) {
    for (let i = 0; i < ring.length; i += 2) {
      const dx = (ring[i] - lon) * scale;
      const dy = ring[i + 1] - lat;
      const distance = dx * dx + dy * dy;
      if (distance < best) best = distance;
    }
  }
  return best;
}

/** Roughly 200 miles: past this we assume you have left the country. */
const OFF_THE_MAP = 3;

/**
 * Which state is this coordinate in?
 *
 * The outlines in geo.ts are deliberately coarse, so two neighbours can both
 * claim a point near a border — when that happens the state whose outline runs
 * closest wins, which is what makes the District of Columbia resolvable at all
 * next to Maryland. A point in no state at all falls back to the nearest one,
 * unless it is far enough away that the honest answer is "not here".
 */
export function stateAt(lon: number, lat: number): string | null {
  const hits = Object.keys(STATE_RINGS).filter((code) =>
    STATE_RINGS[code].some((ring) => ringContains(ring, lon, lat)),
  );

  if (hits.length === 1) return hits[0];

  const candidates = hits.length ? hits : Object.keys(STATE_RINGS);
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const code of candidates) {
    const distance = squaredDistanceTo(code, lon, lat);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = code;
    }
  }

  if (!hits.length && Math.sqrt(bestDistance) > OFF_THE_MAP) return null;
  return best;
}

/** The state you are standing in, plus everything it borders. */
export function nearbyStates(code: string): string[] {
  return [code, ...(STATE_NEIGHBORS[code] ?? [])];
}
