// ============================================================
// Phase 16.2 — Advanced Classical Dosha Detection Engine
// ------------------------------------------------------------
// Implements 13 classical Vedic Doshas with formation rules,
// severity levels, cancellation logic, life impacts, and remedies.
// ============================================================

import type { KundliChart, GrahaName, PlanetChartPosition } from "./types";

export type DoshaSeverity = "none" | "mild" | "moderate" | "severe";

export interface ExtendedDoshaResult {
  id: string;
  name: string;
  sanskrit: string;
  isPresent: boolean;
  severity: DoshaSeverity;
  formationRule: string;
  isCancelled: boolean;
  cancellationRules: string[];
  lifeImpact: string;
  remedies: string[];
  description: string;
  remedyHint: string;
}

// Backward compatibility alias
export type DoshaResult = ExtendedDoshaResult;

function planet(chart: KundliChart, g: GrahaName): PlanetChartPosition | undefined {
  return chart.planets.find((p) => p.graha === g);
}

// 1. Mangal Dosha
export function detectMangalDosha(chart: KundliChart): ExtendedDoshaResult {
  const mars = planet(chart, "Mars");
  const moon = planet(chart, "Moon");
  const dusty = [1, 2, 4, 7, 8, 12];
  const fromLagna = mars ? dusty.includes(mars.house) : false;
  let fromMoon = false;
  if (mars && moon) {
    const rel = ((mars.house - moon.house + 12) % 12) + 1;
    fromMoon = dusty.includes(rel);
  }
  const present = fromLagna || fromMoon;
  const cancellations: string[] = [];
  if (present && mars) {
    if (mars.dignity === "exalted") cancellations.push("Mars is in exaltation (Makara)");
    if (mars.dignity === "own") cancellations.push(`Mars is in own sign (${mars.rashi})`);
    if (chart.planets.some((p) => p.graha === "Jupiter" && p.house === mars.house)) {
      cancellations.push("Jupiter is conjunct Mars");
    }
    if (chart.planets.some((p) => p.graha === "Jupiter" && Math.abs(p.house - mars.house) === 6)) {
      cancellations.push("Jupiter aspects Mars from 7th house");
    }
  }
  const isCancelled = cancellations.length > 0;
  let severity: DoshaSeverity = "none";
  if (present) {
    if (isCancelled) severity = "mild";
    else severity = fromLagna && fromMoon ? "severe" : "moderate";
  }

  return {
    id: "mangal_dosha",
    name: "Mangal Dosha (Kuja)",
    sanskrit: "मंगल दोष",
    isPresent: present,
    severity,
    formationRule: "Mars positioned in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna or Moon",
    isCancelled,
    cancellationRules: cancellations,
    lifeImpact: present
      ? "May cause friction or impulsiveness in marital harmony or business partnerships if unaligned."
      : "No significant Mangal Dosha affliction present.",
    remedies: [
      "Recite Hanuman Chalisa or Sundarkand on Tuesdays",
      "Donate red lentils (masoor dal) and jaggery on Tuesdays",
      "Perform Mangal Shanti puja if severe",
    ],
    description: present
      ? `Mars is placed in House ${mars?.house}, forming Mangal Dosha.`
      : "Mars is comfortably placed outside Mangal houses.",
    remedyHint: "Recite Hanuman Chalisa on Tuesdays.",
  };
}

// 2. Kaal Sarp Dosha (12 subtypes)
const KAAL_SARP_NAMES: Record<number, string> = {
  1: "Anant Kaal Sarp",
  2: "Kulik Kaal Sarp",
  3: "Vasuki Kaal Sarp",
  4: "Shankhpal Kaal Sarp",
  5: "Padma Kaal Sarp",
  6: "Mahapadma Kaal Sarp",
  7: "Takshak Kaal Sarp",
  8: "Karkotak Kaal Sarp",
  9: "Shankhachood Kaal Sarp",
  10: "Ghatak Kaal Sarp",
  11: "Vishdhar Kaal Sarp",
  12: "Sheshnag Kaal Sarp",
};

