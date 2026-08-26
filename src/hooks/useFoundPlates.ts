import { useCallback, useEffect, useState } from "react";

// Kept as-is from the first version of the app so nobody loses a trip's
// progress to the redesign.
const KEY = "checkedPlates";

function readFound(): Set<number> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is number => typeof id === "number"));
  } catch (error) {
    console.error("Could not read saved plates:", error);
    return new Set();
  }
}

const LAST_KEY = "platefind:lastFound";

function readLastFound(): number | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    const id = raw === null ? NaN : Number(raw);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

/** The set of plate ids already spotted. Local to the device, always. */
export function useFoundPlates() {
  const [found, setFound] = useState<Set<number>>(readFound);
  const [lastFoundId, setLastFoundId] = useState<number | null>(readLastFound);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify([...found]));
    } catch (error) {
      console.error("Could not save your plates:", error);
    }
  }, [found, loaded]);

  const toggle = useCallback((id: number) => {
    setFound((current) => {
      const next = new Set(current);
      const adding = !next.has(id);
      if (adding) next.add(id);
      else next.delete(id);

      // "Most recent" only ever means the last plate someone actually claimed,
      // so unmarking that one leaves us with nothing to point at rather than
      // an older find we never recorded an order for.
      const nextLast = adding ? id : lastFoundId === id ? null : lastFoundId;
      setLastFoundId(nextLast);
      try {
        if (nextLast === null) localStorage.removeItem(LAST_KEY);
        else localStorage.setItem(LAST_KEY, String(nextLast));
      } catch {
        // survivable
      }
      return next;
    });
  }, [lastFoundId]);

  const reset = useCallback(() => {
    setFound(new Set());
    setLastFoundId(null);
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(LAST_KEY);
    } catch {
      // the state reset already happened; the write will retry on next change
    }
  }, []);

  return { found, lastFoundId, toggle, reset };
}
