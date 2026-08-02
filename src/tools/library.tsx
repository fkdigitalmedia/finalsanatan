import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Sparkles,
  ExternalLink,
  Filter,
  Copy as CopyIcon,
  Check,
  Star,
  Sun as SunIcon,
  Moon as MoonIcon,
  Clock,
  Calendar,
  Flame,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import { ToolCardFrame } from "@/components/tools/ToolShell";
import { AIRunner } from "@/components/tools/AIToolShell";
import { LocationPicker, DateInput } from "@/components/tools/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useHydrated, useLocation } from "@/lib/location";
import {
  fmtTime,
  fmtLocalDate,
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSunTimes,
  getKaalWindow,
  getChoghadiya,
  WEEKDAYS,
  getLocalWeekday,
  moonLon,
  sunLon,
} from "@/lib/panchang";
import { FESTIVALS_2026 } from "@/lib/festivals-data";
import {
  MANTRAS,
  DEITIES,
  EKADASHIS_2026,
  LUNAR_DAYS_2026,
  PRADOSH_2026,
  SANKASHTI_2026,
  VRATS,
  WEEKDAY_LORDS,
  HORA_SEQUENCE,
  HORA_QUALITY,
  NAKSHATRA_SYLLABLES,
  RASHI_SYLLABLES,
  BABY_NAMES,
  SANSKRIT_DICT,
  GITA_CHAPTERS,
  UPANISHADS,
  VEDAS,
  YOGA_SUTRAS,
  MAHAPURANAS,
  RAMAYANA_KANDAS,
  MAHABHARATA_PARVAS,
  TEMPLES_EX,
  SAMAGRI_LISTS,
  GEMSTONES,
  PRASAD_RECIPES,
  AARTI_THALI_ITEMS,
  iastToDevanagari,
  nameNumerology,
  lifePathNumber,
  dashaSequence,
} from "@/lib/library-data";

/* ─────────────────────── SHARED PRIMITIVES ─────────────────────── */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Kv({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-border/60 last:border-b-0">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="text-right font-medium">{v}</div>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border text-muted-foreground hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="gap-1.5"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          toast.success("Copied");
          setTimeout(() => setOk(false), 1200);
        } catch {}
      }}
    >
      {ok ? <Check className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      Copy
    </Button>
  );
}

function useToolDate() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const dateObj = useMemo(() => new Date(`${date}T06:00:00Z`), [date]);
  return { date, setDate, dateObj };
}

function useLive() {
  const hydrated = useHydrated();
  const [loc, setLoc] = useLocation();
  return { hydrated, loc, setLoc };
}

/* ═══════════════════════ PANCHANG (extra) ═══════════════════════ */

export function PanchangByDate() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated) return <ToolCardFrame>Loading…</ToolCardFrame>;
  const tithi = getTithi(dateObj);
  const nak = getNakshatra(dateObj);
  const yoga = getYoga(dateObj);
  const karana = getKarana(dateObj);
  const sun = getSunTimes(dateObj, loc);
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <DateInput value={date} onChange={setDate} />
        <LocationPicker value={loc} onChange={setLoc} />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <ToolCardFrame title="Panchang">
          <Kv k="Date" v={fmtLocalDate(dateObj, loc.tz)} />
          <Kv k="Weekday" v={WEEKDAYS[getLocalWeekday(dateObj, loc.tz)]} />
          <Kv k="Tithi" v={`${tithi.name} (${tithi.paksha})`} />
          <Kv k="Nakshatra" v={`${nak.name} — pada ${nak.pada}`} />
          <Kv k="Yoga" v={yoga.name} />
          <Kv k="Karana" v={karana.name} />
        </ToolCardFrame>
        <ToolCardFrame title="Sun timings">
          <Kv k="Sunrise" v={fmtTime(sun.sunrise, loc.tz)} />
          <Kv k="Solar noon" v={fmtTime(sun.solarNoon, loc.tz)} />
          <Kv k="Sunset" v={fmtTime(sun.sunset, loc.tz)} />
          <Kv
            k="Day length"
            v={
              sun.dayLengthMinutes
                ? `${Math.floor(sun.dayLengthMinutes / 60)}h ${sun.dayLengthMinutes % 60}m`
                : "—"
            }
          />
        </ToolCardFrame>
      </div>
    </>
  );
}

export function HoraChart() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated) return <ToolCardFrame>Loading…</ToolCardFrame>;
  const sun = getSunTimes(dateObj, loc);
  if (!sun.sunrise || !sun.sunset)
    return <ToolCardFrame>Sun does not rise on this date at this location.</ToolCardFrame>;
  const wk = getLocalWeekday(sun.sunrise, loc.tz);
  const firstLord = WEEKDAY_LORDS[wk].hora_first;
  const startIdx = HORA_SEQUENCE.indexOf(firstLord);
  const nextSunrise = getSunTimes(new Date(dateObj.getTime() + 24 * 3600 * 1000), loc).sunrise;
  const dayHora = (sun.sunset.getTime() - sun.sunrise.getTime()) / 12;
  const nightHora = nextSunrise ? (nextSunrise.getTime() - sun.sunset.getTime()) / 12 : dayHora;
  const rows: { i: number; start: Date; end: Date; lord: string; kind: "Day" | "Night" }[] = [];
  for (let i = 0; i < 12; i++) {
    rows.push({
      i: i + 1,
      start: new Date(sun.sunrise.getTime() + i * dayHora),
      end: new Date(sun.sunrise.getTime() + (i + 1) * dayHora),
      lord: HORA_SEQUENCE[(startIdx + i) % 7],
      kind: "Day",
    });
  }
  for (let i = 0; i < 12; i++) {
    rows.push({
      i: i + 13,
      start: new Date(sun.sunset.getTime() + i * nightHora),
      end: new Date(sun.sunset.getTime() + (i + 1) * nightHora),
      lord: HORA_SEQUENCE[(startIdx + 12 + i) % 7],
      kind: "Night",
    });
  }
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <DateInput value={date} onChange={setDate} />
        <LocationPicker value={loc} onChange={setLoc} />
      </div>
      <ToolCardFrame title={`Planetary Hora — ${WEEKDAYS[wk]}`}>
        <div className="grid sm:grid-cols-2 gap-2">
          {rows.map((r) => {
            const q = HORA_QUALITY[r.lord];
            return (
              <div
                key={r.i}
                className={`rounded-xl border p-3 text-sm ${q.quality === "auspicious" ? "border-success/40 bg-success/5" : q.quality === "inauspicious" ? "border-destructive/40 bg-destructive/5" : "border-border bg-card"}`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium">
                    {r.i}. {r.lord}
                  </span>
                  <span className="text-xs text-muted-foreground">{r.kind}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {fmtTime(r.start, loc.tz)} – {fmtTime(r.end, loc.tz)}
                </div>
                <div className="text-xs mt-1">{q.note}</div>
              </div>
            );
          })}
        </div>
      </ToolCardFrame>
    </>
  );
}

