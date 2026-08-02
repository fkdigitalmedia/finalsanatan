// ============================================================
// Phase 14.6 — Public horoscope adapters.
// Pure mapping between URL slugs and the Horoscope Engine.
// No astrology maths here: everything is delegated to
// src/lib/horoscope/*.
// ============================================================

import { RASHIS } from "@/lib/horoscope/constants";
import type { RashiKey } from "@/lib/horoscope/types";
import { generateDailyHoroscope } from "@/lib/horoscope/daily";
import { generateWeeklyHoroscope } from "@/lib/horoscope/weekly";
import { generateMonthlyHoroscope } from "@/lib/horoscope/monthly";
import { generateYearlyHoroscope } from "@/lib/horoscope/yearly";

export const HOROSCOPE_PERIODS = ["daily", "weekly", "monthly", "yearly"] as const;
export type HoroscopePeriod = (typeof HOROSCOPE_PERIODS)[number];

export interface SignInfo {
  slug: string; // "aries"
  key: RashiKey; // "mesha"
  english: string; // "Aries"
  sanskrit: string; // "Mesha"
  hindi: string;
  symbol: string;
  element: string;
  rulingPlanet: string;
  dates: string;
}

const DATE_RANGES: Record<string, string> = {
  mesha: "Apr 14 – May 14",
  vrishabha: "May 15 – Jun 14",
  mithuna: "Jun 15 – Jul 15",
  karka: "Jul 16 – Aug 16",
  simha: "Aug 17 – Sep 16",
  kanya: "Sep 17 – Oct 16",
  tula: "Oct 17 – Nov 15",
  vrishchika: "Nov 16 – Dec 15",
  dhanu: "Dec 16 – Jan 13",
  makara: "Jan 14 – Feb 12",
  kumbha: "Feb 13 – Mar 14",
  meena: "Mar 15 – Apr 13",
};

export const SIGNS: SignInfo[] = RASHIS.map((r) => ({
  slug: r.english.toLowerCase(),
  key: r.key as RashiKey,
  english: r.english,
  sanskrit: r.sanskrit,
  hindi: r.hindi,
  symbol: r.symbol,
  element: r.element,
  rulingPlanet: r.rulingPlanet,
  dates: DATE_RANGES[r.key] ?? "",
}));

export function findSign(slug: string): SignInfo | undefined {
  const s = String(slug ?? "")
    .toLowerCase()
    .trim();
  return SIGNS.find((x) => x.slug === s || x.key === s || x.sanskrit.toLowerCase() === s);
}

export function isPeriod(value: string): value is HoroscopePeriod {
  return (HOROSCOPE_PERIODS as readonly string[]).includes(value);
}

export function periodLabel(period: HoroscopePeriod): string {
  return period.charAt(0).toUpperCase() + period.slice(1);
}

export function periodPath(period: HoroscopePeriod, slug?: string): string {
  return slug ? `/${period}-horoscope/${slug}` : `/${period}-horoscope`;
}

// ------------------------------------------------------------
// Normalized view model — one shape for all four periods.
// ------------------------------------------------------------

export interface HoroscopeCategoryView {
  key: string;
  /** English fallback label — UI should translate via `horoscope.categories.<key>`. */
  fallbackLabel: string;
  score: number;
}

export interface HoroscopeView {
  period: HoroscopePeriod;
  sign: SignInfo;
  rangeLabel: string;
  overallScore: number;
  categories: HoroscopeCategoryView[];
  lucky: { number?: number; color?: string; direction?: string };
  highlights: string[];
  cautions: string[];
  panchang: { label: string; value: string }[];
}

