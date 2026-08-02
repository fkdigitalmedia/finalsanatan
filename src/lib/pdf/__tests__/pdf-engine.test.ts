// ============================================================
// Universal PDF Report Engine — Tests
// ------------------------------------------------------------
// Rendering is verified through a fake DocLike so the full
// pipeline (sections, tables, charts, TOC, header/footer,
// pagination, variables) is exercised without a browser.
// ============================================================

import { describe, it, expect, beforeEach } from "vitest";

import { buildCacheKey, clearPdfCaches, pdfCache, stableStringify, TtlCache } from "../cache";
import { renderChart } from "../charts";
import { drawText, drawHeading, drawProgressBar, drawScoreCards } from "../components";
import { PAPER_SIZES } from "../constants";
import { buildDefaultTemplate } from "../default-templates";
import { fontForLanguage, headingSize, isRtl, lineHeightMm } from "../fonts";
import { renderFooter } from "../footer";
import { renderHeader } from "../header";
import {
  deepMerge,
  evaluateCondition,
  formatValue,
  getPath,
  normalizeTemplate,
  paperDimensions,
  resolveTheme,
  resolveVariables,
  safeFilename,
  tint,
} from "../helpers";
import {
  registerSection,
  renderSection,
  renderMarkdown,
  registeredSectionTypes,
} from "../renderer";
import { drawTable, inferColumns, planetTable } from "../tables";
import {
  clearTemplates,
  duplicateTemplate,
  ensureDefaultTemplate,
  listThemes,
  registerTemplate,
  registerTheme,
  resolveTemplateFor,
  setTemplateStatus,
} from "../template-manager";
import { invalidateTemplates, loadTemplate, setTemplateSource } from "../template-loader";
import { renderToc } from "../toc";
import { validateData, validateTemplate } from "../validators";
import { renderWatermark } from "../watermark";
import type { PdfTemplate, RenderContext } from "../types";

// ---------- fake document ----------
interface Op {
  op: string;
  args: unknown[];
}

function fakeDoc() {
  const ops: Op[] = [];
  let pages = 1;
  let current = 1;
  const rec = (op: string, ...args: unknown[]) => {
    ops.push({ op, args });
  };
  return {
    ops,
    get pages() {
      return pages;
    },
    setFont: (...a: unknown[]) => rec("setFont", ...a),
    setFontSize: (...a: unknown[]) => rec("setFontSize", ...a),
    setTextColor: (...a: unknown[]) => rec("setTextColor", ...a),
    setFillColor: (...a: unknown[]) => rec("setFillColor", ...a),
    setDrawColor: (...a: unknown[]) => rec("setDrawColor", ...a),
    setLineWidth: (...a: unknown[]) => rec("setLineWidth", ...a),
    text: (...a: unknown[]) => rec("text", ...a),
    rect: (...a: unknown[]) => rec("rect", ...a),
    roundedRect: (...a: unknown[]) => rec("roundedRect", ...a),
    line: (...a: unknown[]) => rec("line", ...a),
    circle: (...a: unknown[]) => rec("circle", ...a),
    triangle: (...a: unknown[]) => rec("triangle", ...a),
    addPage: () => {
      pages++;
      current = pages;
      rec("addPage");
    },
    setPage: (n: number) => {
      current = n;
      rec("setPage", n);
    },
    getNumberOfPages: () => pages,
    addImage: (...a: unknown[]) => rec("addImage", ...a),
    splitTextToSize: (t: string, w: number) => {
      const perLine = Math.max(8, Math.floor(w / 2));
      const words = String(t).split(/\s+/);
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        if ((line + " " + word).trim().length > perLine) {
          lines.push(line.trim());
          line = word;
        } else line = `${line} ${word}`;
      }
      if (line.trim()) lines.push(line.trim());
      return lines.length ? lines : [""];
    },
    getTextWidth: (t: string) => String(t).length * 1.8,
    get currentPage() {
      return current;
    },
  };
}

