import { useMemo, useState } from "react";
import { Sun, Moon, Clock, Sparkles, TriangleAlert, Star, Zap } from "lucide-react";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { DailyShareButton, CityBookmarksBar } from "@/tools/panchang-extras";

import { ToolCardFrame } from "@/components/tools/ToolShell";
import { LocationPicker, DateInput } from "@/components/tools/LocationPicker";
import { useHydrated, useLocation } from "@/lib/location";
import {
  fmtTime,
  fmtLocalDate,
  fmtDateTime,
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSunTimes,
  getKaalWindow,
  getChoghadiya,
  WEEKDAYS,
  getLocalWeekday,
  getAbhijitMuhurat,
  type LatLon,
  CHO_QUALITY,
} from "@/lib/panchang";

function useToolDate() {
  // ISO date string in local (tz agnostic input) — we treat it as noon local (UTC) to compute.
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const dateObj = useMemo(() => new Date(`${date}T06:00:00Z`), [date]);
  return { date, setDate, dateObj };
}

function Controls({
  loc,
  setLoc,
  date,
  setDate,
}: {
  loc: LatLon;
  setLoc: (l: LatLon) => void;
  date: string;
  setDate: (d: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <DateInput value={date} onChange={setDate} />
      <LocationPicker value={loc} onChange={setLoc} />
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-border/60 last:border-b-0">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        {hint && <div className="text-xs text-muted-foreground/80 mt-0.5">{hint}</div>}
      </div>
      <div className="text-right font-medium">{value}</div>
    </div>
  );
}

function useLive() {
  const hydrated = useHydrated();
  const [loc, setLoc] = useLocation();
  return { hydrated, loc, setLoc };
}

// ─────────────────────────── TODAY'S PANCHANG ───────────────────────────

export function TodaysPanchang() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();

  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );

  const tithi = getTithi(dateObj);
  const nak = getNakshatra(dateObj);
  const yoga = getYoga(dateObj);
  const karana = getKarana(dateObj);
  const sun = getSunTimes(dateObj, loc);
  const wk = getLocalWeekday(dateObj, loc.tz);
  const rahu = getKaalWindow("rahu", dateObj, loc);
  const yama = getKaalWindow("yama", dateObj, loc);
  const gulika = getKaalWindow("gulika", dateObj, loc);

  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <CityBookmarksBar loc={loc} setLoc={setLoc} />
        <DailyShareButton dateObj={dateObj} loc={loc} />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <ToolCardFrame title="Panchang">
          <div className="mb-4 text-sm text-muted-foreground">
            {fmtLocalDate(dateObj, loc.tz)} · {loc.label}
          </div>
          <Row label="Vara (Weekday)" value={WEEKDAYS[wk]} />
          <Row
            label="Tithi"
            value={
              <span>
                <b>{tithi.name}</b> · {tithi.paksha} Paksha
              </span>
            }
            hint={`${tithi.percent.toFixed(1)}% complete`}
          />
          <Row
            label="Nakshatra"
            value={
              <span>
                <b>{nak.name}</b> · Pada {nak.pada}
              </span>
            }
            hint={`Lord: ${nak.lord} · Deity: ${nak.deity}`}
          />
          <Row
            label="Yoga"
            value={<b>{yoga.name}</b>}
            hint={`${yoga.percent.toFixed(1)}% complete`}
          />
          <Row
            label="Karana"
            value={
              <span>
                <b>{karana.name}</b> · {karana.type}
              </span>
            }
          />
        </ToolCardFrame>

        <ToolCardFrame title="Timings">
          <Row
            label="Sunrise"
            value={
              <span className="inline-flex items-center gap-2">
                <Sun className="size-4 text-amber-500" /> {fmtTime(sun.sunrise, loc.tz)}
              </span>
            }
          />
          <Row
            label="Sunset"
            value={
              <span className="inline-flex items-center gap-2">
                <Moon className="size-4 text-indigo-500" /> {fmtTime(sun.sunset, loc.tz)}
              </span>
            }
          />
          <Row label="Solar noon" value={fmtTime(sun.solarNoon, loc.tz)} />
          <Row
            label="Day length"
            value={
              sun.dayLengthMinutes != null
                ? `${Math.floor(sun.dayLengthMinutes / 60)}h ${sun.dayLengthMinutes % 60}m`
                : "—"
            }
          />
          <div className="pt-4 mt-2 border-t border-border/60">
            <div className="text-xs uppercase tracking-widest text-accent mb-3">
              Inauspicious windows
            </div>
            <Row
              label="Rahu Kaal"
              value={rahu ? `${fmtTime(rahu.start, loc.tz)} – ${fmtTime(rahu.end, loc.tz)}` : "—"}
            />
            <Row
              label="Yamaganda"
              value={yama ? `${fmtTime(yama.start, loc.tz)} – ${fmtTime(yama.end, loc.tz)}` : "—"}
            />
            <Row
              label="Gulika Kaal"
              value={
                gulika ? `${fmtTime(gulika.start, loc.tz)} – ${fmtTime(gulika.end, loc.tz)}` : "—"
              }
            />
          </div>
        </ToolCardFrame>
      </div>
    </div>
  );
}