const ATLAS_CITIES = [
  { name: "Delhi", label: "Delhi", lat: 28.6139, lon: 77.209, tz: "Asia/Kolkata" },
  { name: "Mumbai", label: "Mumbai", lat: 19.076, lon: 72.8777, tz: "Asia/Kolkata" },
  { name: "Kolkata", label: "Kolkata", lat: 22.5726, lon: 88.3639, tz: "Asia/Kolkata" },
  { name: "Chennai", label: "Chennai", lat: 13.0827, lon: 80.2707, tz: "Asia/Kolkata" },
  { name: "Bengaluru", label: "Bengaluru", lat: 12.9716, lon: 77.5946, tz: "Asia/Kolkata" },
  { name: "Varanasi", label: "Varanasi", lat: 25.3176, lon: 82.9739, tz: "Asia/Kolkata" },
  { name: "Ahmedabad", label: "Ahmedabad", lat: 23.0225, lon: 72.5714, tz: "Asia/Kolkata" },
  { name: "London", label: "London", lat: 51.5074, lon: -0.1278, tz: "Europe/London" },
  { name: "New York", label: "New York", lat: 40.7128, lon: -74.006, tz: "America/New_York" },
  { name: "Dubai", label: "Dubai", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" },
];
export function SunriseSunsetAtlas() {
  const { hydrated } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated) return <ToolCardFrame>Loading…</ToolCardFrame>;
  return (
    <>
      <div className="mb-6 max-w-xs">
        <DateInput value={date} onChange={setDate} />
      </div>
      <ToolCardFrame title="Sunrise & Sunset — around the world">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ATLAS_CITIES.map((c) => {
            const s = getSunTimes(dateObj, c);
            return (
              <div key={c.name} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 font-medium">
                  <MapPin className="size-4 text-accent" />
                  {c.name}
                </div>
                <div className="mt-2 text-sm flex items-center gap-2">
                  <SunIcon className="size-3.5 text-primary" /> {fmtTime(s.sunrise, c.tz)}
                </div>
                <div className="text-sm flex items-center gap-2">
                  <MoonIcon className="size-3.5 text-accent" /> {fmtTime(s.sunset, c.tz)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Day:{" "}
                  {s.dayLengthMinutes
                    ? `${Math.floor(s.dayLengthMinutes / 60)}h ${s.dayLengthMinutes % 60}m`
                    : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </ToolCardFrame>
    </>
  );
}

export function MoonPhase() {
  const { hydrated, loc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated) return <ToolCardFrame>Loading…</ToolCardFrame>;
  const diff = (moonLon(dateObj) - sunLon(dateObj) + 360) % 360;
  const phase = diff / 360; // 0..1
  const illum = (1 - Math.cos((diff * Math.PI) / 180)) / 2;
  const name =
    phase < 0.03 || phase > 0.97
      ? "New Moon (Amavasya)"
      : phase < 0.22
        ? "Waxing Crescent"
        : phase < 0.28
          ? "First Quarter"
          : phase < 0.47
            ? "Waxing Gibbous"
            : phase < 0.53
              ? "Full Moon (Purnima)"
              : phase < 0.72
                ? "Waning Gibbous"
                : phase < 0.78
                  ? "Last Quarter"
                  : "Waning Crescent";
  return (
    <>
      <div className="mb-6 max-w-xs">
        <DateInput value={date} onChange={setDate} />
      </div>
      <ToolCardFrame title="Moon phase">
        <div className="flex items-center gap-6">
          <div className="relative size-32 rounded-full bg-gradient-to-br from-accent/30 to-background border-2 border-border overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${phase < 0.5 ? "70%" : "30%"} 50%, hsl(var(--primary)) 0%, hsl(var(--primary)) ${illum * 60}%, transparent ${illum * 60 + 5}%)`,
              }}
            />
          </div>
          <div>
            <div className="font-display text-2xl font-semibold">{name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Illumination: {(illum * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Phase angle: {diff.toFixed(1)}°</div>
            <div className="text-sm mt-2">{fmtLocalDate(dateObj, loc.tz)}</div>
          </div>
        </div>
      </ToolCardFrame>
    </>
  );
}

export function AbhijitMuhurat() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated) return <ToolCardFrame>Loading…</ToolCardFrame>;
  const sun = getSunTimes(dateObj, loc);
  const wk = sun.sunrise ? getLocalWeekday(sun.sunrise, loc.tz) : 0;
  const isWed = wk === 3;
  let start: Date | null = null,
    end: Date | null = null;
  if (sun.sunrise && sun.sunset) {
    const dayLen = sun.sunset.getTime() - sun.sunrise.getTime();
    const noon = new Date(sun.sunrise.getTime() + dayLen / 2);
    const half = dayLen / 30; // 1/15th of the day (~48 min)
    start = new Date(noon.getTime() - half);
    end = new Date(noon.getTime() + half);
  }
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <DateInput value={date} onChange={setDate} />
        <LocationPicker value={loc} onChange={setLoc} />
      </div>
      <ToolCardFrame title="Abhijit Muhurat">
        <Kv
          k="Window"
          v={start && end ? `${fmtTime(start, loc.tz)} – ${fmtTime(end, loc.tz)}` : "—"}
        />
        <Kv k="Duration" v="~48 minutes (1/15th of the day)" />
        <Kv
          k="Quality"
          v={
            isWed ? (
              <span className="text-destructive">Not observed on Wednesday</span>
            ) : (
              <span className="text-success">Auspicious for shubh karma</span>
            )
          }
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Abhijit is the eighth of the fifteen day-muhurats, centred on solar noon. Traditionally
          the most auspicious window for new starts — except on Wednesdays.
        </p>
      </ToolCardFrame>
    </>
  );
}

export function BrahmaMuhurat() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated) return <ToolCardFrame>Loading…</ToolCardFrame>;
  const sun = getSunTimes(dateObj, loc);
  let start: Date | null = null,
    end: Date | null = null;
  if (sun.sunrise) {
    end = new Date(sun.sunrise.getTime() - 48 * 60 * 1000);
    start = new Date(sun.sunrise.getTime() - 96 * 60 * 1000);
  }
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <DateInput value={date} onChange={setDate} />
        <LocationPicker value={loc} onChange={setLoc} />
      </div>
      <ToolCardFrame title="Brahma Muhurat">
        <Kv
          k="Window"
          v={start && end ? `${fmtTime(start, loc.tz)} – ${fmtTime(end, loc.tz)}` : "—"}
        />
        <Kv k="Duration" v="~96 minutes before sunrise" />
        <Kv k="Ideal for" v="Meditation, jaap, study, yoga" />
        <p className="mt-4 text-sm text-muted-foreground">
          The two muhurats before sunrise are called Brahma Muhurat — the sattva-rich window when
          the mind is most receptive to spiritual practice.
        </p>
      </ToolCardFrame>
    </>
  );
}

/* ═══════════════════════ FESTIVALS ═══════════════════════ */

