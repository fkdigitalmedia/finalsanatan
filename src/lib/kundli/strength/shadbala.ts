// ============================================================
// Kundli / strength / shadbala
// ------------------------------------------------------------
// Simplified Shadbala for the seven visible grahas (Sun..Saturn).
// Produces the six classical balas in *virupas* (1 rupa = 60
// virupas) and a total. Rahu / Ketu are omitted (they are not
// counted in classical Shadbala).
//
// This is a curated approximation of the Parashara scheme, not a
// research-grade implementation — enough for report use.
// ============================================================
import type { GrahaName, PlanetChartPosition, KundliChart } from "@/lib/kundli/types";

export interface ShadbalaEntry {
  graha: GrahaName;
  sthanaBala: number; // positional
  digBala: number; // directional
  kalaBala: number; // temporal (day/night)
  cheshtaBala: number; // motional
  naisargikaBala: number; // natural
  drikBala: number; // aspectual (simplified 0)
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  meetsRequirement: boolean;
}

export interface ShadbalaReport {
  entries: ShadbalaEntry[];
  strongest: GrahaName;
  weakest: GrahaName;
}

const DIGNITY_STHANA: Record<string, number> = {
  exalted: 60,
  moolatrikona: 45,
  own: 30,
  friend: 22.5,
  neutral: 15,
  enemy: 7.5,
  debilitated: 0,
};

// Directional strength — ideal house per planet (max Dig Bala 60)
const IDEAL_HOUSE: Record<GrahaName, number> = {
  Jupiter: 1,
  Mercury: 1,
  Sun: 10,
  Mars: 10,
  Saturn: 7,
  Moon: 4,
  Venus: 4,
  Rahu: 0,
  Ketu: 0,
};

function digBala(graha: GrahaName, house: number): number {
  const ideal = IDEAL_HOUSE[graha];
  if (!ideal) return 0;
  // Distance around the wheel (opposite house = weakest)
  let dist = Math.abs(house - ideal);
  if (dist > 6) dist = 12 - dist;
  return Math.round((60 * (6 - dist)) / 6);
}

// Kala Bala — birth is day if Sun is above horizon (houses 7..12 in whole-sign chart)
const DAY_STRONG: GrahaName[] = ["Sun", "Jupiter", "Venus"];
const NIGHT_STRONG: GrahaName[] = ["Moon", "Mars", "Saturn"];

function kalaBala(graha: GrahaName, isDay: boolean): number {
  if (graha === "Mercury") return 60;
  if (isDay && DAY_STRONG.includes(graha)) return 60;
  if (!isDay && NIGHT_STRONG.includes(graha)) return 60;
  return 15;
}

function cheshtaBala(graha: GrahaName, retrograde: boolean): number {
  if (graha === "Sun" || graha === "Moon") return 30;
  return retrograde ? 60 : 30;
}

const NAISARGIKA: Record<GrahaName, number> = {
  Sun: 60,
  Moon: 51.4,
  Venus: 42.8,
  Jupiter: 34.3,
  Mercury: 25.7,
  Mars: 17.1,
  Saturn: 8.6,
  Rahu: 0,
  Ketu: 0,
};

// Classical minimum required (rupas) per planet
const REQUIRED_RUPAS: Record<GrahaName, number> = {
  Sun: 6.5,
  Moon: 6.0,
  Mars: 5.0,
  Mercury: 7.0,
  Jupiter: 6.5,
  Venus: 5.5,
  Saturn: 5.0,
  Rahu: 0,
  Ketu: 0,
};

export function computeShadbala(chart: KundliChart): ShadbalaReport {
  const sun = chart.planets.find((p) => p.graha === "Sun");
  // "Day birth" = Sun in houses 7..12 (above horizon in whole-sign)
  const isDay = sun ? sun.house >= 7 : true;

  const entries: ShadbalaEntry[] = chart.planets
    .filter((p) => p.graha !== "Rahu" && p.graha !== "Ketu")
    .map((p: PlanetChartPosition) => {
      const sth = DIGNITY_STHANA[p.dignity] ?? 15;
      const dig = digBala(p.graha, p.house);
      const kal = kalaBala(p.graha, isDay);
      const che = cheshtaBala(p.graha, p.retrograde);
      const nai = NAISARGIKA[p.graha];
      const drk = 0;
      const total = sth + dig + kal + che + nai + drk;
      const rupas = Math.round((total / 60) * 100) / 100;
      const req = REQUIRED_RUPAS[p.graha];
      return {
        graha: p.graha,
        sthanaBala: sth,
        digBala: dig,
        kalaBala: kal,
        cheshtaBala: che,
        naisargikaBala: Math.round(nai * 10) / 10,
        drikBala: drk,
        totalVirupas: Math.round(total * 10) / 10,
        totalRupas: rupas,
        requiredRupas: req,
        meetsRequirement: rupas >= req,
      };
    });

  const sorted = [...entries].sort((a, b) => b.totalVirupas - a.totalVirupas);
  return {
    entries,
    strongest: sorted[0]?.graha ?? "Sun",
    weakest: sorted[sorted.length - 1]?.graha ?? "Saturn",
  };
}