export function todaysPanchangCopy(loc: LatLon, dateObj: Date): string {
  const tithi = getTithi(dateObj);
  const nak = getNakshatra(dateObj);
  const yoga = getYoga(dateObj);
  const karana = getKarana(dateObj);
  const sun = getSunTimes(dateObj, loc);
  return [
    `Panchang for ${fmtLocalDate(dateObj, loc.tz)} · ${loc.label}`,
    `Tithi: ${tithi.name} (${tithi.paksha} Paksha)`,
    `Nakshatra: ${nak.name}, Pada ${nak.pada}`,
    `Yoga: ${yoga.name}`,
    `Karana: ${karana.name}`,
    `Sunrise: ${fmtTime(sun.sunrise, loc.tz)} · Sunset: ${fmtTime(sun.sunset, loc.tz)}`,
  ].join("\n");
}

// ─────────────────────────── SINGLE-VALUE TOOLS ───────────────────────────

function SingleValueCard({
  title,
  main,
  badges,
  extra,
}: {
  title: string;
  main: string;
  badges?: { label: string; value: string }[];
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/50 via-card to-card p-8 md:p-10 shadow-elegant text-center">
      <div className="text-xs font-semibold uppercase tracking-widest text-accent">{title}</div>
      <div className="mt-3 font-display text-4xl md:text-6xl font-semibold tracking-tight">
        {main}
      </div>
      {badges && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {badges.map((b) => (
            <div
              key={b.label}
              className="rounded-2xl border border-border bg-background/60 px-4 py-2 text-left"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {b.label}
              </div>
              <div className="font-medium">{b.value}</div>
            </div>
          ))}
        </div>
      )}
      {extra && <div className="mt-6">{extra}</div>}
    </div>
  );
}

export function TodaysTithi() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const t = getTithi(dateObj);
  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <SingleValueCard
        title={`Tithi · ${fmtLocalDate(dateObj, loc.tz)}`}
        main={t.name}
        badges={[
          { label: "Paksha", value: t.paksha },
          { label: "Progress", value: `${t.percent.toFixed(1)}%` },
          { label: "Ends at", value: fmtTime(t.endsAt, loc.tz) },
          { label: "Number", value: `${t.index} / 30` },
        ]}
        extra={<Progress value={t.percent} />}
      />
    </div>
  );
}

export function TodaysNakshatra() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const n = getNakshatra(dateObj);
  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <SingleValueCard
        title={`Nakshatra · ${fmtLocalDate(dateObj, loc.tz)}`}
        main={n.name}
        badges={[
          { label: "Pada", value: `${n.pada} / 4` },
          { label: "Lord", value: n.lord },
          { label: "Deity", value: n.deity },
          { label: "Symbol", value: n.symbol },
          { label: "Ends at", value: fmtTime(n.endsAt, loc.tz) },
        ]}
        extra={<Progress value={n.percent} />}
      />
    </div>
  );
}

export function TodaysYoga() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const y = getYoga(dateObj);
  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <SingleValueCard
        title={`Yoga · ${fmtLocalDate(dateObj, loc.tz)}`}
        main={y.name}
        badges={[
          { label: "Number", value: `${y.index} / 27` },
          { label: "Progress", value: `${y.percent.toFixed(1)}%` },
          { label: "Ends at", value: fmtTime(y.endsAt, loc.tz) },
        ]}
        extra={<Progress value={y.percent} />}
      />
    </div>
  );
}

export function TodaysKarana() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const k = getKarana(dateObj);
  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <SingleValueCard
        title={`Karana · ${fmtLocalDate(dateObj, loc.tz)}`}
        main={k.name}
        badges={[
          { label: "Type", value: k.type },
          { label: "Number", value: `${k.index} / 60` },
          { label: "Progress", value: `${k.percent.toFixed(1)}%` },
          { label: "Ends at", value: fmtTime(k.endsAt, loc.tz) },
        ]}
        extra={<Progress value={k.percent} />}
      />
    </div>
  );
}

// Sunrise / Sunset (very focused)
export function TodaysSunrise() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const s = getSunTimes(dateObj, loc);
  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <SingleValueCard
        title={`Sunrise · ${fmtLocalDate(dateObj, loc.tz)}`}
        main={fmtTime(s.sunrise, loc.tz)}
        badges={[
          { label: "Location", value: loc.label },
          { label: "Sunset", value: fmtTime(s.sunset, loc.tz) },
          { label: "Solar noon", value: fmtTime(s.solarNoon, loc.tz) },
          {
            label: "Day length",
            value:
              s.dayLengthMinutes != null
                ? `${Math.floor(s.dayLengthMinutes / 60)}h ${s.dayLengthMinutes % 60}m`
                : "—",
          },
        ]}
      />
    </div>
  );
}

