// ============================================================
// Kundli — Life Analysis (Batch 3)
// ------------------------------------------------------------
// Deterministic, chart-derived summaries for the major life
// bhavas: Career, Wealth, Marriage, Health, Education, Family,
// Spirituality, Travel. Uses house occupants + dispositor +
// classical significators; NOT AI. Frames every point as an
// interpretive tendency (per platform guardrails).
// ============================================================

import type { KundliResult, PlanetChartPosition, GrahaName, Rashi } from "./types";
import { RASHIS } from "./types";

// Classical rashi lords (Vedic)
export const RASHI_LORD: Record<Rashi, GrahaName> = {
  Mesha: "Mars",
  Vrishabha: "Venus",
  Mithuna: "Mercury",
  Karka: "Moon",
  Simha: "Sun",
  Kanya: "Mercury",
  Tula: "Venus",
  Vrishchika: "Mars",
  Dhanu: "Jupiter",
  Makara: "Saturn",
  Kumbha: "Saturn",
  Meena: "Jupiter",
};

const NATURAL_BENEFICS: GrahaName[] = ["Jupiter", "Venus", "Moon", "Mercury"];
const NATURAL_MALEFICS: GrahaName[] = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

function isBenefic(g: GrahaName) {
  return NATURAL_BENEFICS.includes(g);
}
function isMalefic(g: GrahaName) {
  return NATURAL_MALEFICS.includes(g);
}

function planetsInHouse(k: KundliResult, house: number): PlanetChartPosition[] {
  return k.d1.planets.filter((p) => p.house === house);
}

function houseSign(k: KundliResult, house: number): Rashi {
  return RASHIS[(k.d1.ascendant.rashiIndex + (house - 1)) % 12];
}

function findPlanet(k: KundliResult, g: GrahaName): PlanetChartPosition | undefined {
  return k.d1.planets.find((p) => p.graha === g);
}

function houseLord(k: KundliResult, house: number): GrahaName {
  return RASHI_LORD[houseSign(k, house)];
}

// Human-readable dignity phrase.
function dignityPhrase(p: PlanetChartPosition): string {
  switch (p.dignity) {
    case "exalted":
      return "exalted (uccha)";
    case "moolatrikona":
      return "in Moolatrikona";
    case "own":
      return "in own sign";
    case "friend":
      return "in a friendly sign";
    case "neutral":
      return "in a neutral sign";
    case "enemy":
      return "in an inimical sign";
    case "debilitated":
      return "debilitated (neecha)";
  }
}

export interface LifeSection {
  key: string;
  title: string;
  house: number;
  headline: string;
  bullets: string[];
  guidance: string;
}

// Build a section for a given bhava with its own tone.
function buildSection(
  k: KundliResult,
  house: number,
  key: string,
  title: string,
  themeSignifiers: GrahaName[],
  hints: {
    strong: string;
    weak: string;
    benefic: string;
    malefic: string;
    guidance: string;
  },
): LifeSection {
  const sign = houseSign(k, house);
  const lord = houseLord(k, house);
  const lordPos = findPlanet(k, lord);
  const occupants = planetsInHouse(k, house);
  const bullets: string[] = [];

  bullets.push(
    `Bhava sign: **${sign}** · Lord: **${lord}**` +
      (lordPos
        ? ` sits in H${lordPos.house} (${lordPos.rashi}), ${dignityPhrase(lordPos)}${lordPos.retrograde ? ", retrograde" : ""}.`
        : "."),
  );

  if (occupants.length === 0) {
    bullets.push(
      `No planet occupies this bhava — themes are read primarily through the lord (${lord}) and classical significators.`,
    );
  } else {
    const line = occupants
      .map((p) => `${p.graha} (${dignityPhrase(p)}${p.retrograde ? ", R" : ""})`)
      .join(", ");
    bullets.push(`Occupants: ${line}.`);
  }

  // Lord dignity commentary
  if (lordPos) {
    if (["exalted", "moolatrikona", "own"].includes(lordPos.dignity)) {
      bullets.push(hints.strong);
    } else if (lordPos.dignity === "debilitated") {
      bullets.push(hints.weak);
    }
  }

  // Benefic / malefic influence
  const beneficOcc = occupants.filter((p) => isBenefic(p.graha));
  const maleficOcc = occupants.filter((p) => isMalefic(p.graha));
  if (beneficOcc.length)
    bullets.push(`${hints.benefic} (${beneficOcc.map((p) => p.graha).join(", ")}).`);
  if (maleficOcc.length)
    bullets.push(`${hints.malefic} (${maleficOcc.map((p) => p.graha).join(", ")}).`);

  // Significator notes
  for (const sig of themeSignifiers) {
    const s = findPlanet(k, sig);
    if (!s) continue;
    bullets.push(
      `Karaka **${sig}** is in ${s.rashi} (H${s.house}), ${dignityPhrase(s)}${s.retrograde ? ", retrograde" : ""} — ` +
        (["exalted", "moolatrikona", "own"].includes(s.dignity)
          ? "supports this life-area classically."
          : s.dignity === "debilitated"
            ? "suggests conscious effort in this area."
            : "adds a neutral flavor to this area."),
    );
  }

  const headline =
    lordPos && ["exalted", "moolatrikona", "own"].includes(lordPos.dignity)
      ? "Classically supportive placement — a natural area of focus."
      : lordPos && lordPos.dignity === "debilitated"
        ? "Classical texts suggest patience and deliberate cultivation here."
        : "A mixed picture — themes will unfold with self-awareness and effort.";

  return { key, title, house, headline, bullets, guidance: hints.guidance };
}