function makeCtx(template: PdfTemplate, data: Record<string, unknown> = {}): RenderContext {
  const doc = fakeDoc();
  const page = paperDimensions(template.paper);
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc: doc as any,
    template,
    theme: resolveTheme(template.theme, template.themeOverrides),
    data,
    language: template.language ?? "en",
    page,
    margins: template.paper.margins,
    cursorY: template.paper.margins.top,
    contentTop: template.paper.margins.top,
    contentBottom: page.height - template.paper.margins.bottom,
    fonts: { heading: "helvetica", body: "helvetica" },
    toc: [],
    tocPage: null,
    images: {},
    sectionsRendered: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function textOps(ctx: RenderContext): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ctx.doc as any).ops.filter((o: Op) => o.op === "text").map((o: Op) => String(o.args[0]));
}

const tpl = (overrides: Partial<PdfTemplate> = {}) =>
  normalizeTemplate({ report: "janam-kundli", name: "T", sections: [], ...overrides });

const SAMPLE_CHART = {
  system: "whole-sign" as const,
  ascendant: {
    longitudeTropical: 10,
    longitudeSidereal: 5,
    rashiIndex: 0,
    rashi: "Mesha" as const,
    degreesInRashi: 5,
    nakshatra: "Ashwini" as const,
    nakshatraIndex: 0,
    pada: 1 as const,
  },
  houses: Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    rashiIndex: i,
    rashi: "Mesha" as const,
    startDegree: i * 30,
  })),
  planets: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map(
    (g, i) => ({
      graha: g as never,
      longitudeTropical: i * 30,
      longitudeSidereal: i * 30,
      rashiIndex: i % 12,
      rashi: "Mesha" as never,
      degreesInRashi: 12.5,
      nakshatraIndex: i,
      nakshatra: "Ashwini" as never,
      pada: 1 as const,
      house: (i % 12) + 1,
      retrograde: i % 3 === 0,
      dignity: "own" as const,
      strengthScore: 0.6,
    }),
  ),
};

beforeEach(() => {
  clearPdfCaches();
  clearTemplates();
  invalidateTemplates();
  setTemplateSource(null);
});

// ============================================================
describe("helpers — variables", () => {
  it("resolves nested paths and array indexes", () => {
    const data = { user: { name: "Asha" }, list: [{ v: 3 }] };
    expect(resolveVariables("Hi {{user.name}} / {{list[0].v}}", data)).toBe("Hi Asha / 3");
  });

  it("collapses unknown variables and supports defaults", () => {
    expect(resolveVariables("[{{nope}}]", {})).toBe("[]");
    expect(resolveVariables("{{nope|Guest}}", {})).toBe("Guest");
  });

  it("formats values predictably", () => {
    expect(formatValue(3)).toBe("3");
    expect(formatValue(3.14159)).toBe("3.14");
    expect(formatValue(true)).toBe("Yes");
    expect(formatValue(["a", "b"])).toBe("a, b");
    expect(formatValue(undefined)).toBe("");
  });

  it("getPath is safe on missing branches", () => {
    expect(getPath({ a: { b: 1 } }, "a.b")).toBe(1);
    expect(getPath({}, "a.b.c")).toBeUndefined();
  });

  it("evaluates visibility conditions", () => {
    const data = { yogas: [1], empty: [], name: "Asha" };
    expect(evaluateCondition("yogas", data)).toBe(true);
    expect(evaluateCondition("empty", data)).toBe(false);
    expect(evaluateCondition("!empty", data)).toBe(true);
    expect(evaluateCondition("name == Asha", data)).toBe(true);
    expect(evaluateCondition("name != Asha", data)).toBe(false);
    expect(evaluateCondition(undefined, data)).toBe(true);
  });

  it("deep merges without mutating the base", () => {
    const base = { a: { b: 1, c: 2 } };
    const merged = deepMerge(base, { a: { c: 9 } });
    expect(merged).toEqual({ a: { b: 1, c: 9 } });
    expect(base.a.c).toBe(2);
  });

  it("tints colours and builds safe filenames", () => {
    expect(tint("#000000", 1)).toBe("#ffffff");
    expect(safeFilename("Janam Kundli — Asha")).toMatch(/^janam-kundli-asha\.pdf$/);
  });
});