export function TodaysSunset() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const s = getSunTimes(dateObj, loc);
  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <SingleValueCard
        title={`Sunset · ${fmtLocalDate(dateObj, loc.tz)}`}
        main={fmtTime(s.sunset, loc.tz)}
        badges={[
          { label: "Location", value: loc.label },
          { label: "Sunrise", value: fmtTime(s.sunrise, loc.tz) },
          { label: "Solar noon", value: fmtTime(s.solarNoon, loc.tz) },
          {
            label: "Day length",
            value:
              s.dayLengthMinutes != null
                ? `${Math.floor(s.dayLengthMinutes / 60)}h ${s.dayLengthMinutes % 60}m`
                : "—",
          },
        ]}
      />
    </div>
  );
}

// Kaal windows

function KaalTool({
  kind,
  title,
  tone,
}: {
  kind: "rahu" | "yama" | "gulika";
  title: string;
  tone: "danger" | "warn" | "info";
}) {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const w = getKaalWindow(kind, dateObj, loc);
  const sun = getSunTimes(dateObj, loc);
  const durationMin = w ? Math.round((w.end.getTime() - w.start.getTime()) / 60000) : null;
  const iconColor =
    tone === "danger" ? "text-destructive" : tone === "warn" ? "text-amber-500" : "text-indigo-500";
  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <SingleValueCard
        title={`${title} · ${fmtLocalDate(dateObj, loc.tz)}`}
        main={w ? `${fmtTime(w.start, loc.tz)} – ${fmtTime(w.end, loc.tz)}` : "—"}
        badges={[
          { label: "Duration", value: durationMin ? `${durationMin} min` : "—" },
          { label: "Sunrise", value: fmtTime(sun.sunrise, loc.tz) },
          { label: "Sunset", value: fmtTime(sun.sunset, loc.tz) },
          { label: "Part of day", value: w ? `${w.partIndex} / 8` : "—" },
        ]}
        extra={
          <div className={`inline-flex items-center gap-2 text-sm ${iconColor}`}>
            <TriangleAlert className="size-4" />
            <span>Avoid new ventures during this window.</span>
          </div>
        }
      />
    </div>
  );
}

export const RahuKaal = () => <KaalTool kind="rahu" title="Rahu Kaal" tone="danger" />;
export const GulikaKaal = () => <KaalTool kind="gulika" title="Gulika Kaal" tone="warn" />;
export const Yamaganda = () => <KaalTool kind="yama" title="Yamaganda" tone="warn" />;

