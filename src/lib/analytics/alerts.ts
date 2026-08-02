/**
 * Alert evaluation — cost spikes, payment failures, error bursts, traffic and
 * subscription anomalies. Rules live in `analytics_alerts`; each firing writes
 * an `alert_events` row and can notify staff through the notification engine.
 */

import { EVENTS } from "./constants";
import { countEvents } from "./engine";
import { round, safeDiv } from "./metrics";
import type { AlertRule, DateRange, Sb } from "./types";

export type AlertKind =
  | "ai_cost"
  | "payment_failures"
  | "server_errors"
  | "traffic_spike"
  | "traffic_drop"
  | "subscription_drop";

export const ALERT_KINDS: {
  kind: AlertKind;
  label: string;
  description: string;
  unit: string;
  defaultThreshold: number;
}[] = [
  {
    kind: "ai_cost",
    label: "High AI Cost",
    description: "Daily AI spend above threshold.",
    unit: "currency/day",
    defaultThreshold: 25,
  },
  {
    kind: "payment_failures",
    label: "Payment Failure Spike",
    description: "Failed payment share (last 24h).",
    unit: "%",
    defaultThreshold: 20,
  },
  {
    kind: "server_errors",
    label: "Server / JS Errors",
    description: "Errors captured in the last hour.",
    unit: "count/hour",
    defaultThreshold: 50,
  },
  {
    kind: "traffic_spike",
    label: "Traffic Spike",
    description: "Pageviews up vs. the previous day.",
    unit: "% increase",
    defaultThreshold: 200,
  },
  {
    kind: "traffic_drop",
    label: "Traffic Drop",
    description: "Pageviews down vs. the previous day.",
    unit: "% decrease",
    defaultThreshold: 50,
  },
  {
    kind: "subscription_drop",
    label: "Subscription Drop",
    description: "New subscriptions down vs. previous week.",
    unit: "% decrease",
    defaultThreshold: 50,
  },
];

export interface AlertEvaluation {
  ruleId: string;
  ruleName: string;
  kind: string;
  triggered: boolean;
  value: number;
  threshold: number;
  message: string;
}

const DAY = 86_400_000;

export async function evaluateRule(sb: Sb, rule: AlertRule): Promise<AlertEvaluation> {
  const now = Date.now();
  const threshold = Number(
    rule.threshold ?? ALERT_KINDS.find((k) => k.kind === rule.kind)?.defaultThreshold ?? 0,
  );
  const day: DateRange = { from: new Date(now - DAY), to: new Date(now), days: 1 };
  const prevDay: DateRange = { from: new Date(now - 2 * DAY), to: new Date(now - DAY), days: 1 };

  let value = 0;
  let message = "";

  switch (rule.kind as AlertKind) {
    case "ai_cost": {
      const { data } = await sb
        .from("ai_usage_logs")
        .select("cost_estimate")
        .gte("created_at", day.from.toISOString())
        .limit(50_000);
      value = round(
        (data ?? []).reduce((a, r) => a + Number(r.cost_estimate ?? 0), 0),
        4,
      );
      message = `AI spend in the last 24h is ${value} (threshold ${threshold}).`;
      break;
    }
    case "payment_failures": {
      const { data } = await sb
        .from("orders")
        .select("status")
        .gte("created_at", day.from.toISOString())
        .limit(10_000);
      const rows = data ?? [];
      const failed = rows.filter((o) =>
        ["failed", "declined", "cancelled", "canceled"].includes(o.status),
      ).length;
      value = round(safeDiv(failed, rows.length) * 100, 1);
      message = `${failed} of ${rows.length} payments failed (${value}%).`;
      break;
    }
    case "server_errors": {
      value = await countEvents(
        sb,
        { from: new Date(now - 3_600_000), to: new Date(now), days: 1 },
        [EVENTS.JS_ERROR],
      );
      message = `${value} errors captured in the last hour.`;
      break;
    }
    case "traffic_spike":
    case "traffic_drop": {
      const [cur, prev] = await Promise.all([
        countEvents(sb, day, [EVENTS.PAGEVIEW]),
        countEvents(sb, prevDay, [EVENTS.PAGEVIEW]),
      ]);
      const change = prev === 0 ? (cur > 0 ? 100 : 0) : ((cur - prev) / prev) * 100;
      value = round(rule.kind === "traffic_drop" ? -change : change, 1);
      message = `Pageviews ${cur} vs ${prev} yesterday (${round(change, 1)}%).`;
      break;
    }
    case "subscription_drop": {
      const week = new Date(now - 7 * DAY).toISOString();
      const prevWeek = new Date(now - 14 * DAY).toISOString();
      const [curRes, prevRes] = await Promise.all([
        sb
          .from("user_entitlements")
          .select("id", { count: "exact", head: true })
          .gte("created_at", week),
        sb
          .from("user_entitlements")
          .select("id", { count: "exact", head: true })
          .gte("created_at", prevWeek)
          .lt("created_at", week),
      ]);
      const cur = curRes.count ?? 0;
      const prev = prevRes.count ?? 0;
      const change = prev === 0 ? 0 : ((prev - cur) / prev) * 100;
      value = round(change, 1);
      message = `${cur} new subscriptions this week vs ${prev} last week.`;
      break;
    }
    default:
      message = `Unknown alert kind "${rule.kind}".`;
  }

  return {
    ruleId: rule.id,
    ruleName: rule.rule_name,
    kind: rule.kind,
    triggered: value >= threshold && threshold > 0,
    value,
    threshold,
    message,
  };
}

export async function evaluateAllRules(sb: Sb, rules: AlertRule[]): Promise<AlertEvaluation[]> {
  return Promise.all(rules.filter((r) => r.enabled).map((r) => evaluateRule(sb, r)));
}
