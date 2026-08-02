// Panchang calculations using astronomy-engine.
// Uses Lahiri ayanamsa for sidereal-based Nakshatra & Yoga.
import * as A from "astronomy-engine";

export interface LatLon {
  lat: number;
  lon: number;
  label: string;
  tz: string; // IANA
}

export const DEFAULT_LOCATION: LatLon = {
  lat: 28.6139,
  lon: 77.209,
  label: "New Delhi, India",
  tz: "Asia/Kolkata",
};

export const CITY_PRESETS: LatLon[] = [
  DEFAULT_LOCATION,
  { lat: 19.076, lon: 72.8777, label: "Mumbai, India", tz: "Asia/Kolkata" },
  { lat: 12.9716, lon: 77.5946, label: "Bengaluru, India", tz: "Asia/Kolkata" },
  { lat: 13.0827, lon: 80.2707, label: "Chennai, India", tz: "Asia/Kolkata" },
  { lat: 22.5726, lon: 88.3639, label: "Kolkata, India", tz: "Asia/Kolkata" },
  { lat: 26.4499, lon: 80.3319, label: "Kanpur, India", tz: "Asia/Kolkata" },
  { lat: 25.3176, lon: 82.9739, label: "Varanasi, India", tz: "Asia/Kolkata" },
  { lat: 27.1767, lon: 78.0081, label: "Agra, India", tz: "Asia/Kolkata" },
  { lat: 40.7128, lon: -74.006, label: "New York, USA", tz: "America/New_York" },
  { lat: 51.5074, lon: -0.1278, label: "London, UK", tz: "Europe/London" },
  { lat: 1.3521, lon: 103.8198, label: "Singapore", tz: "Asia/Singapore" },
  { lat: -33.8688, lon: 151.2093, label: "Sydney, Australia", tz: "Australia/Sydney" },
];

export const TITHI_NAMES = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashti",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashti",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Amavasya",
];

export const NAKSHATRAS = [
  { name: "Ashwini", deity: "Ashwini Kumaras", lord: "Ketu", symbol: "Horse head" },
  { name: "Bharani", deity: "Yama", lord: "Venus", symbol: "Yoni" },
  { name: "Krittika", deity: "Agni", lord: "Sun", symbol: "Razor" },
  { name: "Rohini", deity: "Brahma", lord: "Moon", symbol: "Chariot" },
  { name: "Mrigashira", deity: "Soma", lord: "Mars", symbol: "Deer head" },
  { name: "Ardra", deity: "Rudra", lord: "Rahu", symbol: "Teardrop" },
  { name: "Punarvasu", deity: "Aditi", lord: "Jupiter", symbol: "Quiver" },
  { name: "Pushya", deity: "Brihaspati", lord: "Saturn", symbol: "Cow udder" },
  { name: "Ashlesha", deity: "Nagas", lord: "Mercury", symbol: "Coiled serpent" },
  { name: "Magha", deity: "Pitris", lord: "Ketu", symbol: "Throne" },
  { name: "Purva Phalguni", deity: "Bhaga", lord: "Venus", symbol: "Front hammock" },
  { name: "Uttara Phalguni", deity: "Aryaman", lord: "Sun", symbol: "Rear hammock" },
  { name: "Hasta", deity: "Savitr", lord: "Moon", symbol: "Palm of hand" },
  { name: "Chitra", deity: "Vishvakarma", lord: "Mars", symbol: "Bright jewel" },
  { name: "Swati", deity: "Vayu", lord: "Rahu", symbol: "Young shoot" },
  { name: "Vishakha", deity: "Indra-Agni", lord: "Jupiter", symbol: "Triumphal arch" },
  { name: "Anuradha", deity: "Mitra", lord: "Saturn", symbol: "Lotus" },
  { name: "Jyeshtha", deity: "Indra", lord: "Mercury", symbol: "Earring" },
  { name: "Mula", deity: "Nirriti", lord: "Ketu", symbol: "Bunch of roots" },
  { name: "Purva Ashadha", deity: "Apas", lord: "Venus", symbol: "Elephant tusk" },
  { name: "Uttara Ashadha", deity: "Vishvedevas", lord: "Sun", symbol: "Elephant tusk" },
  { name: "Shravana", deity: "Vishnu", lord: "Moon", symbol: "Three footprints" },
  { name: "Dhanishta", deity: "Vasus", lord: "Mars", symbol: "Drum" },
  { name: "Shatabhisha", deity: "Varuna", lord: "Rahu", symbol: "Empty circle" },
  { name: "Purva Bhadrapada", deity: "Aja Ekapada", lord: "Jupiter", symbol: "Front funeral cot" },
  { name: "Uttara Bhadrapada", deity: "Ahir Budhnya", lord: "Saturn", symbol: "Rear funeral cot" },
  { name: "Revati", deity: "Pushan", lord: "Mercury", symbol: "Fish" },
];

export const YOGAS = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

// Karana names: 7 movable (repeat 8 times) + 4 fixed at end of amavasya cycle
const KARANA_MOVABLE = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
const KARANA_FIXED = ["Shakuni", "Chatushpada", "Naga", "Kimstughna"];

export const WEEKDAYS = [
  "Ravivara (Sunday)",
  "Somavara (Monday)",
  "Mangalavara (Tuesday)",
  "Budhavara (Wednesday)",
  "Guruvara (Thursday)",
  "Shukravara (Friday)",
  "Shanivara (Saturday)",
];