// Choghadiya
export function Choghadiya() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );
  const cho = getChoghadiya(dateObj, loc);
  const now = new Date();
  const isNow = (s: Date, e: Date) => now >= s && now < e;

  const Table = ({
    title,
    icon: Icon,
    slots,
  }: {
    title: string;
    icon: typeof Sun;
    slots: { name: string; start: Date; end: Date }[];
  }) => (
    <ToolCardFrame title={title}>
      <div className="flex items-center gap-2 mb-4 text-accent text-sm">
        <Icon className="size-4" /> Muhurta windows
      </div>
      <div className="divide-y divide-border/60">
        {slots.map((s, i) => {
          const q = CHO_QUALITY[s.name];
          const badge =
            q === "auspicious"
              ? "bg-success/15 text-success"
              : q === "inauspicious"
                ? "bg-destructive/15 text-destructive"
                : "bg-muted text-muted-foreground";
          return (
            <div
              key={i}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5 ${isNow(s.start, s.end) ? "bg-primary-soft/60 -mx-3 px-3 rounded-lg" : ""}`}
            >
              <div>
                <div className="font-medium">
                  {s.name}{" "}
                  {isNow(s.start, s.end) && <span className="ml-2 text-xs text-accent">· now</span>}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{q}</div>
              </div>
              <div className="text-sm tabular-nums text-muted-foreground">
                {fmtTime(s.start, loc.tz)}
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>
                {q === "auspicious" ? "shubh" : q === "inauspicious" ? "avoid" : "neutral"}
              </div>
            </div>
          );
        })}
      </div>
    </ToolCardFrame>
  );

  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />
      <div className="grid md:grid-cols-2 gap-5">
        {cho ? (
          <Table title="Day Choghadiya" icon={Sun} slots={cho.day} />
        ) : (
          <ToolCardFrame>Unable to compute for this location/date.</ToolCardFrame>
        )}
        {cho ? <Table title="Night Choghadiya" icon={Moon} slots={cho.night} /> : null}
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-5 text-sm">
        <div className="flex items-center gap-2 text-accent mb-2">
          <Sparkles className="size-4" /> How to read choghadiya
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Star className="size-4 text-success" /> <b>Amrit, Shubh, Labh</b> — auspicious
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-muted-foreground" /> <b>Char</b> — neutral / travel
          </div>
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-destructive" /> <b>Rog, Kaal, Udveg</b> — avoid
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── MUHURAT DASHBOARD ───────────────────────────
// Combined: Rahu Kaal + Abhijit Muhurat + Choghadiya (live "now" highlight)

export function MuhuratDashboard() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );

  const sun = getSunTimes(dateObj, loc);
  const rahu = getKaalWindow("rahu", dateObj, loc);
  const yama = getKaalWindow("yama", dateObj, loc);
  const gulika = getKaalWindow("gulika", dateObj, loc);
  const abhijit = getAbhijitMuhurat(dateObj, loc);
  const cho = getChoghadiya(dateObj, loc);

  const now = new Date();
  const isSameDay = new Date().toISOString().slice(0, 10) === date;
  const inWin = (s?: Date | null, e?: Date | null) => isSameDay && s && e && now >= s && now < e;

  const allSlots = cho ? [...cho.day, ...cho.night] : [];
  const currentCho = allSlots.find((s) => inWin(s.start, s.end));
  const nextAuspicious = allSlots.find(
    (s) => (isSameDay ? s.start > now : true) && CHO_QUALITY[s.name] === "auspicious",
  );

  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />

      {/* Hero — right-now snapshot */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary-soft/60 via-card to-card p-6 md:p-8 shadow-elegant mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Muhurat Dashboard · {fmtLocalDate(dateObj, loc.tz)} · {loc.label}
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <StatBox
            label="Right now"
            main={currentCho ? currentCho.name : isSameDay ? "—" : "Pick today"}
            hint={
              currentCho
                ? `Ends ${fmtTime(currentCho.end, loc.tz)} · ${CHO_QUALITY[currentCho.name]}`
                : "Choghadiya window"
            }
            tone={currentCho ? CHO_QUALITY[currentCho.name] : "neutral"}
          />
          <StatBox
            label="Abhijit Muhurat"
            main={
              abhijit.start && abhijit.end
                ? `${fmtTime(abhijit.start, loc.tz)} – ${fmtTime(abhijit.end, loc.tz)}`
                : "—"
            }
            hint={
              abhijit.observed
                ? `~${abhijit.durationMinutes} min · most auspicious`
                : "Not observed on Wednesday"
            }
            tone={abhijit.observed ? "auspicious" : "inauspicious"}
          />
          <StatBox
            label="Rahu Kaal · avoid"
            main={rahu ? `${fmtTime(rahu.start, loc.tz)} – ${fmtTime(rahu.end, loc.tz)}` : "—"}
            hint={rahu ? `Part ${rahu.partIndex} / 8 of day` : "—"}
            tone="inauspicious"
          />
        </div>
        {nextAuspicious && (
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-success" />
            Next auspicious window: <b className="text-foreground">{nextAuspicious.name}</b> ·{" "}
            {fmtTime(nextAuspicious.start, loc.tz)} – {fmtTime(nextAuspicious.end, loc.tz)}
          </div>
        )}
      </div>

      {/* Timings + kaal windows */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <ToolCardFrame title="Sun & Muhurat">
          <Row
            label="Sunrise"
            value={
              <span className="inline-flex items-center gap-2">
                <Sun className="size-4 text-amber-500" /> {fmtTime(sun.sunrise, loc.tz)}
              </span>
            }
          />
          <Row label="Solar noon" value={fmtTime(sun.solarNoon, loc.tz)} />
          <Row
            label="Sunset"
            value={
              <span className="inline-flex items-center gap-2">
                <Moon className="size-4 text-indigo-500" /> {fmtTime(sun.sunset, loc.tz)}
              </span>
            }
          />
          <Row
            label="Abhijit Muhurat"
            value={
              abhijit.start && abhijit.end
                ? `${fmtTime(abhijit.start, loc.tz)} – ${fmtTime(abhijit.end, loc.tz)}`
                : "—"
            }
            hint={
              abhijit.observed
                ? "8th of 15 day-muhurats · centred on solar noon"
                : "Skipped on Wednesdays"
            }
          />
        </ToolCardFrame>

        <ToolCardFrame title="Inauspicious Kaal · avoid">
          <Row
            label="Rahu Kaal"
            value={rahu ? `${fmtTime(rahu.start, loc.tz)} – ${fmtTime(rahu.end, loc.tz)}` : "—"}
          />
          <Row
            label="Yamaganda"
            value={yama ? `${fmtTime(yama.start, loc.tz)} – ${fmtTime(yama.end, loc.tz)}` : "—"}
          />
          <Row
            label="Gulika Kaal"
            value={
              gulika ? `${fmtTime(gulika.start, loc.tz)} – ${fmtTime(gulika.end, loc.tz)}` : "—"
            }
          />
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-destructive">
            <TriangleAlert className="size-3.5" /> Avoid new ventures during these windows.
          </div>
        </ToolCardFrame>
      </div>

      {/* Choghadiya tables */}
      {cho && (
        <div className="grid md:grid-cols-2 gap-5">
          <ChoTable title="Day Choghadiya" Icon={Sun} slots={cho.day} tz={loc.tz} inWin={inWin} />
          <ChoTable
            title="Night Choghadiya"
            Icon={Moon}
            slots={cho.night}
            tz={loc.tz}
            inWin={inWin}
          />
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-5 text-sm">
        <div className="flex items-center gap-2 text-accent mb-2">
          <Sparkles className="size-4" /> Quick legend
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Star className="size-4 text-success" /> <b>Amrit · Shubh · Labh</b> — auspicious
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-muted-foreground" /> <b>Char</b> — neutral / travel
          </div>
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-4 text-destructive" /> <b>Rog · Kaal · Udveg</b> — avoid
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  main,
  hint,
  tone,
}: {
  label: string;
  main: string;
  hint?: string;
  tone: "auspicious" | "inauspicious" | "neutral";
}) {
  const toneCls =
    tone === "auspicious"
      ? "border-success/40 bg-success/5"
      : tone === "inauspicious"
        ? "border-destructive/40 bg-destructive/5"
        : "border-border bg-background/60";
  return (
    <div className={`rounded-2xl border ${toneCls} p-4`}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1.5 font-display text-xl md:text-2xl font-semibold tracking-tight tabular-nums">
        {main}
      </div>
      {hint && <div className="text-xs text-muted-foreground mt-1 capitalize">{hint}</div>}
    </div>
  );
}

function ChoTable({
  title,
  Icon,
  slots,
  tz,
  inWin,
}: {
  title: string;
  Icon: typeof Sun;
  slots: { name: string; start: Date; end: Date }[];
  tz: string;
  inWin: (s: Date, e: Date) => boolean | null | undefined | "";
}) {
  return (
    <ToolCardFrame title={title}>
      <div className="flex items-center gap-2 mb-4 text-accent text-sm">
        <Icon className="size-4" /> Muhurta windows
      </div>
      <div className="divide-y divide-border/60">
        {slots.map((s, i) => {
          const q = CHO_QUALITY[s.name];
          const badge =
            q === "auspicious"
              ? "bg-success/15 text-success"
              : q === "inauspicious"
                ? "bg-destructive/15 text-destructive"
                : "bg-muted text-muted-foreground";
          const now = !!inWin(s.start, s.end);
          return (
            <div
              key={i}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5 ${now ? "bg-primary-soft/60 -mx-3 px-3 rounded-lg" : ""}`}
            >
              <div>
                <div className="font-medium">
                  {s.name} {now && <span className="ml-2 text-xs text-accent">· now</span>}
                </div>
                <div className="text-xs text-muted-foreground capitalize">{q}</div>
              </div>
              <div className="text-sm tabular-nums text-muted-foreground">
                {fmtTime(s.start, tz)}
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>
                {q === "auspicious" ? "shubh" : q === "inauspicious" ? "avoid" : "neutral"}
              </div>
            </div>
          );
        })}
      </div>
    </ToolCardFrame>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-4">
      <div className="mx-auto max-w-md h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-gradient-brand"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1">
        <Clock className="size-3" /> {value.toFixed(1)}% complete
      </div>
    </div>
  );
}

