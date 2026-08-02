import { describe, expect, it } from "vitest";

import {
  deltaPct,
  fillSeries,
  mean,
  pctOf,
  percentile,
  round,
  safeDiv,
  formatMetric,
  getMetric,
} from "../metrics";
import {
  bucketOf,
  bucketsFor,
  breakdownFrom,
  distinctActors,
  metaNumber,
  metaString,
} from "../engine";
import {
  autoGranularity,
  previousRange,
  resolveRange,
  sanitizeFilters,
  parseQuery,
} from "../validators";
import { cacheKey, getCached, setCached, invalidateTag, clearCache } from "../cache";
import { toCsv, toJson, toExcelXml, renderExport } from "../export";
import { isKnownEvent, labelFor, listEvents } from "../events";
import { ALERT_KINDS } from "../alerts";
import { EVENTS, DEFAULT_FUNNEL, RETENTION_WINDOWS } from "../constants";

describe("metrics math", () => {
  it("computes deltas and safe division", () => {
    expect(deltaPct(150, 100)).toBe(50);
    expect(deltaPct(50, 0)).toBe(100);
    expect(deltaPct(0, 0)).toBe(0);
    expect(safeDiv(4, 0)).toBe(0);
    expect(pctOf(1, 4)).toBe(25);
    expect(round(1.23456, 2)).toBe(1.23);
  });

  it("computes mean and percentiles", () => {
    expect(mean([2, 4, 6])).toBe(4);
    expect(mean([])).toBe(0);
    expect(percentile([1, 2, 3, 4, 5], 50)).toBe(3);
    expect(percentile([1, 2, 3, 4, 100], 95)).toBeGreaterThanOrEqual(4);
  });

  it("fills missing buckets with zeroes", () => {
    const filled = fillSeries(
      [{ t: "2026-01-02", value: 5 }],
      ["2026-01-01", "2026-01-02", "2026-01-03"],
    );
    expect(filled.map((p) => p.value)).toEqual([0, 5, 0]);
  });

  it("formats metric values by unit", () => {
    expect(formatMetric(12, "percent")).toContain("%");
    expect(getMetric("mrr")?.unit).toBe("currency");
  });
});

describe("time bucketing", () => {
  it("buckets by granularity", () => {
    const iso = "2026-03-15T13:45:00.000Z";
    expect(bucketOf(iso, "hour")).toContain("13");
    expect(bucketOf(iso, "day")).toBe("2026-03-15");
    expect(bucketOf(iso, "month")).toBe("2026-03");
  });

  it("produces a contiguous bucket list", () => {
    const range = {
      from: new Date("2026-01-01T00:00:00Z"),
      to: new Date("2026-01-04T00:00:00Z"),
      days: 3,
    };
    expect(bucketsFor(range, "day").length).toBeGreaterThanOrEqual(3);
  });
});

describe("aggregation helpers", () => {
  const rows = [
    { user_id: "u1", session_id: "s1", tool_slug: "kundli", meta: { ms: 120, name: "LCP" } },
    { user_id: "u1", session_id: "s2", tool_slug: "kundli", meta: { ms: 80 } },
    { user_id: null, session_id: "s3", tool_slug: "panchang", meta: {} },
  ];

  it("counts distinct actors preferring user id", () => {
    expect(distinctActors(rows as never)).toBe(2);
  });

  it("builds sorted breakdowns with percentages", () => {
    const b = breakdownFrom(rows as never, "tool_slug", 5);
    expect(b[0].key).toBe("kundli");
    expect(b[0].value).toBe(2);
    expect(b[0].pct).toBeCloseTo(66.7, 0);
  });

  it("reads typed meta values", () => {
    expect(metaNumber({ ms: 12 }, "ms")).toBe(12);
    expect(metaNumber({ ms: "x" }, "ms")).toBeNull();
    expect(metaString({ name: "LCP" }, "name")).toBe("LCP");
  });
});

