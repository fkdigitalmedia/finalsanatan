/**
 * Phase 14.9 BI tabs — Revenue, Funnel, Retention, Cohorts, Reports & Alerts.
 * All data comes from `@/lib/analytics-bi.functions`.
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Download, RefreshCw } from "lucide-react";

import {
  evaluateBiAlerts,
  exportBiReport,
  getBiCohorts,
  getBiDashboard,
  getBiReport,
} from "@/lib/analytics-bi.functions";
import { downloadExport } from "@/lib/analytics/export";
import { REPORT_TYPES } from "@/lib/analytics/reports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { KpiCard } from "@/components/admin/analytics/KpiCard";
import { BreakdownList } from "@/components/admin/analytics/BreakdownList";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

type AnyRec = Record<string, unknown>;

function num(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
function rows(v: unknown): AnyRec[] {
  return Array.isArray(v) ? (v as AnyRec[]) : [];
}
function series(v: unknown): { t: string; value: number }[] {
  return rows(v).map((p) => ({ t: String(p.t ?? ""), value: num(p.value) }));
}
function breakdown(v: unknown): { key: string; value: number; pct?: number }[] {
  return rows(v).map((p) => ({ key: String(p.key ?? "—"), value: num(p.value), pct: num(p.pct) }));
}

function useDashboard(dashboard: string, days: number) {
  const fn = useServerFn(getBiDashboard);
  return useQuery({
    queryKey: ["admin", "bi", dashboard, days],
    queryFn: () => fn({ data: { dashboard, days } }) as Promise<AnyRec>,
    staleTime: 60_000,
  });
}

function Loading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <SanatanLoader title={label} compact />
    </div>
  );
}

/** Generic single-series area chart for BI panels. */
function MiniChart({ title, data }: { title: string; data: { t: string; value: number }[] }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="biGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="t"
              fontSize={11}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v: string) => v.slice(5, 10)}
            />
            <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" width={40} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="url(#biGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Revenue ----
export function RevenueTab({ days }: { days: number }) {
  const q = useDashboard("revenue", days);
  if (q.isLoading) return <Loading label="Calculating revenue…" />;
  const d = (q.data ?? {}) as AnyRec;
  const cur = String(d.currency ?? "INR");
  const money = (n: number) =>
    `${cur === "INR" ? "₹" : ""}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Gross revenue" value={money(num(d.gross))} />
        <KpiCard label="Net revenue" value={money(num(d.net))} />
        <KpiCard label="MRR" value={money(num(d.mrr))} />
        <KpiCard label="ARR" value={money(num(d.arr))} />
        <KpiCard label="Orders" value={num(d.orders).toLocaleString()} />
        <KpiCard label="Avg order value" value={money(num(d.aov))} />
        <KpiCard label="Lifetime value" value={money(num(d.ltv))} />
        <KpiCard label="Refunds" value={money(num(d.refunds))} />
        <KpiCard label="Coupon discount" value={money(num(d.couponDiscount))} />
        <KpiCard label="Payment failure rate" value={`${num(d.paymentFailureRate)}%`} />
        <KpiCard label="Active subscriptions" value={num(d.activeSubscriptions).toLocaleString()} />
        <KpiCard label="New subscriptions" value={num(d.newSubscriptions).toLocaleString()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MiniChart title="Revenue" data={series(d.revenueSeries)} />
        <MiniChart title="Subscription growth" data={series(d.subscriptionSeries)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BreakdownList title="Payment gateways" rows={breakdown(d.byGateway)} />
        <BreakdownList title="Plans" rows={breakdown(d.byPlan)} />
        <BreakdownList title="Coupons" rows={breakdown(d.byCoupon)} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------- Funnel ----
export function FunnelTab({ days }: { days: number }) {
  const q = useDashboard("funnels", days);
  if (q.isLoading) return <Loading label="Mapping the journey…" />;
  const d = (q.data ?? {}) as AnyRec;
  const steps = rows(d.steps);
  const top = num(steps[0]?.users) || 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Entered funnel" value={num(steps[0]?.users).toLocaleString()} />
        <KpiCard
          label="Overall conversion"
          value={`${num(steps[steps.length - 1]?.overallPct)}%`}
        />
        <KpiCard label="Biggest drop-off" value={String(d.biggestDropOff ?? "—")} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visitor → Renewal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((s, i) => (
            <div key={String(s.key ?? i)} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {i + 1}. {String(s.label ?? s.key)}
                </span>
                <span className="text-muted-foreground">
                  {num(s.users).toLocaleString()} · {num(s.overallPct)}% overall
                  {i > 0 ? ` · ${num(s.stepPct)}% step` : ""}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(1, (num(s.users) / top) * 100)}%` }}
                />
              </div>
              {i > 0 && num(s.dropOff) > 0 && (
                <p className="text-xs text-muted-foreground">
                  {num(s.dropOff).toLocaleString()} users dropped off at this step
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------- Retention ----
export function RetentionTab({ days }: { days: number }) {
  const q = useDashboard("retention", days);
  if (q.isLoading) return <Loading label="Measuring retention…" />;
  const d = (q.data ?? {}) as AnyRec;
  const windows = rows(d.windows);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {windows.map((w) => (
          <KpiCard
            key={String(w.windowDays)}
            label={`Day ${String(w.windowDays)}`}
            value={`${num(w.pct)}%`}
            hint={`${num(w.retained)} / ${num(w.cohortSize)}`}
          />
        ))}
      </div>
      <MiniChart title="Retention curve (% active since signup)" data={series(d.curve)} />
    </div>
  );
}

// ---------------------------------------------------------------- Cohorts ----
const COHORT_METRICS = [
  "retention",
  "engagement",
  "revenue",
  "tool_usage",
  "subscription",
] as const;
const COHORT_PERIODS = ["day", "week", "month"] as const;

export function CohortsTab({ days }: { days: number }) {
  const [metric, setMetric] = useState<(typeof COHORT_METRICS)[number]>("retention");
  const [period, setPeriod] = useState<(typeof COHORT_PERIODS)[number]>("week");
  const fn = useServerFn(getBiCohorts);

  const q = useQuery({
    queryKey: ["admin", "bi", "cohorts", days, metric, period],
    queryFn: () => fn({ data: { days, metric, period } }) as Promise<AnyRec>,
    staleTime: 60_000,
  });

  const d = (q.data ?? {}) as AnyRec;
  const cohortRows = rows(d.rows);
  const periods = num(d.periods) || 8;

  const shade = (pct: number) => {
    const a = Math.min(0.85, Math.max(0.05, pct / 100));
    return {
      backgroundColor: `hsl(var(--primary) / ${a})`,
      color: a > 0.45 ? "hsl(var(--primary-foreground))" : undefined,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {COHORT_METRICS.map((m) => (
          <Button
            key={m}
            size="sm"
            variant={metric === m ? "default" : "outline"}
            onClick={() => setMetric(m)}
          >
            {m.replace("_", " ")}
          </Button>
        ))}
        <span className="mx-2 w-px bg-border" />
        {COHORT_PERIODS.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={period === p ? "default" : "outline"}
            onClick={() => setPeriod(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      {q.isLoading ? (
        <Loading label="Building cohorts…" />
      ) : cohortRows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No signups in this range yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 text-left font-medium">Cohort</th>
                <th className="p-2 text-left font-medium">Size</th>
                {Array.from({ length: periods }, (_, i) => (
                  <th key={i} className="p-2 text-center font-medium">
                    {period[0].toUpperCase()}
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortRows.map((r) => {
                const pct = (r.pct as number[]) ?? [];
                const values = (r.values as number[]) ?? [];
                return (
                  <tr key={String(r.cohort)} className="border-t">
                    <td className="p-2 font-medium">{String(r.cohort)}</td>
                    <td className="p-2 text-muted-foreground">{num(r.size)}</td>
                    {Array.from({ length: periods }, (_, i) => (
                      <td key={i} className="p-1 text-center" style={shade(num(pct[i]))}>
                        {pct[i] === undefined
                          ? "—"
                          : metric === "revenue"
                            ? num(values[i])
                            : `${num(pct[i])}%`}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Reports ----
const FORMATS = ["csv", "xlsx", "json", "pdf"] as const;

export function ReportsTab({ days }: { days: number }) {
  const [type, setType] = useState<(typeof REPORT_TYPES)[number]>("overview");
  const reportFn = useServerFn(getBiReport);
  const exportFn = useServerFn(exportBiReport);
  const [busy, setBusy] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin", "bi", "report", type, days],
    queryFn: () => reportFn({ data: { type, days } }) as Promise<AnyRec>,
    staleTime: 60_000,
  });

  const table = (q.data ?? {}) as AnyRec;
  const columns = (table.columns as string[]) ?? [];
  const data = rows(table.rows);

  const doExport = async (format: (typeof FORMATS)[number]) => {
    setBusy(format);
    try {
      const rendered = await exportFn({ data: { type, days, format } });
      downloadExport(rendered as { filename: string; contentType: string; content: string });
      toast.success(`Exported ${format.toUpperCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REPORT_TYPES.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={type === t ? "default" : "outline"}
            onClick={() => setType(t)}
          >
            {t.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FORMATS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant="secondary"
            disabled={busy !== null}
            onClick={() => doExport(f)}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {busy === f ? "Preparing…" : f.toUpperCase()}
          </Button>
        ))}
        <span className="text-xs text-muted-foreground">{data.length} rows</span>
      </div>

      {q.isLoading ? (
        <Loading label="Compiling report…" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                {columns.map((c) => (
                  <th key={c} className="p-2 text-left font-medium capitalize">
                    {c.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 300).map((r, i) => (
                <tr key={i} className="border-t">
                  {columns.map((c) => (
                    <td key={c} className="p-2">
                      {typeof r[c] === "object" ? JSON.stringify(r[c]) : String(r[c] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------- Alerts ----
export function AlertsTab() {
  const fn = useServerFn(evaluateBiAlerts);
  const q = useQuery({
    queryKey: ["admin", "bi", "alerts"],
    queryFn: () => fn({ data: { persist: false } }) as Promise<unknown>,
    staleTime: 30_000,
  });
  const list = rows(q.data);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Rules are stored in the alerts table and re-evaluated on demand and by the cron tick.
        </p>
        <Button size="sm" variant="outline" onClick={() => q.refetch()}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-evaluate
        </Button>
      </div>

      {q.isLoading ? (
        <Loading label="Checking alert rules…" />
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No alert rules configured yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((a) => (
            <Card
              key={String(a.ruleId)}
              className={a.triggered ? "border-destructive/60" : undefined}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{String(a.ruleName)}</CardTitle>
                <Badge variant={a.triggered ? "destructive" : "secondary"}>
                  {a.triggered ? (
                    <>
                      <AlertTriangle className="mr-1 h-3 w-3" /> Triggered
                    </>
                  ) : (
                    "Normal"
                  )}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p>{String(a.message)}</p>
                <p>
                  Value <span className="font-medium text-foreground">{num(a.value)}</span> ·
                  threshold {num(a.threshold)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
