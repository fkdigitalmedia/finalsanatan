import { describe, expect, it, beforeEach } from "vitest";

import {
  MemoryCacheDriver,
  cache,
  cacheOverview,
  clearAllCaches,
  hashKey,
  keyOf,
  stableStringify,
} from "@/lib/cache";
import {
  gradeBudget,
  groupSummary,
  measure,
  recordMetric,
  resetMetrics,
  budgetByKey,
} from "@/lib/perf";

describe("cache keys", () => {
  it("stable-stringifies regardless of key order", () => {
    expect(stableStringify({ b: 1, a: 2 })).toBe(stableStringify({ a: 2, b: 1 }));
  });

  it("produces identical keys for equivalent payloads", () => {
    expect(keyOf("p", { a: 1, b: [1, 2] })).toBe(keyOf("p", { b: [1, 2], a: 1 }));
  });

  it("produces different hashes for different payloads", () => {
    expect(hashKey("alpha")).not.toBe(hashKey("beta"));
  });
});

describe("MemoryCacheDriver", () => {
  it("stores, reads and expires values", async () => {
    const driver = new MemoryCacheDriver(10, 10);
    await driver.set("k", { v: 1 });
    expect(await driver.get("k")).toEqual({ v: 1 });
    await new Promise((r) => setTimeout(r, 20));
    expect(await driver.get("k")).toBeUndefined();
  });

  it("evicts least-recently-used entries past the cap", async () => {
    const driver = new MemoryCacheDriver(60_000, 2);
    await driver.set("a", 1);
    await driver.set("b", 2);
    await driver.get("a"); // refresh recency of "a"
    await driver.set("c", 3);
    expect(await driver.get("b")).toBeUndefined();
    expect(await driver.get("a")).toBe(1);
    expect(driver.stats().evictions).toBeGreaterThan(0);
  });

  it("invalidates by tag and prefix", async () => {
    const driver = new MemoryCacheDriver(60_000, 10);
    await driver.set("festival:1", 1, { tags: ["festivals"] });
    await driver.set("festival:2", 2, { tags: ["festivals"] });
    await driver.set("other", 3);
    expect(await driver.invalidateTag("festivals")).toBe(2);
    expect(await driver.get("other")).toBe(3);
    await driver.set("seo:home", 1);
    expect(await driver.invalidatePrefix("seo:")).toBe(1);
  });
});

describe("namespace cache", () => {
  beforeEach(async () => {
    await clearAllCaches();
  });

  it("remembers values and coalesces concurrent misses", async () => {
    let calls = 0;
    const loader = async () => {
      calls++;
      await new Promise((r) => setTimeout(r, 5));
      return "value";
    };
    const ns = cache("config");
    const [a, b] = await Promise.all([ns.remember("k", loader), ns.remember("k", loader)]);
    expect(a).toBe("value");
    expect(b).toBe("value");
    expect(calls).toBe(1);
    expect(await ns.get("k")).toBe("value");
  });

  it("reports hit rate in the overview", async () => {
    const ns = cache("query");
    await ns.set("x", 1);
    await ns.get("x");
    await ns.get("missing");
    const entry = cacheOverview().find((c) => c.namespace === "query");
    expect(entry?.hitRate).toBeGreaterThan(0);
    expect(entry?.hitRate).toBeLessThan(1);
  });
});

describe("performance metrics", () => {
  beforeEach(() => resetMetrics());

  it("computes percentiles over recorded samples", () => {
    for (let i = 1; i <= 100; i++) recordMetric("api", "/test", i);
    const summary = groupSummary("api").operations[0];
    expect(summary.count).toBe(100);
    expect(summary.p50Ms).toBeGreaterThanOrEqual(50);
    expect(summary.p95Ms).toBeGreaterThanOrEqual(95);
    expect(summary.maxMs).toBe(100);
  });

  it("tracks errors from measure() without swallowing them", async () => {
    await expect(
      measure("ai", "boom", async () => {
        throw new Error("nope");
      }),
    ).rejects.toThrow("nope");
    expect(groupSummary("ai").errors).toBe(1);
  });

  it("grades budgets against targets", () => {
    const budget = budgetByKey("api")!;
    expect(gradeBudget(budget, 120)).toBe("ok");
    expect(gradeBudget(budget, 500)).toBe("warn");
    expect(gradeBudget(budget, 5000)).toBe("critical");
    expect(gradeBudget(budget, null)).toBe("unknown");
  });
});
