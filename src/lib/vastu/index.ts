// ============================================================
// Vastu Engine — deterministic directional analysis
// ------------------------------------------------------------
// Pure, JSON-only rule engine. No AI, no I/O. Consumed by the
// API layer and the AI interpretation layer.
// ============================================================

export type Direction =
  | "north"
  | "north-east"
  | "east"
  | "south-east"
  | "south"
  | "south-west"
  | "west"
  | "north-west"
  | "center";

export const DIRECTIONS: Direction[] = [
  "north",
  "north-east",
  "east",
  "south-east",
  "south",
  "south-west",
  "west",
  "north-west",
  "center",
];

export type RoomKind =
  | "main-entrance"
  | "kitchen"
  | "master-bedroom"
  | "bedroom"
  | "pooja-room"
  | "bathroom"
  | "toilet"
  | "living-room"
  | "study"
  | "staircase"
  | "water-tank"
  | "septic-tank"
  | "storage";

export interface VastuInput {
  /** Facing direction of the plot / main door. */
  facing: Direction;
  /** Room placements: room kind -> direction. */
  rooms?: Partial<Record<RoomKind, Direction>>;
  propertyType?: "home" | "office" | "shop" | "factory";
  language?: string;
}

export interface VastuFinding {
  room: RoomKind | "facing";
  direction: Direction;
  verdict: "ideal" | "acceptable" | "defect";
  score: number; // 0..100
  rule: string;
  remedy?: string;
}

export interface VastuOutput {
  engineVersion: string;
  computedAt: string;
  input: VastuInput;
  score: number; // 0..100 overall
  grade: "excellent" | "good" | "average" | "needs-correction";
  findings: VastuFinding[];
  defects: VastuFinding[];
  remedies: string[];
  metadata: { rulesEvaluated: number; language: string };
}

export const VASTU_ENGINE_VERSION = "1.0.0";

/** ideal / acceptable placements per room, from classical Vastu Shastra. */
const RULES: Record<
  RoomKind,
  { ideal: Direction[]; ok: Direction[]; remedy: string; text: string }
> = {
  "main-entrance": {
    ideal: ["north", "north-east", "east"],
    ok: ["west", "north-west"],
    remedy: "Keep the entrance well-lit and clutter-free; add a brass threshold and Ganesha motif.",
    text: "Main entrance is best in the north, north-east or east to invite prana and morning light.",
  },
  kitchen: {
    ideal: ["south-east"],
    ok: ["north-west"],
    remedy:
      "Place the cooking platform so the cook faces east; keep a red or orange accent in the south-east.",
    text: "Agni governs the south-east, making it the classical kitchen zone.",
  },
  "master-bedroom": {
    ideal: ["south-west"],
    ok: ["south", "west"],
    remedy: "Sleep with the head to the south; use heavy earthen tones in the south-west.",
    text: "The south-west holds the heaviest earth energy, ideal for the head of the family.",
  },
  bedroom: {
    ideal: ["south", "west", "south-west"],
    ok: ["north-west"],
    remedy: "Avoid mirrors facing the bed; keep the north-east of the room open.",
    text: "Bedrooms rest best in the southern and western quadrants.",
  },
  "pooja-room": {
    ideal: ["north-east"],
    ok: ["north", "east"],
    remedy: "Shift the altar to the north-east corner of the room and face the deity west or east.",
    text: "Ishan (north-east) is the most sattvic zone and belongs to worship.",
  },
  bathroom: {
    ideal: ["north-west", "west"],
    ok: ["north"],
    remedy: "Keep the door closed, use sea salt in a bowl and maintain strong ventilation.",
    text: "Bathrooms belong to the north-west or west, away from the sacred north-east.",
  },
  toilet: {
    ideal: ["north-west", "west", "south"],
    ok: [],
    remedy: "Place a sea-salt bowl, keep the lid closed and add a copper strip on the threshold.",
    text: "Toilets must never occupy the north-east or the brahmasthan (centre).",
  },
  "living-room": {
    ideal: ["north", "east", "north-east"],
    ok: ["north-west"],
    remedy: "Keep the north-east of the living area light and uncluttered.",
    text: "Living and guest areas thrive in the north and east.",
  },
  study: {
    ideal: ["north-east", "east", "north"],
    ok: ["west"],
    remedy: "Face east or north while studying; keep the desk away from a beam overhead.",
    text: "Study zones favour the north-east and east for clarity of thought.",
  },
  staircase: {
    ideal: ["south", "south-west", "west"],
    ok: ["south-east"],
    remedy: "Keep an odd number of steps and light the staircase well.",
    text: "Staircases belong to the heavier south and west sectors.",
  },
  "water-tank": {
    ideal: ["north-east", "north"],
    ok: ["east"],
    remedy:
      "Underground water storage should shift towards the north-east; keep it covered and clean.",
    text: "Underground water is auspicious in the north-east.",
  },
  "septic-tank": {
    ideal: ["north-west", "west"],
    ok: ["south"],
    remedy: "Where relocation is impossible, plant heavy greenery and keep the area sealed.",
    text: "Septic tanks must avoid the north-east, south-west and the centre.",
  },
  storage: {
    ideal: ["south-west", "west", "south"],
    ok: ["north-west"],
    remedy: "Keep heavy storage in the south-west; never block the north-east.",
    text: "Heavy storage stabilises the south-west.",
  },
};

