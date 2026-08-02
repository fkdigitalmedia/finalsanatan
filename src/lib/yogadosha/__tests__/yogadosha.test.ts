// ============================================================
// Dosha & Yoga Detection Engine — tests (Phase 13.4)
// Run: `bunx vitest run src/lib/yogadosha`
// ============================================================
import { describe, it, expect } from "vitest";
import {
  DEFAULT_RULES,
  RuleRegistry,
  buildChartContext,
  createYogaDoshaEngine,
  detectYogasAndDoshas,
  validateRuleOutcome,
  validateYogaDoshaInput,
} from "..";
import { generateKundli } from "@/lib/kundli";
import type { BirthInput } from "@/lib/kundli/types";
import type { YogaDoshaInput, YogaDoshaRule } from "../types";

const BIRTH: BirthInput = {
  date: "1990-06-15",
  time: "10:30",
  place: "Mumbai, India",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: "Asia/Kolkata",
};
const INPUT: YogaDoshaInput = { birth: BIRTH };

const CHARTS: BirthInput[] = [
  BIRTH,
  {
    date: "1975-11-02",
    time: "04:15",
    place: "Varanasi, India",
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: "Asia/Kolkata",
  },
  {
    date: "2001-03-21",
    time: "23:45",
    place: "Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
  },
  {
    date: "1968-09-09",
    time: "06:05",
    place: "Chennai, India",
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: "Asia/Kolkata",
  },
  {
    date: "1995-12-31",
    time: "12:00",
    place: "London, UK",
    latitude: 51.5072,
    longitude: -0.1276,
    timezone: "Europe/London",
  },
];

const EXPECTED_IDS = [
  "mangal-dosha",
  "kaal-sarp-yoga",
  "pitra-dosha",
  "guru-chandal-yoga",
  "gaj-kesari-yoga",
  "raj-yoga",
  "neech-bhang-raj-yoga",
  "vipreet-raj-yoga",
  "budhaditya-yoga",
  "chandra-mangal-yoga",
  "parivartan-yoga",
  "adhi-yoga",
  "lakshmi-yoga",
  "vasumati-yoga",
];

type Err = { field: string; message: string };

describe("yogadosha/validators", () => {
  it("accepts a valid input", () => {
    expect(validateYogaDoshaInput(INPUT, EXPECTED_IDS).ok).toBe(true);
  });
  it("rejects a missing birth object", () => {
    const r = validateYogaDoshaInput({} as unknown as YogaDoshaInput);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "birth")).toBe(true);
  });
  it("rejects an out-of-range latitude", () => {
    expect(validateYogaDoshaInput({ birth: { ...BIRTH, latitude: 120 } }).ok).toBe(false);
  });
  it("rejects an unknown rule id", () => {
    const r = validateYogaDoshaInput({ ...INPUT, rules: ["not-a-rule"] }, EXPECTED_IDS);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "rules")).toBe(true);
  });
  it("throws on generate() with invalid input", () => {
    expect(() => detectYogasAndDoshas({ birth: { ...BIRTH, time: "25:99" } })).toThrow();
  });
  it("flags a malformed rule outcome", () => {
    const r = validateRuleOutcome("x", {
      detected: "yes",
      confidence: 500,
      ruleApplied: "",
      planetCombination: null,
      affectedHouses: [42],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThan(3);
  });
});

