// ============================================================
// Kundli / remedies
// ------------------------------------------------------------
// Suggests planet-wise remedies based on weak/afflicted planets
// and detected Doshas. Non-prescriptive — traditional guidance.
// ============================================================
import type { KundliChart, GrahaName } from "./types";
import type { DoshaResult } from "./doshas";

export interface Remedy {
  planet?: GrahaName;
  category: "Mantra" | "Gemstone" | "Charity (Daan)" | "Vrat/Fast" | "Ritual";
  title: string;
  detail: string;
}

const PLANET_REMEDIES: Record<GrahaName, Remedy[]> = {
  Sun: [
    {
      planet: "Sun",
      category: "Mantra",
      title: "Aditya Hridaya Stotra",
      detail: "Recite at sunrise facing east.",
    },
    {
      planet: "Sun",
      category: "Gemstone",
      title: "Ruby (Manikya)",
      detail: "Set in gold, ring finger, Sunday morning — after astrologer's advice.",
    },
    {
      planet: "Sun",
      category: "Charity (Daan)",
      title: "Wheat, jaggery, copper",
      detail: "Donate on Sundays.",
    },
  ],
  Moon: [
    {
      planet: "Moon",
      category: "Mantra",
      title: "Om Chandraya Namah (108×)",
      detail: "Recite on Monday evenings.",
    },
    {
      planet: "Moon",
      category: "Gemstone",
      title: "Pearl (Moti)",
      detail: "Set in silver, little finger, Monday morning.",
    },
    {
      planet: "Moon",
      category: "Charity (Daan)",
      title: "Milk, rice, white cloth",
      detail: "Donate on Mondays.",
    },
  ],
  Mars: [
    {
      planet: "Mars",
      category: "Mantra",
      title: "Hanuman Chalisa",
      detail: "Recite Tuesdays and Saturdays.",
    },
    {
      planet: "Mars",
      category: "Gemstone",
      title: "Red Coral (Moonga)",
      detail: "Set in copper/gold, ring finger, Tuesday morning.",
    },
    {
      planet: "Mars",
      category: "Charity (Daan)",
      title: "Red lentils, jaggery",
      detail: "Donate on Tuesdays.",
    },
  ],
  Mercury: [
    {
      planet: "Mercury",
      category: "Mantra",
      title: "Vishnu Sahasranama",
      detail: "Recite Wednesdays.",
    },
    {
      planet: "Mercury",
      category: "Gemstone",
      title: "Emerald (Panna)",
      detail: "Set in gold, little finger, Wednesday morning.",
    },
    {
      planet: "Mercury",
      category: "Charity (Daan)",
      title: "Green moong, green cloth",
      detail: "Donate on Wednesdays.",
    },
  ],
  Jupiter: [
    {
      planet: "Jupiter",
      category: "Mantra",
      title: "Om Gurave Namah / Brihaspati Stotra",
      detail: "Recite Thursdays.",
    },
    {
      planet: "Jupiter",
      category: "Gemstone",
      title: "Yellow Sapphire (Pukhraj)",
      detail: "Set in gold, index finger, Thursday morning.",
    },
    {
      planet: "Jupiter",
      category: "Charity (Daan)",
      title: "Turmeric, chana dal, yellow cloth",
      detail: "Donate on Thursdays.",
    },
  ],
  Venus: [
    { planet: "Venus", category: "Mantra", title: "Shri Suktam", detail: "Recite Fridays." },
    {
      planet: "Venus",
      category: "Gemstone",
      title: "Diamond / White Sapphire",
      detail: "Set in platinum/silver, middle finger, Friday morning.",
    },
    {
      planet: "Venus",
      category: "Charity (Daan)",
      title: "White cloth, sugar, curd",
      detail: "Donate on Fridays.",
    },
  ],
  Saturn: [
    {
      planet: "Saturn",
      category: "Mantra",
      title: "Shani Chalisa / Maha Mrityunjaya Mantra",
      detail: "Recite Saturdays.",
    },
    {
      planet: "Saturn",
      category: "Gemstone",
      title: "Blue Sapphire (Neelam)",
      detail: "Only after trial — set in silver, middle finger, Saturday evening.",
    },
    {
      planet: "Saturn",
      category: "Charity (Daan)",
      title: "Black sesame, mustard oil, iron",
      detail: "Donate on Saturdays; feed crows.",
    },
  ],
  Rahu: [
    {
      planet: "Rahu",
      category: "Mantra",
      title: "Om Bhram Bhreem Bhroum Sah Rahave Namah",
      detail: "18,000 japa cycle.",
    },
    {
      planet: "Rahu",
      category: "Charity (Daan)",
      title: "Black gram, blanket, mustard oil",
      detail: "Donate on Saturdays.",
    },
  ],
  Ketu: [
    {
      planet: "Ketu",
      category: "Mantra",
      title: "Om Sraam Sreem Sroum Sah Ketave Namah",
      detail: "17,000 japa cycle.",
    },
    {
      planet: "Ketu",
      category: "Charity (Daan)",
      title: "Sesame seeds, brown blanket",
      detail: "Donate on Tuesdays.",
    },
  ],
};

/**
 * Produce a curated list of remedies:
 * - Every debilitated/enemy-sign planet contributes its remedies.
 * - Every present Dosha contributes 1-2 ritual/mantra remedies.
 */
export function suggestRemedies(chart: KundliChart, doshas: DoshaResult[]): Remedy[] {
  const out: Remedy[] = [];
  const seen = new Set<string>();
  const push = (r: Remedy) => {
    const key = `${r.planet ?? "-"}::${r.title}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  };

  // Weak planets
  chart.planets.forEach((p) => {
    if (p.dignity === "debilitated" || p.dignity === "enemy") {
      PLANET_REMEDIES[p.graha].forEach(push);
    }
  });

  // Dosha-specific remedies
  doshas
    .filter((d) => d.isPresent)
    .forEach((d) => {
      push({
        category: "Ritual",
        title: `${d.name} — traditional remedy`,
        detail: d.remedyHint,
      });
    });

  // Always include a universal Mahamrityunjaya recommendation
  push({
    category: "Mantra",
    title: "Maha Mrityunjaya Mantra",
    detail: "Om Tryambakam Yajamahe... — 108 repetitions daily for overall protection and health.",
  });

  return out;
}