const FACING_SCORE: Record<Direction, number> = {
  north: 95,
  "north-east": 92,
  east: 95,
  "south-east": 70,
  south: 65,
  "south-west": 55,
  west: 75,
  "north-west": 72,
  center: 60,
};

function grade(score: number): VastuOutput["grade"] {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "average";
  return "needs-correction";
}

export function analyzeVastu(input: VastuInput): VastuOutput {
  if (!DIRECTIONS.includes(input.facing)) {
    throw new Error(`Invalid facing direction: ${String(input.facing)}`);
  }

  const findings: VastuFinding[] = [
    {
      room: "facing",
      direction: input.facing,
      verdict:
        FACING_SCORE[input.facing] >= 85
          ? "ideal"
          : FACING_SCORE[input.facing] >= 70
            ? "acceptable"
            : "defect",
      score: FACING_SCORE[input.facing],
      rule: `A ${input.facing}-facing property carries ${FACING_SCORE[input.facing] >= 85 ? "highly favourable" : "mixed"} directional energy.`,
      remedy:
        FACING_SCORE[input.facing] < 70
          ? "Strengthen the entrance with light, a clean threshold and a Vastu yantra above the door."
          : undefined,
    },
  ];

  for (const [room, direction] of Object.entries(input.rooms ?? {}) as [RoomKind, Direction][]) {
    const rule = RULES[room];
    if (!rule || !DIRECTIONS.includes(direction)) continue;
    const ideal = rule.ideal.includes(direction);
    const ok = rule.ok.includes(direction);
    const isBrahmasthan =
      direction === "center" && ["toilet", "kitchen", "staircase", "septic-tank"].includes(room);
    findings.push({
      room,
      direction,
      verdict: ideal ? "ideal" : ok && !isBrahmasthan ? "acceptable" : "defect",
      score: ideal ? 100 : ok && !isBrahmasthan ? 72 : isBrahmasthan ? 25 : 40,
      rule: rule.text,
      remedy: ideal ? undefined : rule.remedy,
    });
  }

  const score = Math.round(findings.reduce((s, f) => s + f.score, 0) / findings.length);
  const defects = findings.filter((f) => f.verdict === "defect");

  return {
    engineVersion: VASTU_ENGINE_VERSION,
    computedAt: new Date().toISOString(),
    input,
    score,
    grade: grade(score),
    findings,
    defects,
    remedies: [...new Set(defects.map((d) => d.remedy).filter(Boolean) as string[])],
    metadata: { rulesEvaluated: findings.length, language: input.language ?? "en" },
  };
}
