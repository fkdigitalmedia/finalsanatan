import { describe, expect, it, beforeEach } from "vitest";
import {
  AiInterpretationEngine,
  DEFAULT_PROMPTS,
  InterpretationCache,
  REPORT_DEPTHS,
  REPORT_KINDS,
  SUPPORTED_LANGUAGES,
  buildCacheKey,
  clearPromptOverrides,
  extractSections,
  featureKeyFor,
  formatReport,
  getPrompt,
  listPrompts,
  normalizeMarkdown,
  registerPrompt,
  resolvePrompt,
  resetProviderAdapters,
  setFallbackAdapters,
  setProviderAdapter,
  stableStringify,
  validateInput,
  validateProviderOutput,
} from "../index";
import type { AiProviderAdapter, InterpretationInput } from "../index";

const KUNDLI_JSON = {
  lagna: { rashi: "Mesha", degree: 12.4 },
  moon: { rashi: "Karka", nakshatra: "Pushya" },
  planets: [
    { name: "Sun", house: 10, rashi: "Makara", retrograde: false },
    { name: "Mars", house: 7, rashi: "Tula", retrograde: false },
  ],
};

function stubAdapter(id: string, text: string, calls: string[] = []): AiProviderAdapter {
  return {
    id,
    async complete(req) {
      calls.push(`${id}:${req.featureKey}`);
      return { text, provider: `${id}-provider`, model: "test-model" };
    },
  };
}

const MARKDOWN = `# Kundli Summary

## Chart Snapshot
Lagna is Mesha at 12.4 degrees.

## Personality and Strengths
Mars in the 7th house traditionally indicates a spirited partnership style.`;

const input = (over: Partial<InterpretationInput> = {}): InterpretationInput => ({
  report: "kundli-summary",
  data: KUNDLI_JSON,
  ...over,
});

beforeEach(() => {
  resetProviderAdapters();
  clearPromptOverrides();
});

describe("ai/validators", () => {
  it("accepts a well-formed request", () => {
    expect(validateInput(input()).valid).toBe(true);
  });

  it("rejects unknown reports, depths and languages", () => {
    expect(validateInput(input({ report: "tarot" as never })).valid).toBe(false);
    expect(validateInput(input({ depth: "epic" as never })).valid).toBe(false);
    expect(validateInput(input({ language: "fr" as never })).valid).toBe(false);
  });

  it("rejects empty, non-object and non-JSON-safe engine data", () => {
    expect(validateInput(input({ data: {} })).valid).toBe(false);
    expect(validateInput(input({ data: [] as never })).valid).toBe(false);
    expect(validateInput(input({ data: { x: NaN } })).valid).toBe(false);
    const cyclic: Record<string, unknown> = { a: 1 };
    cyclic.self = cyclic;
    expect(validateInput(input({ data: cyclic })).valid).toBe(false);
  });

  it("rejects out-of-range confidence", () => {
    expect(validateInput(input({ confidence: 140 })).valid).toBe(false);
  });

  it("flags empty provider output", () => {
    expect(validateProviderOutput("").valid).toBe(false);
    expect(validateProviderOutput(MARKDOWN).valid).toBe(true);
  });
});

describe("ai/prompts", () => {
  it("ships a template for every supported report", () => {
    expect(Object.keys(DEFAULT_PROMPTS).sort()).toEqual([...REPORT_KINDS].sort());
    expect(listPrompts()).toHaveLength(REPORT_KINDS.length);
  });

  it("namespaces feature keys for admin provider mapping", () => {
    expect(featureKeyFor("daily-horoscope")).toBe("interpretation.daily-horoscope");
  });

  it("embeds the engine JSON, language and section list in the prompt", () => {
    const resolved = resolvePrompt({
      report: "kundli-summary",
      depth: "detailed",
      language: "mr",
      data: KUNDLI_JSON,
    });
    expect(resolved.prompt).toContain("Pushya");
    expect(resolved.prompt).toContain("Marathi");
    expect(resolved.prompt).toContain("## Chart Snapshot");
    expect(resolved.featureKey).toBe("interpretation.kundli-summary");
    expect(resolved.maxTokens).toBeGreaterThan(0);
  });

  it("carries safety rules on every template", () => {
    for (const kind of REPORT_KINDS) {
      const tpl = getPrompt(kind);
      expect(tpl.system).toMatch(/never/i);
      expect(tpl.system).toMatch(/medical, legal/i);
    }
  });

  it("keeps summary short and professional long", () => {
    const short = resolvePrompt({
      report: "yoga",
      depth: "summary",
      language: "en",
      data: KUNDLI_JSON,
    });
    const long = resolvePrompt({
      report: "yoga",
      depth: "professional",
      language: "en",
      data: KUNDLI_JSON,
    });
    expect(long.maxTokens).toBeGreaterThan(short.maxTokens);
    expect(long.prompt).toContain("Technical Notes");
  });

  it("lets an admin override a template without touching the engine", () => {
    registerPrompt({
      ...DEFAULT_PROMPTS.numerology,
      version: 7,
      instruction: "CUSTOM ADMIN INSTRUCTION",
    });
    const resolved = resolvePrompt({
      report: "numerology",
      depth: "summary",
      language: "en",
      data: { lifePath: 5 },
    });
    expect(resolved.prompt).toContain("CUSTOM ADMIN INSTRUCTION");
    expect(resolved.version).toBe(7);
    clearPromptOverrides("numerology");
    expect(getPrompt("numerology").version).toBe(1);
  });

  it("adds a low-confidence directive when asked", () => {
    const resolved = resolvePrompt({
      report: "dosha",
      depth: "summary",
      language: "en",
      data: KUNDLI_JSON,
      lowConfidence: true,
    });
    expect(resolved.prompt).toMatch(/LOW confidence/);
  });
});

