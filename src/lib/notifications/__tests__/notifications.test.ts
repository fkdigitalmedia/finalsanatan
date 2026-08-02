import { describe, expect, it } from "vitest";
import {
  interpolate,
  renderTemplate,
  extractVariables,
  missingVariables,
  pickTemplate,
} from "../templates";
import {
  withDefaults,
  shouldSend,
  isQuietHour,
  deferForQuietHours,
  retryDelayMs,
} from "../preferences";
import { isScheduleDue, describeSchedule } from "../schedules";

describe("templates", () => {
  it("interpolates variables and drops unknown ones", () => {
    expect(interpolate("Hi {{userName}}, {{missing}}!", { userName: "Aarav" })).toBe("Hi Aarav, !");
  });

  it("extracts and reports missing variables", () => {
    const t = { subject: "{{a}}", body_md: "{{b}} {{a}}" };
    expect(extractVariables(t).sort()).toEqual(["a", "b"]);
    expect(missingVariables(t, { a: 1 })).toEqual(["b"]);
  });

  it("falls back to a readable subject", () => {
    const r = renderTemplate(
      {
        type: "daily_horoscope",
        channel: "in_app",
        language: "en",
        subject: "{{x}}",
        body_md: "body",
      },
      {},
    );
    expect(r.subject).toBe("Daily Horoscope");
  });

  it("picks channel/language with fallbacks", () => {
    const list = [
      { type: "welcome", channel: "in_app" as const, language: "en", subject: "a", body_md: "" },
      { type: "welcome", channel: "email" as const, language: "en", subject: "b", body_md: "" },
    ];
    expect(pickTemplate(list, "welcome", "email", "hi")?.subject).toBe("b");
    expect(pickTemplate(list, "welcome", "sms", "hi")?.subject).toBe("a");
    expect(pickTemplate(list, "nope", "in_app")).toBeNull();
  });
});

describe("preferences gating", () => {
  it("blocks a disabled category but allows critical types", () => {
    const p = withDefaults({ horoscope_alerts: false });
    expect(shouldSend(p, "daily_horoscope", "in_app").allowed).toBe(false);
    expect(shouldSend(p, "payment_failed", "in_app").allowed).toBe(true);
  });

  it("respects a disabled channel and full unsubscribe", () => {
    expect(shouldSend(withDefaults({ email_enabled: false }), "welcome", "email").allowed).toBe(
      false,
    );
    expect(shouldSend(withDefaults({ unsubscribed_all: true }), "welcome", "in_app").allowed).toBe(
      false,
    );
    expect(
      shouldSend(withDefaults({ unsubscribed_all: true }), "payment_success", "in_app").allowed,
    ).toBe(true);
  });

  it("detects quiet hours across midnight and defers non-critical sends", () => {
    const p = withDefaults({
      quiet_hours_enabled: true,
      quiet_hours_start: 22,
      quiet_hours_end: 7,
      timezone: "UTC",
    });
    const night = new Date("2026-01-01T23:00:00Z");
    expect(isQuietHour(p, night)).toBe(true);
    expect(isQuietHour(p, new Date("2026-01-01T12:00:00Z"))).toBe(false);
    expect(deferForQuietHours(p, "daily_horoscope", night).getTime()).toBeGreaterThan(
      night.getTime(),
    );
    expect(deferForQuietHours(p, "payment_failed", night).getTime()).toBe(night.getTime());
  });

  it("backs off exponentially and caps at an hour", () => {
    expect(retryDelayMs(1)).toBe(2 * 60_000);
    expect(retryDelayMs(2)).toBe(4 * 60_000);
    expect(retryDelayMs(10)).toBe(60 * 60_000);
  });
});

describe("schedules", () => {
  const base = {
    id: "1",
    cadence: "daily",
    run_at_hour: 6,
    run_at_minute: 0,
    timezone: "UTC",
    enabled: true,
    last_run_at: null,
  } as any;

  it("is due after the run time and not twice in one day", () => {
    const now = new Date("2026-01-01T07:00:00Z");
    expect(isScheduleDue(base, now)).toBe(true);
    expect(isScheduleDue({ ...base, last_run_at: "2026-01-01T06:30:00Z" }, now)).toBe(false);
    expect(isScheduleDue(base, new Date("2026-01-01T05:00:00Z"))).toBe(false);
    expect(isScheduleDue({ ...base, enabled: false }, now)).toBe(false);
  });

  it("honours weekly and monthly cadence", () => {
    const thursday = new Date("2026-01-01T07:00:00Z"); // Thursday = 4
    expect(isScheduleDue({ ...base, cadence: "weekly", day_of_week: 4 }, thursday)).toBe(true);
    expect(isScheduleDue({ ...base, cadence: "weekly", day_of_week: 1 }, thursday)).toBe(false);
    expect(isScheduleDue({ ...base, cadence: "monthly", day_of_month: 1 }, thursday)).toBe(true);
    expect(isScheduleDue({ ...base, cadence: "monthly", day_of_month: 5 }, thursday)).toBe(false);
  });

  it("describes a schedule for the admin table", () => {
    expect(describeSchedule(base)).toContain("Daily at 06:00");
  });
});