// Sun/Moon apparent geocentric ecliptic longitude (tropical, degrees).
function apparentEclLon(body: A.Body, date: Date): number {
  const t = A.MakeTime(date);
  // Astronomy.EclipticGeoMoon returns spherical for moon; for sun use SunPosition
  if (body === A.Body.Moon) {
    const m = A.EclipticGeoMoon(t);
    return norm360(m.lon);
  }
  const s = A.SunPosition(t);
  return norm360(s.elon);
}

function norm360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}

// Lahiri ayanamsa in degrees (approximate).
function ayanamsa(date: Date): number {
  const jd = A.MakeTime(date).ut + 2451545.0; // ut = days since J2000 12:00 TT approx
  const T = (jd - 2451545.0) / 365.25;
  return 23.8531 + T * 0.01397; // deg
}

export function moonLon(date: Date) {
  return apparentEclLon(A.Body.Moon, date);
}
export function sunLon(date: Date) {
  return apparentEclLon(A.Body.Sun, date);
}

export interface TithiInfo {
  index: number; // 1..30
  name: string;
  paksha: "Shukla" | "Krishna";
  percent: number; // % complete
  elapsedDeg: number;
  endsAt: Date | null;
}

export function getTithi(date: Date): TithiInfo {
  const diff = norm360(moonLon(date) - sunLon(date));
  const idx = Math.floor(diff / 12); // 0..29
  const within = diff - idx * 12; // 0..12
  const paksha = idx < 15 ? "Shukla" : "Krishna";
  return {
    index: idx + 1,
    name: TITHI_NAMES[idx],
    paksha,
    percent: (within / 12) * 100,
    elapsedDeg: within,
    endsAt: findTithiEnd(date, idx),
  };
}

function findTithiEnd(startDate: Date, idx: number): Date | null {
  // step forward up to 30 hours to find when tithi changes
  const stepMin = 5;
  let d = new Date(startDate.getTime());
  for (let i = 0; i < (30 * 60) / stepMin; i++) {
    d = new Date(d.getTime() + stepMin * 60 * 1000);
    const diff = norm360(moonLon(d) - sunLon(d));
    const cur = Math.floor(diff / 12);
    if (cur !== idx) return d;
  }
  return null;
}

export interface NakshatraInfo {
  index: number; // 1..27
  name: string;
  pada: number; // 1..4
  deity: string;
  lord: string;
  symbol: string;
  percent: number;
  endsAt: Date | null;
}

export function getNakshatra(date: Date): NakshatraInfo {
  const sidereal = norm360(moonLon(date) - ayanamsa(date));
  const span = 360 / 27; // 13.333...
  const idx = Math.floor(sidereal / span);
  const within = sidereal - idx * span;
  const pada = Math.floor((within / span) * 4) + 1;
  const info = NAKSHATRAS[idx];
  return {
    index: idx + 1,
    name: info.name,
    pada,
    deity: info.deity,
    lord: info.lord,
    symbol: info.symbol,
    percent: (within / span) * 100,
    endsAt: findNakshatraEnd(date, idx),
  };
}

function findNakshatraEnd(startDate: Date, idx: number): Date | null {
  const span = 360 / 27;
  const stepMin = 5;
  let d = new Date(startDate.getTime());
  for (let i = 0; i < (30 * 60) / stepMin; i++) {
    d = new Date(d.getTime() + stepMin * 60 * 1000);
    const sid = norm360(moonLon(d) - ayanamsa(d));
    if (Math.floor(sid / span) !== idx) return d;
  }
  return null;
}

export interface YogaInfo {
  index: number; // 1..27
  name: string;
  percent: number;
  endsAt: Date | null;
}

export function getYoga(date: Date): YogaInfo {
  const total = norm360(moonLon(date) + sunLon(date) - 2 * ayanamsa(date));
  const span = 360 / 27;
  const idx = Math.floor(total / span);
  const within = total - idx * span;
  return {
    index: idx + 1,
    name: YOGAS[idx],
    percent: (within / span) * 100,
    endsAt: findYogaEnd(date, idx),
  };
}

function findYogaEnd(startDate: Date, idx: number): Date | null {
  const span = 360 / 27;
  const stepMin = 5;
  let d = new Date(startDate.getTime());
  for (let i = 0; i < (36 * 60) / stepMin; i++) {
    d = new Date(d.getTime() + stepMin * 60 * 1000);
    const total = norm360(moonLon(d) + sunLon(d) - 2 * ayanamsa(d));
    if (Math.floor(total / span) !== idx) return d;
  }
  return null;
}

export interface KaranaInfo {
  index: number; // 1..60 within lunar month
  name: string;
  type: "Movable" | "Fixed";
  percent: number;
  endsAt: Date | null;
}

export function getKarana(date: Date): KaranaInfo {
  const diff = norm360(moonLon(date) - sunLon(date));
  const kIdx = Math.floor(diff / 6); // 0..59
  const within = diff - kIdx * 6;
  let name: string;
  let type: "Movable" | "Fixed" = "Movable";
  // Karana schedule: k=0 is 1st half of tithi 1 -> Kimstughna (fixed). Actually:
  // Sequence per traditional: 1st karana of Shukla Pratipada = Kimstughna (fixed),
  // then 7 movable karanas repeat: after Kimstughna: Bava, Balava, ... starting from 2nd half.
  // From karana 2 to karana 57 (56 karanas): 8 cycles of 7 movable = 56.
  // Then karanas 58, 59, 60 are: Shakuni, Chatushpada, Naga (fixed).
  // Karana 1 = Kimstughna.
  if (kIdx === 0) {
    name = "Kimstughna";
    type = "Fixed";
  } else if (kIdx >= 57) {
    name = ["Shakuni", "Chatushpada", "Naga"][kIdx - 57];
    type = "Fixed";
  } else {
    name = KARANA_MOVABLE[(kIdx - 1) % 7];
  }
  return {
    index: kIdx + 1,
    name,
    type,
    percent: (within / 6) * 100,
    endsAt: findKaranaEnd(date, kIdx),
  };
}

