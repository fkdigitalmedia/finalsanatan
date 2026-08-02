// ============================================================
// Workspace insights — pure adapters over existing engines.
// NO astrology maths lives here: every value is produced by
// the Panchang / Kundli / Dasha / Gochar engines and merely
// reshaped for dashboard widgets.
// ============================================================

import {
  fmtTime,
  getAbhijitMuhurat,
  getChoghadiya,
  getMoonRashi,
  getNakshatra,
  getSunTimes,
  getTithi,
  getYoga,
  type LatLon,
} from "@/lib/panchang";
import { generateDasha } from "@/lib/dasha";
import { generateGochar } from "@/lib/gochar";
import type { BirthInput } from "@/lib/kundli/types";
import type { UserKundli } from "./types";

export interface PanchangSummary {
  tithi: string;
  nakshatra: string;
  yoga: string;
  moonSign: string;
  sunrise: string;
  sunset: string;
}

export interface MuhuratSlot {
  name: string;
  start: string;
  end: string;
  quality: "auspicious" | "inauspicious" | "neutral";
}

export interface DashaSummary {
  mahadasha: string | null;
  antardasha: string | null;
  mahadashaEnds: string | null;
  progress: number;
}

export interface GocharSummaryView {
  score: number;
  verdict: string;
  favourable: string[];
  sensitive: string[];
}

/** Convert a saved chart row into the canonical engine birth input. */
export function birthInputFromKundli(
  k: Pick<
    UserKundli,
    | "birth_date"
    | "birth_time"
    | "place_name"
    | "latitude"
    | "longitude"
    | "timezone"
    | "gender"
    | "language"
    | "name"
  >,
): BirthInput {
  return {
    date: k.birth_date,
    time: String(k.birth_time ?? "12:00").slice(0, 5),
    place: k.place_name ?? "",
    latitude: Number(k.latitude ?? 0),
    longitude: Number(k.longitude ?? 0),
    timezone: k.timezone || "Asia/Kolkata",
    gender: (k.gender as BirthInput["gender"]) ?? "male",
    language: k.language ?? "en",
  };
}

export function locationFromKundli(
  k: Pick<UserKundli, "latitude" | "longitude" | "place_name" | "timezone">,
): LatLon {
  return {
    lat: Number(k.latitude ?? 0),
    lon: Number(k.longitude ?? 0),
    label: k.place_name ?? "",
    tz: k.timezone || "Asia/Kolkata",
  };
}

export function summarizePanchang(date: Date, loc: LatLon, tz = "Asia/Kolkata"): PanchangSummary {
  const sun = getSunTimes(date, loc);
  return {
    tithi: getTithi(date).name,
    nakshatra: getNakshatra(date).name,
    yoga: getYoga(date).name,
    moonSign: getMoonRashi(date).name,
    sunrise: fmtTime(sun.sunrise, tz),
    sunset: fmtTime(sun.sunset, tz),
  };
}

/** Next auspicious windows for today, Abhijit first. */
export function upcomingMuhurats(
  date: Date,
  loc: LatLon,
  tz = "Asia/Kolkata",
  limit = 4,
): MuhuratSlot[] {
  const out: MuhuratSlot[] = [];
  const abhijit = getAbhijitMuhurat(date, loc);
  if (abhijit?.start && abhijit?.end) {
    out.push({
      name: "Abhijit Muhurat",
      start: fmtTime(abhijit.start, tz),
      end: fmtTime(abhijit.end, tz),
      quality: "auspicious",
    });
  }
  const cho = getChoghadiya(date, loc);
  const slots = [...(cho?.day ?? []), ...(cho?.night ?? [])] as Array<{
    name: string;
    start: Date;
    end: Date;
    quality?: string;
  }>;
  for (const s of slots) {
    if (out.length >= limit) break;
    if (s.end.getTime() < date.getTime()) continue;
    if (s.quality !== "auspicious") continue;
    out.push({
      name: `${s.name} Choghadiya`,
      start: fmtTime(s.start, tz),
      end: fmtTime(s.end, tz),
      quality: "auspicious",
    });
  }
  return out.slice(0, limit);
}

export function summarizeDasha(birth: BirthInput, currentDate?: string): DashaSummary {
  const out = generateDasha({ birth, currentDate });
  return {
    mahadasha: out.currentMahadasha?.lord ?? null,
    antardasha: out.currentAntardasha?.lord ?? null,
    mahadashaEnds: out.currentMahadasha?.endISO ?? null,
    progress: Math.round((out.currentMahadasha?.progress ?? 0) * 100),
  };
}

export function summarizeGochar(birth: BirthInput, currentDate?: string): GocharSummaryView {
  const out = generateGochar({ birth, currentDate });
  return {
    score: Math.round(out.summary.overallScore),
    verdict: String(out.summary.verdict),
    favourable: out.summary.positivePlanets.map(String),
    sensitive: out.summary.sensitivePlanets.map(String),
  };
}

/** Formats a `CurrentPeriod.endISO` for display without locale surprises. */
export function formatDate(iso?: string | null, locale = "en-IN"): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}