describe("ai/formatter", () => {
  it("strips code fences and chat preambles", () => {
    expect(normalizeMarkdown("Sure! Here is your report:\n# Title\n\nBody")).toBe(
      "# Title\n\nBody",
    );
    expect(normalizeMarkdown("```markdown\n# Title\n\nBody\n```")).toBe("# Title\n\nBody");
  });

  it("normalises bullets and heading spacing", () => {
    const out = normalizeMarkdown("# T\n\n•  one\n•  two\n##Next\nx");
    expect(out).toContain("- one");
    expect(out).toContain("## Next");
  });

  it("splits H2 sections", () => {
    const sections = extractSections(MARKDOWN);
    expect(sections.map((s) => s.heading)).toEqual(["Chart Snapshot", "Personality and Strengths"]);
    expect(sections[0].body).toContain("Mesha");
  });

  it("appends a localized disclaimer exactly once", () => {
    const first = formatReport(MARKDOWN, {
      title: "Kundli Summary",
      language: "hi",
      lowConfidence: false,
    });
    expect(first.markdown).toContain("वैदिक ज्योतिष");
    const again = formatReport(first.markdown, {
      title: "Kundli Summary",
      language: "hi",
      lowConfidence: false,
    });
    expect(again.markdown.split("वैदिक ज्योतिष").length - 1).toBe(1);
  });

  it("adds the low-confidence note and a title when missing", () => {
    const out = formatReport("Body without a title but long enough to pass.", {
      title: "Yoga Explanation",
      language: "en",
      lowConfidence: true,
    });
    expect(out.markdown.startsWith("# Yoga Explanation")).toBe(true);
    expect(out.markdown).toContain("low confidence");
    expect(out.wordCount).toBeGreaterThan(5);
  });
});

describe("ai/cache", () => {
  it("stable-stringifies regardless of key order", () => {
    expect(stableStringify({ b: 1, a: [2, { d: 4, c: 3 }] })).toBe(
      stableStringify({ a: [2, { c: 3, d: 4 }], b: 1 }),
    );
  });

  it("changes the key when engine data changes", () => {
    const base = {
      report: "kundli-summary",
      depth: "summary",
      language: "en",
      templateVersion: 1,
      data: KUNDLI_JSON,
    };
    const same = buildCacheKey({ ...base, data: { ...KUNDLI_JSON } });
    const changed = buildCacheKey({
      ...base,
      data: { ...KUNDLI_JSON, lagna: { rashi: "Vrishabha", degree: 3 } },
    });
    expect(buildCacheKey(base)).toBe(same);
    expect(changed).not.toBe(same);
  });

  it("changes the key when the prompt version changes", () => {
    const a = buildCacheKey({
      report: "yoga",
      depth: "summary",
      language: "en",
      templateVersion: 1,
      data: { x: 1 },
    });
    const b = buildCacheKey({
      report: "yoga",
      depth: "summary",
      language: "en",
      templateVersion: 2,
      data: { x: 1 },
    });
    expect(a).not.toBe(b);
  });

  it("expires entries and supports report invalidation", () => {
    const cache = new InterpretationCache({ ttlMs: 1 });
    const dummy = { report: "yoga" } as never;
    cache.set("yoga:summary:en:v1:abc", dummy);
    expect(cache.size).toBe(1);
    expect(cache.invalidateReport("yoga")).toBe(1);
    expect(cache.size).toBe(0);
  });
});