function findKaranaEnd(startDate: Date, idx: number): Date | null {
  const stepMin = 5;
  let d = new Date(startDate.getTime());
  for (let i = 0; i < (16 * 60) / stepMin; i++) {
    d = new Date(d.getTime() + stepMin * 60 * 1000);
    const diff = norm360(moonLon(d) - sunLon(d));
    if (Math.floor(diff / 6) !== idx) return d;
  }
  return null;
}

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date | null;
  dayLengthMinutes: number | null;
}

export function getSunTimes(date: Date, loc: LatLon): SunTimes {
  const obs = new A.Observer(loc.lat, loc.lon, 0);
  // Search from local midnight of the requested date
  const start = startOfLocalDay(date, loc.tz);
  const rise = A.SearchRiseSet(A.Body.Sun, obs, +1, A.MakeTime(start), 2);
  const set = A.SearchRiseSet(A.Body.Sun, obs, -1, A.MakeTime(start), 2);
  const riseDate = rise ? rise.date : null;
  const setDate = set ? set.date : null;
  const noon = riseDate && setDate ? new Date((riseDate.getTime() + setDate.getTime()) / 2) : null;
  const dayLen =
    riseDate && setDate ? Math.round((setDate.getTime() - riseDate.getTime()) / 60000) : null;
  return { sunrise: riseDate, sunset: setDate, solarNoon: noon, dayLengthMinutes: dayLen };
}

// Local start-of-day using tz — implemented via Intl to compute offset.
export function startOfLocalDay(date: Date, tz: string): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  const y = get("year");
  const m = get("month");
  const d = get("day");
  // Construct 00:00 in that tz by computing offset:
  const utcMid = Date.UTC(y, m - 1, d, 0, 0, 0);
  // determine offset at that instant
  const offsetMinutes = getTzOffsetMinutes(new Date(utcMid), tz);
  return new Date(utcMid - offsetMinutes * 60000);
}

function getTzOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  parts.forEach((p) => {
    if (p.type !== "literal") map[p.type] = p.value;
  });
  const asUTC = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour, +map.minute, +map.second);
  return (asUTC - date.getTime()) / 60000;
}

// Kaal windows: divide day (sunrise->sunset) into 8 parts, pick part number by weekday.
// Part index 1..8. Returns { start, end }.
const RAHU_KAAL = { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 } as const; // Sun..Sat
const YAMA_GANDA = { 0: 4, 1: 3, 2: 2, 3: 1, 4: 7, 5: 6, 6: 5 } as const;
const GULIKA = { 0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 } as const;

export function getKaalWindow(kind: "rahu" | "yama" | "gulika", date: Date, loc: LatLon) {
  const { sunrise, sunset } = getSunTimes(date, loc);
  if (!sunrise || !sunset) return null;
  const totalMs = sunset.getTime() - sunrise.getTime();
  const part = totalMs / 8;
  const table = kind === "rahu" ? RAHU_KAAL : kind === "yama" ? YAMA_GANDA : GULIKA;
  const localWeekday = getLocalWeekday(sunrise, loc.tz);
  const idx = (table as Record<number, number>)[localWeekday];
  const start = new Date(sunrise.getTime() + (idx - 1) * part);
  const end = new Date(start.getTime() + part);
  return { start, end, partIndex: idx };
}

export function getLocalWeekday(date: Date, tz: string): number {
  // 0 = Sunday
  const wk = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(date);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[wk] ?? 0;
}

// Choghadiya
const DAY_CHO: string[][] = [
  ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"], // Sun
  ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"], // Mon
  ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"], // Tue
  ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"], // Wed
  ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"], // Thu
  ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"], // Fri
  ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"], // Sat
];
const NIGHT_CHO: string[][] = [
  ["Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh"], // Sun
  ["Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char"], // Mon
  ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal"], // Tue
  ["Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg"], // Wed
  ["Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"], // Thu
  ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog"], // Fri
  ["Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh"], // Sat
];

export const CHO_QUALITY: Record<string, "auspicious" | "inauspicious" | "neutral"> = {
  Shubh: "auspicious",
  Labh: "auspicious",
  Amrit: "auspicious",
  Char: "neutral",
  Rog: "inauspicious",
  Kaal: "inauspicious",
  Udveg: "inauspicious",
};

export interface ChoghadiyaSlot {
  name: string;
  start: Date;
  end: Date;
  quality: "auspicious" | "inauspicious" | "neutral";
}
export interface ChoghadiyaResult {
  day: ChoghadiyaSlot[];
  night: ChoghadiyaSlot[];
}

export function getChoghadiya(date: Date, loc: LatLon): ChoghadiyaResult | null {
  const { sunrise, sunset } = getSunTimes(date, loc);
  if (!sunrise || !sunset) return null;
  const nextSunrise = getSunTimes(new Date(date.getTime() + 24 * 3600 * 1000), loc).sunrise;
  if (!nextSunrise) return null;
  const wk = getLocalWeekday(sunrise, loc.tz);
  const dayPart = (sunset.getTime() - sunrise.getTime()) / 8;
  const nightPart = (nextSunrise.getTime() - sunset.getTime()) / 8;
  const day: ChoghadiyaSlot[] = DAY_CHO[wk].map((n, i) => ({
    name: n,
    start: new Date(sunrise.getTime() + i * dayPart),
    end: new Date(sunrise.getTime() + (i + 1) * dayPart),
    quality: CHO_QUALITY[n],
  }));
  const night: ChoghadiyaSlot[] = NIGHT_CHO[wk].map((n, i) => ({
    name: n,
    start: new Date(sunset.getTime() + i * nightPart),
    end: new Date(sunset.getTime() + (i + 1) * nightPart),
    quality: CHO_QUALITY[n],
  }));
  return { day, night };
}