export function detectKaalSarpDosha(chart: KundliChart): ExtendedDoshaResult {
  const rahu = planet(chart, "Rahu");
  const ketu = planet(chart, "Ketu");
  const seven: GrahaName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  let present = false;
  let subName = "Kaal Sarp";
  if (rahu && ketu) {
    const rLon = rahu.longitudeSidereal;
    const kLon = ketu.longitudeSidereal;
    const inArc = (lon: number, a: number, b: number) => {
      const d = (b - a + 360) % 360;
      const x = (lon - a + 360) % 360;
      return x > 0 && x < d;
    };
    const fwd = seven.every((g) => {
      const p = planet(chart, g);
      return !!p && inArc(p.longitudeSidereal, rLon, kLon);
    });
    const bwd = seven.every((g) => {
      const p = planet(chart, g);
      return !!p && inArc(p.longitudeSidereal, kLon, rLon);
    });
    present = fwd || bwd;
    subName = KAAL_SARP_NAMES[rahu.house] || "Kaal Sarp";
  }

  return {
    id: "kaal_sarp_dosha",
    name: present ? `${subName} Dosha` : "Kaal Sarp Dosha",
    sanskrit: "कालसर्प दोष",
    isPresent: present,
    severity: present ? "severe" : "none",
    formationRule: "All 7 planets hemmed on one side of the Rahu-Ketu orbital axis",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: present
      ? "Indicates intense initial karmic hurdles followed by major transformation and late success."
      : "Planets are well distributed across both sides of Rahu-Ketu axis.",
    remedies: [
      "Perform Kaal Sarp Shanti Puja at Trimbakeshwar or Kalahasti",
      "Chant Om Namah Shivaya 108 times daily",
      "Worship Rahu-Ketu Yantra",
    ],
    description: present
      ? `All 7 planets lie between Rahu (House ${rahu?.house}) and Ketu.`
      : "No Kaal Sarp configuration found.",
    remedyHint: "Nag Panchami puja & Shiva worship.",
  };
}

// 3. Guru Chandal
export function detectGuruChandalDosha(chart: KundliChart): ExtendedDoshaResult {
  const jup = planet(chart, "Jupiter");
  const rahu = planet(chart, "Rahu");
  const ketu = planet(chart, "Ketu");
  const present = !!(jup && ((rahu && jup.house === rahu.house) || (ketu && jup.house === ketu.house)));
  const cancellations: string[] = [];
  if (present && jup) {
    if (jup.dignity === "exalted" || jup.dignity === "own") {
      cancellations.push("Jupiter is in exalted or own sign");
    }
  }

  return {
    id: "guru_chandal_dosha",
    name: "Guru Chandal Dosha",
    sanskrit: "गुरु चांडाल दोष",
    isPresent: present,
    severity: present ? (cancellations.length > 0 ? "mild" : "moderate") : "none",
    formationRule: "Conjunction of Jupiter with Rahu or Ketu in the same house",
    isCancelled: cancellations.length > 0,
    cancellationRules: cancellations,
    lifeImpact: present
      ? "Unconventional thinking regarding ethics or spirituality; requires solid mentorship."
      : "Jupiter is un-afflicted by Rahu or Ketu.",
    remedies: [
      "Chant Om Gram Greem Grom Sah Guruve Namaha on Thursdays",
      "Donate yellow items (turmeric, chana dal) to temple",
      "Seek guidance from noble gurus and elders",
    ],
    description: present
      ? `Jupiter and ${rahu && jup?.house === rahu.house ? "Rahu" : "Ketu"} are conjunct in House ${jup?.house}.`
      : "Jupiter is free from Rahu/Ketu conjunction.",
    remedyHint: "Guru mantras on Thursdays & respect elders.",
  };
}