// ============================================================
describe("paper + themes", () => {
  it("computes portrait and landscape dimensions", () => {
    expect(
      paperDimensions({
        size: "a4",
        orientation: "portrait",
        margins: { top: 1, right: 1, bottom: 1, left: 1 },
      }),
    ).toEqual(PAPER_SIZES.a4);
    const land = paperDimensions({
      size: "a4",
      orientation: "landscape",
      margins: { top: 1, right: 1, bottom: 1, left: 1 },
    });
    expect(land.width).toBeGreaterThan(land.height);
  });

  it("supports custom paper sizes", () => {
    const dims = paperDimensions({
      size: "custom",
      orientation: "portrait",
      width: 100,
      height: 150,
      margins: { top: 1, right: 1, bottom: 1, left: 1 },
    });
    expect(dims).toEqual({ width: 100, height: 150 });
  });

  it("resolves every built-in theme and applies overrides", () => {
    for (const name of ["classic", "premium", "luxury", "modern", "minimal", "temple"]) {
      expect(resolveTheme(name).name).toBe(name);
    }
    const t = resolveTheme("minimal", { colors: { primary: "#123456" } as never });
    expect(t.colors.primary).toBe("#123456");
    expect(t.colors.ink).toBeTruthy();
  });

  it("registers and lists custom themes", () => {
    const base = resolveTheme("classic");
    registerTheme({ ...base, name: "royal", label: "Royal" });
    expect(listThemes().some((t) => t.name === "royal")).toBe(true);
  });
});

// ============================================================
describe("validators", () => {
  it("accepts a normalised template", () => {
    const t = tpl({ sections: [{ id: "a", type: "paragraph" }] });
    expect(validateTemplate(t).valid).toBe(true);
  });

  it("rejects missing sections, bad paper and duplicate ids", () => {
    expect(validateTemplate(tpl()).valid).toBe(false);
    const bad = tpl({
      sections: [
        { id: "x", type: "paragraph" },
        { id: "x", type: "paragraph" },
      ],
    });
    expect(validateTemplate(bad).issues.some((i) => /Duplicate/.test(i.message))).toBe(true);
    const paper = tpl({
      sections: [{ id: "a", type: "paragraph" }],
      paper: {
        size: "custom",
        orientation: "portrait",
        margins: { top: 1, right: 1, bottom: 1, left: 1 },
      },
    });
    expect(validateTemplate(paper).valid).toBe(false);
  });

  it("validates the data context", () => {
    expect(validateData({ a: 1 }).valid).toBe(true);
    expect(validateData(null).valid).toBe(false);
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(validateData(cyclic).valid).toBe(false);
  });
});

// ============================================================
describe("cache", () => {
  it("produces stable keys regardless of key order", () => {
    expect(stableStringify({ a: 1, b: 2 })).toBe(stableStringify({ b: 2, a: 1 }));
    expect(buildCacheKey({ a: 1, b: 2 })).toBe(buildCacheKey({ b: 2, a: 1 }));
  });

  it("changes the key when data changes", () => {
    expect(buildCacheKey({ data: { x: 1 } })).not.toBe(buildCacheKey({ data: { x: 2 } }));
  });

  it("stores, hits and expires entries", () => {
    const cache = new TtlCache<string>(1000, 2);
    cache.set("a", "1");
    expect(cache.get("a")).toBe("1");
    expect(cache.hits).toBe(1);
    cache.set("b", "2");
    cache.set("c", "3");
    expect(cache.size).toBeLessThanOrEqual(2);
    expect(cache.get("zzz")).toBeNull();
  });

  it("pdf cache round-trips a rendered entry", () => {
    pdfCache.set("k", {
      dataUrl: "data:application/pdf;base64,AA",
      pages: 2,
      bytes: 10,
      filename: "a.pdf",
      generatedAt: "now",
    });
    expect(pdfCache.get("k")?.pages).toBe(2);
    clearPdfCaches();
    expect(pdfCache.get("k")).toBeNull();
  });
});