const PANCHANG_TIPS = [
  "पंचांग = तिथि · वार · नक्षत्र · योग · करण — दिन के पाँच अंग।",
  "Rahu Kaal me naye kaam shuru karna avoid kiya jata hai — travel usually theek hai.",
  "Abhijit Muhurat (~madhyahna) sabse shubh window maani jaati hai — approx 48 min.",
  "Tithi zyaadatar din ke beech me change hoti hai, isliye sunrise wali tithi vrat ke liye ginte hain.",
  "Choghadiya me Amrit · Shubh · Labh — auspicious; Rog · Kaal · Udveg — avoid.",
  "Nakshatra Chandrama ki position se milta hai — har ek ka apna deity aur lord hota hai.",
  "हम Lahiri Ayanamsa aur Drik-siddha ganit use karte hain — Bharat Sarkar ka standard.",
  "Sunrise-Sunset aapke shahar ke exact longitude par depend karta hai.",
];

function SkeletonBlock() {
  return (
    <SanatanLoader
      title="Aapke shahar ka Panchang compute ho raha hai"
      subtitle="Sooryodaya · Tithi · Nakshatra…"
      tips={PANCHANG_TIPS}
    />
  );
}

// ─────────────────────────── PERSONAL GUIDANCE ───────────────────────────
import {
  getMoonRashi,
  getTarabalam,
  getChandrabalam,
  getLuckyForDay,
  getFastingInfo,
  getDeityOfDay,
  getMoonSignHoroscope,
  NAKSHATRAS as _NAK,
  RASHIS as _RASHIS,
} from "@/lib/panchang";

