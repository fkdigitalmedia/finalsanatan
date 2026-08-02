// Monthly panchang, tips, ICS + share-card generation utilities.
import {
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSunTimes,
  getKaalWindow,
  getAbhijitMuhurat,
  getChoghadiya,
  getLocalWeekday,
  WEEKDAYS,
  fmtTime,
  fmtLocalDate,
  TITHI_NAMES,
  type LatLon,
  CHO_QUALITY,
} from "./panchang";

export interface DayCell {
  date: Date; // noon UTC on that calendar date
  isoDate: string; // YYYY-MM-DD
  weekday: number;
  tithi: { index: number; name: string; paksha: "Shukla" | "Krishna" };
  nakshatra: { index: number; name: string };
  yogaName: string;
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
  isChaturthi: boolean;
  isChaturdashi: boolean;
}

export function getMonthCells(year: number, month0: number, loc: LatLon): DayCell[] {
  const days = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const out: DayCell[] = [];
  for (let d = 1; d <= days; d++) {
    const date = new Date(Date.UTC(year, month0, d, 6, 0, 0)); // 06:00 UTC anchor
    const t = getTithi(date);
    const n = getNakshatra(date);
    const y = getYoga(date);
    out.push({
      date,
      isoDate: `${year}-${String(month0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      weekday: getLocalWeekday(date, loc.tz),
      tithi: { index: t.index, name: t.name, paksha: t.paksha },
      nakshatra: { index: n.index, name: n.name },
      yogaName: y.name,
      isPurnima: t.name === "Purnima",
      isAmavasya: t.name === "Amavasya",
      isEkadashi: t.name === "Ekadashi",
      isChaturthi: t.name === "Chaturthi",
      isChaturdashi: t.name === "Chaturdashi",
    });
  }
  return out;
}

// Deterministic tips based on tithi/nak/weekday/choghadiya.
export interface PlanYourDayTip {
  headline: string;
  do: string[];
  avoid: string[];
  bestWindow: { label: string; start: string; end: string } | null;
  worstWindow: { label: string; start: string; end: string } | null;
  focus: string;
}

const TITHI_ADVICE: Record<string, string> = {
  Pratipada: "Fresh starts favoured — light beginnings, not major launches.",
  Dwitiya: "Good for growth, learning and gentle communication.",
  Tritiya: "Auspicious for ornament, art and creative work.",
  Chaturthi: "Ganesha's day — honour obstacles, avoid heavy arguments.",
  Panchami: "Favourable for medicine, learning and Devi sadhana.",
  Shashti: "Skanda's day — courage, valour and travel favoured.",
  Saptami: "Solar energy — start journeys, health regimens.",
  Ashtami: "Devi and Bhairava energy — sadhana over transactions.",
  Navami: "Strong for tapasya, not for material dealings.",
  Dashami: "Balanced — favourable for civic work and travel.",
  Ekadashi: "Fasting day — light food, meditation, no grain traditionally.",
  Dwadashi: "Break Ekadashi vrata early; charity and dana favoured.",
  Trayodashi: "Pradosh energy — Shiva puja at twilight is ideal.",
  Chaturdashi: "Intense — reserve for sadhana; avoid new ventures.",
  Purnima: "Full-moon peak — meditation, mantra, satsang.",
  Amavasya: "Ancestor day — pitru tarpan, introspection; avoid new starts.",
};

export function getPlanYourDayTip(date: Date, loc: LatLon): PlanYourDayTip {
  const tithi = getTithi(date);
  const nak = getNakshatra(date);
  const wk = getLocalWeekday(date, loc.tz);
  const rahu = getKaalWindow("rahu", date, loc);
  const abhi = getAbhijitMuhurat(date, loc);
  const cho = getChoghadiya(date, loc);

  const now = new Date();
  const isToday =
    new Date(date).toDateString() === now.toDateString() ||
    new Intl.DateTimeFormat("en-US", { timeZone: loc.tz, dateStyle: "short" }).format(now) ===
      new Intl.DateTimeFormat("en-US", { timeZone: loc.tz, dateStyle: "short" }).format(date);

  // best window: nearest upcoming auspicious choghadiya (Shubh/Labh/Amrit)
  type Win = { label: string; start: Date; end: Date };
  let best: Win | null = null;
  let worst: Win | null = null;
  if (cho) {
    const all = [...cho.day, ...cho.night];
    const from = isToday ? now.getTime() : cho.day[0].start.getTime();
    const upcoming = all.filter((s) => s.end.getTime() > from);
    const bestSlot = upcoming.find((s) => s.quality === "auspicious");
    const worstSlot = upcoming.find((s) => s.quality === "inauspicious");
    if (bestSlot)
      best = { label: `${bestSlot.name} Choghadiya`, start: bestSlot.start, end: bestSlot.end };
    if (worstSlot)
      worst = { label: `${worstSlot.name} Choghadiya`, start: worstSlot.start, end: worstSlot.end };
  }
  if (abhi.observed && abhi.start && abhi.end && (!best || abhi.start < best.start)) {
    best = { label: "Abhijit Muhurat", start: abhi.start, end: abhi.end };
  }

  const dos: string[] = [];
  const avoid: string[] = [];

  const tAdvice = TITHI_ADVICE[tithi.name] ?? "Regular day — usual sadhana and karma.";
  dos.push(tAdvice);

  if (rahu)
    avoid.push(
      `Rahu Kaal ${fmtTime(rahu.start, loc.tz)}–${fmtTime(rahu.end, loc.tz)} — avoid new ventures, contracts, travel start.`,
    );
  if (!abhi.observed) avoid.push("Wednesdays — Abhijit is not observed today.");
  if (tithi.name === "Chaturdashi" && tithi.paksha === "Krishna")
    avoid.push("Krishna Chaturdashi — intense day, defer material starts.");
  if (tithi.name === "Amavasya") avoid.push("Amavasya — avoid launching business or long travel.");

  // weekday-specific
  const dayTips: Record<number, string> = {
    0: "Sunday — worship Surya; leadership and health matters shine.",
    1: "Monday — worship Chandra/Shiva; emotional and family matters flow.",
    2: "Tuesday — worship Hanuman/Mangal; courage and disputes settle.",
    3: "Wednesday — worship Ganesha; ideal for learning and trade.",
    4: "Thursday — worship Brihaspati/Vishnu; wisdom, teachers, dharma.",
    5: "Friday — worship Shukra/Devi; art, comfort, relationships.",
    6: "Saturday — worship Shani/Hanuman; discipline and long-term work.",
  };
  dos.push(dayTips[wk]);

  // Nakshatra note (very short)
  dos.push(`Nakshatra ${nak.name} — a good day for activities aligned with its natural quality.`);

  return {
    headline: `${WEEKDAYS[wk]} · ${tithi.paksha} ${tithi.name}`,
    do: dos,
    avoid,
    bestWindow: best
      ? { label: best.label, start: fmtTime(best.start, loc.tz), end: fmtTime(best.end, loc.tz) }
      : null,
    worstWindow: worst
      ? { label: worst.label, start: fmtTime(worst.start, loc.tz), end: fmtTime(worst.end, loc.tz) }
      : null,
    focus: tAdvice,
  };
}

// ─── Share card (Canvas → PNG) ──────────────────────────────────────────
export interface ShareCardData {
  title: string;
  date: string;
  city: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  rahu: string;
  abhijit: string;
}

export function buildSharePng(d: ShareCardData): string {
  const W = 1080,
    H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  // background gradient
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#3b1a0b");
  g.addColorStop(0.5, "#7a2f14");
  g.addColorStop(1, "#c56d1b");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // decorative circles
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#ffe7b8";
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 6 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#ffd580";
  ctx.font = "bold 44px 'Georgia', serif";
  ctx.fillText("॥ Today's Panchang ॥", 60, 110);

  ctx.fillStyle = "#fff6e0";
  ctx.font = "26px 'Georgia', serif";
  ctx.fillText(d.date, 60, 160);
  ctx.font = "italic 22px 'Georgia', serif";
  ctx.fillText(d.city, 60, 195);

  // card
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, 60, 240, W - 120, H - 340, 30);
  ctx.fill();

  ctx.fillStyle = "#fff6e0";
  const rows: [string, string][] = [
    ["Tithi", d.tithi],
    ["Nakshatra", d.nakshatra],
    ["Yoga", d.yoga],
    ["Karana", d.karana],
    ["Sunrise", d.sunrise],
    ["Sunset", d.sunset],
    ["Rahu Kaal", d.rahu],
    ["Abhijit", d.abhijit],
  ];
  ctx.font = "600 30px 'Georgia', serif";
  rows.forEach((r, i) => {
    const y = 320 + i * 105;
    ctx.fillStyle = "#ffe7b8";
    ctx.font = "600 26px 'Helvetica', sans-serif";
    ctx.fillText(r[0].toUpperCase(), 100, y);
    ctx.fillStyle = "#ffffff";
    ctx.font = "34px 'Georgia', serif";
    ctx.fillText(r[1], 100, y + 44);
  });

  // footer
  ctx.fillStyle = "#ffd580";
  ctx.font = "bold 32px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.fillText("SanatanTools.com", W / 2, H - 60);
  ctx.textAlign = "left";

  return c.toDataURL("image/png");
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ─── Month ICS builder ─────────────────────────────────────────────────
export function buildMonthPanchangIcs(cells: DayCell[], loc: LatLon, origin: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SanatanTools//Panchang//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Panchang — ${loc.label}`,
  ];
  for (const c of cells) {
    const dt = c.isoDate.replace(/-/g, "");
    const uid = `panchang-${c.isoDate}-${loc.lat.toFixed(2)}-${loc.lon.toFixed(2)}@sanatantools`;
    const flags: string[] = [];
    if (c.isPurnima) flags.push("Purnima");
    if (c.isAmavasya) flags.push("Amavasya");
    if (c.isEkadashi) flags.push("Ekadashi");
    if (c.isChaturthi) flags.push("Chaturthi");
    const flag = flags.length ? ` · ${flags.join("/")}` : "";
    const summary = `${c.tithi.paksha} ${c.tithi.name} · ${c.nakshatra.name}${flag}`;
    const desc = `Tithi: ${c.tithi.paksha} ${c.tithi.name}\\nNakshatra: ${c.nakshatra.name}\\nYoga: ${c.yogaName}\\nLocation: ${loc.label}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${dt}`,
      `DTEND;VALUE=DATE:${dt}`,
      `SUMMARY:${escapeIcs(summary)}`,
      `DESCRIPTION:${escapeIcs(desc)}`,
      `URL:${origin}/tools/todays-panchang`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}