// ============================================================
describe("template manager & loader", () => {
  it("builds a default template for every known report", () => {
    for (const report of [
      "janam-kundli",
      "kundli-matching",
      "daily-horoscope",
      "numerology-report",
      "festival-report",
    ]) {
      const t = ensureDefaultTemplate(report);
      expect(validateTemplate(t).valid).toBe(true);
      expect(t.sections.length).toBeGreaterThan(3);
    }
  });

  it("falls back to a generic template for unknown future reports", () => {
    const t = ensureDefaultTemplate("astro-cartography-2030");
    expect(validateTemplate(t).valid).toBe(true);
    expect(t.report).toBe("astro-cartography-2030");
  });

  it("registers, duplicates and publishes templates", () => {
    const t = registerTemplate({
      report: "vastu-report",
      name: "Vastu A",
      sections: [{ id: "s1", type: "paragraph" }],
    });
    const copy = duplicateTemplate(t.id, "Vastu B");
    expect(copy?.status).toBe("draft");
    expect(setTemplateStatus(copy!.id, "published")?.status).toBe("published");
  });

  it("prefers a published template over the built-in default", () => {
    registerTemplate({
      report: "career-report",
      name: "Custom",
      status: "published",
      sections: [{ id: "s1", type: "paragraph" }],
    });
    expect(resolveTemplateFor("career-report").name).toBe("Custom");
  });

  it("loads from a remote source and caches the result", async () => {
    let calls = 0;
    setTemplateSource({
      id: "test",
      async fetchForReport(report) {
        calls++;
        return {
          report,
          name: "Remote",
          sections: [{ id: "s1", type: "paragraph", title: "Remote" }],
        };
      },
    });
    const a = await loadTemplate("muhurat-report");
    const b = await loadTemplate("muhurat-report");
    expect(a.name).toBe("Remote");
    expect(b.name).toBe("Remote");
    expect(calls).toBe(1);
  });

  it("degrades to the default when the remote template is invalid", async () => {
    setTemplateSource({
      id: "bad",
      async fetchForReport() {
        return { name: "Broken", sections: [] } as never;
      },
    });
    const t = await loadTemplate("numerology-report");
    expect(t.sections.length).toBeGreaterThan(0);
  });

  it("survives a throwing source", async () => {
    setTemplateSource({
      id: "boom",
      async fetchForReport() {
        throw new Error("down");
      },
    });
    const t = await loadTemplate("janam-kundli");
    expect(t.sections.length).toBeGreaterThan(0);
  });
});

// ============================================================
describe("rendering — text, headings, pagination", () => {
  it("writes wrapped paragraph text", async () => {
    const t = tpl({
      sections: [{ id: "p", type: "paragraph", options: { text: "Hello {{user}}" } }],
    });
    const ctx = makeCtx(t, { user: "Asha" });
    await renderSection(ctx, t.sections[0]);
    expect(textOps(ctx).join(" ")).toContain("Asha");
    expect(ctx.sectionsRendered).toBe(1);
  });

  it("paginates when content exceeds the page", () => {
    const t = tpl({ sections: [] });
    const ctx = makeCtx(t);
    const long = Array.from({ length: 4000 }, (_, i) => `line ${i}`).join(" ");
    drawText(ctx, long);
    expect(ctx.doc.getNumberOfPages()).toBeGreaterThan(1);
  });

  it("scales headings by level", () => {
    expect(headingSize(10, 1, 1)).toBeGreaterThan(headingSize(10, 1, 3));
    expect(lineHeightMm(10, 1.5)).toBeCloseTo(5.292, 2);
  });

  it("renders markdown structures", () => {
    const ctx = makeCtx(tpl({ sections: [] }));
    renderMarkdown(
      ctx,
      "# Title\n\n## Section\n\n- one\n- two\n\n1. first\n\n> quote\n\n---\n\nBody text",
    );
    const written = textOps(ctx).join("\n");
    expect(written).toContain("Title");
    expect(written).toContain("one");
    expect(written).toContain("first");
  });

  it("skips sections that are disabled or fail visibleWhen", async () => {
    const t = tpl({
      sections: [
        { id: "a", type: "paragraph", enabled: false, options: { text: "no" } },
        { id: "b", type: "paragraph", visibleWhen: "missing", options: { text: "no" } },
      ],
    });
    const ctx = makeCtx(t, {});
    for (const s of t.sections) await renderSection(ctx, s);
    expect(ctx.sectionsRendered).toBe(0);
  });

  it("ignores unknown section types instead of throwing", async () => {
    const ctx = makeCtx(tpl({ sections: [] }));
    await expect(renderSection(ctx, { id: "x", type: "not-a-real-type" })).resolves.toBeUndefined();
  });

  it("supports runtime-registered custom sections", async () => {
    registerSection("test-block", (c) => {
      drawHeading(c, "Custom Block", 2);
    });
    expect(registeredSectionTypes()).toContain("test-block");
    const ctx = makeCtx(tpl({ sections: [] }));
    await renderSection(ctx, { id: "c", type: "test-block" });
    expect(textOps(ctx).join(" ")).toContain("Custom Block");
  });
});

