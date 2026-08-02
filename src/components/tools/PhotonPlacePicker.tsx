import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, Search, AlertCircle } from "lucide-react";
import type { LatLon } from "@/lib/panchang";

/**
 * Photon (OpenStreetMap) autocomplete for Place of Birth.
 *
 * - Debounces queries by 300ms
 * - Only queries when input length >= 3
 * - Cancels stale in-flight requests (AbortController) — no duplicate hits
 * - Keyboard navigation: ↑ / ↓ / Enter / Escape
 * - Loading spinner + graceful manual-entry fallback if API fails
 * - Mobile friendly (large tap targets, full-width dropdown)
 */

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    district?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    osm_id?: number;
    osm_key?: string;
    osm_value?: string;
  };
}

interface Suggestion {
  key: string;
  label: string; // full "City, District, State, Country"
  primary: string; // headline (city/place name)
  secondary: string; // "District · State · Country"
  lat: number;
  lon: number;
  countryCode?: string;
}

function toSuggestion(f: PhotonFeature, idx: number): Suggestion {
  const p = f.properties;
  const [lon, lat] = f.geometry.coordinates;
  const primary = p.name || p.city || p.town || p.village || p.county || p.state || "Unnamed place";
  const parts = [
    p.city && p.city !== primary ? p.city : null,
    p.district || p.county || null,
    p.state || null,
    p.country || null,
  ].filter(Boolean) as string[];
  // De-duplicate consecutive repeats
  const cleaned = parts.filter((x, i) => x !== parts[i - 1] && x !== primary);
  const label = [primary, ...cleaned].join(", ");
  const secondary = cleaned.join(" · ") || "—";
  return {
    key: `${p.osm_key ?? "x"}-${p.osm_id ?? idx}-${lat}-${lon}`,
    label,
    primary,
    secondary,
    lat,
    lon,
    countryCode: p.countrycode?.toUpperCase(),
  };
}

function resolveTimezone(countryCode?: string): string {
  if (countryCode === "IN") return "Asia/Kolkata";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

interface Props {
  value: LatLon;
  onChange: (loc: LatLon) => void;
  label?: string;
  id?: string;
}

export function PhotonPlacePicker({
  value,
  onChange,
  label = "Place of birth",
  id = "photon-place",
}: Props) {
  const [query, setQuery] = useState<string>(value.label ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(0);
  const [manualMode, setManualMode] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listboxId = `${id}-listbox`;

  // Keep the input in sync when parent replaces value (e.g. via a reset).
  useEffect(() => {
    setQuery((prev) => (prev === "" ? (value.label ?? "") : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced fetch
  useEffect(() => {
    const q = query.trim();
    if (manualMode) return;
    if (q.length < 3) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      abortRef.current?.abort();
      return;
    }
    if (q === lastQueryRef.current && suggestions.length) return;

    const handle = setTimeout(() => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      lastQueryRef.current = q;
      setLoading(true);
      setError(null);

      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lang=en`;
      fetch(url, { signal: ctrl.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`Photon ${r.status}`);
          return r.json() as Promise<{ features: PhotonFeature[] }>;
        })
        .then((json) => {
          const list = (json.features ?? []).map(toSuggestion);
          setSuggestions(list);
          setOpen(true);
          setHighlight(0);
        })
        .catch((e) => {
          if (e?.name === "AbortError") return;
          setSuggestions([]);
          setError("Couldn't reach the location service. Enter your city manually below.");
          setOpen(true);
        })
        .finally(() => {
          if (!ctrl.signal.aborted) setLoading(false);
        });
    }, 300);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, manualMode]);

  // Close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (s: Suggestion) => {
    onChange({
      lat: s.lat,
      lon: s.lon,
      label: s.label,
      tz: resolveTimezone(s.countryCode),
    });
    setQuery(s.label);
    setOpen(false);
    setError(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !suggestions.length) {
      if (e.key === "ArrowDown" && suggestions.length) {
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const s = suggestions[highlight];
      if (s) pick(s);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hasCoords = useMemo(
    () => Number.isFinite(value.lat) && Number.isFinite(value.lon),
    [value.lat, value.lon],
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <MapPin className="size-4" />
        </span>
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && suggestions[highlight] ? `${listboxId}-${highlight}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          inputMode="search"
          placeholder="Start typing your city, e.g. Varanasi"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setManualMode(false);
            setOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          aria-label={label}
          className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-10 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4 opacity-60" />
          )}
        </span>
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
        >
          {error && (
            <div className="flex items-start gap-2 px-3 py-3 text-xs text-destructive border-b border-border/60">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!error && suggestions.length === 0 && !loading && query.trim().length >= 3 && (
            <div className="px-3 py-3 text-xs text-muted-foreground">
              No matches. Try a different spelling or switch to manual entry.
            </div>
          )}

          {!error && query.trim().length < 3 && (
            <div className="px-3 py-3 text-xs text-muted-foreground">
              Type at least 3 letters to search…
            </div>
          )}

          {suggestions.map((s, i) => (
            <button
              type="button"
              id={`${listboxId}-${i}`}
              role="option"
              aria-selected={i === highlight}
              key={s.key}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => pick(s)}
              className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                i === highlight ? "bg-accent/60 text-accent-foreground" : "hover:bg-muted"
              }`}
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span className="min-w-0">
                <span className="block truncate font-medium">{s.primary}</span>
                <span className="block truncate text-xs text-muted-foreground">{s.secondary}</span>
              </span>
            </button>
          ))}

          <div className="border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
            Results by{" "}
            <a
              href="https://photon.komoot.io/"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2"
            >
              Photon / OpenStreetMap
            </a>
            {" · "}
            <button
              type="button"
              className="underline underline-offset-2"
              onClick={() => {
                setManualMode(true);
                setOpen(false);
              }}
            >
              Enter manually
            </button>
          </div>
        </div>
      )}

      {/* Manual fallback */}
      {manualMode && (
        <div className="mt-2 grid grid-cols-1 gap-2 rounded-md border border-dashed border-border/70 bg-muted/40 p-2 sm:grid-cols-3">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange({ ...value, label: e.target.value });
            }}
            placeholder="Place name"
            aria-label="Place name (manual)"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm sm:col-span-3"
          />
          <input
            type="number"
            step="0.0001"
            min={-90}
            max={90}
            value={Number.isFinite(value.lat) ? value.lat : ""}
            onChange={(e) => onChange({ ...value, lat: parseFloat(e.target.value) || 0 })}
            placeholder="Latitude"
            aria-label="Latitude"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            type="number"
            step="0.0001"
            min={-180}
            max={180}
            value={Number.isFinite(value.lon) ? value.lon : ""}
            onChange={(e) => onChange({ ...value, lon: parseFloat(e.target.value) || 0 })}
            placeholder="Longitude"
            aria-label="Longitude"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            type="text"
            value={value.tz}
            onChange={(e) => onChange({ ...value, tz: e.target.value })}
            placeholder="IANA timezone e.g. Asia/Kolkata"
            aria-label="Timezone"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          />
        </div>
      )}

      {hasCoords && !manualMode && (
        <p className="mt-1 text-xs text-muted-foreground">
          {value.lat.toFixed(4)}°, {value.lon.toFixed(4)}° · timezone {value.tz}
        </p>
      )}
    </div>
  );
}