// Abhijit Muhurat — 8th of 15 day-muhurats, centred on solar noon (~48 min).
// Not observed on Wednesdays by tradition ("Vidhwa" period).
export interface AbhijitInfo {
  start: Date | null;
  end: Date | null;
  solarNoon: Date | null;
  durationMinutes: number | null;
  observed: boolean; // false on Wednesdays
  weekday: number;
}

export function getAbhijitMuhurat(date: Date, loc: LatLon): AbhijitInfo {
  const sun = getSunTimes(date, loc);
  if (!sun.sunrise || !sun.sunset) {
    return {
      start: null,
      end: null,
      solarNoon: null,
      durationMinutes: null,
      observed: false,
      weekday: 0,
    };
  }
  const wk = getLocalWeekday(sun.sunrise, loc.tz);
  const dayLen = sun.sunset.getTime() - sun.sunrise.getTime();
  const noon = new Date(sun.sunrise.getTime() + dayLen / 2);
  const half = dayLen / 30; // 1/15th of the day / 2
  const start = new Date(noon.getTime() - half);
  const end = new Date(noon.getTime() + half);
  return {
    start,
    end,
    solarNoon: noon,
    durationMinutes: Math.round((end.getTime() - start.getTime()) / 60000),
    observed: wk !== 3, // Wednesday
    weekday: wk,
  };
}

// Formatting helpers
export function fmtTime(d: Date | null, tz: string): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
export function fmtDateTime(d: Date | null, tz: string): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
export function fmtLocalDate(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// ─────────────────────────── PERSONAL GUIDANCE ENGINE ───────────────────────────

export const RASHIS = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrischika (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
];

export interface MoonRashiInfo {
  index: number; // 1..12
  name: string;
  lord: string;
}
const RASHI_LORDS = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
];

export function getMoonRashi(date: Date): MoonRashiInfo {
  const sidereal = norm360(moonLon(date) - ayanamsa(date));
  const idx = Math.floor(sidereal / 30);
  return { index: idx + 1, name: RASHIS[idx], lord: RASHI_LORDS[idx] };
}

// ─── Tarabalam (from natal nakshatra to today's nakshatra) ───
export const TARAS = [
  { name: "Janma", good: false, note: "Own — caution, avoid new ventures" },
  { name: "Sampat", good: true, note: "Wealth — favourable for gains" },
  { name: "Vipat", good: false, note: "Danger — avoid travel & risk" },
  { name: "Kshema", good: true, note: "Prosperity — safe & beneficial" },
  { name: "Pratyari", good: false, note: "Obstacles — postpone if possible" },
  { name: "Sadhaka", good: true, note: "Accomplishment — success favoured" },
  { name: "Vadha", good: false, note: "Destruction — avoid critical work" },
  { name: "Mitra", good: true, note: "Friend — friendly & supportive" },
  { name: "Ati-Mitra", good: true, note: "Best friend — most auspicious" },
];

export function getTarabalam(
  natalNakIndex: number /* 1..27 */,
  todayNakIndex: number,
): { taraIndex: number; tara: (typeof TARAS)[number] } {
  const diff = (((todayNakIndex - natalNakIndex) % 9) + 9) % 9;
  return { taraIndex: diff + 1, tara: TARAS[diff] };
}

// ─── Chandrabalam (Moon distance from natal Moon rashi) ───
export function getChandrabalam(natalRashiIndex: number /* 1..12 */, todayRashiIndex: number) {
  const diff = ((((todayRashiIndex - natalRashiIndex) % 12) + 12) % 12) + 1; // 1..12
  // Traditional: 1,3,6,7,10,11 = good; 2,5,9 = neutral; 4,8,12 = weak
  const good = [1, 3, 6, 7, 10, 11].includes(diff);
  const weak = [4, 8, 12].includes(diff);
  const strength: "strong" | "weak" | "neutral" = good ? "strong" : weak ? "weak" : "neutral";
  const note = good
    ? "Moon is strong — favourable for travel, new work, meetings."
    : weak
      ? "Moon is weak — avoid long travel & major decisions today."
      : "Moon is neutral — routine work is fine; postpone big ventures.";
  return { house: diff, strength, note };
}

// ─── Lucky attributes for the day (weekday-driven, nakshatra-shaded) ───
const WEEKDAY_LUCKY: { color: string; number: number; direction: string; metal: string }[] = [
  { color: "Golden Orange", number: 1, direction: "East", metal: "Gold" }, // Sun
  { color: "Pearl White", number: 2, direction: "North-West", metal: "Silver" }, // Mon
  { color: "Deep Red", number: 9, direction: "South", metal: "Copper" }, // Tue
  { color: "Emerald Green", number: 5, direction: "North", metal: "Bronze" }, // Wed
  { color: "Saffron Yellow", number: 3, direction: "North-East", metal: "Gold" }, // Thu
  { color: "Sky Blue", number: 6, direction: "South-East", metal: "Silver" }, // Fri
  { color: "Indigo Black", number: 8, direction: "West", metal: "Iron" }, // Sat
];

export function getLuckyForDay(weekday: number /* 0..6 */, nakLord?: string) {
  const base = WEEKDAY_LUCKY[weekday];
  const gem: Record<string, string> = {
    Sun: "Ruby",
    Moon: "Pearl",
    Mars: "Red Coral",
    Mercury: "Emerald",
    Jupiter: "Yellow Sapphire",
    Venus: "Diamond",
    Saturn: "Blue Sapphire",
    Rahu: "Hessonite",
    Ketu: "Cat's Eye",
  };
  return { ...base, gemstone: nakLord ? (gem[nakLord] ?? "—") : "—" };
}