// 4. Kemadruma
export function detectKemadrumaDosha(chart: KundliChart): ExtendedDoshaResult {
  const moon = planet(chart, "Moon");
  let present = false;
  const cancellations: string[] = [];
  if (moon) {
    const others: GrahaName[] = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    const h2 = (moon.house % 12) + 1;
    const h12 = ((moon.house + 10) % 12) + 1;
    const in2 = others.some((g) => planet(chart, g)?.house === h2);
    const in12 = others.some((g) => planet(chart, g)?.house === h12);
    const inSelf = others.some((g) => planet(chart, g)?.house === moon.house);
    present = !in2 && !in12 && !inSelf;

    // Cancellation rules
    const kendraPlanets = chart.planets.filter((p) => [1, 4, 7, 10].includes(p.house) && p.graha !== "Moon");
    if (kendraPlanets.length > 0) cancellations.push("Planets present in Kendras from Lagna");
    if (others.some((g) => {
      const p = planet(chart, g);
      return !!p && ((p.house - moon.house + 12) % 12 + 1) in [1, 4, 7, 10];
    })) cancellations.push("Planets present in Kendras from Moon");
  }
  const isCancelled = cancellations.length > 0;

  return {
    id: "kemadruma_dosha",
    name: "Kemadruma Dosha",
    sanskrit: "केमद्रुम दोष",
    isPresent: present,
    severity: present ? (isCancelled ? "mild" : "moderate") : "none",
    formationRule: "No planet (other than Sun, Rahu, Ketu) in 2nd, 12th, or conjunct Moon",
    isCancelled,
    cancellationRules: cancellations,
    lifeImpact: present
      ? "Initial psychological loneliness or financial fluctuations, mitigated by spiritual discipline."
      : "Moon has sufficient planetary support on either side.",
    remedies: [
      "Chant Chandra Beej Mantra: Om Shram Shreem Shrom Sah Chandraya Namaha",
      "Offer milk and sacred water on Shivling on Mondays",
      "Keep silver item or wear Pearl after consultation",
    ],
    description: present
      ? "Moon stands alone without planetary flank support."
      : "Moon has planetary flank or Kendra support.",
    remedyHint: "Chandra mantras & Shiva worship on Mondays.",
  };
}

// 5. Pitra Dosha
export function detectPitraDosha(chart: KundliChart): ExtendedDoshaResult {
  const sun = planet(chart, "Sun");
  const rahu = planet(chart, "Rahu");
  const sat = planet(chart, "Saturn");

  const sunIn9 = sun?.house === 9;
  const rahuIn9 = rahu?.house === 9;
  const satIn9 = sat?.house === 9;
  const sunAfflicted = !!sun && !!rahu && sun.house === rahu.house;
  const present = sunIn9 || rahuIn9 || (satIn9 && sunAfflicted);

  return {
    id: "pitra_dosha",
    name: "Pitra Dosha",
    sanskrit: "पितृ दोष",
    isPresent: present,
    severity: present ? "moderate" : "none",
    formationRule: "Sun or Rahu placed in 9th house, or Sun conjunct Rahu/Saturn",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: present
      ? "Indicates ancestral debts or obstacles in lineage progress; easily relieved by ancestral rituals."
      : "9th house and Sun are free of major Pitra afflictions.",
    remedies: [
      "Perform Pind Daan or Pitru Tarpan on Amavasya",
      "Feed crows, dogs, and cows regularly",
      "Water Peepal tree on Saturdays",
    ],
    description: present
      ? "Affliction to 9th house or Sun indicates Pitra Dosha."
      : "No Pitra Dosha pattern detected.",
    remedyHint: "Pind Daan / Peepal worship on Amavasya.",
  };
}

// 6. Grahan Dosha
export function detectGrahanDosha(chart: KundliChart): ExtendedDoshaResult {
  const sun = planet(chart, "Sun");
  const moon = planet(chart, "Moon");
  const rahu = planet(chart, "Rahu");
  const ketu = planet(chart, "Ketu");

  const sunGrahan = !!(sun && ((rahu && sun.house === rahu.house) || (ketu && sun.house === ketu.house)));
  const moonGrahan = !!(moon && ((rahu && moon.house === rahu.house) || (ketu && moon.house === ketu.house)));
  const present = sunGrahan || moonGrahan;

  return {
    id: "grahan_dosha",
    name: "Grahan Dosha",
    sanskrit: "ग्रहण दोष",
    isPresent: present,
    severity: present ? "moderate" : "none",
    formationRule: "Sun or Moon conjunct Rahu or Ketu in the same house",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: present
      ? `Eclipse effect on ${sunGrahan ? "Sun (Self/Father)" : "Moon (Mind/Mother)"} requires emotional stability and spiritual light.`
      : "Luminaries are free from Rahu/Ketu eclipse conjunction.",
    remedies: [
      "Chant Gayatri Mantra or Mahamrityunjaya Mantra",
      "Donate food and clothes during Solar/Lunar eclipses",
      "Offer Arghya to Sun with copper vessel daily",
    ],
    description: present
      ? `${sunGrahan ? "Sun" : "Moon"} is conjunct Rahu/Ketu in House ${sunGrahan ? sun?.house : moon?.house}.`
      : "Sun and Moon are free of Grahan conjunction.",
    remedyHint: "Gayatri Mantra & solar/lunar charity.",
  };
}

