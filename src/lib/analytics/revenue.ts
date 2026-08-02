/**
 * Revenue analytics — orders, MRR/ARR, AOV, refunds, coupons, gateways.
 */

import { bucketOf, bucketsFor } from "./engine";
import { fillSeries, mean, round, safeDiv, sum } from "./metrics";
import { autoGranularity } from "./validators";
import type { BreakdownRow, DateRange, Granularity, Point, RevenueSummary, Sb } from "./types";

const PAID = ["paid", "captured", "completed", "succeeded", "active"];
const FAILED = ["failed", "cancelled", "canceled", "declined"];
const REFUNDED = ["refunded", "partially_refunded", "chargeback"];

interface OrderRow {
  id: string;
  user_id: string | null;
  plan_id: string | null;
  provider: string;
  amount_cents: number;
  currency: string;
  status: string;
  product_type: string;
  created_at: string;
}

export interface RevenueResult extends RevenueSummary {
  paymentFailureRate: number;
  payingUsers: number;
  subscriptionGrowth: Point[];
  refundCount: number;
  couponsRedeemed: number;
}

export async function getRevenueAnalytics(
  sb: Sb,
  range: DateRange,
  granularity?: Granularity,
): Promise<RevenueResult> {
  const gran = autoGranularity(range, granularity);

  const [ordersRes, plansRes, couponsRes, entRes] = await Promise.all([
    sb
      .from("orders")
      .select("id,user_id,plan_id,provider,amount_cents,currency,status,product_type,created_at")
      .gte("created_at", range.from.toISOString())
      .lt("created_at", range.to.toISOString())
      .limit(50_000),
    sb.from("subscription_plans").select("id,name,slug,price_cents,currency,interval,product_type"),
    sb.from("coupons").select("code,redemptions,percent_off,amount_off_cents,currency"),
    sb.from("user_entitlements").select("user_id,plan_id,active,source,created_at").limit(50_000),
  ]);

  const orders = (ordersRes.data ?? []) as OrderRow[];
  const plans = plansRes.data ?? [];
  const planById = new Map(plans.map((p) => [p.id, p]));

  const paid = orders.filter((o) => PAID.includes(o.status));
  const failed = orders.filter((o) => FAILED.includes(o.status));
  const refunded = orders.filter((o) => REFUNDED.includes(o.status));

  const amount = (o: OrderRow) => Number(o.amount_cents ?? 0) / 100;
  const gross = sum(paid.map(amount));
  const refunds = sum(refunded.map(amount));
  const currency = paid[0]?.currency ?? plans[0]?.currency ?? "INR";

  // MRR from currently active recurring entitlements.
  const activeEnts = (entRes.data ?? []).filter((e) => e.active);
  let mrr = 0;
  for (const e of activeEnts) {
    const plan = e.plan_id ? planById.get(e.plan_id) : null;
    if (!plan || plan.product_type !== "subscription") continue;
    const monthly =
      plan.interval === "year" ? Number(plan.price_cents) / 12 : Number(plan.price_cents);
    mrr += monthly / 100;
  }

  const payingUsers = new Set(paid.map((o) => o.user_id).filter(Boolean)).size;

  const byGateway: BreakdownRow[] = aggregate(paid, (o) => o.provider || "unknown", amount);
  const byPlan: BreakdownRow[] = aggregate(
    paid,
    (o) => (o.plan_id ? (planById.get(o.plan_id)?.name ?? "Unknown plan") : "Ad-hoc"),
    amount,
  );

  // Revenue timeseries
  const points = new Map<string, number>();
  for (const o of paid) {
    const b = bucketOf(o.created_at, gran);
    points.set(b, (points.get(b) ?? 0) + amount(o));
  }
  const timeseries: Point[] = fillSeries(
    [...points.entries()].map(([t, value]) => ({ t, value: round(value, 2) })),
    bucketsFor(range, gran),
  );

  // Subscription growth = new active entitlements per bucket
  const growth = new Map<string, number>();
  for (const e of activeEnts) {
    const b = bucketOf(e.created_at, gran);
    growth.set(b, (growth.get(b) ?? 0) + 1);
  }
  const subscriptionGrowth = fillSeries(
    [...growth.entries()].map(([t, value]) => ({ t, value })),
    bucketsFor(range, gran),
  );

  const couponRows = couponsRes.data ?? [];
  const couponsRedeemed = sum(couponRows.map((c) => Number(c.redemptions ?? 0)));
  const couponDiscount = sum(
    couponRows.map((c) => {
      const redemptions = Number(c.redemptions ?? 0);
      if (c.amount_off_cents) return (Number(c.amount_off_cents) / 100) * redemptions;
      if (c.percent_off && paid.length)
        return ((mean(paid.map(amount)) * Number(c.percent_off)) / 100) * redemptions;
      return 0;
    }),
  );

  return {
    gross: round(gross, 2),
    net: round(gross - refunds, 2),
    refunds: round(refunds, 2),
    refundCount: refunded.length,
    currency,
    orders: paid.length,
    aov: round(safeDiv(gross, paid.length), 2),
    mrr: round(mrr, 2),
    arr: round(mrr * 12, 2),
    ltv: round(safeDiv(gross, payingUsers || 1), 2),
    couponDiscount: round(couponDiscount, 2),
    couponsRedeemed,
    payingUsers,
    paymentFailureRate: round(safeDiv(failed.length, paid.length + failed.length) * 100, 1),
    byGateway,
    byPlan,
    timeseries,
    subscriptionGrowth,
  };
}

function aggregate<T>(
  rows: T[],
  keyOf: (r: T) => string,
  valueOf: (r: T) => number,
): BreakdownRow[] {
  const map = new Map<string, number>();
  for (const r of rows) map.set(keyOf(r), (map.get(keyOf(r)) ?? 0) + valueOf(r));
  const total = sum([...map.values()]);
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      key,
      label: key,
      value: round(value, 2),
      pct: round(safeDiv(value, total) * 100, 1),
    }));
}