// ─── Fasting day identifier (from tithi + weekday) ───
export function getFastingInfo(tithi: TithiInfo, weekday: number) {
  const list: { name: string; deity: string; note: string }[] = [];
  if (tithi.name === "Ekadashi")
    list.push({
      name: "Ekadashi Vrat",
      deity: "Vishnu",
      note: "Fast from grains; consume fruits & milk. Meditate on Vishnu.",
    });
  if (tithi.name === "Purnima")
    list.push({
      name: "Purnima Vrat",
      deity: "Satyanarayan",
      note: "Satyanarayan Katha & Chandra darshan traditionally observed.",
    });
  if (tithi.name === "Amavasya")
    list.push({
      name: "Amavasya",
      deity: "Pitr / Shiva",
      note: "Pitr tarpan, silence, and simple sattvic diet recommended.",
    });
  if (tithi.name === "Chaturdashi" && tithi.paksha === "Krishna")
    list.push({
      name: "Masik Shivaratri",
      deity: "Shiva",
      note: "Fast till moonrise; Shiva abhishek in the night prahar.",
    });
  if (tithi.name === "Chaturthi" && tithi.paksha === "Krishna")
    list.push({
      name: "Sankashti Chaturthi",
      deity: "Ganesha",
      note: "Fast till moonrise; recite Ganesh mantras.",
    });
  if (tithi.name === "Chaturthi" && tithi.paksha === "Shukla")
    list.push({
      name: "Vinayak Chaturthi",
      deity: "Ganesha",
      note: "Ganesh worship & fasting for obstacle removal.",
    });
  if (tithi.name === "Trayodashi")
    list.push({
      name: "Pradosh Vrat",
      deity: "Shiva",
      note: "Fast, break at Pradosh kaal (sunset window) with Shiva puja.",
    });
  // Weekday vrats (add only if not already a major tithi vrat)
  if (list.length === 0) {
    const wk = [
      {
        name: "Ravivar Vrat",
        deity: "Surya",
        note: "Fast till sunset; offer arghya to Surya at sunrise.",
      },
      {
        name: "Somvar Vrat",
        deity: "Shiva",
        note: "Fast till evening; Shiva abhishek with milk & bel patra.",
      },
      {
        name: "Mangalvar Vrat",
        deity: "Hanuman",
        note: "Fast for strength & protection; Hanuman Chalisa 11×.",
      },
      {
        name: "Budhvar Vrat",
        deity: "Ganesha",
        note: "Fast for wisdom & communication; Ganesh mantras.",
      },
      {
        name: "Guruvar Vrat",
        deity: "Vishnu / Brihaspati",
        note: "Yellow attire; Vishnu Sahasranama recommended.",
      },
      {
        name: "Shukravar Vrat",
        deity: "Lakshmi / Santoshi Ma",
        note: "Fast for prosperity & harmony; Sri Suktam.",
      },
      {
        name: "Shanivar Vrat",
        deity: "Shani",
        note: "Fast, black til / mustard oil offerings to Shani.",
      },
    ][weekday];
    list.push(wk);
  }
  return list;
}

// ─── Deity & mantra of the day (weekday) ───
export interface DayDeityInfo {
  weekday: number;
  deity: string;
  planet: string;
  mantra: { text: string; translit: string; meaning: string };
  practice: string;
}
export function getDeityOfDay(weekday: number): DayDeityInfo {
  const data: Omit<DayDeityInfo, "weekday">[] = [
    {
      deity: "Surya (Sun)",
      planet: "Sun",
      mantra: {
        text: "ॐ घृणि सूर्याय नमः",
        translit: "Om Ghrini Suryaya Namah",
        meaning: "Salutations to the radiant Sun.",
      },
      practice: "Offer water (arghya) to the rising Sun; 12 Surya Namaskar.",
    },
    {
      deity: "Shiva",
      planet: "Moon",
      mantra: {
        text: "ॐ नमः शिवाय",
        translit: "Om Namah Shivaya",
        meaning: "Salutations to Shiva.",
      },
      practice: "Abhishek with milk, water, honey. 108 japa.",
    },
    {
      deity: "Hanuman / Mangal",
      planet: "Mars",
      mantra: {
        text: "ॐ हं हनुमते नमः",
        translit: "Om Han Hanumate Namah",
        meaning: "Salutations to Hanuman.",
      },
      practice: "Recite Hanuman Chalisa; offer sindoor & jaggery.",
    },
    {
      deity: "Ganesha",
      planet: "Mercury",
      mantra: {
        text: "ॐ गं गणपतये नमः",
        translit: "Om Gam Ganapataye Namah",
        meaning: "Salutations to Ganapati.",
      },
      practice: "Offer durva & modak; 108 Ganesh japa for wisdom.",
    },
    {
      deity: "Vishnu / Brihaspati",
      planet: "Jupiter",
      mantra: {
        text: "ॐ नमो भगवते वासुदेवाय",
        translit: "Om Namo Bhagavate Vasudevaya",
        meaning: "Salutations to Vasudeva (Vishnu).",
      },
      practice: "Wear yellow; offer chana dal & jaggery; Vishnu Sahasranama.",
    },
    {
      deity: "Lakshmi / Shukra",
      planet: "Venus",
      mantra: {
        text: "ॐ श्रीं महालक्ष्म्यै नमः",
        translit: "Om Shreem Mahalakshmyai Namah",
        meaning: "Salutations to Mahalakshmi.",
      },
      practice: "Light a ghee lamp at dusk; recite Sri Suktam.",
    },
    {
      deity: "Shani / Hanuman",
      planet: "Saturn",
      mantra: {
        text: "ॐ शं शनैश्चराय नमः",
        translit: "Om Sham Shanaishcharaya Namah",
        meaning: "Salutations to Shani.",
      },
      practice: "Offer mustard oil to Shani; feed crows; charity to the needy.",
    },
  ];
  return { weekday, ...data[weekday] };
}