// ============================================================
describe("rendering — tables", () => {
  it("renders headers, rows and repeats headers across pages", () => {
    const ctx = makeCtx(tpl({ sections: [] }));
    const rows = Array.from({ length: 120 }, (_, i) => ({ a: `row${i}`, b: i }));
    drawTable(ctx, {
      columns: [
        { key: "a", label: "Alpha" },
        { key: "b", label: "Beta", align: "right" },
      ],
      rows,
    });
    const written = textOps(ctx);
    expect(written.filter((t) => t === "Alpha").length).toBeGreaterThan(1);
    expect(ctx.doc.getNumberOfPages()).toBeGreaterThan(1);
  });

  it("infers columns when the template omits them", () => {
    const cols = inferColumns([{ name: "a", score: 1 }]);
    expect(cols.map((c) => c.key)).toEqual(["name", "score"]);
  });

  it("maps planet data into a planet table", () => {
    const table = planetTable(SAMPLE_CHART.planets as never);
    expect(table.rows).toHaveLength(9);
    expect(table.rows[0].motion).toBeDefined();
  });

  it("renders the planet-table section from bound data", async () => {
    const t = tpl({
      sections: [
        {
          id: "pt",
          type: "planet-table",
          title: "Planets",
          options: { planetsSource: "planetTable" },
        },
      ],
    });
    const ctx = makeCtx(t, { planetTable: SAMPLE_CHART.planets });
    await renderSection(ctx, t.sections[0]);
    expect(textOps(ctx).join(" ")).toContain("Nakshatra");
  });
});