export function PersonalGuidance() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();
  const [natalNak, setNatalNak] = useState<number>(0); // 0 = not set
  const [natalRashi, setNatalRashi] = useState<number>(0);

  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );

  const wk = getLocalWeekday(dateObj, loc.tz);
  const tithi = getTithi(dateObj);
  const nak = getNakshatra(dateObj);
  const moonRashi = getMoonRashi(dateObj);
  const lucky = getLuckyForDay(wk, nak.lord);
  const fasts = getFastingInfo(tithi, wk);
  const deity = getDeityOfDay(wk);
  const horoscopeRashi = natalRashi > 0 ? natalRashi : moonRashi.index;
  const horo = getMoonSignHoroscope(horoscopeRashi, dateObj);
  const tara = natalNak > 0 ? getTarabalam(natalNak, nak.index) : null;
  const chandra = natalRashi > 0 ? getChandrabalam(natalRashi, moonRashi.index) : null;

  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />

      {/* Hero — Deity of the day */}
      <ToolCardFrame>
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Deity of the Day · {WEEKDAYS[wk].split(" ")[0]}
            </div>
            <div className="text-2xl font-serif mt-1">{deity.deity}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Ruling planet: <b>{deity.planet}</b>
            </div>
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="text-lg font-serif">{deity.mantra.text}</div>
              <div className="text-sm text-muted-foreground mt-1">{deity.mantra.translit}</div>
              <div className="text-xs text-muted-foreground/90 mt-2 italic">
                "{deity.mantra.meaning}"
              </div>
            </div>
            <div className="mt-3 text-sm">
              <span className="text-muted-foreground">Practice: </span>
              {deity.practice}
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-amber-500/10 to-rose-500/5 p-4 min-w-[220px]">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Today's Moon sign
            </div>
            <div className="text-xl font-serif mt-1">{moonRashi.name}</div>
            <div className="text-xs text-muted-foreground mt-1">Rashi lord: {moonRashi.lord}</div>
            <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
              Nakshatra
            </div>
            <div className="text-sm font-medium">
              {nak.name} · Pada {nak.pada}
            </div>
          </div>
        </div>
      </ToolCardFrame>

      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        {/* Lucky */}
        <ToolCardFrame title="Today's Lucky">
          <Row
            label="Colour"
            value={<b>{lucky.color}</b>}
            hint="Wear or keep this shade near you today"
          />
          <Row
            label="Number"
            value={<b>{lucky.number}</b>}
            hint="Favourable digit for choices & timings"
          />
          <Row
            label="Direction"
            value={<b>{lucky.direction}</b>}
            hint="Face this direction for prayer & important calls"
          />
          <Row label="Metal" value={<b>{lucky.metal}</b>} />
          <Row
            label="Gemstone (nakshatra)"
            value={<b>{lucky.gemstone}</b>}
            hint={`Based on today's nakshatra lord: ${nak.lord}`}
          />
        </ToolCardFrame>

        {/* Fasting */}
        <ToolCardFrame title="Fasting & Vrat Today">
          {fasts.map((f, i) => (
            <div key={i} className="py-3 border-b border-border/60 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.deity}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{f.note}</div>
            </div>
          ))}
        </ToolCardFrame>
      </div>

      {/* Personal balams */}
      <div className="mt-5">
        <ToolCardFrame title="Tarabalam & Chandrabalam — for travel & new work">
          <p className="text-sm text-muted-foreground mb-4">
            Enter your <b>janma nakshatra</b> and <b>janma rashi</b> once — we'll compute how
            today's Moon supports your travel, meetings and new ventures.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <label className="text-sm">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Janma Nakshatra
              </div>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={natalNak}
                onChange={(e) => setNatalNak(Number(e.target.value))}
              >
                <option value={0}>— Select —</option>
                {_NAK.map((n, i) => (
                  <option key={i} value={i + 1}>
                    {n.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Janma Rashi (Moon sign)
              </div>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={natalRashi}
                onChange={(e) => setNatalRashi(Number(e.target.value))}
              >
                <option value={0}>— Select —</option>
                {_RASHIS.map((r, i) => (
                  <option key={i} value={i + 1}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div
              className={`rounded-lg border p-4 ${tara ? (tara.tara.good ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/5") : "border-border/60 bg-muted/20"}`}
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Tarabalam
              </div>
              {tara ? (
                <>
                  <div className="text-lg font-serif mt-1">
                    Tara {tara.taraIndex} · {tara.tara.name}
                  </div>
                  <div className="text-sm mt-1">{tara.tara.note}</div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground mt-2">
                  Select your janma nakshatra above.
                </div>
              )}
            </div>
            <div
              className={`rounded-lg border p-4 ${chandra ? (chandra.strength === "strong" ? "border-emerald-500/40 bg-emerald-500/5" : chandra.strength === "weak" ? "border-rose-500/40 bg-rose-500/5" : "border-amber-500/40 bg-amber-500/5") : "border-border/60 bg-muted/20"}`}
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Chandrabalam
              </div>
              {chandra ? (
                <>
                  <div className="text-lg font-serif mt-1 capitalize">
                    {chandra.strength} · House {chandra.house}
                  </div>
                  <div className="text-sm mt-1">{chandra.note}</div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground mt-2">
                  Select your janma rashi above.
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Tarabalam &amp; Chandrabalam are traditional checks used before travel, marriage tasks,
            business launches and any new ceremony.
          </p>
        </ToolCardFrame>
      </div>

      {/* Horoscope */}
      <div className="mt-5">
        <ToolCardFrame title={`Daily Guidance · ${_RASHIS[horoscopeRashi - 1]}`}>
          <p className="text-xs text-muted-foreground mb-3">
            {natalRashi > 0
              ? "Personalised for your janma rashi."
              : "Based on today's Moon sign — set your janma rashi above for a personalised reading."}
          </p>
          <Row
            label="Work"
            value={<span className="text-right block max-w-[36ch]">{horo.work}</span>}
          />
          <Row
            label="Money"
            value={<span className="text-right block max-w-[36ch]">{horo.money}</span>}
          />
          <Row
            label="Health"
            value={<span className="text-right block max-w-[36ch]">{horo.health}</span>}
          />
          <Row
            label="Relations"
            value={<span className="text-right block max-w-[36ch]">{horo.relations}</span>}
          />
          <Row
            label="Advice"
            value={<span className="text-right block max-w-[36ch] italic">{horo.advice}</span>}
          />
        </ToolCardFrame>
      </div>
    </div>
  );
}

// ─────────────────────────── ADVANCED PANCHANG ───────────────────────────
import {
  getMoonTimes,
  getAlmanac,
  getUpcomingEclipses,
  getTransits,
  getNextNodeTransit,
  getLagna,
} from "@/lib/panchang";

export function AdvancedPanchang() {
  const { hydrated, loc, setLoc } = useLive();
  const { date, setDate, dateObj } = useToolDate();

  if (!hydrated)
    return (
      <ToolCardFrame>
        <SkeletonBlock />
      </ToolCardFrame>
    );

  const now = new Date(); // Lagna is live "right now"
  const almanac = getAlmanac(dateObj);
  const moon = getMoonTimes(dateObj, loc);
  const eclipses = getUpcomingEclipses(dateObj, 6);
  const transits = getTransits(dateObj);
  const nodeTransit = getNextNodeTransit(dateObj);
  const lagna = getLagna(now, loc);

  return (
    <div>
      <Controls loc={loc} setLoc={setLoc} date={date} setDate={setDate} />

      {/* Lagna hero */}
      <ToolCardFrame>
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Lagna right now · {loc.label}
            </div>
            <div className="text-3xl font-serif mt-1">{lagna.rashi}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {lagna.degreeInRashi.toFixed(2)}° in {lagna.rashi.split(" ")[0]} · Nakshatra:{" "}
              <b>{lagna.nakshatra}</b>
            </div>
            <div className="text-xs text-muted-foreground/90 mt-2">
              Ascendant recalculated for {fmtTime(now, loc.tz)}. Refresh for the current lagna.
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-gradient-to-br from-indigo-500/10 to-amber-500/5 p-4 min-w-[240px]">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Almanac · {fmtLocalDate(dateObj, loc.tz)}
            </div>
            <div className="text-sm mt-2 space-y-1">
              <div>
                <span className="text-muted-foreground">Samvatsara:</span>{" "}
                <b>{almanac.samvatsara}</b>
              </div>
              <div>
                <span className="text-muted-foreground">Vikram Samvat:</span>{" "}
                <b>{almanac.vikramSamvat}</b>
              </div>
              <div>
                <span className="text-muted-foreground">Shaka Samvat:</span>{" "}
                <b>{almanac.shakaSamvat}</b>
              </div>
              <div>
                <span className="text-muted-foreground">Kali Samvat:</span>{" "}
                <b>{almanac.kaliSamvat}</b>
              </div>
            </div>
          </div>
        </div>
      </ToolCardFrame>

      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        {/* Paksha / Ritu / Ayana */}
        <ToolCardFrame title="Paksha · Ritu · Ayana">
          <Row
            label="Paksha"
            value={<b>{almanac.paksha} Paksha</b>}
            hint={almanac.paksha === "Shukla" ? "Waxing fortnight" : "Waning fortnight"}
          />
          <Row
            label="Ritu (Season)"
            value={<b>{almanac.ritu}</b>}
            hint="Vedic season based on Sun's sidereal rashi"
          />
          <Row
            label="Ayana"
            value={<b>{almanac.ayana}</b>}
            hint={
              almanac.ayana === "Uttarayana"
                ? "Sun's northward journey (Makara → Karka)"
                : "Sun's southward journey (Karka → Makara)"
            }
          />
          <Row
            label="Gola"
            value={<b>{almanac.gola}</b>}
            hint="Sun's celestial hemisphere (declination)"
          />
          <Row
            label="Solar Masa"
            value={<b>{almanac.masaSolar}</b>}
            hint="Sun's current sidereal rashi (Nirayana solar month)"
          />
        </ToolCardFrame>

        {/* Moon rise / set */}
        <ToolCardFrame title="Moonrise & Moonset">
          <Row label="Moonrise" value={<b>{fmtDateTime(moon.rise, loc.tz)}</b>} />
          <Row label="Moonset" value={<b>{fmtDateTime(moon.set, loc.tz)}</b>} />
          <p className="text-xs text-muted-foreground mt-3">
            Moon may not rise or set on a given calendar day at extreme latitudes. Times are
            computed for {loc.label}.
          </p>
        </ToolCardFrame>
      </div>

      {/* Graha Gochar */}
      <div className="mt-5">
        <ToolCardFrame title="Graha Gochar (Planetary Transits)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border/60 text-muted-foreground text-xs uppercase tracking-widest">
                  <th className="py-2 pr-3">Planet</th>
                  <th className="py-2 pr-3">Rashi</th>
                  <th className="py-2 pr-3 text-right">Degree</th>
                  <th className="py-2 pr-3">Nakshatra</th>
                  <th className="py-2 pr-3">Motion</th>
                </tr>
              </thead>
              <tbody>
                {transits.map((p) => (
                  <tr key={p.body} className="border-b border-border/40 last:border-b-0">
                    <td className="py-2 pr-3 font-medium">{p.body}</td>
                    <td className="py-2 pr-3">{p.rashi}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{p.rashiDeg.toFixed(2)}°</td>
                    <td className="py-2 pr-3">{p.nakshatra}</td>
                    <td className="py-2 pr-3">
                      {p.retrograde ? (
                        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] bg-rose-500/10 text-rose-500">
                          Retrograde (Vakri)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] bg-emerald-500/10 text-emerald-500">
                          Direct (Margi)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Sidereal positions (Lahiri ayanamsa) for {fmtLocalDate(dateObj, loc.tz)}. Rahu &amp;
            Ketu use the mean lunar node (always retrograde).
          </p>
        </ToolCardFrame>
      </div>

      {/* Rahu-Ketu alert */}
      <div className="mt-5">
        <ToolCardFrame title="Rahu · Ketu Transit Alert">
          {nodeTransit.rahu ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Rahu</div>
                <div className="text-sm mt-2">
                  Currently in <b>{nodeTransit.rahu.current}</b>
                </div>
                <div className="text-sm mt-1">
                  Next: <b>{nodeTransit.rahu.next}</b>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Change on <b>{fmtDateTime(nodeTransit.rahu.when, loc.tz)}</b>
                </div>
              </div>
              <div className="rounded-lg border border-indigo-500/40 bg-indigo-500/5 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Ketu</div>
                <div className="text-sm mt-2">
                  Currently in <b>{nodeTransit.ketu!.current}</b>
                </div>
                <div className="text-sm mt-1">
                  Next: <b>{nodeTransit.ketu!.next}</b>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Change on <b>{fmtDateTime(nodeTransit.ketu!.when, loc.tz)}</b>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No node transit found in the next 3 years.
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Rahu &amp; Ketu spend roughly 18 months in each rashi. Their transit shifts major karmic
            patterns — a traditional time for shanti pujas.
          </p>
        </ToolCardFrame>
      </div>

      {/* Eclipses */}
      <div className="mt-5">
        <ToolCardFrame title="Grahan Calendar — Upcoming Eclipses">
          {eclipses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No eclipses found in the search window.</p>
          ) : (
            <div className="space-y-3">
              {eclipses.map((e, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between gap-3 py-2 border-b border-border/60 last:border-b-0"
                >
                  <div>
                    <div className="font-medium">{e.kind}</div>
                    <div className="text-xs text-muted-foreground capitalize">{e.type} eclipse</div>
                  </div>
                  <div className="text-right text-sm font-medium tabular-nums">
                    {fmtDateTime(e.peak, loc.tz)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Global peak times shown in your local time zone. Visibility from {loc.label} depends on
            the eclipse geometry — check a visibility map for local coverage. Traditional Sutak-kaal
            begins hours before the eclipse.
          </p>
        </ToolCardFrame>
      </div>
    </div>
  );
}