// ─── Simple Moon-sign horoscope (deterministic, seeded by rashi + date) ───
const HOROSCOPE_LINES: Record<string, string[]> = {
  work: [
    "A steady focus at work brings quiet recognition — avoid arguing over small details.",
    "New responsibilities arrive; delegate what you can and prioritise ruthlessly.",
    "A senior's guidance shapes your next move — listen carefully before responding.",
    "Progress feels slow but compounds — trust the process today.",
    "Creative ideas flow easily — write them down before they vanish.",
  ],
  money: [
    "Small, disciplined spending strengthens long-term security.",
    "Delay large purchases until the Moon strengthens later this week.",
    "An unexpected refund or return is possible — check pending settlements.",
    "Review subscriptions today; free up cash for something meaningful.",
    "A friend may seek a loan — be kind but clear with boundaries.",
  ],
  health: [
    "Hydration & pranayama in the morning noticeably lift your mood today.",
    "Rest your eyes — screen fatigue is the main culprit behind the heaviness.",
    "Warm, sattvic food suits your dosha better than cold snacks today.",
    "A 20-min walk after sunset settles both body and mind.",
    "Sleep early — the mind needs deep rest more than entertainment tonight.",
  ],
  relations: [
    "A kind word to a family elder returns as unexpected blessing.",
    "Listen twice, speak once — someone close needs to feel heard.",
    "Old friends reappear; a short call is enough to rekindle warmth.",
    "Romantic partners appreciate small gestures more than grand plans today.",
    "Avoid sharp words in the evening — Moon-Mars aspect can trigger flare-ups.",
  ],
  advice: [
    "Do one sacred act — even a lamp, a mantra, a fruit offered — the day tilts favourably.",
    "Silence in the first hour after waking is your secret superpower today.",
    "Wear your day-colour; carry your day-metal — small alignments matter.",
    "Give something away — a coin, a meal, a smile — Lakshmi favours generosity.",
    "Speak your Ishta's name 11 times before stepping out.",
  ],
};

function seededPick<T>(arr: T[], seed: number): T {
  const i = ((seed % arr.length) + arr.length) % arr.length;
  return arr[i];
}
export function getMoonSignHoroscope(rashiIndex: number /* 1..12 */, date: Date) {
  const day = Math.floor(date.getTime() / 86400000);
  const seed = day * 13 + rashiIndex * 7;
  return {
    work: seededPick(HOROSCOPE_LINES.work, seed),
    money: seededPick(HOROSCOPE_LINES.money, seed + 1),
    health: seededPick(HOROSCOPE_LINES.health, seed + 2),
    relations: seededPick(HOROSCOPE_LINES.relations, seed + 3),
    advice: seededPick(HOROSCOPE_LINES.advice, seed + 4),
  };
}

// ─────────────────────────── ADVANCED PANCHANG ENGINE ───────────────────────────

// ─── Moonrise / Moonset ───
export function getMoonTimes(date: Date, loc: LatLon): { rise: Date | null; set: Date | null } {
  const obs = new A.Observer(loc.lat, loc.lon, 0);
  const start = startOfLocalDay(date, loc.tz);
  const rise = A.SearchRiseSet(A.Body.Moon, obs, +1, A.MakeTime(start), 2);
  const set = A.SearchRiseSet(A.Body.Moon, obs, -1, A.MakeTime(start), 2);
  return { rise: rise?.date ?? null, set: set?.date ?? null };
}

// ─── Ritu (season), Ayana (solstice half), Paksha, Samvatsar ───
const RITUS = [
  "Shishira (Winter)",
  "Vasanta (Spring)",
  "Grishma (Summer)",
  "Varsha (Monsoon)",
  "Sharad (Autumn)",
  "Hemanta (Pre-winter)",
];
// Vikram Samvat starts around Chaitra Shukla Pratipada (~mid-March). Simple year offset.
const SAMVATSARA_NAMES = [
  "Prabhava",
  "Vibhava",
  "Shukla",
  "Pramoda",
  "Prajapati",
  "Angirasa",
  "Shrimukha",
  "Bhava",
  "Yuva",
  "Dhata",
  "Ishvara",
  "Bahudhanya",
  "Pramathi",
  "Vikrama",
  "Vrisha",
  "Chitrabhanu",
  "Svabhanu",
  "Tarana",
  "Parthiva",
  "Vyaya",
  "Sarvajit",
  "Sarvadhari",
  "Virodhi",
  "Vikriti",
  "Khara",
  "Nandana",
  "Vijaya",
  "Jaya",
  "Manmatha",
  "Durmukha",
  "Hevalambi",
  "Vilambi",
  "Vikari",
  "Sharvari",
  "Plava",
  "Shubhakrit",
  "Shobhakrit",
  "Krodhi",
  "Vishvavasu",
  "Parabhava",
  "Plavanga",
  "Kilaka",
  "Saumya",
  "Sadharana",
  "Virodhikrit",
  "Paridhavi",
  "Pramadi",
  "Ananda",
  "Rakshasa",
  "Nala",
  "Pingala",
  "Kalayukti",
  "Siddharthi",
  "Raudra",
  "Durmati",
  "Dundubhi",
  "Rudhirodgari",
  "Raktakshi",
  "Krodhana",
  "Akshaya",
];

