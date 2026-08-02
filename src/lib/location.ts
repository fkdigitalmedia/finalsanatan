import { useEffect, useState } from "react";
import { DEFAULT_LOCATION, type LatLon } from "./panchang";

const KEY = "st.location.v1";

export function useLocation(): [LatLon, (loc: LatLon) => void] {
  const [loc, setLoc] = useState<LatLon>(DEFAULT_LOCATION);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLoc(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);
  const save = (next: LatLon) => {
    setLoc(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  return [loc, save];
}

// Hydration-safe "is client mounted" flag.
export function useHydrated(): boolean {
  const [h, setH] = useState(false);
  useEffect(() => {
    setH(true);
  }, []);
  return h;
}