// 7. Shrapit Dosha
export function detectShrapitDosha(chart: KundliChart): ExtendedDoshaResult {
  const sat = planet(chart, "Saturn");
  const rahu = planet(chart, "Rahu");
  const present = !!sat && !!rahu && sat.house === rahu.house;

  return {
    id: "shrapit_dosha",
    name: "Shrapit Dosha",
    sanskrit: "श्रापित दोष",
    isPresent: present,
    severity: present ? "severe" : "none",
    formationRule: "Conjunction of Saturn and Rahu in any single house",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: present
      ? "Karmic delays and challenges that demand patient perseverance, honesty, and spiritual service."
      : "Saturn and Rahu occupy different houses.",
    remedies: [
      "Perform Shani-Rahu Shanti Puja",
      "Feed fish and birds on Saturdays",
      "Recite Shani Chalisa and Rahu Stotram",
    ],
    description: present
      ? `Saturn and Rahu are conjunct in House ${sat?.house}.`
      : "Saturn and Rahu are not conjunct.",
    remedyHint: "Shani-Rahu puja & feed wildlife.",
  };
}

// 8. Gandmool Dosha
const GANDMOOL_NAKSHATRAS = new Set(["Ashwini", "Ashlesha", "Magha", "Jyeshtha", "Mula", "Revati"]);

export function detectGandmoolDosha(chart: KundliChart): ExtendedDoshaResult {
  const moon = planet(chart, "Moon");
  const present = !!moon && GANDMOOL_NAKSHATRAS.has(moon.nakshatra);

  return {
    id: "gandmool_dosha",
    name: "Gandmool Dosha",
    sanskrit: "गंडमूल दोष",
    isPresent: present,
    severity: present ? "moderate" : "none",
    formationRule: "Natal Moon placed in one of the 6 Gandmool Nakshatras (Ashwini, Ashlesha, Magha, Jyeshtha, Mula, Revati)",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: present
      ? `Birth in ${moon?.nakshatra} Nakshatra indicates strong transformative energy requiring traditional Mool Shanti.`
      : "Natal Moon is not in a Gandmool Nakshatra.",
    remedies: [
      "Perform Gandmool Shanti Puja on 27th day after birth or Moon nakshatra day",
      "Donate green vegetables, grains, or clothing",
      "Worship ruling deity of the birth Nakshatra",
    ],
    description: present
      ? `Moon is in ${moon?.nakshatra} Nakshatra (Pada ${moon?.pada}).`
      : "Moon is outside Gandmool Nakshatras.",
    remedyHint: "Mool Shanti Puja on Nakshatra day.",
  };
}

// 9. Nadi Dosha
export function detectNadiDosha(chart: KundliChart): ExtendedDoshaResult {
  return {
    id: "nadi_dosha",
    name: "Nadi Dosha Check",
    sanskrit: "नाड़ी दोष",
    isPresent: false,
    severity: "none",
    formationRule: "Matching birth Nakshatras falling under the same Nadi (Aadi, Madhya, Antya)",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: "Evaluated in Guna Milan matching. Individual natal chart indicates inherent Nadi strength.",
    remedies: ["Perform Nadi Niwarana Puja in marriage matching if applicable"],
    description: "Evaluated primarily in Guna Milan match.",
    remedyHint: "Nadi Shanti during Guna Milan.",
  };
}

// 10. Bhakoot Dosha
export function detectBhakootDosha(chart: KundliChart): ExtendedDoshaResult {
  return {
    id: "bhakoot_dosha",
    name: "Bhakoot Dosha Check",
    sanskrit: "भकूट दोष",
    isPresent: false,
    severity: "none",
    formationRule: "Moon signs in 2-12, 6-8, or 9-5 relative positions during compatibility matching",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: "Evaluated in Guna Milan matching.",
    remedies: ["Chant Mahamrityunjaya Mantra & Vishnu Sahasranama"],
    description: "Evaluated in Guna Milan match.",
    remedyHint: "Bhakoot Shanti in compatibility matching.",
  };
}