export interface AlmanacInfo {
  paksha: "Shukla" | "Krishna";
  ritu: string; // Vedic season
  ayana: "Uttarayana" | "Dakshinayana";
  gola: "Uttara Gola" | "Dakshina Gola"; // Sun's hemisphere (declination)
  vikramSamvat: number;
  shakaSamvat: number;
  kaliSamvat: number;
  samvatsara: string;
  masaSolar: string; // Sun's sidereal rashi (Solar month)
}

const SOLAR_MASAS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrischika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
];

export function getAlmanac(date: Date): AlmanacInfo {
  const sunSid = norm360(sunLon(date) - ayanamsa(date));
  const sunTrop = sunLon(date);
  const sunRashi = Math.floor(sunSid / 30);
  const tithi = getTithi(date);

  // Ritu (2 solar-months each starting from Makara / mid-Jan):
  // Shishira: Makara+Kumbha; Vasanta: Meena+Mesha; Grishma: Vrishabha+Mithuna;
  // Varsha: Karka+Simha; Sharad: Kanya+Tula; Hemanta: Vrischika+Dhanu.
  const rituFromRashi = [3, 4, 4, 5, 5, 6, 6, 0, 0, 1, 1, 2, 2, 3]; // safety
  // Cleaner mapping:
  const rituMap: Record<number, number> = {
    9: 0,
    10: 0,
    11: 1,
    0: 1,
    1: 2,
    2: 2,
    3: 3,
    4: 3,
    5: 4,
    6: 4,
    7: 5,
    8: 5,
  };
  const ritu = RITUS[rituMap[sunRashi] ?? rituFromRashi[sunRashi] ?? 0];

  // Ayana — traditional Nirayana: Uttarayana starts when Sun (sidereal) enters Makara (Jan ~14).
  const ayana: "Uttarayana" | "Dakshinayana" =
    sunSid >= 270 || sunSid < 90 ? "Uttarayana" : "Dakshinayana";

  // Gola — northern/southern based on Sun's tropical declination sign.
  const t = A.MakeTime(date);
  const eq = A.Equator(A.Body.Sun, t, new A.Observer(0, 0, 0), true, true);
  const gola: "Uttara Gola" | "Dakshina Gola" = eq.dec >= 0 ? "Uttara Gola" : "Dakshina Gola";

  const gYear = date.getUTCFullYear();
  // Vikram Samvat = Gregorian + 57 (before Chaitra) or +56 (after solar Mesha ~Apr 14 Nirayana New Year).
  // Simplified: use Nirayana Mesha entry: if Sun's sidereal rashi ≥ Mesha (0) and month >= April, add 57 else 56.
  const inNewSamvat =
    date.getUTCMonth() > 2 || (date.getUTCMonth() === 2 && date.getUTCDate() >= 22);
  const vikramSamvat = gYear + (inNewSamvat ? 57 : 56);
  const shakaSamvat = gYear - (inNewSamvat ? 78 : 79);
  const kaliSamvat = gYear + (inNewSamvat ? 3102 : 3101);
  // 60-year Samvatsara cycle. Anchor: 1987–88 = Prabhava (index 0 for Vikram 2044).
  const samvatsara = SAMVATSARA_NAMES[(((vikramSamvat - 2044) % 60) + 60) % 60];

  return {
    paksha: tithi.paksha,
    ritu,
    ayana,
    gola,
    vikramSamvat,
    shakaSamvat,
    kaliSamvat,
    samvatsara,
    masaSolar: SOLAR_MASAS[sunRashi],
  };
}

// ─── Eclipse calendar (Solar + Lunar) ───
export interface EclipseEvent {
  kind: "Surya Grahan (Solar)" | "Chandra Grahan (Lunar)";
  type: string; // total / partial / annular / penumbral
  peak: Date;
}
export function getUpcomingEclipses(fromDate: Date, count = 4): EclipseEvent[] {
  const out: EclipseEvent[] = [];
  try {
    let s = A.SearchGlobalSolarEclipse(A.MakeTime(fromDate));
    for (let i = 0; i < count && s; i++) {
      out.push({ kind: "Surya Grahan (Solar)", type: s.kind, peak: s.peak.date });
      s = A.NextGlobalSolarEclipse(s.peak);
    }
  } catch {
    /* ignore */
  }
  try {
    let l = A.SearchLunarEclipse(A.MakeTime(fromDate));
    for (let i = 0; i < count && l; i++) {
      out.push({ kind: "Chandra Grahan (Lunar)", type: l.kind, peak: l.peak.date });
      l = A.NextLunarEclipse(l.peak);
    }
  } catch {
    /* ignore */
  }
  return out.sort((a, b) => a.peak.getTime() - b.peak.getTime()).slice(0, count);
}

// ─── Graha Gochar (planetary transits — current sidereal rashi) ───
export interface TransitInfo {
  body: string;
  rashiIndex: number; // 0..11
  rashi: string;
  rashiDeg: number; // 0..30
  nakshatra: string;
  retrograde: boolean;
}
const PLANET_BODIES: { name: string; body: A.Body }[] = [
  { name: "Sun", body: A.Body.Sun },
  { name: "Moon", body: A.Body.Moon },
  { name: "Mercury", body: A.Body.Mercury },
  { name: "Venus", body: A.Body.Venus },
  { name: "Mars", body: A.Body.Mars },
  { name: "Jupiter", body: A.Body.Jupiter },
  { name: "Saturn", body: A.Body.Saturn },
];

