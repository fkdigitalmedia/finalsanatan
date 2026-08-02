import { useMemo, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { CITY_PRESETS, type LatLon } from "@/lib/panchang";
import { INDIA_STATES, INDIA_TIMEZONE } from "@/lib/india-locations";

interface Props {
  value: LatLon;
  onChange: (loc: LatLon) => void;
}

const INTL_PRESETS = CITY_PRESETS.filter((c) => c.tz !== INDIA_TIMEZONE);
const INTL_STATE = "🌍 International";

function parseLabel(label: string): { state: string; city: string } | null {
  // Try to match "City, State, India" or "City, India"
  for (const s of INDIA_STATES) {
    const hit = s.cities.find((c) => label.startsWith(`${c.name},`) || label === c.name);
    if (hit) return { state: s.state, city: hit.name };
  }
  return null;
}

export function LocationPicker({ value, onChange }: Props) {
  const initial = useMemo(() => parseLabel(value.label), [value.label]);
  const [state, setState] = useState<string>(
    initial?.state ??
      (INTL_PRESETS.some((c) => c.label === value.label) ? INTL_STATE : INDIA_STATES[0].state),
  );

  const cities = useMemo(() => {
    if (state === INTL_STATE)
      return INTL_PRESETS.map((c) => ({ name: c.label, lat: c.lat, lon: c.lon, tz: c.tz }));
    const s = INDIA_STATES.find((x) => x.state === state);
    return (s?.cities ?? []).map((c) => ({
      name: c.name,
      lat: c.lat,
      lon: c.lon,
      tz: INDIA_TIMEZONE,
    }));
  }, [state]);

  const activeCity = useMemo(() => {
    if (state === INTL_STATE) {
      return INTL_PRESETS.find((c) => c.label === value.label)?.label ?? cities[0]?.name ?? "";
    }
    return initial?.city ?? cities[0]?.name ?? "";
  }, [state, value.label, initial, cities]);

  // If the value doesn't match any city in the new state, snap to first.
  useEffect(() => {
    if (!cities.length) return;
    const match = cities.find((c) =>
      state === INTL_STATE ? c.name === value.label : value.label.startsWith(`${c.name},`),
    );
    if (!match) {
      const first = cities[0];
      onChange({
        lat: first.lat,
        lon: first.lon,
        tz: first.tz,
        label: state === INTL_STATE ? first.name : `${first.name}, ${state}, India`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const selectClass =
    "bg-transparent focus:outline-none font-medium text-foreground [&>option]:bg-background [&>option]:text-foreground max-w-[140px] truncate";

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-sm shadow-sm">
      <MapPin className="size-4 text-accent shrink-0" />
      <span className="text-muted-foreground text-xs uppercase tracking-widest">Location</span>
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className={selectClass}
        aria-label="State"
      >
        {INDIA_STATES.map((s) => (
          <option key={s.state} value={s.state}>
            {s.state}
          </option>
        ))}
        <option value={INTL_STATE}>{INTL_STATE}</option>
      </select>
      <span className="text-muted-foreground">/</span>
      <select
        value={activeCity}
        onChange={(e) => {
          const c = cities.find((x) => x.name === e.target.value);
          if (!c) return;
          onChange({
            lat: c.lat,
            lon: c.lon,
            tz: c.tz,
            label: state === INTL_STATE ? c.name : `${c.name}, ${state}, India`,
          });
        }}
        className={selectClass}
        aria-label="City"
      >
        {cities.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-border bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
    />
  );
}
