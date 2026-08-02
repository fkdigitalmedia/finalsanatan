import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  FileText,
  Sparkles,
  TriangleAlert,
  MapPin,
  X,
} from "lucide-react";

import { ToolCardFrame } from "@/components/tools/ToolShell";
import { LocationPicker, DateInput } from "@/components/tools/LocationPicker";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { useHydrated, useLocation } from "@/lib/location";
import {
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSunTimes,
  getKaalWindow,
  getAbhijitMuhurat,
  getChoghadiya,
  fmtTime,
  fmtLocalDate,
  getLocalWeekday,
  WEEKDAYS,
  type LatLon,
} from "@/lib/panchang";
import {
  getMonthCells,
  getPlanYourDayTip,
  buildMonthPanchangIcs,
  buildSharePng,
} from "@/lib/panchang-month";
import { resolveAllFestivals } from "@/lib/festivals/engine";

// ─────────────────────────────────────────────────────────────────────────
// MONTHLY PANCHANG VIEW
// ─────────────────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthlyPanchang() {
  const hydrated = useHydrated();
  const [loc, setLoc] = useLocation();
  const now = new Date();
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month0, setMonth0] = useState(now.getUTCMonth());

  const cells = useMemo(
    () => (hydrated ? getMonthCells(year, month0, loc) : []),
    [hydrated, year, month0, loc],
  );
  const festivals = useMemo(() => {
    if (!hydrated) return [];
    return resolveAllFestivals(year, loc).filter((f) => f.date.getUTCMonth() === month0);
  }, [hydrated, year, month0, loc]);

  if (!hydrated)
    return (
      <ToolCardFrame>
        <SanatanLoader subtitle="Loading month panchang..." />
      </ToolCardFrame>
    );

  const firstDow = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  const grid: ((typeof cells)[number] | null)[] = [];
  for (let i = 0; i < firstDow; i++) grid.push(null);
  for (const c of cells) grid.push(c);
  while (grid.length % 7) grid.push(null);

  const shift = (delta: number) => {
    let m = month0 + delta,
      y = year;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setMonth0(m);
    setYear(y);
  };

  const festByIso = new Map<string, string[]>();
  for (const f of festivals) {
    const iso = f.date.toISOString().slice(0, 10);
    if (!festByIso.has(iso)) festByIso.set(iso, []);
    festByIso.get(iso)!.push(f.name);
  }

  const downloadIcs = () => {
    const ics = buildMonthPanchangIcs(cells, loc, window.location.origin);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `panchang-${year}-${String(month0 + 1).padStart(2, "0")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text(`Panchang — ${MONTHS[month0]} ${year}`, 40, 50);
    doc.setFontSize(11);
    doc.text(loc.label, 40, 70);
    let y = 100;
    doc.setFontSize(10);
    cells.forEach((c) => {
      if (y > 780) {
        doc.addPage();
        y = 60;
      }
      const iso = c.isoDate;
      const fest = festByIso.get(iso)?.join(", ") || "";
      const line = `${iso}  ${DOW[c.weekday]}  ·  ${c.tithi.paksha} ${c.tithi.name}  ·  ${c.nakshatra.name}${fest ? "  ·  " + fest : ""}`;
      doc.text(line, 40, y);
      y += 16;
    });
    doc.save(`panchang-${year}-${String(month0 + 1).padStart(2, "0")}.pdf`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="inline-flex items-center gap-1 rounded-2xl border border-border bg-background px-2 py-1 shadow-sm">
          <button
            onClick={() => shift(-1)}
            className="p-2 hover:bg-muted rounded-lg"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="px-3 font-medium min-w-[160px] text-center">
            {MONTHS[month0]} {year}
          </div>
          <button
            onClick={() => shift(1)}
            className="p-2 hover:bg-muted rounded-lg"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <LocationPicker value={loc} onChange={setLoc} />
        <div className="ml-auto flex gap-2">
          <button
            onClick={downloadIcs}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <Download className="size-4" /> ICS
          </button>
          <button
            onClick={downloadPdf}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <FileText className="size-4" /> PDF
          </button>
        </div>
      </div>

      <ToolCardFrame>
        <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground mb-2">
          {DOW.map((d) => (
            <div key={d} className="py-2 font-semibold">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((c, i) => {
            if (!c) return <div key={i} className="aspect-square rounded-lg bg-muted/20" />;
            const fests = festByIso.get(c.isoDate) || [];
            const isToday = c.isoDate === new Date().toISOString().slice(0, 10);
            const flagColor = c.isPurnima
              ? "bg-amber-500/20 border-amber-400/40"
              : c.isAmavasya
                ? "bg-slate-700/30 border-slate-500/40"
                : c.isEkadashi
                  ? "bg-violet-500/15 border-violet-400/40"
                  : fests.length
                    ? "bg-primary/10 border-primary/30"
                    : "border-border/50";
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg border p-1.5 text-left flex flex-col overflow-hidden ${flagColor} ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <div className="text-sm font-semibold">{c.date.getUTCDate()}</div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  {c.tithi.paksha[0]} {c.tithi.name.slice(0, 6)}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight">
                  {c.nakshatra.name.slice(0, 8)}
                </div>
                {fests.length > 0 && (
                  <div
                    className="text-[10px] text-primary font-medium mt-auto truncate"
                    title={fests.join(", ")}
                  >
                    {fests[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 text-xs mt-4 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="size-3 rounded bg-amber-500/40" /> Purnima
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-3 rounded bg-slate-500/50" /> Amavasya
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-3 rounded bg-violet-500/40" /> Ekadashi
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-3 rounded bg-primary/30" /> Festival
          </span>
        </div>
      </ToolCardFrame>

      <div className="mt-6">
        <ToolCardFrame title={`Festivals & Vrats — ${MONTHS[month0]} ${year}`}>
          {festivals.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No major festivals detected this month.
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {festivals.map((f, i) => (
                <li key={i} className="py-3 flex items-center gap-3">
                  <div className="text-xs font-semibold text-primary min-w-[64px]">
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(
                      f.date,
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{f.name}</div>
                    {f.notes?.[0] && (
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {f.notes?.[0]}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ToolCardFrame>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PANCHANG COMPARE — TWO CITIES
// ─────────────────────────────────────────────────────────────────────────

const DEFAULT_B: LatLon = { lat: 19.076, lon: 72.8777, label: "Mumbai, India", tz: "Asia/Kolkata" };

export function PanchangCompare() {
  const hydrated = useHydrated();
  const [locA, setLocA] = useLocation();
  const [locB, setLocB] = useState<LatLon>(DEFAULT_B);
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const dateObj = useMemo(() => new Date(`${date}T06:00:00Z`), [date]);

  if (!hydrated)
    return (
      <ToolCardFrame>
        <SanatanLoader subtitle="Preparing comparison..." />
      </ToolCardFrame>
    );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <DateInput value={date} onChange={setDate} />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <CompareCityCard label="City A" loc={locA} setLoc={setLocA} dateObj={dateObj} />
        <CompareCityCard label="City B" loc={locB} setLoc={setLocB} dateObj={dateObj} />
      </div>
      <div className="mt-6 text-xs text-muted-foreground">
        Tithi/Nakshatra are astronomically the same everywhere; only <strong>end times</strong>,
        sunrise/sunset and kaal windows differ by city.
      </div>
    </div>
  );
}

function CompareCityCard({
  label,
  loc,
  setLoc,
  dateObj,
}: {
  label: string;
  loc: LatLon;
  setLoc: (l: LatLon) => void;
  dateObj: Date;
}) {
  const t = getTithi(dateObj);
  const n = getNakshatra(dateObj);
  const y = getYoga(dateObj);
  const k = getKarana(dateObj);
  const sun = getSunTimes(dateObj, loc);
  const rahu = getKaalWindow("rahu", dateObj, loc);
  const abhi = getAbhijitMuhurat(dateObj, loc);
  const wk = getLocalWeekday(dateObj, loc.tz);

  return (
    <ToolCardFrame title={label}>
      <div className="mb-4">
        <LocationPicker value={loc} onChange={setLoc} />
      </div>
      <div className="text-xs text-muted-foreground mb-3">
        {fmtLocalDate(dateObj, loc.tz)} · {WEEKDAYS[wk]}
      </div>
      <MiniRow
        label="Tithi"
        value={`${t.paksha} ${t.name}`}
        sub={`ends ${fmtTime(t.endsAt, loc.tz)}`}
      />
      <MiniRow
        label="Nakshatra"
        value={`${n.name} · Pada ${n.pada}`}
        sub={`ends ${fmtTime(n.endsAt, loc.tz)}`}
      />
      <MiniRow label="Yoga" value={y.name} sub={`ends ${fmtTime(y.endsAt, loc.tz)}`} />
      <MiniRow label="Karana" value={k.name} sub={k.type} />
      <MiniRow label="Sunrise" value={fmtTime(sun.sunrise, loc.tz)} />
      <MiniRow label="Sunset" value={fmtTime(sun.sunset, loc.tz)} />
      <MiniRow
        label="Rahu Kaal"
        value={rahu ? `${fmtTime(rahu.start, loc.tz)}–${fmtTime(rahu.end, loc.tz)}` : "—"}
      />
      <MiniRow
        label="Abhijit"
        value={
          abhi.observed && abhi.start && abhi.end
            ? `${fmtTime(abhi.start, loc.tz)}–${fmtTime(abhi.end, loc.tz)}`
            : "Not observed today"
        }
      />
    </ToolCardFrame>
  );
}

function MiniRow({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-border/50 last:border-b-0 text-sm">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-right">
        <div className="font-medium">{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PLAN YOUR DAY — Panchang-derived daily tips
// ─────────────────────────────────────────────────────────────────────────

export function PlanYourDay() {
  const hydrated = useHydrated();
  const [loc, setLoc] = useLocation();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const dateObj = useMemo(() => new Date(`${date}T06:00:00Z`), [date]);
  if (!hydrated)
    return (
      <ToolCardFrame>
        <SanatanLoader subtitle="Analysing your day..." />
      </ToolCardFrame>
    );

  const tip = getPlanYourDayTip(dateObj, loc);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <DateInput value={date} onChange={setDate} />
        <LocationPicker value={loc} onChange={setLoc} />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <ToolCardFrame title="Today's Focus">
          <div className="text-lg font-serif font-semibold text-primary mb-2">{tip.headline}</div>
          <p className="text-sm text-muted-foreground">{tip.focus}</p>
          {tip.bestWindow && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <div className="text-[11px] uppercase tracking-widest text-emerald-500 font-semibold flex items-center gap-1">
                <Sparkles className="size-3.5" /> Best window
              </div>
              <div className="mt-1 font-medium">{tip.bestWindow.label}</div>
              <div className="text-sm text-muted-foreground">
                {tip.bestWindow.start} – {tip.bestWindow.end}
              </div>
            </div>
          )}
          {tip.worstWindow && (
            <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
              <div className="text-[11px] uppercase tracking-widest text-destructive font-semibold flex items-center gap-1">
                <TriangleAlert className="size-3.5" /> Avoid
              </div>
              <div className="mt-1 font-medium">{tip.worstWindow.label}</div>
              <div className="text-sm text-muted-foreground">
                {tip.worstWindow.start} – {tip.worstWindow.end}
              </div>
            </div>
          )}
        </ToolCardFrame>

        <ToolCardFrame title="Do">
          <ul className="space-y-3 text-sm">
            {tip.do.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary mt-0.5">✦</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </ToolCardFrame>

        <ToolCardFrame title="Avoid">
          {tip.avoid.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Nothing significant to avoid today beyond usual dinacharya.
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              {tip.avoid.map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-destructive mt-0.5">✗</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
        </ToolCardFrame>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHARE BUTTON (used inside Today's Panchang and elsewhere)
// ─────────────────────────────────────────────────────────────────────────

export function DailyShareButton({ dateObj, loc }: { dateObj: Date; loc: LatLon }) {
  const [open, setOpen] = useState(false);
  const [png, setPng] = useState<string | null>(null);

  const generate = () => {
    const t = getTithi(dateObj);
    const n = getNakshatra(dateObj);
    const y = getYoga(dateObj);
    const k = getKarana(dateObj);
    const s = getSunTimes(dateObj, loc);
    const rahu = getKaalWindow("rahu", dateObj, loc);
    const abhi = getAbhijitMuhurat(dateObj, loc);
    const url = buildSharePng({
      title: "Today's Panchang",
      date: fmtLocalDate(dateObj, loc.tz),
      city: loc.label,
      tithi: `${t.paksha} ${t.name}`,
      nakshatra: `${n.name} · Pada ${n.pada}`,
      yoga: y.name,
      karana: k.name,
      sunrise: fmtTime(s.sunrise, loc.tz),
      sunset: fmtTime(s.sunset, loc.tz),
      rahu: rahu ? `${fmtTime(rahu.start, loc.tz)}–${fmtTime(rahu.end, loc.tz)}` : "—",
      abhijit:
        abhi.observed && abhi.start && abhi.end
          ? `${fmtTime(abhi.start, loc.tz)}–${fmtTime(abhi.end, loc.tz)}`
          : "—",
    });
    setPng(url);
    setOpen(true);
  };

  const download = () => {
    if (!png) return;
    const a = document.createElement("a");
    a.href = png;
    a.download = `panchang-${dateObj.toISOString().slice(0, 10)}.png`;
    a.click();
  };

  return (
    <>
      <button
        onClick={generate}
        className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-muted"
      >
        <Share2 className="size-4" /> Share as image
      </button>
      {open && png && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-background rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-1.5 text-white"
            >
              <X className="size-4" />
            </button>
            <img src={png} alt="Panchang share card" className="w-full block" />
            <div className="p-4 flex gap-2">
              <button
                onClick={download}
                className="flex-1 rounded-full bg-primary text-primary-foreground py-2.5 font-medium"
              >
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BOOKMARKED CITIES — quick-pick chips
// ─────────────────────────────────────────────────────────────────────────
import { useCityBookmarks } from "@/hooks/useCityBookmarks";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function CityBookmarksBar({ loc, setLoc }: { loc: LatLon; setLoc: (l: LatLon) => void }) {
  const { items, toggle, isBookmarked } = useCityBookmarks();
  const saved = isBookmarked(loc);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => toggle(loc)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
        aria-label={saved ? "Remove bookmark" : "Bookmark this city"}
      >
        {saved ? (
          <BookmarkCheck className="size-3.5 text-primary" />
        ) : (
          <Bookmark className="size-3.5" />
        )}
        {saved ? "Saved" : "Save city"}
      </button>
      {items.slice(0, 6).map((c) => (
        <button
          key={c.label}
          onClick={() => setLoc({ label: c.label, lat: c.lat, lon: c.lon, tz: c.tz })}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${loc.label === c.label ? "bg-primary/10 border-primary/40 text-primary" : "border-border hover:bg-muted"}`}
        >
          <MapPin className="size-3" /> {c.label.split(",")[0]}
        </button>
      ))}
    </div>
  );
}