function bodySiderealLon(body: A.Body, date: Date): number {
  const t = A.MakeTime(date);
  if (body === A.Body.Moon) return norm360(A.EclipticGeoMoon(t).lon - ayanamsa(date));
  if (body === A.Body.Sun) return norm360(A.SunPosition(t).elon - ayanamsa(date));
  const vec = A.GeoVector(body, t, true);
  const ecl = A.Ecliptic(vec);
  return norm360(ecl.elon - ayanamsa(date));
}

// Mean lunar node (Rahu). Meeus, chapter 47 — simplified formula.
function meanLunarNodeSidereal(date: Date): number {
  const jd = A.MakeTime(date).ut + 2451545.0;
  const T = (jd - 2451545.0) / 36525;
  // Mean longitude of ascending node (tropical, degrees)
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  return norm360(omega - ayanamsa(date));
}

export function getTransits(date: Date): TransitInfo[] {
  const nakSpan = 360 / 27;
  const list: TransitInfo[] = PLANET_BODIES.map(({ name, body }) => {
    const sid = bodySiderealLon(body, date);
    // retrograde: compare sidereal lon 12h before & after
    const past = bodySiderealLon(body, new Date(date.getTime() - 12 * 3600e3));
    const future = bodySiderealLon(body, new Date(date.getTime() + 12 * 3600e3));
    const delta = ((future - past + 540) % 360) - 180;
    const retro = name !== "Sun" && name !== "Moon" ? delta < 0 : false;
    const rIdx = Math.floor(sid / 30);
    return {
      body: name,
      rashiIndex: rIdx,
      rashi: RASHIS[rIdx],
      rashiDeg: sid - rIdx * 30,
      nakshatra: NAKSHATRAS[Math.floor(sid / nakSpan)].name,
      retrograde: retro,
    };
  });
  // Rahu (always retrograde by convention)
  const rahu = meanLunarNodeSidereal(date);
  const rIdxR = Math.floor(rahu / 30);
  list.push({
    body: "Rahu",
    rashiIndex: rIdxR,
    rashi: RASHIS[rIdxR],
    rashiDeg: rahu - rIdxR * 30,
    nakshatra: NAKSHATRAS[Math.floor(rahu / nakSpan)].name,
    retrograde: true,
  });
  const ketu = norm360(rahu + 180);
  const rIdxK = Math.floor(ketu / 30);
  list.push({
    body: "Ketu",
    rashiIndex: rIdxK,
    rashi: RASHIS[rIdxK],
    rashiDeg: ketu - rIdxK * 30,
    nakshatra: NAKSHATRAS[Math.floor(ketu / nakSpan)].name,
    retrograde: true,
  });
  return list;
}

// ─── Rahu-Ketu transit alert (next rashi change) ───
export function getNextNodeTransit(date: Date): {
  rahu: { current: string; next: string; when: Date } | null;
  ketu: { current: string; next: string; when: Date } | null;
} {
  const startRahu = meanLunarNodeSidereal(date);
  const startIdx = Math.floor(startRahu / 30);
  // Rahu moves ~-0.053°/day; search up to 3 years ahead in 1-day steps.
  const stepMs = 24 * 3600e3;
  let d = new Date(date.getTime());
  for (let i = 0; i < 365 * 3; i++) {
    d = new Date(d.getTime() + stepMs);
    const cur = Math.floor(meanLunarNodeSidereal(d) / 30);
    if (cur !== startIdx) {
      const nextRahuIdx = cur;
      const nextKetuIdx = (nextRahuIdx + 6) % 12;
      const curKetuIdx = (startIdx + 6) % 12;
      return {
        rahu: { current: RASHIS[startIdx], next: RASHIS[nextRahuIdx], when: d },
        ketu: { current: RASHIS[curKetuIdx], next: RASHIS[nextKetuIdx], when: d },
      };
    }
  }
  return { rahu: null, ketu: null };
}

// ─── Lagna (Ascendant) for a given moment & location ───
export interface LagnaInfo {
  rashiIndex: number;
  rashi: string;
  degreeInRashi: number;
  nakshatra: string;
  siderealLon: number;
}

export function getLagna(date: Date, loc: LatLon): LagnaInfo {
  // Local Sidereal Time (approx, radian-free)
  const t = A.MakeTime(date);
  const jd = t.ut + 2451545.0;
  const T = (jd - 2451545.0) / 36525;
  // Mean GST in hours (Meeus 12.4)
  let gmst =
    6.697374558 +
    0.06570982441908 * (jd - 2451545.0) +
    1.00273790935 * (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) +
    0.000026 * T * T;
  gmst = ((gmst % 24) + 24) % 24;
  const lst = (((gmst + loc.lon / 15) % 24) + 24) % 24;
  const ramc = lst * 15; // deg

  // Obliquity (mean)
  const eps = 23.439291 - 0.0130042 * T;
  const DEG = Math.PI / 180;
  const sinE = Math.sin(eps * DEG);
  const cosE = Math.cos(eps * DEG);
  const tanPhi = Math.tan(loc.lat * DEG);
  const sinR = Math.sin(ramc * DEG);
  const cosR = Math.cos(ramc * DEG);

  let asc = Math.atan2(-cosR, sinE * tanPhi + cosE * sinR) / DEG;
  asc = norm360(asc);
  const diff = norm360(asc - ramc);
  if (diff > 180) asc = norm360(asc + 180);

  const sid = norm360(asc - ayanamsa(date));
  const rIdx = Math.floor(sid / 30);
  const nakSpan = 360 / 27;
  return {
    rashiIndex: rIdx,
    rashi: RASHIS[rIdx],
    degreeInRashi: sid - rIdx * 30,
    nakshatra: NAKSHATRAS[Math.floor(sid / nakSpan)].name,
    siderealLon: sid,
  };
}