describe("ai/engine", () => {
  it("generates formatted Markdown from engine JSON", async () => {
    setProviderAdapter(stubAdapter("stub", MARKDOWN));
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    const out = await engine.generate(input({ depth: "detailed", language: "en" }));

    expect(out.markdown.startsWith("# Kundli Summary")).toBe(true);
    expect(out.sections.length).toBeGreaterThan(0);
    expect(out.meta.provider).toBe("stub-provider");
    expect(out.meta.adapter).toBe("stub");
    expect(out.meta.featureKey).toBe("interpretation.kundli-summary");
    expect(out.meta.cached).toBe(false);
    expect(JSON.parse(JSON.stringify(out))).toBeTruthy();
  });

  it("rejects invalid input before calling any provider", async () => {
    const calls: string[] = [];
    setProviderAdapter(stubAdapter("stub", MARKDOWN, calls));
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    await expect(engine.generate(input({ data: {} }))).rejects.toThrow(
      /Invalid interpretation input/,
    );
    expect(calls).toHaveLength(0);
  });

  it("serves a cache hit and bypasses it on demand", async () => {
    const calls: string[] = [];
    setProviderAdapter(stubAdapter("stub", MARKDOWN, calls));
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });

    const first = await engine.generate(input());
    const second = await engine.generate(input());
    expect(calls).toHaveLength(1);
    expect(second.meta.cached).toBe(true);
    expect(second.markdown).toBe(first.markdown);

    await engine.generate(input({ bypassCache: true }));
    expect(calls).toHaveLength(2);
  });

  it("misses the cache when engine data changes", async () => {
    const calls: string[] = [];
    setProviderAdapter(stubAdapter("stub", MARKDOWN, calls));
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    await engine.generate(input());
    await engine.generate(input({ data: { ...KUNDLI_JSON, moon: { rashi: "Simha" } } }));
    expect(calls).toHaveLength(2);
  });

  it("switches providers through the adapter layer", async () => {
    setProviderAdapter(stubAdapter("openai-like", MARKDOWN));
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    expect((await engine.generate(input())).meta.provider).toBe("openai-like-provider");

    setProviderAdapter(stubAdapter("gemini-like", MARKDOWN));
    expect((await engine.generate(input({ bypassCache: true }))).meta.provider).toBe(
      "gemini-like-provider",
    );
  });

  it("falls back to the next adapter when the primary fails", async () => {
    setProviderAdapter({
      id: "broken",
      async complete() {
        throw new Error("upstream 500");
      },
    });
    setFallbackAdapters([stubAdapter("backup", MARKDOWN)]);
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    const out = await engine.generate(input());
    expect(out.meta.adapter).toBe("backup");
  });

  it("throws a clear error when every adapter fails", async () => {
    setProviderAdapter({
      id: "a",
      async complete() {
        throw new Error("boom");
      },
    });
    setFallbackAdapters([
      {
        id: "b",
        async complete() {
          throw new Error("boom2");
        },
      },
    ]);
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    await expect(engine.generate(input())).rejects.toThrow(/All AI adapters failed/);
  });

  it("rejects an empty provider response instead of returning a blank report", async () => {
    setProviderAdapter({
      id: "empty",
      async complete() {
        return { text: "   ", provider: "p", model: "m" };
      },
    });
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    await expect(engine.generate(input())).rejects.toThrow(/adapters failed/);
  });

  it("marks low confidence in the output metadata and Markdown", async () => {
    setProviderAdapter(stubAdapter("stub", MARKDOWN));
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    const out = await engine.generate(input({ confidence: 20 }));
    expect(out.meta.lowConfidence).toBe(true);
    expect(out.markdown).toContain("low confidence");
  });

  it("runs every report, depth and language combination", async () => {
    setProviderAdapter(stubAdapter("stub", MARKDOWN));
    const engine = new AiInterpretationEngine({ cache: new InterpretationCache() });
    for (const report of REPORT_KINDS) {
      for (const depth of REPORT_DEPTHS) {
        const out = await engine.generate({ report, data: KUNDLI_JSON, depth, language: "en" });
        expect(out.report).toBe(report);
        expect(out.markdown.length).toBeGreaterThan(20);
      }
    }
    for (const language of SUPPORTED_LANGUAGES) {
      const out = await engine.generate({ report: "yoga", data: KUNDLI_JSON, language });
      expect(out.language).toBe(language);
    }
  });
});