// ============================================================
describe("rendering — charts", () => {
  it.each(["north", "south", "east", "wheel", "planet-wheel", "house-wheel"] as const)(
    "renders the %s chart without errors",
    (style) => {
      const ctx = makeCtx(tpl({ sections: [] }));
      const used = renderChart(ctx, SAMPLE_CHART as never, {
        style,
        size: 80,
        caption: `${style} chart`,
      });
      expect(used).toBeGreaterThan(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((ctx.doc as any).ops.length).toBeGreaterThan(5);
    },
  );

  it("no-ops on missing chart data", () => {
    const ctx = makeCtx(tpl({ sections: [] }));
    expect(renderChart(ctx, undefined, { style: "north" })).toBe(0);
  });
});

// ============================================================
describe("rendering — visual components", () => {
  it("draws score cards and progress bars", () => {
    const ctx = makeCtx(tpl({ sections: [] }));
    drawScoreCards(
      ctx,
      [
        { label: "Career", value: 82 },
        { label: "Health", value: 71 },
      ],
      2,
    );
    drawProgressBar(ctx, "Wealth", 64);
    const written = textOps(ctx).join(" ");
    expect(written).toContain("Career");
    expect(written).toContain("Wealth");
  });

  it("renders scorecards / badges / timeline sections", async () => {
    const t = tpl({
      sections: [
        { id: "s", type: "scorecards", title: "Scores", options: { itemsSource: "scores" } },
        { id: "b", type: "badges", title: "Tags", options: { itemsSource: "tags" } },
        { id: "tl", type: "dasha-timeline", options: { itemsSource: "mahadasha" } },
      ],
    });
    const ctx = makeCtx(t, {
      scores: [{ label: "Career", value: 80 }],
      tags: ["Gaj Kesari", { label: "Raj Yoga", tone: "success" }],
      mahadasha: [{ label: "Jupiter", from: "2024", to: "2040" }],
    });
    for (const s of t.sections) await renderSection(ctx, s);
    const written = textOps(ctx).join(" ");
    expect(written).toContain("Career");
    expect(written).toContain("Raj Yoga");
    expect(written).toContain("Jupiter");
  });

  it("renders dosha and yoga summaries with an empty fallback", async () => {
    const t = tpl({
      sections: [
        { id: "d", type: "dosha-summary", title: "Doshas", options: { itemsSource: "doshas" } },
      ],
    });
    const withData = makeCtx(t, {
      doshas: [{ name: "Mangal Dosha", description: "Mars in 7th", severity: "moderate" }],
    });
    await renderSection(withData, t.sections[0]);
    expect(textOps(withData).join(" ")).toContain("Mangal Dosha");

    const empty = makeCtx(t, {});
    await renderSection(empty, t.sections[0]);
    expect(textOps(empty).join(" ")).toContain("None detected");
  });

  it("renders the disclaimer in the report language", async () => {
    const t = tpl({
      language: "hi",
      sections: [{ id: "dis", type: "disclaimer", title: "अस्वीकरण" }],
    });
    const ctx = makeCtx(t, {});
    ctx.language = "hi";
    await renderSection(ctx, t.sections[0]);
    expect(textOps(ctx).join(" ")).toContain("ज्योतिष");
  });
});

// ============================================================
describe("cover, header, footer, watermark, TOC", () => {
  it("renders a cover with resolved variables", async () => {
    const t = tpl({
      sections: [
        {
          id: "cover",
          type: "cover",
          title: "{{reportTitle}}",
          options: {
            subtitle: "for {{user}}",
            details: [{ label: "DOB", value: "{{birthDate}}" }],
            breakAfter: false,
          },
        },
      ],
    });
    const ctx = makeCtx(t, { reportTitle: "Janam Kundli", user: "Asha", birthDate: "1990-01-01" });
    await renderSection(ctx, t.sections[0]);
    const written = textOps(ctx).join(" ");
    expect(written).toContain("Janam Kundli");
    expect(written).toContain("for Asha");
    expect(written).toContain("1990-01-01");
  });

  it("stamps header and footer with page numbers", () => {
    const t = tpl({ sections: [{ id: "p", type: "paragraph" }] });
    const ctx = makeCtx(t, {
      reportTitle: "Kundli",
      branding: { company: "SanatanTools", website: "https://sanatantools.com" },
    });
    renderHeader(ctx, 2, false);
    renderFooter(ctx, 2, 7, false);
    const written = textOps(ctx).join(" ");
    expect(written).toContain("SanatanTools");
    expect(written).toContain("Page 2 / 7");
  });

  it("hides header and footer on the cover by default", () => {
    const t = tpl({ sections: [{ id: "p", type: "paragraph" }] });
    const ctx = makeCtx(t, {});
    renderHeader(ctx, 1, true);
    renderFooter(ctx, 1, 3, true);
    expect(textOps(ctx)).toHaveLength(0);
  });

  it("renders a text watermark when enabled", () => {
    const t = tpl({
      sections: [{ id: "p", type: "paragraph" }],
      watermark: {
        enabled: true,
        text: "{{branding.company}}",
        opacity: 0.08,
        angle: 45,
        scale: 0.6,
      },
    });
    const ctx = makeCtx(t, { branding: { company: "SanatanTools" } });
    renderWatermark(ctx);
    expect(textOps(ctx).join(" ")).toContain("SanatanTools");
  });

  it("collects TOC entries and fills the reserved page", async () => {
    const t = tpl({
      sections: [
        { id: "toc", type: "toc", title: "Contents", inToc: false },
        { id: "a", type: "paragraph", title: "Alpha", inToc: true, options: { text: "x" } },
        {
          id: "b",
          type: "paragraph",
          title: "Beta",
          inToc: true,
          newPage: true,
          options: { text: "y" },
        },
      ],
    });
    const ctx = makeCtx(t, {});
    for (const s of t.sections) await renderSection(ctx, s);
    expect(ctx.tocPage).not.toBeNull();
    expect(ctx.toc.map((e) => e.title)).toEqual(["Alpha", "Beta"]);
    renderToc(ctx);
    const written = textOps(ctx).join(" ");
    expect(written).toContain("Table of Contents");
    expect(written).toContain("Beta");
  });
});

// ============================================================
describe("fonts & unicode", () => {
  it("maps languages to script fonts", () => {
    expect(fontForLanguage("hi")).toBe("NotoDevanagari");
    expect(fontForLanguage("ta")).toBe("NotoTamil");
    expect(fontForLanguage("en")).toBe("helvetica");
    expect(fontForLanguage("xx")).toBe("helvetica");
  });

  it("flags RTL languages only", () => {
    expect(isRtl("ur")).toBe(true);
    expect(isRtl("hi")).toBe(false);
  });

  it("renders unicode text unchanged", () => {
    const ctx = makeCtx(tpl({ sections: [] }));
    drawText(ctx, "जन्म कुंडली • ஜாதகம் • ಜಾತಕ");
    expect(textOps(ctx).join(" ")).toContain("जन्म");
  });
});

// ============================================================
describe("full template pass", () => {
  it("renders the default Kundli template end-to-end", async () => {
    const t = ensureDefaultTemplate("janam-kundli");
    const ctx = makeCtx(t, {
      reportTitle: "Janam Kundli",
      user: "Asha",
      birthDate: "1990-01-01",
      birthTime: "07:30",
      birthPlace: "Pune",
      lagna: "Mesha",
      moonSign: "Karka",
      nakshatra: "Pushya",
      summary: "A balanced chart.",
      introduction: "Intro text.",
      kundliChart: SAMPLE_CHART,
      navamsaChart: SAMPLE_CHART,
      planetTable: SAMPLE_CHART.planets,
      houseTable: SAMPLE_CHART.houses,
      mahadasha: [{ label: "Jupiter", from: "2024", to: "2040" }],
      yogas: [{ name: "Gaj Kesari", description: "Moon-Jupiter kendra" }],
      doshas: [{ name: "Mangal Dosha", description: "Mars in 7th" }],
      scores: [{ label: "Career", value: 82 }],
      recommendations: [{ label: "Chant Guru mantra", detail: "Thursdays" }],
      analysis: "## Career\n\nStrong tenth house.",
    });
    for (const s of t.sections) await renderSection(ctx, s);
    expect(ctx.sectionsRendered).toBeGreaterThan(8);
    expect(ctx.doc.getNumberOfPages()).toBeGreaterThan(3);
    const written = textOps(ctx).join(" ");
    expect(written).toContain("Gaj Kesari");
    expect(written).toContain("Career");
  });

  it("renders a large report quickly", async () => {
    const sections = Array.from({ length: 120 }, (_, i) => ({
      id: `s${i}`,
      type: "paragraph" as const,
      title: `Section ${i}`,
      inToc: true,
      options: { text: "Lorem ipsum dolor sit amet. ".repeat(12) },
    }));
    const t = tpl({ sections });
    const ctx = makeCtx(t, {});
    const started = Date.now();
    for (const s of t.sections) await renderSection(ctx, s);
    expect(Date.now() - started).toBeLessThan(5000);
    expect(ctx.doc.getNumberOfPages()).toBeGreaterThan(5);
  });

  it("builds default templates for all report presets without throwing", () => {
    for (const report of [
      "janam-kundli",
      "varshphal",
      "business-report",
      "muhurat-report",
      "vastu-report",
    ]) {
      expect(() => buildDefaultTemplate(report)).not.toThrow();
    }
  });
});
