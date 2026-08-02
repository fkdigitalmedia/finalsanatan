import { useEffect, useMemo, useState, useRef } from "react";
import {
  Search,
  Bell,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  MapPin,
  Filter,
  Calendar,
} from "lucide-react";

import { ToolCardFrame } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FESTIVALS_2026, type Festival } from "@/lib/festivals-data";
import {
  DAILY_QUOTES,
  DAILY_SHLOKAS,
  AARTIS,
  CHALISAS,
  STOTRAS,
  TEMPLES,
  PUJA_CHECKLISTS,
  type Aarti,
  type Chalisa,
  type Stotra,
  type Temple,
  type PujaChecklist,
} from "@/lib/content-data";
import { useHydrated } from "@/lib/location";

// ─────────────────────────── FESTIVAL CALENDAR ───────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function FestivalCalendar() {
  const [region, setRegion] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");
  const regions = ["All", "All-India", "North", "South", "East", "West"];
  const categories = ["All", "Major", "Vrat", "Ekadashi", "Purnima", "Amavasya", "Regional"];
  const filtered = FESTIVALS_2026.filter(
    (f) =>
      (region === "All" || f.region === region) && (category === "All" || f.category === category),
  );
  const byMonth = useMemo(() => {
    const map = new Map<number, Festival[]>();
    for (let m = 1; m <= 12; m++) map.set(m, []);
    filtered.forEach((f) => map.get(f.month)!.push(f));
    return map;
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterSelect label="Region" value={region} onChange={setRegion} options={regions} />
        <FilterSelect
          label="Category"
          value={category}
          onChange={setCategory}
          options={categories}
        />
        <div className="ml-auto text-sm text-muted-foreground self-center">
          {filtered.length} festivals in 2026
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from(byMonth.entries()).map(([m, list]) => (
          <div key={m} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-display text-xl font-semibold">{MONTHS[m - 1]} 2026</div>
              <div className="text-xs text-muted-foreground">{list.length} events</div>
            </div>
            {list.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">No matching festivals.</div>
            ) : (
              <ul className="space-y-3">
                {list.map((f) => (
                  <li key={f.slug} className="border-l-2 border-primary/50 pl-3">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      {formatShort(f.date)}
                    </div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {f.description}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm">
      <Filter className="size-4 text-accent" />
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none font-medium"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatShort(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")} ${MONTHS[d.getMonth()]} · ${d.toLocaleDateString("en-US", { weekday: "short" })}`;
}

// ─────────────────────────── FESTIVAL COUNTDOWN ───────────────────────────

export function FestivalCountdown() {
  const hydrated = useHydrated();
  const [now, setNow] = useState(() => Date.now());
  const [selected, setSelected] = useState<string>(FESTIVALS_2026[0].slug);
  useEffect(() => {
    if (!hydrated) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [hydrated]);

  const upcoming = FESTIVALS_2026.filter(
    (f) => new Date(f.date).getTime() > now - 24 * 3600 * 1000,
  );
  const chosen =
    FESTIVALS_2026.find((f) => f.slug === selected) ?? upcoming[0] ?? FESTIVALS_2026[0];
  const target = new Date(chosen.date + "T06:00:00").getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 3600 * 1000));
  const hours = Math.floor((diff / (3600 * 1000)) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm">
          <Calendar className="size-4 text-accent" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Festival</span>
          <select
            value={chosen.slug}
            onChange={(e) => setSelected(e.target.value)}
            className="bg-transparent text-foreground focus:outline-none font-medium max-w-[240px] [color-scheme:light] dark:[color-scheme:dark]"
          >
            {FESTIVALS_2026.map((f) => (
              <option key={f.slug} value={f.slug} className="bg-background text-foreground">
                {f.name} · {formatShort(f.date)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/50 via-card to-card p-8 md:p-12 shadow-elegant text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Countdown to
        </div>
        <div className="mt-2 font-display text-3xl md:text-5xl font-semibold">{chosen.name}</div>
        <div className="text-sm text-muted-foreground mt-1">
          {formatShort(chosen.date)} · {chosen.region}
        </div>
        <div className="mt-8 grid grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { l: "Days", v: days },
            { l: "Hours", v: hours },
            { l: "Minutes", v: minutes },
            { l: "Seconds", v: seconds },
          ].map((x) => (
            <div key={x.l} className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="font-display text-3xl md:text-5xl font-semibold tabular-nums">
                {hydrated ? x.v.toString().padStart(2, "0") : "--"}
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {x.l}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground max-w-2xl mx-auto">
          {chosen.significance}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────── FESTIVAL FINDER ───────────────────────────

export function FestivalFinder() {
  const [q, setQ] = useState("");
  const [month, setMonth] = useState<string>("All");
  const results = FESTIVALS_2026.filter((f) => {
    const okQ =
      !q ||
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      (f.deity ?? "").toLowerCase().includes(q.toLowerCase());
    const okM = month === "All" || Number(month) === f.month;
    return okQ && okM;
  });
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search festivals or deities…"
            className="pl-9"
          />
        </div>
        <FilterSelect
          label="Month"
          value={month}
          onChange={setMonth}
          options={["All", ...Array.from({ length: 12 }, (_, i) => String(i + 1))]}
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((f) => (
          <div
            key={f.slug}
            className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-glow transition"
          >
            <div className="text-xs uppercase tracking-widest text-accent">
              {formatShort(f.date)}
            </div>
            <div className="mt-1 font-display text-lg font-semibold">{f.name}</div>
            {f.deity && <div className="text-xs text-muted-foreground">Deity: {f.deity}</div>}
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{f.description}</p>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline">{f.category}</Badge>
              <Badge variant="outline">{f.region}</Badge>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-16">
            No festivals match your search.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── COUNTERS / MANTRA TOOLS ───────────────────────────

function useCounterStorage(key: string) {
  const [n, setN] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setN(parsed.n ?? 0);
        setTotal(parsed.total ?? 0);
      }
    } catch {
      /* ignore */
    }
  }, [key]);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify({ n, total }));
    } catch {
      /* ignore */
    }
  }, [key, n, total]);
  return { n, setN, total, setTotal };
}

function beep() {
  try {
    const AC =
      (
        window as unknown as {
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
        }
      ).AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 660;
    g.gain.value = 0.06;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 120);
  } catch {
    /* ignore */
  }
}

interface CounterConfig {
  storageKey: string;
  label: string;
  mala: number;
  sound?: boolean;
  hero?: string;
}

function CounterUI({ cfg }: { cfg: CounterConfig }) {
  const hydrated = useHydrated();
  const { n, setN, total, setTotal } = useCounterStorage(cfg.storageKey);
  const [sound, setSound] = useState(true);
  const inc = () => {
    const next = n + 1;
    setN(next);
    setTotal(total + 1);
    if (sound) beep();
    if (next % cfg.mala === 0 && typeof navigator !== "undefined" && "vibrate" in navigator) {
      (navigator as Navigator & { vibrate?: (n: number) => void }).vibrate?.(50);
    }
  };
  const dec = () => setN(Math.max(0, n - 1));
  const reset = () => setN(0);
  const malas = Math.floor(n / cfg.mala);
  const progress = ((n % cfg.mala) / cfg.mala) * 100;

  return (
    <div>
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/50 via-card to-card p-8 md:p-12 shadow-elegant text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          {cfg.label}
        </div>
        {cfg.hero && (
          <div className="mt-2 font-devanagari text-3xl md:text-5xl text-foreground/80">
            {cfg.hero}
          </div>
        )}
        <button
          onClick={inc}
          className="mt-6 mx-auto grid place-items-center size-48 md:size-64 rounded-full bg-gradient-brand text-primary-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98] transition font-display text-6xl md:text-7xl font-semibold tabular-nums select-none"
          aria-label="Increment"
        >
          {hydrated ? n : 0}
        </button>
        <div className="mt-6 max-w-md mx-auto">
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {n % cfg.mala} / {cfg.mala} in this mala · {malas} mala{malas === 1 ? "" : "s"}{" "}
            completed
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={dec}>
            <Minus className="size-4" /> Undo
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" /> Reset
          </Button>
          <Button variant="outline" onClick={() => setSound((s) => !s)}>
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}{" "}
            {sound ? "Sound on" : "Sound off"}
          </Button>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Lifetime count: <b className="text-foreground">{hydrated ? total : 0}</b>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Tap the circle to count. Your count is saved on this device.
      </p>
    </div>
  );
}

export const DigitalJaapCounter = () => (
  <CounterUI cfg={{ storageKey: "st.counter.jaap", label: "Digital Jaap Counter", mala: 108 }} />
);
export const OmCounter = () => (
  <CounterUI cfg={{ storageKey: "st.counter.om", label: "Om Counter", mala: 108, hero: "ॐ" }} />
);
export const MalaCounter = () => (
  <CounterUI
    cfg={{ storageKey: "st.counter.mala", label: "Mala Counter", mala: 108, hero: "जप" }}
  />
);

// ─────────────────────────── MANTRA TIMER ───────────────────────────

export function MantraTimer() {
  const hydrated = useHydrated();
  const [minutes, setMinutes] = useState(11);
  const [remaining, setRemaining] = useState(11 * 60);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const targetRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) setRemaining(minutes * 60);
  }, [minutes, running]);

  useEffect(() => {
    if (!running) return;
    targetRef.current = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      if (targetRef.current == null) return;
      const r = Math.max(0, Math.round((targetRef.current - Date.now()) / 1000));
      setRemaining(r);
      if (r <= 0) {
        setRunning(false);
        if (sound) {
          beep();
          setTimeout(beep, 200);
          setTimeout(beep, 400);
        }
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");
  const progress = minutes > 0 ? (1 - remaining / (minutes * 60)) * 100 : 0;

  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/40 via-card to-card p-8 md:p-12 shadow-elegant text-center">
      <div className="text-xs font-semibold uppercase tracking-widest text-accent">
        Mantra Timer
      </div>
      <div className="mt-6 font-display text-7xl md:text-8xl font-semibold tabular-nums">
        {hydrated ? `${mm}:${ss}` : "--:--"}
      </div>
      <div className="mt-4 max-w-md mx-auto h-2 rounded-full bg-border overflow-hidden">
        <div className="h-full bg-gradient-brand" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {[3, 5, 11, 21, 31, 45].map((m) => (
          <Button
            key={m}
            variant={minutes === m ? "default" : "outline"}
            onClick={() => setMinutes(m)}
            disabled={running}
          >
            {m} min
          </Button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button size="lg" onClick={() => setRunning((r) => !r)} className="gap-2">
          {running ? (
            <>
              <Pause className="size-4" /> Pause
            </>
          ) : (
            <>
              <Play className="size-4" /> Start
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setRunning(false);
            setRemaining(minutes * 60);
          }}
        >
          <RotateCcw className="size-4" /> Reset
        </Button>
        <Button variant="outline" onClick={() => setSound((s) => !s)}>
          {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}{" "}
          {sound ? "Chime on" : "Chime off"}
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────── DAILY QUOTE / SHLOK ───────────────────────────

function pickOfDay<T>(arr: T[]): T {
  const now = new Date();
  const day = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / (24 * 3600 * 1000),
  );
  return arr[day % arr.length];
}

export function DailyQuote() {
  const hydrated = useHydrated();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (hydrated) setIndex(DAILY_QUOTES.indexOf(pickOfDay(DAILY_QUOTES)));
  }, [hydrated]);
  const q = DAILY_QUOTES[index];
  return (
    <div>
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/40 via-card to-card p-10 md:p-14 shadow-elegant">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent text-center">
          Quote of the day
        </div>
        <blockquote className="mt-6 text-center font-display text-2xl md:text-4xl leading-snug text-foreground">
          "{q.text}"
        </blockquote>
        <div className="mt-4 text-center text-sm text-muted-foreground">— {q.source}</div>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIndex((i) => (i - 1 + DAILY_QUOTES.length) % DAILY_QUOTES.length)}
        >
          Previous
        </Button>
        <Button variant="outline" onClick={() => setIndex((i) => (i + 1) % DAILY_QUOTES.length)}>
          Next
        </Button>
        <Button
          variant="outline"
          onClick={() => setIndex(Math.floor(Math.random() * DAILY_QUOTES.length))}
        >
          <Sparkles className="size-4" /> Random
        </Button>
      </div>
    </div>
  );
}

export function DailyShlok() {
  const hydrated = useHydrated();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (hydrated) setIndex(DAILY_SHLOKAS.indexOf(pickOfDay(DAILY_SHLOKAS)));
  }, [hydrated]);
  const s = DAILY_SHLOKAS[index];
  return (
    <div>
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/40 via-card to-card p-8 md:p-12 shadow-elegant">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Shlok of the day
        </div>
        <div className="mt-5 font-devanagari text-2xl md:text-3xl leading-loose whitespace-pre-line text-center">
          {s.devanagari}
        </div>
        <div className="mt-5 text-center italic text-muted-foreground">{s.transliteration}</div>
        <div className="mt-5 text-center max-w-2xl mx-auto">{s.meaning}</div>
        <div className="mt-4 text-center text-xs text-muted-foreground">— {s.source}</div>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIndex((i) => (i - 1 + DAILY_SHLOKAS.length) % DAILY_SHLOKAS.length)}
        >
          Previous
        </Button>
        <Button variant="outline" onClick={() => setIndex((i) => (i + 1) % DAILY_SHLOKAS.length)}>
          Next
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────── COLLECTIONS (Aarti / Chalisa / Stotra) ───────────────────────────

function CollectionUI<T extends { slug: string; title: string; deity: string }>(props: {
  items: T[];
  getBody: (t: T) => { primary: string; secondary?: string };
  label: string;
}) {
  const { items, getBody, label } = props;
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>(items[0]?.slug);
  const filtered = items.filter(
    (x) =>
      x.title.toLowerCase().includes(q.toLowerCase()) ||
      x.deity.toLowerCase().includes(q.toLowerCase()),
  );
  const current = items.find((x) => x.slug === active) ?? filtered[0];
  const body = current ? getBody(current) : null;
  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <aside className="rounded-2xl border border-border bg-card p-4 shadow-card h-fit">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${label}s…`}
            className="pl-9"
          />
        </div>
        <ul className="space-y-1 max-h-[520px] overflow-auto pr-1">
          {filtered.map((x) => (
            <li key={x.slug}>
              <button
                onClick={() => setActive(x.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${active === x.slug ? "bg-primary-soft text-accent font-medium" : "hover:bg-muted"}`}
              >
                <div className="font-medium">{x.title}</div>
                <div className="text-xs text-muted-foreground">{x.deity}</div>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-sm text-muted-foreground p-3">No matches.</li>
          )}
        </ul>
      </aside>
      <ToolCardFrame>
        {current && body ? (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-accent">{current.deity}</div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold">{current.title}</h2>
              </div>
              <Button variant="outline" onClick={() => window.print()} size="sm">
                Print
              </Button>
            </div>
            <div className="font-devanagari text-lg leading-loose whitespace-pre-line">
              {body.primary}
            </div>
            {body.secondary && (
              <p className="mt-6 text-sm text-muted-foreground italic border-t border-border pt-4">
                {body.secondary}
              </p>
            )}
          </>
        ) : (
          <div className="text-muted-foreground">Nothing to show.</div>
        )}
      </ToolCardFrame>
    </div>
  );
}

export const AartiCollection = () => (
  <CollectionUI<Aarti> items={AARTIS} label="aarti" getBody={(a) => ({ primary: a.lyrics })} />
);
export const ChalisaCollection = () => (
  <CollectionUI<Chalisa> items={CHALISAS} label="chalisa" getBody={(a) => ({ primary: a.text })} />
);
export const StotraCollection = () => (
  <CollectionUI<Stotra>
    items={STOTRAS}
    label="stotra"
    getBody={(a) => ({ primary: a.text, secondary: a.meaning })}
  />
);

// ─────────────────────────── TEMPLE FINDER ───────────────────────────

export function TempleFinder() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [state, setState] = useState("All");
  const types = [
    "All",
    "Jyotirlinga",
    "Char Dham",
    "Shakti Peeth",
    "Vishnu Dham",
    "Ganesha",
    "Hanuman",
    "Devi",
    "Other",
  ];
  const states = ["All", ...Array.from(new Set(TEMPLES.map((t) => t.state))).sort()];
  const results: Temple[] = TEMPLES.filter((t) => {
    if (type !== "All" && t.type !== type) return false;
    if (state !== "All" && t.state !== state) return false;
    if (q && !`${t.name} ${t.city} ${t.deity}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search temples, cities, deities…"
            className="pl-9"
          />
        </div>
        <FilterSelect label="Type" value={type} onChange={setType} options={types} />
        <FilterSelect label="State" value={state} onChange={setState} options={states} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((t) => (
          <div
            key={t.slug}
            className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-glow transition"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <MapPin className="size-3" /> {t.city}, {t.state}
            </div>
            <div className="mt-1 font-display text-lg font-semibold">{t.name}</div>
            <div className="text-xs text-muted-foreground">Deity: {t.deity}</div>
            <p className="mt-3 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline">{t.type}</Badge>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${t.name} ${t.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline ml-auto self-center"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-16">
            No temples match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── PUJA CHECKLIST ───────────────────────────

export function PujaChecklistGenerator() {
  const [active, setActive] = useState<string>(PUJA_CHECKLISTS[0].slug);
  const puja = PUJA_CHECKLISTS.find((p) => p.slug === active)!;
  const hydrated = useHydrated();
  const [checked, setChecked] = useState<Record<string, Set<string>>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("st.puja.checked");
      if (raw) {
        const parsed: Record<string, string[]> = JSON.parse(raw);
        const map: Record<string, Set<string>> = {};
        Object.entries(parsed).forEach(([k, v]) => {
          map[k] = new Set(v);
        });
        setChecked(map);
      }
    } catch {
      /* ignore */
    }
  }, []);
  const persist = (next: Record<string, Set<string>>) => {
    try {
      const flat: Record<string, string[]> = {};
      Object.entries(next).forEach(([k, v]) => {
        flat[k] = Array.from(v);
      });
      localStorage.setItem("st.puja.checked", JSON.stringify(flat));
    } catch {
      /* ignore */
    }
  };
  const toggle = (key: string) => {
    const set = new Set(checked[active] ?? []);
    set.has(key) ? set.delete(key) : set.add(key);
    const next = { ...checked, [active]: set };
    setChecked(next);
    persist(next);
  };
  const isChecked = (key: string) => hydrated && (checked[active]?.has(key) ?? false);

  const totalItems = puja.samagri.length + puja.steps.length;
  const doneItems = hydrated ? (checked[active]?.size ?? 0) : 0;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {PUJA_CHECKLISTS.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActive(p.slug)}
            className={`px-4 py-2 rounded-full text-sm border transition ${active === p.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
          >
            {p.title}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <ToolCardFrame title={`Samagri for ${puja.title}`}>
          <div className="text-xs text-muted-foreground mb-3">
            {doneItems} / {totalItems} items checked
          </div>
          <ul className="space-y-2">
            {puja.samagri.map((s, i) => {
              const key = `samagri:${i}`;
              return (
                <li key={key}>
                  <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked(key)}
                      onChange={() => toggle(key)}
                      className="mt-1 accent-primary"
                    />
                    <span
                      className={`text-sm ${isChecked(key) ? "line-through text-muted-foreground" : ""}`}
                    >
                      {s}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </ToolCardFrame>
        <div className="space-y-5">
          <ToolCardFrame title="Puja steps">
            <ol className="space-y-2">
              {puja.steps.map((s, i) => {
                const key = `step:${i}`;
                return (
                  <li key={key}>
                    <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked(key)}
                        onChange={() => toggle(key)}
                        className="mt-1 accent-primary"
                      />
                      <span
                        className={`text-sm ${isChecked(key) ? "line-through text-muted-foreground" : ""}`}
                      >
                        <b>{i + 1}.</b> {s}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ol>
          </ToolCardFrame>
          <ToolCardFrame title="Mantras">
            <ul className="space-y-3">
              {puja.mantras.map((m, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-primary-soft/50 p-4 font-devanagari text-lg leading-relaxed"
                >
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`/tools/${puja.aarti === "sukhkarta-dukhharta" ? "aarti-collection" : "aarti-collection"}`}
                className="inline-flex"
              >
                <Button variant="outline" size="sm">
                  <Bell className="size-4" /> Read the Aarti
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = { ...checked, [active]: new Set<string>() };
                  setChecked(next);
                  persist(next);
                }}
              >
                <RotateCcw className="size-4" /> Reset checklist
              </Button>
            </div>
          </ToolCardFrame>
        </div>
      </div>
    </div>
  );
}