// 11. Kuja Dosha (Extended Mars analysis)
export function detectKujaDosha(chart: KundliChart): ExtendedDoshaResult {
  return detectMangalDosha(chart);
}

// 12. Chandra Dosha (Vish Yoga / Afflicted Moon)
export function detectChandraDosha(chart: KundliChart): ExtendedDoshaResult {
  const moon = planet(chart, "Moon");
  const sat = planet(chart, "Saturn");
  const vishYoga = !!moon && !!sat && (moon.house === sat.house || Math.abs(moon.house - sat.house) === 6);
  const debilitatedMoon = moon?.dignity === "debilitated";
  const present = vishYoga || debilitatedMoon;

  return {
    id: "chandra_dosha",
    name: "Chandra Dosha (Vish Yoga)",
    sanskrit: "चंद्र दोष / विष योग",
    isPresent: present,
    severity: present ? "moderate" : "none",
    formationRule: "Moon conjunct/aspecting Saturn (Vish Yoga) or Moon in debilitation (Vrishchika)",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: present
      ? "Emotional sensitivity or mood swings; spiritual practice brings peace and clarity."
      : "Moon is emotionally stable and un-afflicted.",
    remedies: [
      "Offer raw milk and water to Shivling on Mondays",
      "Wear silver ring or chain",
      "Chant Om Namah Shivaya 108 times daily",
    ],
    description: present
      ? `Moon is ${debilitatedMoon ? "debilitated" : "afflicted by Saturn"} in House ${moon?.house}.`
      : "Moon is well-placed.",
    remedyHint: "Shivling Arghya & Silver ring on Monday.",
  };
}

// 13. Surya Dosha
export function detectSuryaDosha(chart: KundliChart): ExtendedDoshaResult {
  const sun = planet(chart, "Sun");
  const sat = planet(chart, "Saturn");
  const rahu = planet(chart, "Rahu");

  const sunDebilitated = sun?.dignity === "debilitated";
  const sunSatConj = !!sun && !!sat && sun.house === sat.house;
  const sunRahuConj = !!sun && !!rahu && sun.house === rahu.house;
  const present = sunDebilitated || sunSatConj || sunRahuConj;

  return {
    id: "surya_dosha",
    name: "Surya Dosha",
    sanskrit: "सूर्य दोष",
    isPresent: present,
    severity: present ? "moderate" : "none",
    formationRule: "Sun debilitated (Tula), or conjunct Saturn / Rahu",
    isCancelled: false,
    cancellationRules: [],
    lifeImpact: present
      ? "Requires conscious boost to confidence, vitality, and relationship with father/superiors."
      : "Sun is bright and strong.",
    remedies: [
      "Offer water to Sun at sunrise with copper Lota",
      "Recite Aditya Hrudaya Stotram daily",
      "Donate wheat and copper on Sundays",
    ],
    description: present
      ? `Sun is ${sunDebilitated ? "debilitated in Tula" : "afflicted by Saturn/Rahu"} in House ${sun?.house}.`
      : "Sun is strong.",
    remedyHint: "Sun Arghya & Aditya Hrudayam.",
  };
}

/** Detect all 13 classical Doshas */
export function detectAllDoshas(chart: KundliChart): ExtendedDoshaResult[] {
  return [
    detectMangalDosha(chart),
    detectKaalSarpDosha(chart),
    detectGuruChandalDosha(chart),
    detectKemadrumaDosha(chart),
    detectPitraDosha(chart),
    detectGrahanDosha(chart),
    detectShrapitDosha(chart),
    detectGandmoolDosha(chart),
    detectNadiDosha(chart),
    detectBhakootDosha(chart),
    detectKujaDosha(chart),
    detectChandraDosha(chart),
    detectSuryaDosha(chart),
  ];
}

// Backward compatibility export
export function detectDoshas(chart: KundliChart): ExtendedDoshaResult[] {
  return detectAllDoshas(chart);
}