describe("yogadosha/registry", () => {
  it("ships all 14 required rules", () => {
    const ids = new RuleRegistry().ids();
    expect(ids.length).toBe(14);
    for (const id of EXPECTED_IDS) expect(ids).toContain(id);
  });

  it("declares complete rule metadata", () => {
    for (const rule of DEFAULT_RULES) {
      expect(rule.id).toBeTruthy();
      expect(rule.name).toBeTruthy();
      expect(rule.description.length).toBeGreaterThan(20);
      expect(["dosha", "yoga"]).toContain(rule.kind);
      expect(typeof rule.evaluate).toBe("function");
    }
  });

  it("supports registering a custom rule without touching the engine", () => {
    const registry = new RuleRegistry();
    const custom: YogaDoshaRule = {
      id: "test-custom-yoga",
      name: "Test Custom Yoga",
      kind: "yoga",
      category: "Other",
      description: "Detects the Sun placed in an odd-numbered house — test-only rule.",
      evaluate: (ctx) => {
        const sun = ctx.planet("Sun")!;
        return {
          detected: sun.house % 2 === 1,
          confidence: sun.house % 2 === 1 ? 100 : 0,
          ruleApplied: `Sun in house ${sun.house}`,
          planetCombination: ["Sun"],
          affectedHouses: [sun.house],
        };
      },
    };
    registry.register(custom);
    const out = createYogaDoshaEngine({ registry }).generate(INPUT);
    expect(registry.ids()).toContain("test-custom-yoga");
    expect(out.detections.some((d) => d.id === "test-custom-yoga")).toBe(true);
    expect(registry.unregister("test-custom-yoga")).toBe(true);
  });

  it("rejects a rule without an evaluate()", () => {
    expect(() => new RuleRegistry().register({ id: "bad" } as unknown as YogaDoshaRule)).toThrow();
  });
});

describe("yogadosha/context", () => {
  const ctx = buildChartContext(generateKundli(BIRTH).d1);

  it("derives lords consistently with whole-sign houses", () => {
    for (let h = 1; h <= 12; h++) {
      expect(ctx.rashiOfHouse(h)).toBe((ctx.lagnaRashiIndex + h - 1) % 12);
      expect(ctx.lordOfHouse(h)).toBe(ctx.lordOfRashi(ctx.rashiOfHouse(h)));
    }
  });

  it("computes the universal 7th aspect", () => {
    const sunHouse = ctx.houseOf("Sun")!;
    const opposite = ((sunHouse + 5) % 12) + 1;
    expect(ctx.aspectsHouse("Sun", opposite)).toBe(true);
  });

  it("treats conjunction as a connection", () => {
    const moonHouse = ctx.houseOf("Moon")!;
    const together = ctx.planetsInHouse(moonHouse).map((p) => p.graha);
    for (const g of together) expect(ctx.areConnected("Moon", g)).toBe(true);
  });

  it("returns a symmetric separation in [0, 180]", () => {
    const s = ctx.separation("Sun", "Moon")!;
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(180);
    expect(ctx.separation("Moon", "Sun")).toBeCloseTo(s, 6);
  });
});

