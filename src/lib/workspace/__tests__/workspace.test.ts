import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAGE_SIZE,
  describeDevice,
  duplicatePayload,
  makeShareToken,
  sanitizeSearch,
  toPage,
} from "../api";
import {
  birthInputFromKundli,
  formatDate,
  locationFromKundli,
  summarizeDasha,
  summarizeGochar,
  summarizePanchang,
  upcomingMuhurats,
} from "../insights";
import { buildPdfData, safeName } from "../download";
import { HOROSCOPE_PERIODS, RELATIONSHIPS, REPORT_KINDS } from "../types";
import type { UserKundli, UserReport } from "../types";

const chart: UserKundli = {
  id: "k1",
  user_id: "u1",
  name: "Arjun",
  gender: "male",
  birth_date: "1990-05-14",
  birth_time: "08:30:00",
  place_name: "Pune, India",
  latitude: 18.5204,
  longitude: 73.8567,
  timezone: "Asia/Kolkata",
  tz_offset_minutes: 330,
  language: "en",
  chart: {},
  notes: null,
  tags: [],
  is_favorite: false,
  is_archived: false,
  family_member_id: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("workspace api helpers", () => {
  it("paginates results", () => {
    const p = toPage([1, 2, 3], 30, 2, 12);
    expect(p).toMatchObject({ total: 30, page: 2, pageSize: 12, hasMore: true });
    expect(toPage([1], 12, 1, 12).hasMore).toBe(false);
  });

  it("has a sane default page size", () => {
    expect(DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
  });

  it("sanitizes search terms against filter injection", () => {
    expect(sanitizeSearch("  a%b,c(d)  ")).toBe("a b c d");
    expect(sanitizeSearch(undefined)).toBe("");
    expect(sanitizeSearch("x".repeat(200)).length).toBe(80);
  });

  it("duplicates a chart without ids and favourites", () => {
    const copy = duplicatePayload(chart);
    expect(copy).not.toHaveProperty("id");
    expect(copy.name).toBe("Arjun (copy)");
    expect(copy.is_favorite).toBe(false);
    expect(copy.user_id).toBe("u1");
  });

  it("generates unique share tokens", () => {
    const a = makeShareToken();
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(a).not.toBe(makeShareToken());
  });

  it("describes devices from a user agent", () => {
    expect(describeDevice("Mozilla/5.0 (iPhone) Safari").platform).toBe("iOS");
    expect(describeDevice("Windows NT 10.0 Chrome/120").label).toBe("Chrome on Windows");
    expect(describeDevice("").platform).toBe("Unknown");
  });
});

describe("workspace catalogues", () => {
  it("exposes open catalogues for future modules", () => {
    expect(REPORT_KINDS.length).toBeGreaterThanOrEqual(13);
    expect(HOROSCOPE_PERIODS).toContain("personalized");
    expect(RELATIONSHIPS).toContain("spouse");
  });
});

describe("engine adapters (no maths duplicated)", () => {
  it("maps a saved chart to engine birth input", () => {
    const b = birthInputFromKundli(chart);
    expect(b).toMatchObject({
      date: "1990-05-14",
      time: "08:30",
      timezone: "Asia/Kolkata",
      gender: "male",
    });
  });

  it("maps a saved chart to a panchang location", () => {
    expect(locationFromKundli(chart)).toMatchObject({ lat: 18.5204, tz: "Asia/Kolkata" });
  });

  it("summarizes panchang from the panchang engine", () => {
    const s = summarizePanchang(new Date("2026-03-01T06:00:00Z"), locationFromKundli(chart));
    expect(s.tithi).toBeTruthy();
    expect(s.nakshatra).toBeTruthy();
    expect(s.sunrise).toMatch(/\d/);
  });

  it("returns only auspicious muhurat windows", () => {
    const slots = upcomingMuhurats(new Date("2026-03-01T02:00:00Z"), locationFromKundli(chart));
    expect(Array.isArray(slots)).toBe(true);
    slots.forEach((s) => expect(s.quality).toBe("auspicious"));
    expect(slots.length).toBeLessThanOrEqual(4);
  });

  it("summarizes dasha from the dasha engine", () => {
    const d = summarizeDasha(birthInputFromKundli(chart), "2026-03-01");
    expect(d.mahadasha).toBeTruthy();
    expect(d.progress).toBeGreaterThanOrEqual(0);
    expect(d.progress).toBeLessThanOrEqual(100);
  });

  it("summarizes gochar from the gochar engine", () => {
    const g = summarizeGochar(birthInputFromKundli(chart), "2026-03-01");
    expect(g.score).toBeGreaterThanOrEqual(0);
    expect(g.score).toBeLessThanOrEqual(100);
    expect(g.verdict).toBeTruthy();
  });

  it("formats dates defensively", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
    expect(formatDate("2030-01-05T00:00:00Z")).toContain("2030");
  });
});

describe("download helper", () => {
  const report = {
    id: "r1",
    title: "Janam Kundli — Arjun",
    kind: "janam-kundli",
    language: "hi",
    content_md: "## Summary\nAll good",
    data: { summary: "Short" },
  } as unknown as UserReport;

  it("builds a variable context for the PDF engine", () => {
    const d = buildPdfData(report, "Arjun");
    expect(d.user).toBe("Arjun");
    expect(d.analysis).toContain("All good");
    expect(d.summary).toBe("Short");
    expect(d.language).toBe("hi");
  });

  it("creates filesystem-safe filenames", () => {
    expect(safeName("Janam Kundli — Arjun", "janam-kundli")).toBe(
      "janam-kundli-janam-kundli-arjun",
    );
    expect(safeName("", "")).toBe("report");
  });
});