export function generateLifeAnalysis(k: KundliResult): LifeSection[] {
  return [
    buildSection(
      k,
      10,
      "career",
      "Career & Profession (Karma Bhava)",
      ["Sun", "Saturn", "Mercury"],
      {
        strong:
          "A well-dignified 10th lord classically points to steady professional identity and recognition through work.",
        weak: "A debilitated 10th lord invites patience — career growth often benefits from mentorship and long-view thinking.",
        benefic:
          "Benefic presence in the 10th softens work culture and can attract collaborative opportunities",
        malefic: "Malefic presence in the 10th can bring intensity or discipline-heavy demands",
        guidance:
          "Reflect on the field of work most aligned with your temperament, not merely status.",
      },
    ),
    buildSection(k, 2, "wealth", "Wealth & Finance (Dhana Bhava)", ["Jupiter", "Venus"], {
      strong:
        "A strong 2nd lord traditionally supports accumulation of resources and family assets.",
      weak: "A weak 2nd lord invites conscious budgeting and steady saving habits.",
      benefic: "Benefic influence here often correlates with ease around money",
      malefic:
        "Malefic influence can push you toward disciplined but sometimes tight financial cycles",
      guidance:
        "Wealth in Vedic thought is a stewardship, not a scoreboard — plan long-term flows.",
    }),
    buildSection(k, 7, "marriage", "Marriage & Partnership (Kalatra Bhava)", ["Venus", "Jupiter"], {
      strong: "A well-placed 7th lord supports harmonious partnership themes.",
      weak: "Classical texts suggest deliberate communication and later-in-life partnership can help balance a weak 7th lord.",
      benefic: "Benefics in the 7th traditionally soften relationship dynamics",
      malefic: "Malefics in the 7th can bring passion + friction — self-awareness is the antidote",
      guidance: "Partnership is a mirror — reflect on what qualities you consistently attract.",
    }),
    buildSection(k, 6, "health", "Health & Well-being (Roga Bhava)", ["Sun", "Mars"], {
      strong: "A strong 6th lord classically indicates resilience and recovery capacity.",
      weak: "Attention to routine, sleep, and stress-management is classically advised.",
      benefic: "Benefic presence in the 6th supports healing and preventive habits",
      malefic: "Malefic presence often correlates with high-intensity lifestyles requiring balance",
      guidance:
        "This is educational, not medical — always consult qualified healthcare professionals.",
    }),
    buildSection(k, 4, "education", "Education & Learning (Sukha Bhava)", ["Mercury", "Jupiter"], {
      strong: "A strong 4th lord supports formal learning and comfort in home-base study.",
      weak: "Consider structured environments and mentors to support the learning journey.",
      benefic: "Benefics in the 4th aid steady intellectual growth",
      malefic: "Malefics here can push you into unconventional or challenging learning paths",
      guidance: "Learning is lifelong — measure it by curiosity, not credentials alone.",
    }),
    buildSection(k, 4, "family", "Home & Family (Matri Bhava)", ["Moon", "Venus"], {
      strong: "Classical support for close family bonds and emotional grounding through home.",
      weak: "Invites conscious effort to build the family container you value.",
      benefic: "Benefic influence supports harmony under the family roof",
      malefic: "Malefic influence may bring lively but sometimes intense home dynamics",
      guidance: "Family patterns can be honored and consciously updated across generations.",
    }),
    buildSection(k, 9, "spirituality", "Dharma & Spirituality (Bhagya Bhava)", ["Jupiter", "Sun"], {
      strong:
        "A strong 9th lord classically supports guidance, teachers, and a sense of higher purpose.",
      weak: "Traditionally invites self-study (svadhyaya) and steady practice to build inner clarity.",
      benefic: "Benefic influence supports ease with philosophical or spiritual pursuits",
      malefic: "Malefic influence can indicate a self-forged path rather than an inherited one",
      guidance:
        "Dharma is context-sensitive — walk your own path with reverence for many traditions.",
    }),
    buildSection(k, 12, "travel", "Travel & Foreign Lands (Vyaya Bhava)", ["Rahu", "Saturn"], {
      strong:
        "A well-placed 12th lord supports conscious retreat, foreign connections, and inner practice.",
      weak: "Invites boundaries around expenses and rest cycles.",
      benefic: "Benefics in the 12th classically support spiritual or artistic retreat",
      malefic:
        "Malefics here can indicate a life shaped by movement, foreign travel, or expenditure — plan intentionally",
      guidance: "Rest and retreat are legitimate life-areas — not lost time.",
    }),
  ];
}
