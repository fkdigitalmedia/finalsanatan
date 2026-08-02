// ============================================================
// Kundli / panchang-at-birth
// ------------------------------------------------------------
// Evaluates the five Panchang limbs (Tithi, Vaar, Nakshatra,
// Yoga, Karana) at the exact moment of birth. Reuses the same
// astronomical primitives used by the daily Panchang page.
// ============================================================
import { getTithi, getNakshatra, getYoga, getKarana, WEEKDAYS } from "@/lib/panchang";

export interface BirthPanchang {
  vaar: string; // weekday name
  tithi: { name: string; index: number; paksha: "Shukla" | "Krishna"; percent: number };
  nakshatra: { name: string; pada: number; lord: string; deity: string };
  yoga: { name: string; index: number; percent: number };
  karana: { name: string; type: "Movable" | "Fixed"; index: number };
}

export function computeBirthPanchang(utc: Date): BirthPanchang {
  const t = getTithi(utc);
  const n = getNakshatra(utc);
  const y = getYoga(utc);
  const k = getKarana(utc);
  const dow = utc.getUTCDay();
  return {
    vaar: WEEKDAYS[dow] ?? "—",
    tithi: { name: t.name, index: t.index, paksha: t.paksha, percent: t.percent },
    nakshatra: { name: n.name, pada: n.pada, lord: n.lord, deity: n.deity },
    yoga: { name: y.name, index: y.index, percent: y.percent },
    karana: { name: k.name, type: k.type, index: k.index },
  };
}