function labelize(key: string): string {
  return key.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickLucky(l: Record<string, unknown> | undefined) {
  const n =
    (l?.number as number) ?? (l?.numbers as number[])?.[0] ?? (l?.luckyNumbers as number[])?.[0];
  const c =
    (l?.color as string) ?? (l?.colors as string[])?.[0] ?? (l?.luckyColors as string[])?.[0];
  const d = (l?.direction as string) ?? (l?.luckyDirection as string);
  return { number: n, color: c, direction: d };
}

function avg(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function toCategories(
  scores: Record<string, { score?: number; average?: number }>,
): HoroscopeCategoryView[] {
  return Object.entries(scores ?? {}).map(([key, v]) => ({
    key,
    fallbackLabel: labelize(key),
    score: Math.round(Number(v?.score ?? v?.average ?? 0)),
  }));
}

export interface BuildOptions {
  date?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  language?: string;
}

/** Build a display-ready horoscope for a sign + period. Delegates to engines. */
export function buildHoroscope(
  period: HoroscopePeriod,
  sign: SignInfo,
  opts: BuildOptions = {},
): HoroscopeView {
  const base = {
    rashi: sign.key,
    timezone: opts.timezone ?? "Asia/Kolkata",
    language: opts.language ?? "en",
    ...(opts.latitude != null ? { latitude: opts.latitude } : {}),
    ...(opts.longitude != null ? { longitude: opts.longitude } : {}),
  };
  const today = opts.date ?? new Date().toISOString().slice(0, 10);

  if (period === "daily") {
    const out = generateDailyHoroscope({ ...base, date: today });
    const categories = toCategories(out.scores as never);
    return {
      period,
      sign,
      rangeLabel: out.date,
      overallScore: avg(categories.map((c) => c.score)),
      categories,
      lucky: {
        number: out.luckyFactors.number,
        color: out.luckyFactors.color,
        direction: out.luckyFactors.direction,
      },
      highlights: out.luckyFactors.favorableActivities ?? [],
      cautions: out.luckyFactors.activitiesToAvoid ?? [],
      panchang: [
        { label: "tithi", value: `${out.panchang.tithi.name} (${out.panchang.tithi.paksha})` },
        { label: "nakshatra", value: out.panchang.nakshatra.name },
        { label: "yoga", value: out.panchang.yoga.name },
      ],
    };
  }

  if (period === "weekly") {
    const out = generateWeeklyHoroscope({ ...base, startDate: today } as never);
    const categories = toCategories(out.scores as never);
    return {
      period,
      sign,
      rangeLabel: `${out.startDate} → ${out.endDate}`,
      overallScore: avg(categories.map((c) => c.score)),
      categories,
      lucky: pickLucky(out.luckyFactors as unknown as Record<string, unknown>),
      highlights: out.opportunities ?? [],
      cautions: out.challenges ?? [],
      panchang: [
        { label: "favourableDays", value: (out.favorableDays ?? []).slice(0, 3).join(", ") || "—" },
        { label: "cautionDays", value: (out.cautionDays ?? []).slice(0, 3).join(", ") || "—" },
      ],
    };
  }

  if (period === "monthly") {
    const d = new Date(today);
    const out = generateMonthlyHoroscope({
      ...base,
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
    } as never);
    const categories = toCategories(out.scores as never);
    return {
      period,
      sign,
      rangeLabel: `${out.year}-${String(out.month).padStart(2, "0")}`,
      overallScore: Math.round(out.overview?.averageScore ?? avg(categories.map((c) => c.score))),
      categories,
      lucky: pickLucky(out.luckyFactors as unknown as Record<string, unknown>),
      highlights: out.opportunities ?? [],
      cautions: out.challenges ?? [],
      panchang: [
        {
          label: "bestWeek",
          value: out.bestWeek ? `${out.bestWeek.startDate} → ${out.bestWeek.endDate}` : "—",
        },
        {
          label: "sensitiveWeek",
          value: out.mostSensitiveWeek
            ? `${out.mostSensitiveWeek.startDate} → ${out.mostSensitiveWeek.endDate}`
            : "—",
        },
      ],
    };
  }

  const year = Number(today.slice(0, 4));
  const out = generateYearlyHoroscope({ ...base, year } as never);
  const categories = toCategories(out.scores as never);
  return {
    period,
    sign,
    rangeLabel: String(out.year),
    overallScore: Math.round(out.overview?.averageScore ?? avg(categories.map((c) => c.score))),
    categories,
    lucky: pickLucky(out.luckyFactors as unknown as Record<string, unknown>),
    highlights: out.opportunities ?? [],
    cautions: out.challenges ?? [],
    panchang: (out.quarters ?? []).slice(0, 4).map((q, i) => ({
      label: `quarter:${i + 1}`,
      value: `${Math.round(Number((q as { averageScore?: number }).averageScore ?? 0))}/100`,
    })),
  };
}

/** FAQ blocks reused by every horoscope page (schema + UI). */
export function horoscopeFaqs(
  period: HoroscopePeriod,
  sign?: SignInfo,
): { question: string; answer: string }[] {
  const who = sign ? `${sign.english} (${sign.sanskrit})` : "each Rashi";
  return [
    {
      question: `How is the ${period} horoscope for ${who} calculated?`,
      answer: `It is generated from real planetary positions using our sidereal astronomy and Panchang engines — Moon transit (Chandra gochara) relative to your Rashi, tithi, nakshatra and yoga. No content is hand-written per day.`,
    },
    {
      question: "Which zodiac system do you use?",
      answer:
        "Vedic (sidereal) astrology with the Lahiri ayanamsa, based on your Moon sign (Rashi) rather than the Western Sun sign.",
    },
    {
      question: "Is this horoscope free?",
      answer:
        "Yes. All 12 Rashi horoscopes are free to read. Personalised horoscopes based on your full birth chart are part of the premium plans.",
    },
    {
      question: "How often is it updated?",
      answer: `The ${period} horoscope is recalculated from live planetary data every time the page loads, so it is always current.`,
    },
  ];
}
