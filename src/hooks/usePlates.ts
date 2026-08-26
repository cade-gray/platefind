import { useCallback, useEffect, useRef, useState } from "react";
import type { ConnectionStatus, Plate } from "../types";

const API = "https://api.platefind.app/plates";
const CACHE_KEY = "platefind:plateCache";
const STALE_AFTER = 30 * 24 * 60 * 60 * 1000; // a month on the road is a long time

interface CacheEntry {
  savedAt: number;
  plates: Plate[];
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (!Array.isArray(parsed?.plates) || typeof parsed.savedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(plates: Plate[]): number {
  const savedAt = Date.now();
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt, plates } satisfies CacheEntry));
  } catch {
    // over quota or storage disabled: the session still works, it just won't
    // survive going offline
  }
  return savedAt;
}

/**
 * Cache-first plate list.
 *
 * The saved list renders immediately so the app is usable before — and without
 * — any network, then a background refresh replaces it if the API answers.
 * A failed refresh never clears what we already have; out past the last cell
 * tower the cached list *is* the product.
 */
export function usePlates() {
  const cached = useRef(readCache()).current;
  const [plates, setPlates] = useState<Plate[]>(cached?.plates ?? []);
  const [savedAt, setSavedAt] = useState<number | null>(cached?.savedAt ?? null);
  const [fetching, setFetching] = useState(false);
  const [failed, setFailed] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setFetching(true);
    try {
      const response = await fetch(API, { signal });
      if (!response.ok) throw new Error(`API responded ${response.status}`);
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("API did not return a list");
      setPlates(data as Plate[]);
      setSavedAt(writeCache(data as Plate[]));
      setFailed(false);
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;
      console.error("Could not refresh the plate list:", error);
      setFailed(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (navigator.onLine) void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  // coming back into signal is the moment to catch up
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      void refresh();
    };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [refresh]);

  const stale = savedAt !== null && Date.now() - savedAt > STALE_AFTER;

  let status: ConnectionStatus;
  if (!online) status = stale ? "stale" : "offline";
  else if (fetching) status = plates.length ? "updating" : "loading";
  else if (failed) status = "error";
  else if (!plates.length) status = "loading";
  else status = "online";

  return { plates, savedAt, status, refresh: () => void refresh() };
}