describe("yogadosha/engine", () => {
  const out = detectYogasAndDoshas(INPUT);

  it("emits the expected top-level keys", () => {
    for (const k of ["profile", "doshas", "yogas", "detections", "summary", "metadata"] as const) {
      expect(out).toHaveProperty(k);
    }
  });

  it("evaluates every registered rule", () => {
    expect(out.detections.length).toBe(14);
    expect(out.metadata.ruleCount).toBe(14);
    expect(out.doshas.length + out.yogas.length).toBe(out.detections.length);
  });

  it("returns the required fields on every detection record", () => {
    for (const d of out.detections) {
      expect(typeof d.detected).toBe("boolean");
      expect(d.confidence).toBeGreaterThanOrEqual(0);
      expect(d.confidence).toBeLessThanOrEqual(100);
      expect(typeof d.ruleApplied).toBe("string");
      expect(d.ruleApplied.length).toBeGreaterThan(0);
      expect(Array.isArray(d.planetCombination)).toBe(true);
      expect(Array.isArray(d.affectedHouses)).toBe(true);
      for (const h of d.affectedHouses) {
        expect(h).toBeGreaterThanOrEqual(1);
        expect(h).toBeLessThanOrEqual(12);
      }
      expect(["none", "mild", "moderate", "strong"]).toContain(d.strength);
    }
  });

  it("never marks an undetected rule with a strength", () => {
    for (const d of out.detections.filter((x) => !x.detected)) {
      expect(d.strength).toBe("none");
      // Undetected rules may still report partial evidence, but never full confidence.
      expect(d.confidence).toBeLessThan(60);
    }
  });

  it("keeps the summary consistent with the detections", () => {
    const detected = out.detections.filter((d) => d.detected);
    expect(out.summary.detectedCount).toBe(detected.length);
    expect(out.summary.doshaCount).toBe(detected.filter((d) => d.kind === "dosha").length);
    expect(out.summary.yogaCount).toBe(detected.filter((d) => d.kind === "yoga").length);
    expect(out.summary.detectedIds.sort()).toEqual(detected.map((d) => d.id).sort());
    expect(out.summary.balanceScore).toBeGreaterThanOrEqual(0);
    expect(out.summary.balanceScore).toBeLessThanOrEqual(100);
  });

  it("honours the rules filter and includeUndetected flag", () => {
    const filtered = detectYogasAndDoshas({
      ...INPUT,
      rules: ["mangal-dosha", "raj-yoga"],
    });
    expect(filtered.detections.length).toBe(2);
    const onlyDetected = detectYogasAndDoshas({ ...INPUT, includeUndetected: false });
    expect(onlyDetected.detections.every((d) => d.detected)).toBe(true);
  });

  it("agrees with the chart on Mangal Dosha placement", () => {
    const ctx = buildChartContext(generateKundli(BIRTH).d1);
    const mars = ctx.planet("Mars")!;
    const rec = out.detections.find((d) => d.id === "mangal-dosha")!;
    const fromLagna = [1, 2, 4, 7, 8, 12].includes(mars.house);
    const fromMoon = [1, 2, 4, 7, 8, 12].includes(ctx.houseFromMoon("Mars")!);
    const venus = ctx.planet("Venus")!;
    const fromVenus = [1, 2, 4, 7, 8, 12].includes(ctx.houseFrom(venus.house, mars.house));
    expect(rec.detected).toBe(fromLagna || fromMoon || fromVenus);
  });

  it("agrees with the chart on Budhaditya and Gaj Kesari", () => {
    const ctx = buildChartContext(generateKundli(BIRTH).d1);
    const bud = out.detections.find((d) => d.id === "budhaditya-yoga")!;
    expect(bud.detected).toBe(ctx.houseOf("Sun") === ctx.houseOf("Mercury"));
    const gk = out.detections.find((d) => d.id === "gaj-kesari-yoga")!;
    expect(gk.detected).toBe([1, 4, 7, 10].includes(ctx.houseFromMoon("Jupiter")!));
  });

  it("keeps parivartan exchanges symmetric when detected", () => {
    const p = out.detections.find((d) => d.id === "parivartan-yoga")!;
    const exchanges = (p.details.exchanges ?? []) as Array<{ houseA: number; houseB: number }>;
    expect(p.detected).toBe(exchanges.length > 0);
    for (const e of exchanges) expect(e.houseA).not.toBe(e.houseB);
  });

  it("runs cleanly across several different charts", () => {
    for (const birth of CHARTS) {
      const res = detectYogasAndDoshas({ birth });
      expect(res.detections.length).toBe(14);
      for (const d of res.detections) {
        expect(Number.isFinite(d.confidence)).toBe(true);
        expect(d.detected === false || d.confidence > 0).toBe(true);
      }
      expect(res.summary.totalRulesEvaluated).toBe(14);
    }
  });

  it("serialises to JSON without NaN or cycles", () => {
    const json = JSON.stringify(out);
    expect(json).not.toContain("NaN");
    expect(JSON.parse(json).summary.detectedCount).toBe(out.summary.detectedCount);
  });

  it("caches repeated calls on the same engine instance", () => {
    const engine = createYogaDoshaEngine();
    const a = engine.generate(INPUT);
    const b = engine.generate(INPUT);
    expect(b).toBe(a);
    expect(engine.ruleIds().length).toBe(14);
  });

  it("isolates a throwing rule instead of crashing the run", () => {
    const registry = new RuleRegistry();
    registry.register({
      id: "exploding-rule",
      name: "Exploding Rule",
      kind: "yoga",
      category: "Other",
      description: "Always throws — verifies engine-level rule isolation.",
      evaluate: () => {
        throw new Error("boom");
      },
    });
    const res = createYogaDoshaEngine({ registry }).generate(INPUT);
    const rec = res.detections.find((d) => d.id === "exploding-rule")!;
    expect(rec.detected).toBe(false);
    expect(rec.ruleApplied).toContain("boom");
    expect(res.detections.length).toBe(15);
  });
});
