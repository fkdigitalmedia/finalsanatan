// ============================================================
// Kundli / doshas
// ------------------------------------------------------------
// Classical dosha detection: Mangal, Kaal Sarp, Sade Sati,
// Kemadruma, Guru Chandal, Shakat.
// Each returns severity + explanation + remedy pointer.
// ============================================================
import type { KundliChart, GrahaName } from "./types";

export type DoshaSeverity = "none" | "mild" | "moderate" | "severe";

export interface DoshaResult {
  name: string;
  sanskrit?: string;
  isPresent: boolean;
  severity: DoshaSeverity;
  description: string;
  remedyHint: string;
}

function planet(chart: KundliChart, g: GrahaName) {
  return chart.planets.find((p) => p.graha === g);
}

// Mangal Dosha — Mars in 1,2,4,7,8,12 from Lagna (or Moon)
function mangalDosha(chart: KundliChart): DoshaResult {
  const mars = planet(chart, "Mars");
  const moon = planet(chart, "Moon");
  const dustyHouses = [1, 2, 4, 7, 8, 12];
  const fromLagna = mars ? dustyHouses.includes(mars.house) : false;
  let fromMoon = false;
  if (mars && moon) {
    const rel = ((mars.house - moon.house + 12) % 12) + 1;
    fromMoon = dustyHouses.includes(rel);
  }
  const present = fromLagna || fromMoon;
  let severity: DoshaSeverity = "none";
  if (present) severity = fromLagna && fromMoon ? "severe" : "moderate";
  // Cancellation: Mars in own/exalted or with Jupiter/Moon
  if (present && mars) {
    const cancel =
      mars.dignity === "exalted" ||
      mars.dignity === "own" ||
      chart.planets.some(
        (p) => (p.graha === "Jupiter" || p.graha === "Moon") && p.house === mars.house,
      );
    if (cancel) severity = "mild";
  }
  return {
    name: "Mangal Dosha",
    sanskrit: "मंगल दोष",
    isPresent: present,
    severity,
    description: present
      ? `Mars occupies a Mangal-Dosha house from ${fromLagna && fromMoon ? "both Lagna and Moon" : fromLagna ? "Lagna" : "Moon"}. Traditionally linked to friction in marriage and impulsive decisions.`
      : "Mars is not placed in any Mangal Dosha house — no Mangal Dosha.",
    remedyHint:
      "Recite Hanuman Chalisa on Tuesdays; charity of red lentils and jaggery; Mangal Shanti puja if severity is high.",
  };
}

// Kaal Sarp Dosha — all 7 planets between Rahu-Ketu axis (one side)
function kaalSarp(chart: KundliChart): DoshaResult {
  const rahu = planet(chart, "Rahu");
  const ketu = planet(chart, "Ketu");
  const seven: GrahaName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  let present = false;
  if (rahu && ketu) {
    const rLon = rahu.longitudeSidereal;
    const kLon = ketu.longitudeSidereal;
    const inArc = (lon: number, a: number, b: number) => {
      // returns true if lon lies on the short arc from a → b going forward
      let d = (b - a + 360) % 360;
      let x = (lon - a + 360) % 360;
      return x > 0 && x < d;
    };
    const allInFwd = seven.every((g) => {
      const p = planet(chart, g);
      return !!p && inArc(p.longitudeSidereal, rLon, kLon);
    });
    const allInBwd = seven.every((g) => {
      const p = planet(chart, g);
      return !!p && inArc(p.longitudeSidereal, kLon, rLon);
    });
    present = allInFwd || allInBwd;
  }
  return {
    name: "Kaal Sarp Dosha",
    sanskrit: "कालसर्प दोष",
    isPresent: present,
    severity: present ? "severe" : "none",
    description: present
      ? "All 7 planets lie on one side of the Rahu–Ketu axis, forming Kaal Sarp Dosha. Life may involve delays and karmic obstacles that require conscious effort to overcome."
      : "Planets are distributed on both sides of the Rahu–Ketu axis — no Kaal Sarp Dosha.",
    remedyHint:
      "Nag Panchami puja; recitation of Maha Mrityunjaya mantra; visit to Kaal Sarp Dosha kshetras (Trimbakeshwar, Kalahasti).",
  };
}

