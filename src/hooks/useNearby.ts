import { useCallback, useEffect, useRef, useState } from "react";
import { nearbyStates, stateAt } from "../lib/locate";

export type NearbyStatus =
  | "unsupported" // no geolocation in this browser, or an insecure origin
  | "idle" // we have not asked yet, and will not until you say so
  | "locating"
  | "ready"
  | "denied"
  | "outside" // located, but nowhere near the fifty states
  | "error";

export interface Nearby {
  status: NearbyStatus;
  /** Postal code of the state you are in. */
  code: string | null;
  /** That state plus everything it borders. */
  codes: string[];
  request: () => void;
  stop: () => void;
}

/**
 * Which states are plausibly around you.
 *
 * Uses watchPosition rather than a one-shot fix: the entire point is that you
 * are moving, and crossing a state line should quietly change the answer.
 * Location comes from the device, so unlike everything else on the network this
 * keeps working with no signal at all.
 */
export function useNearby(): Nearby {
  const supported = typeof navigator !== "undefined" && "geolocation" in navigator;
  const [status, setStatus] = useState<NearbyStatus>(supported ? "idle" : "unsupported");
  const [code, setCode] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const request = useCallback(() => {
    if (!supported || watchId.current !== null) return;
    setStatus("locating");
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const found = stateAt(position.coords.longitude, position.coords.latitude);
        setCode(found);
        setStatus(found ? "ready" : "outside");
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "error");
        stop();
      },
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 20_000 },
    );
  }, [supported, stop]);

  // If permission was granted on an earlier visit, pick straight up where we
  // left off. Otherwise wait to be asked — nobody wants a location prompt in
  // their face on first load.
  useEffect(() => {
    if (!supported || !navigator.permissions?.query) return;
    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (cancelled) return;
        if (result.state === "granted") request();
        else if (result.state === "denied") setStatus("denied");
      })
      .catch(() => {
        // Permissions API is optional; the button still works without it
      });
    return () => {
      cancelled = true;
    };
  }, [supported, request]);

  useEffect(() => stop, [stop]);

  return {
    status,
    code,
    codes: status === "ready" && code ? nearbyStates(code) : [],
    request,
    stop,
  };
}