describe("validators", () => {
  it("resolves ranges and clamps days", () => {
    const r = resolveRange({ days: 9999 });
    expect(r.days).toBeLessThanOrEqual(730);
    expect(r.from.getTime()).toBeLessThan(r.to.getTime());
  });

  it("derives an equal-length previous range", () => {
    const r = resolveRange({ days: 7 });
    const p = previousRange(r);
    expect(Math.round((r.to.getTime() - r.from.getTime()) / 1000)).toBe(
      Math.round((p.to.getTime() - p.from.getTime()) / 1000),
    );
    expect(p.to.getTime()).toBeLessThanOrEqual(r.from.getTime());
  });

  it("chooses sensible granularity", () => {
    expect(autoGranularity(resolveRange({ days: 1 }))).toBe("hour");
    expect(autoGranularity(resolveRange({ days: 30 }))).toBe("day");
    expect(autoGranularity(resolveRange({ days: 30 }), "week")).toBe("week");
  });

  it("strips unknown filter keys", () => {
    const f = sanitizeFilters({ country: "IN", bogus: "x" } as never);
    expect(f.country).toBe("IN");
    expect((f as Record<string, unknown>).bogus).toBeUndefined();
  });

  it("parses untrusted query input", () => {
    expect(() => parseQuery({ days: 7, filters: { device: "mobile" } })).not.toThrow();
  });
});

describe("cache", () => {
  it("stores, expires and invalidates by tag", () => {
    clearCache();
    const k = cacheKey({ a: 1, b: "x" });
    setCached(k, { v: 1 }, 1000, ["analytics"]);
    expect(getCached<{ v: number }>(k)?.v).toBe(1);
    expect(invalidateTag("analytics")).toBeGreaterThan(0);
    expect(getCached(k)).toBeNull();
  });

  it("expires entries past their ttl", () => {
    clearCache();
    const k = cacheKey({ z: 1 });
    setCached(k, 5, -1);
    expect(getCached(k)).toBeNull();
  });

  it("produces stable keys regardless of key order", () => {
    expect(cacheKey({ a: 1, b: 2 })).toBe(cacheKey({ a: 1, b: 2 }));
  });
});

describe("exports", () => {
  const columns = ["metric", "value"];
  const rows = [
    { metric: "revenue", value: 1200 },
    { metric: "note, with comma", value: 'he said "hi"' },
  ];

  it("escapes csv correctly", () => {
    const csv = toCsv(columns, rows);
    expect(csv.split("\n")[0]).toBe("metric,value");
    expect(csv).toContain('"note, with comma"');
    expect(csv).toContain('""hi""');
  });

  it("emits valid json", () => {
    const parsed = JSON.parse(toJson(columns, rows)) as { rows: unknown[] };
    expect(parsed.rows).toHaveLength(2);
  });

  it("emits excel xml with typed cells", () => {
    const xml = toExcelXml("Revenue", columns, rows);
    expect(xml).toContain('ss:Type="Number"');
    expect(xml).toContain("<Workbook");
  });

  it("renders each format with the right content type", () => {
    for (const [format, ct] of [
      ["csv", "text/csv"],
      ["json", "application/json"],
      ["xlsx", "application/vnd.ms-excel"],
      ["pdf", "text/html"],
    ] as const) {
      const r = renderExport({ format, filename: "report", columns, rows });
      expect(r.contentType).toBe(ct);
      expect(r.content.length).toBeGreaterThan(10);
    }
  });
});

describe("event catalog & constants", () => {
  it("knows the core events", () => {
    expect(isKnownEvent(EVENTS.PAGEVIEW)).toBe(true);
    expect(isKnownEvent("not_a_real_event")).toBe(false);
    expect(labelFor(EVENTS.PAGEVIEW).length).toBeGreaterThan(0);
    expect(listEvents().length).toBeGreaterThan(10);
  });

  it("defines the default funnel and retention windows", () => {
    expect(DEFAULT_FUNNEL[0].key).toBe("visitor");
    expect(RETENTION_WINDOWS).toContain(30);
    expect(ALERT_KINDS.map((a) => a.kind)).toContain("ai_cost");
  });
});