// Sade Sati — Saturn transiting 12th, 1st or 2nd from natal Moon
function sadeSati(chart: KundliChart): DoshaResult {
  const moon = planet(chart, "Moon");
  const sat = planet(chart, "Saturn");
  let present = false;
  let phase = "";
  if (moon && sat) {
    const rel = (sat.rashiIndex - moon.rashiIndex + 12) % 12;
    if (rel === 11) {
      present = true;
      phase = "Rising phase (12th from Moon)";
    } else if (rel === 0) {
      present = true;
      phase = "Peak phase (over Moon)";
    } else if (rel === 1) {
      present = true;
      phase = "Setting phase (2nd from Moon)";
    }
  }
  return {
    name: "Sade Sati (Natal)",
    sanskrit: "साढ़े साती",
    isPresent: present,
    severity: present ? "moderate" : "none",
    description: present
      ? `Saturn is placed in the ${phase} relative to natal Moon at birth. Indicates a lifetime tendency toward Saturnian responsibility and delayed rewards.`
      : "Saturn is not in Sade Sati positions at birth.",
    remedyHint:
      "Shani mantra on Saturdays; charity of black sesame, mustard oil; service to elderly and needy.",
  };
}

// Kemadruma — Moon without any planet in 2nd or 12th from itself (excluding luminaries)
function kemadruma(chart: KundliChart): DoshaResult {
  const moon = planet(chart, "Moon");
  let present = false;
  if (moon) {
    const others: GrahaName[] = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const has2nd = others.some((g) => {
      const p = planet(chart, g);
      return !!p && p.house === (moon.house % 12) + 1;
    });
    const has12th = others.some((g) => {
      const p = planet(chart, g);
      return !!p && p.house === ((moon.house + 10) % 12) + 1;
    });
    const hasWith = others.some((g) => {
      const p = planet(chart, g);
      return !!p && p.house === moon.house;
    });
    present = !has2nd && !has12th && !hasWith;
  }
  return {
    name: "Kemadruma Dosha",
    sanskrit: "केमद्रुम दोष",
    isPresent: present,
    severity: present ? "moderate" : "none",
    description: present
      ? "Moon has no planetary support in the 2nd, 12th, or its own house. Can indicate emotional isolation and financial ups-and-downs early in life."
      : "Moon is well-supported — no Kemadruma Dosha.",
    remedyHint:
      "Chandra mantras on Mondays; offer milk and rice to a temple; wear pearl only after astrologer's consultation.",
  };
}

// Guru Chandal — Jupiter conjunct Rahu or Ketu
function guruChandal(chart: KundliChart): DoshaResult {
  const jup = planet(chart, "Jupiter");
  const rahu = planet(chart, "Rahu");
  const ketu = planet(chart, "Ketu");
  const present =
    !!jup && ((rahu && jup.house === rahu.house) || (ketu && jup.house === ketu.house));
  return {
    name: "Guru Chandal Dosha",
    sanskrit: "गुरु चांडाल दोष",
    isPresent: !!present,
    severity: present ? "moderate" : "none",
    description: present
      ? "Jupiter is conjunct with Rahu/Ketu. Wisdom can be swayed by unconventional influences; discretion and mentorship are important."
      : "Jupiter is free of Rahu/Ketu conjunction.",
    remedyHint:
      "Guru mantras on Thursdays; charity of yellow items (turmeric, chana dal); reverence for teachers.",
  };
}

export function detectDoshas(chart: KundliChart): DoshaResult[] {
  return [
    mangalDosha(chart),
    kaalSarp(chart),
    sadeSati(chart),
    kemadruma(chart),
    guruChandal(chart),
  ];
}