function ListWithFilter<T extends { name: string; date: string }>({
  items,
  filters,
  activeFilter,
  onFilter,
  extraRender,
}: {
  items: T[];
  filters?: string[];
  activeFilter?: string;
  onFilter?: (v: string) => void;
  extraRender: (item: T) => React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const filtered = items.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[240px]">
          <SearchBar value={q} onChange={setQ} placeholder="Search…" />
        </div>
      </div>
      {filters && (
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Chip key={f} active={activeFilter === f} onClick={() => onFilter?.(f)}>
              {f}
            </Chip>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {new Date(item.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="font-display text-lg font-semibold mt-1">{item.name}</div>
            <div className="mt-2 text-sm text-muted-foreground">{extraRender(item)}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState>No matches.</EmptyState>
          </div>
        )}
      </div>
    </>
  );
}

export function VratCalendar() {
  const [active, setActive] = useState<string>("All");
  const filtered =
    active === "All"
      ? VRATS
      : VRATS.filter(
          (v) =>
            v.frequency.toLowerCase().includes(active.toLowerCase()) ||
            v.name.toLowerCase().includes(active.toLowerCase()),
        );
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {["All", "Weekly", "Monthly", "Yearly"].map((f) => (
          <Chip key={f} active={active === f} onClick={() => setActive(f)}>
            {f}
          </Chip>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((v) => (
          <div key={v.slug} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-baseline justify-between">
              <div className="font-display text-lg font-semibold">{v.name}</div>
              <Badge variant="outline">{v.deity}</Badge>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
              {v.frequency}
            </div>
            <div className="mt-3 text-sm">
              <strong>Rules:</strong> {v.rules}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <strong>Benefits:</strong> {v.benefits}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function EkadashiDates() {
  return <ListWithFilter items={EKADASHIS_2026} extraRender={(e) => e.description} />;
}
export function PurnimaAmavasya() {
  const [kind, setKind] = useState<"All" | "Purnima" | "Amavasya">("All");
  const items = kind === "All" ? LUNAR_DAYS_2026 : LUNAR_DAYS_2026.filter((l) => l.kind === kind);
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["All", "Purnima", "Amavasya"] as const).map((f) => (
          <Chip key={f} active={kind === f} onClick={() => setKind(f)}>
            {f}
          </Chip>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((d, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-baseline justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {new Date(d.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <Badge
                variant="outline"
                className={d.kind === "Purnima" ? "border-primary/50" : "border-accent/50"}
              >
                {d.kind}
              </Badge>
            </div>
            <div className="font-display text-lg font-semibold mt-1">{d.name}</div>
            <div className="mt-2 text-sm text-muted-foreground">{d.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function RegionalFestivals() {
  const [region, setRegion] = useState<string>("All");
  const regions = ["All", "North", "South", "East", "West", "All-India"];
  const filtered = FESTIVALS_2026.filter(
    (f) => (region === "All" || f.region === region) && f.category === "Regional",
  );
  const all = FESTIVALS_2026.filter((f) => region === "All" || f.region === region);
  const list = filtered.length ? filtered : all;
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {regions.map((r) => (
          <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
            {r}
          </Chip>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((f) => (
          <div key={f.slug} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {new Date(f.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              · {f.region}
            </div>
            <div className="font-display text-lg font-semibold mt-1">{f.name}</div>
            <div className="mt-2 text-sm text-muted-foreground">{f.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function PradoshVrat() {
  return <ListWithFilter items={PRADOSH_2026} extraRender={(p) => p.description} />;
}
export function SankashtiChaturthi() {
  return <ListWithFilter items={SANKASHTI_2026} extraRender={(p) => p.description} />;
}

export function FestivalOfTheDay() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming =
    FESTIVALS_2026.filter((f) => f.date >= today).slice(0, 1)[0] ?? FESTIVALS_2026[0];
  return (
    <ToolCardFrame title="Festival of the day">
      {upcoming ? (
        <div>
          <div className="text-xs uppercase tracking-widest text-accent">
            {new Date(upcoming.date).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="font-display text-3xl font-semibold mt-2">{upcoming.name}</div>
          <div className="mt-2 text-sm text-muted-foreground">{upcoming.description}</div>
          <div className="mt-3 flex gap-2">
            <Badge variant="outline">{upcoming.category}</Badge>
            <Badge variant="outline">{upcoming.region}</Badge>
          </div>
          <div className="mt-6">
            <Link to="/festivals">
              <Button variant="outline">See all festivals</Button>
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState>No festivals loaded.</EmptyState>
      )}
    </ToolCardFrame>
  );
}

export function UpcomingFestivals() {
  const today = new Date().toISOString().slice(0, 10);
  const list = FESTIVALS_2026.filter((f) => f.date >= today).slice(0, 12);
  return (
    <ToolCardFrame title="Next 12 festivals">
      <ul className="divide-y divide-border">
        {list.map((f) => (
          <li key={f.slug} className="py-3 flex items-start gap-4">
            <div className="text-center min-w-[64px]">
              <div className="text-xs text-muted-foreground uppercase tracking-widest">
                {new Date(f.date).toLocaleString("en-GB", { month: "short" })}
              </div>
              <div className="font-display text-2xl font-semibold">
                {new Date(f.date).getDate()}
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{f.description}</div>
            </div>
            <Badge variant="outline">{f.region}</Badge>
          </li>
        ))}
      </ul>
    </ToolCardFrame>
  );
}

/* ═══════════════════════ PUJA ═══════════════════════ */

export function PujaVidhiPlanner() {
  const [deity, setDeity] = useState("Ganesha");
  const [time, setTime] = useState("30");
  const plan = useMemo(() => planPuja(deity, Number(time) || 30), [deity, time]);
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Field label="Deity">
          <select
            value={deity}
            onChange={(e) => setDeity(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            {[
              "Ganesha",
              "Shiva",
              "Vishnu",
              "Durga",
              "Lakshmi",
              "Hanuman",
              "Krishna",
              "Saraswati",
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Available minutes">
          <Input
            type="number"
            min={5}
            max={180}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Field>
      </div>
      <ToolCardFrame title={`Puja plan — ${deity}`}>
        <ol className="space-y-3">
          {plan.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="grid place-items-center size-7 rounded-full bg-primary-soft text-accent font-semibold text-xs shrink-0">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="font-medium">
                  {s.title}{" "}
                  <span className="text-xs text-muted-foreground">· {s.duration} min</span>
                </div>
                <div className="text-muted-foreground text-sm">{s.note}</div>
              </div>
            </li>
          ))}
        </ol>
      </ToolCardFrame>
    </>
  );
}
function planPuja(deity: string, minutes: number) {
  const base = [
    {
      title: "Achman & Pavitrikaran",
      duration: 2,
      note: "Sip water thrice; sprinkle water for purification.",
    },
    { title: "Deep Prajwalan", duration: 1, note: "Light ghee lamp; invite the deity." },
    {
      title: "Sankalp",
      duration: 2,
      note: "State intention: today's date, place, gotra, name, purpose.",
    },
    {
      title: `${deity} Avahan & Sthapana`,
      duration: 3,
      note: "Invoke and seat the deity on the chowki.",
    },
    {
      title: "Panchopachar Puja",
      duration: 4,
      note: "Offer gandha, pushpa, dhoop, deep, naivedya.",
    },
    {
      title: `${deity} Mantra Jaap`,
      duration: Math.max(5, minutes - 20),
      note: "Chant the mula mantra of the deity.",
    },
    { title: "Aarti", duration: 3, note: "Perform aarti with ghee lamp; ring the bell." },
    {
      title: "Kshama Prarthana & Visarjan",
      duration: 2,
      note: "Ask forgiveness for any lapse; conclude.",
    },
  ];
  return base;
}

export function SamagriChecklist() {
  const [puja, setPuja] = useState(SAMAGRI_LISTS[0].puja);
  const sel = SAMAGRI_LISTS.find((s) => s.puja === puja)!;
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {SAMAGRI_LISTS.map((s) => (
          <Chip key={s.puja} active={puja === s.puja} onClick={() => setPuja(s.puja)}>
            {s.puja}
          </Chip>
        ))}
      </div>
      <ToolCardFrame title={`${sel.puja} — samagri`}>
        <ul className="divide-y divide-border">
          {sel.items.map((it, i) => (
            <li key={i} className="py-3 flex items-baseline justify-between">
              <span className="font-medium">{it.name}</span>
              <span className="text-sm text-muted-foreground">{it.qty}</span>
            </li>
          ))}
        </ul>
      </ToolCardFrame>
    </>
  );
}

export function SankalpGenerator() {
  const [name, setName] = useState("");
  const [gotra, setGotra] = useState("");
  const [place, setPlace] = useState("");
  const [purpose, setPurpose] = useState("Ganesh Puja");
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const sankalp = `॥ श्री गणेशाय नमः ॥\n\nToday, on ${dateStr}, at ${place || "[place]"}, I, ${name || "[your name]"}, of ${gotra || "[your]"} gotra, resolve to perform ${purpose || "this puja"} with pure heart and devotion, seeking the blessings of the Divine, for the welfare of my family, my community, and all beings.\n\n॥ ॐ शान्तिः शान्तिः शान्तिः ॥`;
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Field label="Your name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arjuna Sharma"
          />
        </Field>
        <Field label="Gotra">
          <Input
            value={gotra}
            onChange={(e) => setGotra(e.target.value)}
            placeholder="e.g. Bharadwaj"
          />
        </Field>
        <Field label="Place">
          <Input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="e.g. Varanasi, India"
          />
        </Field>
        <Field label="Purpose">
          <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </Field>
      </div>
      <ToolCardFrame title="Sankalp">
        <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">{sankalp}</pre>
        <div className="mt-4">
          <CopyBtn text={sankalp} />
        </div>
      </ToolCardFrame>
    </>
  );
}

export function GrihaPraveshPlanner() {
  const steps = [
    {
      title: "Choose muhurat",
      note: "Consult panchang for shubh tithi (avoid amavasya, ashtami). Prefer Chaitra, Vaishakh, Jyeshtha, Magh.",
    },
    {
      title: "Ganesh sthapana at entrance",
      note: "Install Ganesha on the main door; place svastika + kalash outside.",
    },
    {
      title: "Vastu shanti puja",
      note: "Perform vastu puja in the north-east corner with a qualified priest.",
    },
    {
      title: "Kalash yatra",
      note: "Head of family carries the copper kalash across the threshold — right foot first.",
    },
    { title: "Boil milk on new stove", note: "Overflowing milk symbolises abundance." },
    { title: "Navadhanya chowk", note: "Draw a chowk with rice + turmeric; place nine grains." },
    { title: "Havan / lakshmi puja", note: "Perform a short havan; offer sweets to the deity." },
    { title: "Bhoj & bhandara", note: "Feed brahmins / friends / family; share prasad." },
  ];
  return (
    <ToolCardFrame title="Griha Pravesh — step-by-step">
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="grid place-items-center size-7 rounded-full bg-primary-soft text-accent font-semibold text-xs shrink-0">
              {i + 1}
            </span>
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-muted-foreground">{s.note}</div>
            </div>
          </li>
        ))}
      </ol>
    </ToolCardFrame>
  );
}

export function HavanGuide() {
  return (
    <div className="space-y-5">
      <ToolCardFrame title="What is a havan?">
        <p className="text-sm">
          A havan is a fire ritual where offerings (samagri) are placed into the sacred fire (agni)
          with mantras. Agni is the divine messenger — it carries the offerings to the devas.
        </p>
      </ToolCardFrame>
      <ToolCardFrame title="Samagri">
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {SAMAGRI_LISTS.find((s) => s.puja === "Havan / Yajna")!.items.map((it, i) => (
            <li key={i} className="flex justify-between rounded-lg border border-border p-2">
              <span>{it.name}</span>
              <span className="text-muted-foreground">{it.qty}</span>
            </li>
          ))}
        </ul>
      </ToolCardFrame>
      <ToolCardFrame title="Procedure">
        <ol className="space-y-2 text-sm list-decimal pl-5">
          <li>Place havan kund on the ground; arrange logs in a lattice.</li>
          <li>Kindle with kapoor and dry twigs; recite Agni mantra.</li>
          <li>Offer ghee with "स्वाहा" after each mantra — starting with Ganapati.</li>
          <li>Recite the main mantra (e.g. Mahamrityunjaya, Gayatri) with 108 or 1008 ahutis.</li>
          <li>Conclude with purnahuti — a full coconut and vastra offered together.</li>
          <li>Distribute vibhuti (havan ash) as prasad.</li>
        </ol>
      </ToolCardFrame>
      <ToolCardFrame title="Safety">
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Perform in a well-ventilated space; keep water nearby.</li>
          <li>Do not use flammable synthetic clothing.</li>
          <li>Never leave the kund unattended till fully cooled.</li>
        </ul>
      </ToolCardFrame>
    </div>
  );
}

export function AartiThaliGuide() {
  return (
    <ToolCardFrame title="Aarti Thali — item by item">
      <ul className="divide-y divide-border">
        {AARTI_THALI_ITEMS.map((it, i) => (
          <li key={i} className="py-3">
            <div className="font-medium">{it.item}</div>
            <div className="text-sm text-muted-foreground">{it.purpose}</div>
          </li>
        ))}
      </ul>
    </ToolCardFrame>
  );
}

export function PrasadRecipes() {
  const [sel, setSel] = useState(PRASAD_RECIPES[0].name);
  const recipe = PRASAD_RECIPES.find((r) => r.name === sel)!;
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="space-y-1">
        {PRASAD_RECIPES.map((r) => (
          <button
            key={r.name}
            onClick={() => setSel(r.name)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${sel === r.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            {r.name}
            <div className="text-xs opacity-70">{r.deity}</div>
          </button>
        ))}
      </div>
      <ToolCardFrame title={recipe.name}>
        <div className="text-xs uppercase tracking-widest text-accent">
          {recipe.deity} · {recipe.occasion}
        </div>
        <h3 className="mt-4 font-semibold">Ingredients</h3>
        <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
          {recipe.ingredients.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <h3 className="mt-4 font-semibold">Steps</h3>
        <ol className="mt-2 list-decimal pl-5 text-sm space-y-1">
          {recipe.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </ToolCardFrame>
    </div>
  );
}

/* ═══════════════════════ MANTRAS ═══════════════════════ */

function MantraCard({ m }: { m: (typeof MANTRAS)[number] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="font-display text-lg font-semibold">{m.title}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">
            {m.deity} · {m.type}
          </div>
        </div>
        <CopyBtn text={`${m.devanagari}\n${m.iast}\n${m.meaning}`} />
      </div>
      <div className="mt-3 font-devanagari text-lg leading-relaxed">{m.devanagari}</div>
      <div className="mt-1 text-sm italic text-muted-foreground">{m.iast}</div>
      <div className="mt-3 text-sm">{m.meaning}</div>
      <div className="mt-2 text-sm text-muted-foreground">
        <Star className="inline size-3 mr-1 text-primary" />
        {m.benefits}
      </div>
    </div>
  );
}

function MantraListView({ filter }: { filter?: (m: (typeof MANTRAS)[number]) => boolean }) {
  const [q, setQ] = useState("");
  const base = filter ? MANTRAS.filter(filter) : MANTRAS;
  const list = base.filter(
    (m) =>
      m.title.toLowerCase().includes(q.toLowerCase()) ||
      m.deity.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="mb-6">
        <SearchBar value={q} onChange={setQ} placeholder="Search mantra, deity…" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((m) => (
          <MantraCard key={m.slug} m={m} />
        ))}
      </div>
    </>
  );
}

export function MantraLibrary() {
  return <MantraListView />;
}
export function BeejMantras() {
  return <MantraListView filter={(m) => m.type === "beej"} />;
}
export function DeityMantras() {
  const deities = Array.from(new Set(MANTRAS.map((m) => m.deity)));
  const [d, setD] = useState<string>("All");
  const list = d === "All" ? MANTRAS : MANTRAS.filter((m) => m.deity === d);
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={d === "All"} onClick={() => setD("All")}>
          All
        </Chip>
        {deities.map((x) => (
          <Chip key={x} active={d === x} onClick={() => setD(x)}>
            {x}
          </Chip>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((m) => (
          <MantraCard key={m.slug} m={m} />
        ))}
      </div>
    </>
  );
}

export function MantraOfTheDay() {
  const idx = new Date().getDate() % MANTRAS.length;
  const m = MANTRAS[idx];
  return (
    <div className="max-w-2xl mx-auto">
      <MantraCard m={m} />
    </div>
  );
}

export function GayatriGuide() {
  const g = MANTRAS.find((m) => m.slug === "gayatri")!;
  return (
    <div className="space-y-4">
      <MantraCard m={g} />
      <ToolCardFrame title="How to chant">
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li>Face east at sunrise, north at midday, west at sunset.</li>
          <li>Chant 108 times using a tulsi or rudraksha mala.</li>
          <li>Keep the pronunciation clear — pause at each pada.</li>
          <li>Best chanted after bath, on an empty stomach.</li>
        </ul>
      </ToolCardFrame>
      <ToolCardFrame title="Word meaning">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Om Bhur Bhuvah Svah</strong> — the three worlds (earth, atmosphere, heaven).
          </li>
          <li>
            <strong>Tat Savitur Varenyam</strong> — that adorable radiance of Savitar (Sun).
          </li>
          <li>
            <strong>Bhargo Devasya Dhimahi</strong> — we meditate on the divine effulgence.
          </li>
          <li>
            <strong>Dhiyo Yo Nah Prachodayat</strong> — may He inspire our intellect.
          </li>
        </ul>
      </ToolCardFrame>
    </div>
  );
}

export function MahamrityunjayaGuide() {
  const m = MANTRAS.find((x) => x.slug === "mahamrityunjaya")!;
  return (
    <div className="space-y-4">
      <MantraCard m={m} />
      <ToolCardFrame title="Benefits">
        <ul className="text-sm list-disc pl-5 space-y-1">
          <li>Traditionally recited for healing, longevity and freedom from fear of death.</li>
          <li>Chanted during illness, before surgery, or during Shravan month.</li>
          <li>Best chanted at Pradosh kaal (twilight) facing north.</li>
        </ul>
      </ToolCardFrame>
      <ToolCardFrame title="Recommended jaap">
        <p className="text-sm">
          Chant 108 times daily for 40 days as a complete anushthana. For serious healing
          intentions, 1,25,000 recitations (sava lakh) as ekadash rudri.
        </p>
      </ToolCardFrame>
    </div>
  );
}

/* ═══════════════════════ AI (additional modes) ═══════════════════════ */

export function AIMantraRecommender() {
  const [intent, setIntent] = useState("");
  const [deity, setDeity] = useState("");
  const [time, setTime] = useState("");
  return (
    <AIRunner
      mode="mantra-recommender"
      getInput={() => (intent.trim() ? { intent, deity, time } : null)}
      submitLabel="Suggest mantras"
      examples={[
        {
          label: "Confidence before an exam",
          apply: () => {
            setIntent("Confidence and clarity before an important exam");
            setDeity("Saraswati");
            setTime("Morning");
          },
        },
        {
          label: "Peace of mind",
          apply: () => {
            setIntent("Peace of mind before sleep");
            setDeity("");
            setTime("Evening");
          },
        },
        {
          label: "New business venture",
          apply: () => {
            setIntent("Success and abundance for a new business");
            setDeity("Ganesha");
            setTime("Morning");
          },
        },
      ]}
    >
      <Field label="Your intent">
        <Textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          rows={3}
          placeholder="e.g. Peace, courage, healing, abundance…"
        />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Preferred deity (optional)">
          <Input
            value={deity}
            onChange={(e) => setDeity(e.target.value)}
            placeholder="e.g. Shiva, Krishna, Devi"
          />
        </Field>
        <Field label="Time / context">
          <Input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. Morning, before sleep"
          />
        </Field>
      </div>
    </AIRunner>
  );
}

export function AIBabyNameSuggester() {
  const [gender, setGender] = useState("Boy");
  const [nakshatra, setNakshatra] = useState("");
  const [syllable, setSyllable] = useState("");
  const [meaning, setMeaning] = useState("");
  return (
    <AIRunner
      mode="baby-name-ai"
      getInput={() => ({ gender, nakshatra, syllable, meaning })}
      submitLabel="Suggest names"
      examples={[
        {
          label: "Boy · Ashwini · A",
          apply: () => {
            setGender("Boy");
            setNakshatra("Ashwini");
            setSyllable("A");
            setMeaning("bright, dawn");
          },
        },
        {
          label: "Girl · Rohini · Va",
          apply: () => {
            setGender("Girl");
            setNakshatra("Rohini");
            setSyllable("Va");
            setMeaning("prosperity, moonlight");
          },
        },
      ]}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Gender">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option>Boy</option>
            <option>Girl</option>
            <option>Unisex</option>
          </select>
        </Field>
        <Field label="Nakshatra (optional)">
          <Input
            value={nakshatra}
            onChange={(e) => setNakshatra(e.target.value)}
            placeholder="e.g. Ashwini"
          />
        </Field>
        <Field label="Preferred starting syllable">
          <Input
            value={syllable}
            onChange={(e) => setSyllable(e.target.value)}
            placeholder="e.g. A, Chu"
          />
        </Field>
        <Field label="Theme (optional)">
          <Input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="e.g. light, wisdom"
          />
        </Field>
      </div>
    </AIRunner>
  );
}

/* ═══════════════════════ TEMPLES ═══════════════════════ */

function TempleCard({ t }: { t: (typeof TEMPLES_EX)[number] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="font-display text-lg font-semibold">{t.name}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">
            {t.deity}
          </div>
        </div>
        <Badge variant="outline">{t.category}</Badge>
      </div>
      <div className="mt-3 text-sm flex items-center gap-2 text-muted-foreground">
        <MapPin className="size-3.5" />
        {t.city}, {t.state}
      </div>
      <div className="mt-1 text-sm flex items-center gap-2 text-muted-foreground">
        <Clock className="size-3.5" />
        {t.timings}
      </div>
      <p className="mt-3 text-sm">{t.history}</p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.name + " " + t.city)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline"
      >
        Open in Maps <ExternalLink className="size-3" />
      </a>
    </div>
  );
}

export function TempleDirectory() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(TEMPLES_EX.map((t) => t.category)))];
  const list = TEMPLES_EX.filter(
    (t) =>
      (cat === "All" || t.category === cat) &&
      (t.name + t.city + t.state + t.deity).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="mb-4">
        <SearchBar value={q} onChange={setQ} placeholder="Search temple, deity, city…" />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((t) => (
          <TempleCard key={t.slug} t={t} />
        ))}
      </div>
    </>
  );
}

export function DarshanTimings() {
  return (
    <ToolCardFrame title="Darshan timings — major temples">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 pr-4">Temple</th>
              <th className="py-2 pr-4">City</th>
              <th className="py-2">Timings</th>
            </tr>
          </thead>
          <tbody>
            {TEMPLES_EX.map((t) => (
              <tr key={t.slug} className="border-b border-border/60">
                <td className="py-3 pr-4 font-medium">{t.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {t.city}, {t.state}
                </td>
                <td className="py-3">{t.timings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Timings may vary on festivals and eclipses. Check the temple's official site before
        travelling.
      </p>
    </ToolCardFrame>
  );
}

export function CharDhamPlanner() {
  const [start, setStart] = useState("Haridwar");
  const dhams = [
    {
      name: "Yamunotri",
      state: "Uttarakhand",
      best: "May–Jun, Sep–Oct",
      note: "Trek 6 km from Janki Chatti.",
    },
    {
      name: "Gangotri",
      state: "Uttarakhand",
      best: "May–Jun, Sep–Oct",
      note: "Drive-in access; 100 km from Uttarkashi.",
    },
    {
      name: "Kedarnath",
      state: "Uttarakhand",
      best: "May, Jun, Sep",
      note: "16 km trek from Gaurikund or helicopter from Phata.",
    },
    {
      name: "Badrinath",
      state: "Uttarakhand",
      best: "May–Jun, Sep–Oct",
      note: "Motorable; last of the Char Dham.",
    },
  ];
  return (
    <>
      <div className="mb-6 grid sm:grid-cols-2 gap-4">
        <Field label="Base city">
          <Input value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
      </div>
      <ToolCardFrame title="Recommended Char Dham route (12–14 days)">
        <div className="text-sm mb-4">
          <strong>Route:</strong> {start} → Yamunotri → Gangotri → Kedarnath → Badrinath → {start}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {dhams.map((d, i) => (
            <div key={d.name} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <span className="grid place-items-center size-6 rounded-full bg-primary text-primary-foreground text-xs">
                  {i + 1}
                </span>
                <span className="font-semibold">{d.name}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {d.state} · Best: {d.best}
              </div>
              <div className="text-sm mt-2">{d.note}</div>
            </div>
          ))}
        </div>
      </ToolCardFrame>
    </>
  );
}

export function JyotirlingaGuide() {
  const jyot = TEMPLES_EX.filter((t) => t.category === "Jyotirlinga");
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {jyot.map((t) => (
        <TempleCard key={t.slug} t={t} />
      ))}
    </div>
  );
}
export function ShaktiPeethGuide() {
  const sp = TEMPLES_EX.filter((t) => t.category === "Shakti Peeth");
  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        The 51 Shakti Peethas are the places where the body parts of Sati fell. Here are the
        most-visited, drawn from the traditional list.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {sp.map((t) => (
          <TempleCard key={t.slug} t={t} />
        ))}
      </div>
    </>
  );
}
export function NearbyTemples() {
  const { hydrated, loc } = useLive();
  if (!hydrated) return <ToolCardFrame>Loading…</ToolCardFrame>;
  const withDist = TEMPLES_EX.map((t) => {
    const city = ATLAS_CITIES.find((c) => c.name.toLowerCase() === t.city.toLowerCase());
    const lat = city?.lat ?? 20 + Math.random() * 10;
    const lon = city?.lon ?? 75 + Math.random() * 10;
    const d = haversine(loc.lat, loc.lon, lat, lon);
    return { ...t, d };
  })
    .sort((a, b) => a.d - b.d)
    .slice(0, 12);
  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        Sorted by great-circle distance from your saved location ({loc.lat.toFixed(2)}°,{" "}
        {loc.lon.toFixed(2)}°). Update your city in any panchang tool to refine.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {withDist.map((t) => (
          <div key={t.slug} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-baseline justify-between">
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <Badge variant="outline">{Math.round(t.d)} km</Badge>
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">
              {t.deity} · {t.category}
            </div>
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="size-3.5" />
              {t.city}, {t.state}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ═══════════════════════ CALCULATORS ═══════════════════════ */

function BirthForm({
  onSubmit,
}: {
  onSubmit: (d: { date: string; time: string; place: string }) => void;
}) {
  const [date, setDate] = useState("1990-01-01");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState("Delhi");
  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      <Field label="Date of birth">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <Field label="Time of birth">
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </Field>
      <Field label="Place">
        <Input value={place} onChange={(e) => setPlace(e.target.value)} />
      </Field>
      <div className="sm:col-span-3">
        <Button onClick={() => onSubmit({ date, time, place })}>Calculate</Button>
      </div>
    </div>
  );
}

function computeBirthChart(date: string, time: string) {
  const dt = new Date(`${date}T${time || "12:00"}:00Z`);
  const nak = getNakshatra(dt);
  const tithi = getTithi(dt);
  const yoga = getYoga(dt);
  const karana = getKarana(dt);
  // Approximate rashi from sidereal moon longitude
  const sidereal = (((moonLon(dt) - 23.85) % 360) + 360) % 360;
  const rashiIdx = Math.floor(sidereal / 30);
  const rashi = RASHI_SYLLABLES[rashiIdx].rashi;
  return { dt, nak, tithi, yoga, karana, rashi, rashiIdx, sidereal };
}

export function KundliGenerator() {
  const [res, setRes] = useState<ReturnType<typeof computeBirthChart> | null>(null);
  return (
    <>
      <BirthForm onSubmit={({ date, time }) => setRes(computeBirthChart(date, time))} />
      {res && (
        <div className="grid md:grid-cols-2 gap-4">
          <ToolCardFrame title="Birth details">
            <Kv k="Moon Rashi" v={res.rashi} />
            <Kv k="Nakshatra" v={`${res.nak.name} — pada ${res.nak.pada}`} />
            <Kv k="Deity / Lord" v={`${res.nak.deity} · ${res.nak.lord}`} />
            <Kv k="Tithi" v={`${res.tithi.name} (${res.tithi.paksha})`} />
            <Kv k="Yoga" v={res.yoga.name} />
            <Kv k="Karana" v={res.karana.name} />
          </ToolCardFrame>
          <ToolCardFrame title="Suggested naming syllables">
            <div className="flex flex-wrap gap-2">
              {NAKSHATRA_SYLLABLES.find((n) => n.nakshatra === res.nak.name)?.padas.map((p, i) => (
                <Badge key={i} variant="outline" className="text-base">
                  {p}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Use the pada corresponding to your child's exact nakshatra pada.
            </p>
          </ToolCardFrame>
        </div>
      )}
      {!res && <EmptyState>Enter birth details to generate the chart.</EmptyState>}
    </>
  );
}

export function RashiCalculator() {
  const [res, setRes] = useState<ReturnType<typeof computeBirthChart> | null>(null);
  return (
    <>
      <BirthForm onSubmit={({ date, time }) => setRes(computeBirthChart(date, time))} />
      {res && (
        <ToolCardFrame title="Moon sign (Rashi)">
          <div className="font-display text-4xl">{res.rashi}</div>
          <div className="text-sm text-muted-foreground mt-2">
            Sidereal moon longitude: {res.sidereal.toFixed(2)}°
          </div>
          <div className="text-sm mt-4">
            <strong>Sound syllables:</strong> {RASHI_SYLLABLES[res.rashiIdx].syllables.join(", ")}
          </div>
        </ToolCardFrame>
      )}
    </>
  );
}

export function NakshatraFinder() {
  const [res, setRes] = useState<ReturnType<typeof computeBirthChart> | null>(null);
  return (
    <>
      <BirthForm onSubmit={({ date, time }) => setRes(computeBirthChart(date, time))} />
      {res && (
        <ToolCardFrame title="Janma Nakshatra">
          <div className="font-display text-4xl">{res.nak.name}</div>
          <div className="text-sm mt-2">
            Pada {res.nak.pada} · Deity {res.nak.deity} · Lord {res.nak.lord} · Symbol{" "}
            {res.nak.symbol}
          </div>
        </ToolCardFrame>
      )}
    </>
  );
}

export function DashaCalculator() {
  const [res, setRes] = useState<ReturnType<typeof computeBirthChart> | null>(null);
  const [year, setYear] = useState(1990);
  return (
    <>
      <BirthForm
        onSubmit={({ date, time }) => {
          setRes(computeBirthChart(date, time));
          setYear(new Date(date).getFullYear());
        }}
      />
      {res && (
        <ToolCardFrame title="Vimshottari Mahadasha">
          <ul className="divide-y divide-border">
            {dashaSequence(res.nak.index - 1, year).map((d, i) => (
              <li key={i} className="py-2 flex items-baseline justify-between">
                <div>
                  <span className="font-medium">{d.planet}</span>{" "}
                  <span className="text-xs text-muted-foreground">· {d.years} years</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {d.startYear} – {d.endYear}
                </div>
              </li>
            ))}
          </ul>
        </ToolCardFrame>
      )}
    </>
  );
}

export function GemstoneRecommender() {
  const [rashi, setRashi] = useState(RASHI_SYLLABLES[0].rashi);
  const g = GEMSTONES.find((x) => x.rashi === rashi)!;
  return (
    <>
      <Field label="Your rashi">
        <select
          value={rashi}
          onChange={(e) => setRashi(e.target.value)}
          className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          {RASHI_SYLLABLES.map((r) => (
            <option key={r.rashi}>{r.rashi}</option>
          ))}
        </select>
      </Field>
      <div className="mt-6">
        <ToolCardFrame title={`Recommended for ${g.rashi}`}>
          <Kv k="Primary gem" v={g.primary} />
          <Kv k="Alternative" v={g.alt} />
          <Kv k="Wear on" v={g.wear} />
          <Kv k="Setting metal" v={g.metal} />
          <p className="mt-4 text-xs text-muted-foreground">
            Consult a qualified jyotishi before wearing a gemstone — a full chart reading is
            recommended.
          </p>
        </ToolCardFrame>
      </div>
    </>
  );
}

export function Numerology() {
  const [dob, setDob] = useState("1990-01-01");
  const [name, setName] = useState("");
  const life = lifePathNumber(dob);
  const dest = name ? nameNumerology(name) : null;
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Field label="Date of birth">
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </Field>
        <Field label="Full name (as used)">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <ToolCardFrame title="Life Path Number">
          <div className="font-display text-6xl">{life}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Derived by reducing every digit of your date of birth.
          </p>
        </ToolCardFrame>
        <ToolCardFrame title="Destiny Number (from name)">
          {dest ? (
            <>
              <div className="font-display text-6xl">{dest.number}</div>
              <p className="mt-2 text-sm text-muted-foreground">{dest.meaning}</p>
            </>
          ) : (
            <EmptyState>Enter a name to compute.</EmptyState>
          )}
        </ToolCardFrame>
      </div>
    </>
  );
}

export function NameNumerology() {
  const [name, setName] = useState("");
  const r = name ? nameNumerology(name) : null;
  return (
    <>
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Arjuna" />
      </Field>
      <div className="mt-6">
        {r ? (
          <ToolCardFrame title={`Numerology of ${name}`}>
            <div className="font-display text-6xl">{r.number}</div>
            <p className="mt-2 text-sm">{r.meaning}</p>
          </ToolCardFrame>
        ) : (
          <EmptyState>Type a name.</EmptyState>
        )}
      </div>
    </>
  );
}

export function BirthstoneFinder() {
  const stones: { month: number; name: string; stone: string }[] = [
    { month: 1, name: "January", stone: "Garnet" },
    { month: 2, name: "February", stone: "Amethyst" },
    { month: 3, name: "March", stone: "Aquamarine" },
    { month: 4, name: "April", stone: "Diamond" },
    { month: 5, name: "May", stone: "Emerald" },
    { month: 6, name: "June", stone: "Pearl" },
    { month: 7, name: "July", stone: "Ruby" },
    { month: 8, name: "August", stone: "Peridot" },
    { month: 9, name: "September", stone: "Blue Sapphire" },
    { month: 10, name: "October", stone: "Opal" },
    { month: 11, name: "November", stone: "Yellow Topaz" },
    { month: 12, name: "December", stone: "Turquoise" },
  ];
  const [m, setM] = useState(new Date().getMonth() + 1);
  const s = stones.find((x) => x.month === m)!;
  return (
    <>
      <Field label="Birth month">
        <select
          value={m}
          onChange={(e) => setM(Number(e.target.value))}
          className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          {stones.map((x) => (
            <option key={x.month} value={x.month}>
              {x.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="mt-6">
        <ToolCardFrame title={s.name}>
          <div className="font-display text-3xl">{s.stone}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            The Western birthstone tradition. Vedic gemstone recommendation is based on rashi and
            grah rather than birth month.
          </p>
        </ToolCardFrame>
      </div>
    </>
  );
}

/* ═══════════════════════ SANSKRIT ═══════════════════════ */

export function SanskritDictionary() {
  const [q, setQ] = useState("");
  const list = SANSKRIT_DICT.filter((w) =>
    (w.word + w.devanagari + w.meaning).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <div className="mb-6">
        <SearchBar value={q} onChange={setQ} placeholder="Search word or meaning…" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((w) => (
          <div key={w.word} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="font-devanagari text-lg">{w.devanagari}</div>
                <div className="text-xs text-muted-foreground italic">
                  {w.word} · {w.category}
                </div>
              </div>
              <Badge variant="outline">{w.category}</Badge>
            </div>
            <div className="mt-2 text-sm">{w.meaning}</div>
            {w.root && <div className="text-xs text-muted-foreground mt-1">Root: {w.root}</div>}
          </div>
        ))}
      </div>
    </>
  );
}

export function Transliteration() {
  const [input, setInput] = useState("namaste");
  const out = iastToDevanagari(input);
  return (
    <>
      <Field
        label="Input (IAST or English phonetic)"
        hint="Try: namaste · om namah shivaya · gayatri"
      >
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} />
      </Field>
      <div className="mt-6">
        <ToolCardFrame title="Devanagari">
          <div className="font-devanagari text-3xl leading-relaxed">{out}</div>
          <div className="mt-4">
            <CopyBtn text={out} />
          </div>
        </ToolCardFrame>
      </div>
    </>
  );
}

export function SandhiSplitter() {
  const [input, setInput] = useState("dharmakshetre");
  const parts = splitSandhi(input);
  return (
    <>
      <Field label="Compound word" hint="Simple rule-based splitter — handles common sandhi joins.">
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <div className="mt-6">
        <ToolCardFrame title="Suggested split">
          <div className="font-display text-2xl">{parts.join(" + ")}</div>
          <p className="mt-4 text-xs text-muted-foreground">
            For complex vigraha use the AI Sanskrit Helper for a full grammar analysis.
          </p>
        </ToolCardFrame>
      </div>
    </>
  );
}
function splitSandhi(s: string): string[] {
  // rudimentary: split on visual vowel joins
  const rules = [/aa/, /ee/, /oo/, /ai/, /au/];
  let parts = [s];
  for (const r of rules) {
    parts = parts.flatMap((p) => p.split(r).filter(Boolean));
  }
  if (parts.length < 2) {
    // split at capital or hyphen if present
    return s.split(/[\s\-]/).filter(Boolean);
  }
  return parts;
}

export function ShlokaAnalyzer() {
  const [input, setInput] = useState("");
  const lines = input.split("\n").filter(Boolean);
  const totalSyllables = lines.reduce((n, l) => n + syllableCount(l), 0);
  const guess = guessMeter(totalSyllables, lines.length);
  return (
    <>
      <Field label="Paste a shloka (Devanagari or IAST)">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} />
      </Field>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <ToolCardFrame title="Structure">
          <Kv k="Padas (lines)" v={lines.length} />
          <Kv k="Total syllables" v={totalSyllables} />
          <Kv
            k="Syllables per pada"
            v={lines.length ? Math.round(totalSyllables / lines.length) : 0}
          />
        </ToolCardFrame>
        <ToolCardFrame title="Chhandas guess">
          <div className="font-display text-2xl">{guess}</div>
          <p className="mt-3 text-xs text-muted-foreground">
            Heuristic based on syllable count. Anushtup = 32, Trishtup = 44, Jagati = 48.
          </p>
        </ToolCardFrame>
      </div>
    </>
  );
}
function syllableCount(line: string): number {
  // Approximation: count vowels + independent vowel marks
  const vowels = line.match(/[aāiīuūeoṛṝḷ]|[अआइईउऊऋॠएऐओऔ]|[ािीुूृेैोौ]/gi);
  return vowels ? vowels.length : 0;
}
function guessMeter(total: number, lines: number) {
  if (lines === 4 && total >= 30 && total <= 34) return "Anushtup (32 syllables)";
  if (lines === 4 && total >= 42 && total <= 46) return "Trishtup (44 syllables)";
  if (lines === 4 && total >= 46 && total <= 50) return "Jagati (48 syllables)";
  if (total >= 76 && total <= 84) return "Shardulavikridita (76)";
  return "Unrecognised — try another chhandas reference.";
}

const DEVANAGARI_KEYS = [
  ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],
  ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ"],
  ["ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न"],
  ["प", "फ", "ब", "भ", "म", "य", "र", "ल", "व"],
  ["श", "ष", "स", "ह", "ा", "ि", "ी", "ु", "ू", "े", "ै", "ो", "ौ", "्", " "],
];
export function DevanagariTyping() {
  const [text, setText] = useState("");
  return (
    <>
      <Textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="font-devanagari text-2xl"
        placeholder="Type or tap the keys below…"
      />
      <div className="mt-4 space-y-2">
        {DEVANAGARI_KEYS.map((row, ri) => (
          <div key={ri} className="flex flex-wrap gap-1.5">
            {row.map((k) => (
              <button
                key={k}
                onClick={() => setText((t) => t + k)}
                className="min-w-[40px] h-10 px-3 rounded-md border border-border bg-background hover:bg-primary hover:text-primary-foreground font-devanagari text-lg"
              >
                {k}
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setText((t) => t.slice(0, -1))}>
            ⌫ Backspace
          </Button>
          <Button variant="outline" onClick={() => setText("")}>
            Clear
          </Button>
          <CopyBtn text={text} />
        </div>
      </div>
    </>
  );
}

const DHATU_TABLE: Record<
  string,
  { root: string; meaning: string; forms: Record<string, string> }
> = {
  gam: {
    root: "गम्",
    meaning: "to go",
    forms: {
      "1st singular": "गच्छामि",
      "1st plural": "गच्छामः",
      "2nd singular": "गच्छसि",
      "2nd plural": "गच्छथ",
      "3rd singular": "गच्छति",
      "3rd plural": "गच्छन्ति",
    },
  },
  bhu: {
    root: "भू",
    meaning: "to be",
    forms: {
      "1st singular": "भवामि",
      "1st plural": "भवामः",
      "2nd singular": "भवसि",
      "2nd plural": "भवथ",
      "3rd singular": "भवति",
      "3rd plural": "भवन्ति",
    },
  },
  kri: {
    root: "कृ",
    meaning: "to do",
    forms: {
      "1st singular": "करोमि",
      "1st plural": "कुर्मः",
      "2nd singular": "करोषि",
      "2nd plural": "कुरुथ",
      "3rd singular": "करोति",
      "3rd plural": "कुर्वन्ति",
    },
  },
  as: {
    root: "अस्",
    meaning: "to be",
    forms: {
      "1st singular": "अस्मि",
      "1st plural": "स्मः",
      "2nd singular": "असि",
      "2nd plural": "स्थ",
      "3rd singular": "अस्ति",
      "3rd plural": "सन्ति",
    },
  },
  vad: {
    root: "वद्",
    meaning: "to speak",
    forms: {
      "1st singular": "वदामि",
      "1st plural": "वदामः",
      "2nd singular": "वदसि",
      "2nd plural": "वदथ",
      "3rd singular": "वदति",
      "3rd plural": "वदन्ति",
    },
  },
  path: {
    root: "पठ्",
    meaning: "to read",
    forms: {
      "1st singular": "पठामि",
      "1st plural": "पठामः",
      "2nd singular": "पठसि",
      "2nd plural": "पठथ",
      "3rd singular": "पठति",
      "3rd plural": "पठन्ति",
    },
  },
  sthaa: {
    root: "स्था",
    meaning: "to stand",
    forms: {
      "1st singular": "तिष्ठामि",
      "1st plural": "तिष्ठामः",
      "2nd singular": "तिष्ठसि",
      "2nd plural": "तिष्ठथ",
      "3rd singular": "तिष्ठति",
      "3rd plural": "तिष्ठन्ति",
    },
  },
};
export function VerbConjugator() {
  const [dhatu, setDhatu] = useState("gam");
  const d = DHATU_TABLE[dhatu];
  return (
    <>
      <Field label="Dhatu (root)">
        <select
          value={dhatu}
          onChange={(e) => setDhatu(e.target.value)}
          className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          {Object.entries(DHATU_TABLE).map(([k, v]) => (
            <option key={k} value={k}>
              {k} — {v.meaning}
            </option>
          ))}
        </select>
      </Field>
      <div className="mt-6">
        <ToolCardFrame title={`${d.root} — present tense (लट् लकार)`}>
          <div className="grid sm:grid-cols-2 gap-2">
            {Object.entries(d.forms).map(([person, form]) => (
              <div
                key={person}
                className="flex items-baseline justify-between rounded-lg border border-border p-3"
              >
                <span className="text-sm text-muted-foreground">{person}</span>
                <span className="font-devanagari text-lg">{form}</span>
              </div>
            ))}
          </div>
        </ToolCardFrame>
      </div>
    </>
  );
}

/* ═══════════════════════ BABY NAMES ═══════════════════════ */

function NameGrid({ names }: { names: typeof BABY_NAMES }) {
  if (!names.length) return <EmptyState>No names match your filter.</EmptyState>;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {names.map((n) => (
        <div key={n.name} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <div className="font-display text-lg">{n.name}</div>
            <Badge variant="outline">
              {n.gender === "M" ? "Boy" : n.gender === "F" ? "Girl" : "Unisex"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-1">{n.meaning}</div>
          {n.deity && <div className="text-xs mt-1 text-accent">Deity: {n.deity}</div>}
        </div>
      ))}
    </div>
  );
}

export function NamesByNakshatra() {
  const [nak, setNak] = useState(NAKSHATRA_SYLLABLES[0].nakshatra);
  const syls = NAKSHATRA_SYLLABLES.find((n) => n.nakshatra === nak)!.padas.map((p) =>
    p[0].toUpperCase(),
  );
  const list = BABY_NAMES.filter((n) => syls.some((s) => n.name.toUpperCase().startsWith(s)));
  return (
    <>
      <Field label="Nakshatra">
        <select
          value={nak}
          onChange={(e) => setNak(e.target.value)}
          className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          {NAKSHATRA_SYLLABLES.map((n) => (
            <option key={n.nakshatra}>{n.nakshatra}</option>
          ))}
        </select>
      </Field>
      <div className="mt-4 text-sm text-muted-foreground">
        Padas: {NAKSHATRA_SYLLABLES.find((n) => n.nakshatra === nak)!.padas.join(", ")}
      </div>
      <div className="mt-6">
        <NameGrid names={list} />
      </div>
    </>
  );
}

export function NamesByRashi() {
  const [rashi, setRashi] = useState(RASHI_SYLLABLES[0].rashi);
  const syls = RASHI_SYLLABLES.find((r) => r.rashi === rashi)!.syllables.map((s) =>
    s[0].toUpperCase(),
  );
  const list = BABY_NAMES.filter((n) => syls.some((s) => n.name.toUpperCase().startsWith(s)));
  return (
    <>
      <Field label="Rashi">
        <select
          value={rashi}
          onChange={(e) => setRashi(e.target.value)}
          className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
        >
          {RASHI_SYLLABLES.map((r) => (
            <option key={r.rashi}>{r.rashi}</option>
          ))}
        </select>
      </Field>
      <div className="mt-6">
        <NameGrid names={list} />
      </div>
    </>
  );
}

export function NamesByDeity() {
  const deities = Array.from(new Set(BABY_NAMES.map((n) => n.deity).filter(Boolean))) as string[];
  const [d, setD] = useState<string>(deities[0] ?? "All");
  const list =
    d === "All" ? BABY_NAMES.filter((n) => n.deity) : BABY_NAMES.filter((n) => n.deity === d);
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={d === "All"} onClick={() => setD("All")}>
          All
        </Chip>
        {deities.map((x) => (
          <Chip key={x} active={d === x} onClick={() => setD(x)}>
            {x}
          </Chip>
        ))}
      </div>
      <NameGrid names={list} />
    </>
  );
}

export function NamesByMeaning() {
  const [q, setQ] = useState("");
  const list = q.trim()
    ? BABY_NAMES.filter((n) => n.meaning.toLowerCase().includes(q.toLowerCase()))
    : BABY_NAMES;
  return (
    <>
      <div className="mb-6">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search by meaning — light, wisdom, courage…"
        />
      </div>
      <NameGrid names={list} />
    </>
  );
}

export function TwinNames() {
  const boys = BABY_NAMES.filter((n) => n.gender === "M");
  const girls = BABY_NAMES.filter((n) => n.gender === "F");
  const boyPairs = pair(boys);
  const girlPairs = pair(girls);
  const mixedPairs = boys
    .slice(0, 8)
    .map((b, i) => ({ a: b, b: girls[i] }))
    .filter((p) => p.b);
  return (
    <div className="space-y-8">
      <ToolCardFrame title="Boy + Boy">
        <PairGrid pairs={boyPairs.slice(0, 8)} />
      </ToolCardFrame>
      <ToolCardFrame title="Girl + Girl">
        <PairGrid pairs={girlPairs.slice(0, 8)} />
      </ToolCardFrame>
      <ToolCardFrame title="Boy + Girl">
        <PairGrid pairs={mixedPairs} />
      </ToolCardFrame>
    </div>
  );
}
function pair<T>(arr: T[]): { a: T; b: T }[] {
  const out: { a: T; b: T }[] = [];
  for (let i = 0; i + 1 < arr.length; i += 2) out.push({ a: arr[i], b: arr[i + 1] });
  return out;
}
function PairGrid({
  pairs,
}: {
  pairs: { a: (typeof BABY_NAMES)[number]; b: (typeof BABY_NAMES)[number] }[];
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {pairs.map((p, i) => (
        <div key={i} className="rounded-xl border border-border bg-background p-4">
          <div className="font-display text-xl">
            {p.a.name} <span className="text-muted-foreground">&</span> {p.b.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {p.a.meaning} / {p.b.meaning}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════ LEARNING ═══════════════════════ */

export function BhagavadGita() {
  const [sel, setSel] = useState(1);
  const c = GITA_CHAPTERS.find((x) => x.num === sel)!;
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <div className="space-y-1 max-h-[70vh] overflow-y-auto">
        {GITA_CHAPTERS.map((x) => (
          <button
            key={x.num}
            onClick={() => setSel(x.num)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${sel === x.num ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            <div className="font-medium">Ch. {x.num}</div>
            <div className="text-xs opacity-70">{x.name}</div>
          </button>
        ))}
      </div>
      <ToolCardFrame title={`Chapter ${c.num} — ${c.name}`}>
        <div className="font-devanagari text-xl">{c.devanagari}</div>
        <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
          {c.verses} verses
        </div>
        <h3 className="mt-4 font-semibold">Summary</h3>
        <p className="text-sm text-muted-foreground mt-1">{c.summary}</p>
        <h3 className="mt-4 font-semibold">Core teaching</h3>
        <p className="text-sm mt-1">{c.teaching}</p>
      </ToolCardFrame>
    </div>
  );
}

export function UpanishadsGuide() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {UPANISHADS.map((u) => (
        <div key={u.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-semibold">{u.name}</div>
              <div className="font-devanagari text-sm">{u.devanagari}</div>
            </div>
            <Badge variant="outline">{u.veda}</Badge>
          </div>
          <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            {u.theme}
          </div>
          <p className="mt-2 text-sm">{u.keyTeaching}</p>
        </div>
      ))}
    </div>
  );
}

export function VedasIntroduction() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {VEDAS.map((v) => (
        <div key={v.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="font-devanagari text-2xl">{v.devanagari}</div>
          <div className="font-display text-xl font-semibold mt-1">{v.name}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
            {v.verses}
          </div>
          <p className="mt-3 text-sm">{v.content}</p>
          <p className="mt-2 text-xs text-muted-foreground">Chief devatas: {v.deity}</p>
        </div>
      ))}
    </div>
  );
}

export function YogaSutras() {
  return (
    <div className="space-y-4">
      {YOGA_SUTRAS.map((p) => (
        <ToolCardFrame key={p.pada} title={p.pada}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {p.count} sutras · {p.theme}
          </div>
          <div className="mt-3 font-devanagari text-lg">{p.keyVerse}</div>
        </ToolCardFrame>
      ))}
    </div>
  );
}

export function SanatanTimeline() {
  const events: { era: string; when: string; what: string }[] = [
    {
      era: "Vedic",
      when: "1500 BCE — 500 BCE",
      what: "Composition of the Rigveda, Yajurveda, Samaveda, Atharvaveda.",
    },
    {
      era: "Upanishadic",
      when: "800 BCE — 300 BCE",
      what: "Principal Upanishads — Isha, Katha, Kena, Chandogya, Brihadaranyaka.",
    },
    {
      era: "Epic",
      when: "500 BCE — 100 CE",
      what: "Ramayana of Valmiki, Mahabharata of Vyasa (including Bhagavad Gita).",
    },
    {
      era: "Sutra",
      when: "500 BCE — 200 CE",
      what: "Yoga Sutras of Patanjali, Brahma Sutras of Vyasa.",
    },
    {
      era: "Puranic",
      when: "300 CE — 1000 CE",
      what: "18 Mahapuranas composed, including Bhagavata Purana.",
    },
    {
      era: "Bhakti / Vedanta",
      when: "8th — 16th CE",
      what: "Adi Shankara, Ramanuja, Madhva, Chaitanya, Meera, Tulsidas.",
    },
    {
      era: "Modern renaissance",
      when: "19th CE — 20th CE",
      what: "Ramakrishna, Vivekananda, Aurobindo, Ramana Maharshi.",
    },
  ];
  return (
    <ol className="relative border-l border-border ml-4 space-y-6">
      {events.map((e, i) => (
        <li key={i} className="ml-6">
          <span className="absolute -left-2.5 grid place-items-center size-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {i + 1}
          </span>
          <div className="text-xs uppercase tracking-widest text-accent">{e.when}</div>
          <div className="font-display text-lg font-semibold">{e.era}</div>
          <div className="text-sm text-muted-foreground">{e.what}</div>
        </li>
      ))}
    </ol>
  );
}

export function DeityEncyclopedia() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(DEITIES[0].slug);
  const list = DEITIES.filter((d) =>
    (d.name + d.devanagari + d.domain).toLowerCase().includes(q.toLowerCase()),
  );
  const d = DEITIES.find((x) => x.slug === sel)!;
  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-6">
      <div>
        <SearchBar value={q} onChange={setQ} placeholder="Search deity…" />
        <div className="mt-3 space-y-1 max-h-[60vh] overflow-y-auto">
          {list.map((x) => (
            <button
              key={x.slug}
              onClick={() => setSel(x.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${sel === x.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <div className="font-medium">{x.name}</div>
              <div className="text-xs opacity-70">{x.domain}</div>
            </button>
          ))}
        </div>
      </div>
      <ToolCardFrame title={d.name}>
        <div className="font-devanagari text-3xl">{d.devanagari}</div>
        <Kv k="Domain" v={d.domain} />
        {d.consort && <Kv k="Consort" v={d.consort} />}
        {d.vehicle && <Kv k="Vehicle" v={d.vehicle} />}
        {d.weapons && <Kv k="Attributes" v={d.weapons} />}
        <Kv k="Primary scripture" v={d.scripture} />
        <Kv k="Primary mantra" v={<span className="font-devanagari">{d.primary_mantra}</span>} />
        <p className="mt-4 text-sm">{d.significance}</p>
      </ToolCardFrame>
    </div>
  );
}

export function MahabharataSummary() {
  return (
    <ol className="space-y-3">
      {MAHABHARATA_PARVAS.map((p, i) => (
        <li key={p.name} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-semibold">
                {i + 1}. {p.name}
              </div>
              <div className="font-devanagari text-sm">{p.devanagari}</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{p.theme}</p>
        </li>
      ))}
    </ol>
  );
}

export function RamayanaSummary() {
  return (
    <ol className="space-y-3">
      {RAMAYANA_KANDAS.map((k, i) => (
        <li key={k.name} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-semibold">
                {i + 1}. {k.name}
              </div>
              <div className="font-devanagari text-sm">{k.devanagari}</div>
            </div>
            <Badge variant="outline">{k.sargas} sargas</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{k.summary}</p>
        </li>
      ))}
    </ol>
  );
}

export function PuranasOverview() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {MAHAPURANAS.map((p) => (
        <div key={p.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-semibold">{p.name}</div>
              <div className="font-devanagari text-sm">{p.devanagari}</div>
            </div>
            <Badge variant="outline">{p.deity}</Badge>
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
            {p.verses} verses
          </div>
          <p className="mt-2 text-sm">{p.theme}</p>
        </div>
      ))}
    </div>
  );
}

export function SanskritWordOfDay() {
  const idx = new Date().getDate() % SANSKRIT_DICT.length;
  const w = SANSKRIT_DICT[idx];
  return (
    <ToolCardFrame title="Sanskrit word of the day">
      <div className="font-devanagari text-5xl">{w.devanagari}</div>
      <div className="mt-2 italic text-muted-foreground">{w.word}</div>
      <p className="mt-4 text-sm">{w.meaning}</p>
      {w.root && <p className="mt-2 text-xs text-muted-foreground">Root: {w.root}</p>}
      <div className="mt-4">
        <Badge variant="outline">{w.category}</Badge>
      </div>
    </ToolCardFrame>
  );
}

export function DeityOfTheDay() {
  const d = DEITIES[new Date().getDate() % DEITIES.length];
  return (
    <ToolCardFrame title="Deity of the day">
      <div className="font-devanagari text-5xl">{d.devanagari}</div>
      <div className="font-display text-3xl font-semibold mt-2">{d.name}</div>
      <div className="text-sm text-muted-foreground mt-1">{d.domain}</div>
      <div className="mt-4 font-devanagari text-lg">{d.primary_mantra}</div>
      <p className="mt-4 text-sm">{d.significance}</p>
    </ToolCardFrame>
  );
}

const NAKSHATRA_DETAILS: {
  name: string;
  lord: string;
  deity: string;
  symbol: string;
  nature: string;
}[] = [
  {
    name: "Ashwini",
    lord: "Ketu",
    deity: "Ashwini Kumaras",
    symbol: "Horse's head",
    nature: "Swift, healing",
  },
  { name: "Bharani", lord: "Venus", deity: "Yama", symbol: "Yoni", nature: "Transformative" },
  { name: "Krittika", lord: "Sun", deity: "Agni", symbol: "Razor", nature: "Sharp, purifying" },
  { name: "Rohini", lord: "Moon", deity: "Brahma", symbol: "Chariot", nature: "Growing, fertile" },
  { name: "Mrigashira", lord: "Mars", deity: "Soma", symbol: "Deer's head", nature: "Searching" },
  { name: "Ardra", lord: "Rahu", deity: "Rudra", symbol: "Teardrop", nature: "Stormy" },
  { name: "Punarvasu", lord: "Jupiter", deity: "Aditi", symbol: "Quiver", nature: "Renewing" },
  {
    name: "Pushya",
    lord: "Saturn",
    deity: "Brihaspati",
    symbol: "Cow's udder",
    nature: "Nourishing",
  },
  { name: "Ashlesha", lord: "Mercury", deity: "Nagas", symbol: "Serpent", nature: "Mystical" },
  { name: "Magha", lord: "Ketu", deity: "Pitrs", symbol: "Throne", nature: "Ancestral, royal" },
  {
    name: "Purva Phalguni",
    lord: "Venus",
    deity: "Bhaga",
    symbol: "Front of bed",
    nature: "Playful, luxurious",
  },
  {
    name: "Uttara Phalguni",
    lord: "Sun",
    deity: "Aryaman",
    symbol: "Back of bed",
    nature: "Contract-making",
  },
  { name: "Hasta", lord: "Moon", deity: "Savitar", symbol: "Hand", nature: "Skillful" },
  {
    name: "Chitra",
    lord: "Mars",
    deity: "Vishvakarma",
    symbol: "Pearl",
    nature: "Beautiful, artistic",
  },
  { name: "Swati", lord: "Rahu", deity: "Vayu", symbol: "Coral", nature: "Independent" },
  {
    name: "Vishakha",
    lord: "Jupiter",
    deity: "Indra-Agni",
    symbol: "Triumphal arch",
    nature: "Determined",
  },
  {
    name: "Anuradha",
    lord: "Saturn",
    deity: "Mitra",
    symbol: "Lotus",
    nature: "Friendly, devoted",
  },
  { name: "Jyeshtha", lord: "Mercury", deity: "Indra", symbol: "Earring", nature: "Senior, wise" },
  { name: "Mula", lord: "Ketu", deity: "Nirriti", symbol: "Root", nature: "Root-searching" },
  { name: "Purva Ashadha", lord: "Venus", deity: "Apas", symbol: "Fan", nature: "Invincible" },
  {
    name: "Uttara Ashadha",
    lord: "Sun",
    deity: "Vishvedevas",
    symbol: "Elephant's tusk",
    nature: "Universal",
  },
  { name: "Shravana", lord: "Moon", deity: "Vishnu", symbol: "Ear", nature: "Listening" },
  { name: "Dhanishta", lord: "Mars", deity: "Vasus", symbol: "Drum", nature: "Rhythmic" },
  { name: "Shatabhisha", lord: "Rahu", deity: "Varuna", symbol: "100 stars", nature: "Healing" },
  {
    name: "Purva Bhadrapada",
    lord: "Jupiter",
    deity: "Aja Ekapada",
    symbol: "Front of stool",
    nature: "Fiery",
  },
  {
    name: "Uttara Bhadrapada",
    lord: "Saturn",
    deity: "Ahir Budhnya",
    symbol: "Back of stool",
    nature: "Deep, calm",
  },
  {
    name: "Revati",
    lord: "Mercury",
    deity: "Pushan",
    symbol: "Fish",
    nature: "Nurturing, safe passage",
  },
];
export function NakshatraGuide() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {NAKSHATRA_DETAILS.map((n, i) => (
        <div key={n.name} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <div className="font-display text-lg font-semibold">
              {i + 1}. {n.name}
            </div>
            <Badge variant="outline">{n.lord}</Badge>
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {n.deity} · {n.symbol}
          </div>
          <div className="mt-2 text-sm">{n.nature}</div>
        </div>
      ))}
    </div>
  );
}

const RASHI_DETAILS: {
  name: string;
  sanskrit: string;
  lord: string;
  element: string;
  nature: string;
}[] = [
  {
    name: "Aries",
    sanskrit: "Mesha",
    lord: "Mars",
    element: "Fire",
    nature: "Cardinal — pioneering, bold",
  },
  {
    name: "Taurus",
    sanskrit: "Vrishabha",
    lord: "Venus",
    element: "Earth",
    nature: "Fixed — steady, artistic",
  },
  {
    name: "Gemini",
    sanskrit: "Mithuna",
    lord: "Mercury",
    element: "Air",
    nature: "Mutable — curious, communicative",
  },
  {
    name: "Cancer",
    sanskrit: "Karka",
    lord: "Moon",
    element: "Water",
    nature: "Cardinal — nurturing, emotional",
  },
  {
    name: "Leo",
    sanskrit: "Simha",
    lord: "Sun",
    element: "Fire",
    nature: "Fixed — regal, generous",
  },
  {
    name: "Virgo",
    sanskrit: "Kanya",
    lord: "Mercury",
    element: "Earth",
    nature: "Mutable — analytical, refined",
  },
  {
    name: "Libra",
    sanskrit: "Tula",
    lord: "Venus",
    element: "Air",
    nature: "Cardinal — harmonising, fair",
  },
  {
    name: "Scorpio",
    sanskrit: "Vrishchika",
    lord: "Mars",
    element: "Water",
    nature: "Fixed — intense, transformative",
  },
  {
    name: "Sagittarius",
    sanskrit: "Dhanu",
    lord: "Jupiter",
    element: "Fire",
    nature: "Mutable — philosophical, expansive",
  },
  {
    name: "Capricorn",
    sanskrit: "Makara",
    lord: "Saturn",
    element: "Earth",
    nature: "Cardinal — disciplined, patient",
  },
  {
    name: "Aquarius",
    sanskrit: "Kumbha",
    lord: "Saturn",
    element: "Air",
    nature: "Fixed — humanitarian, visionary",
  },
  {
    name: "Pisces",
    sanskrit: "Meena",
    lord: "Jupiter",
    element: "Water",
    nature: "Mutable — compassionate, mystical",
  },
];
export function RashiGuide() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {RASHI_DETAILS.map((r, i) => (
        <div key={r.name} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display text-lg font-semibold">
                {i + 1}. {r.name}
              </div>
              <div className="text-xs text-muted-foreground">{r.sanskrit}</div>
            </div>
            <Badge variant="outline">{r.element}</Badge>
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            Lord: {r.lord}
          </div>
          <div className="mt-2 text-sm">{r.nature}</div>
        </div>
      ))}
    </div>
  );
}
