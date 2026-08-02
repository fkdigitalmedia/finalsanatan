import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Activity, AlertOctagon, Bot, Coins, Cpu, Sparkles, Timer, Zap } from "lucide-react";
import { getAiAnalytics } from "@/lib/analytics.functions";
import { KpiCard } from "@/components/admin/analytics/KpiCard";
import { TrendChart } from "@/components/admin/analytics/TrendChart";

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}
function fmtUsd(n: number) {
  if (n >= 1000) return `$${n.toFixed(0)}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}
function fmtMs(n: number) {
  if (!n) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(2)} s`;
  return `${Math.round(n)} ms`;
}
function failureColor(rate: number) {
  if (rate <= 0.01) return "text-emerald-600";
  if (rate <= 0.05) return "text-amber-600";
  return "text-destructive";
}

type Row = {
  key: string;
  requests: number;
  failures: number;
  failure_rate: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost_usd: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
};

function BreakdownTable({
  title,
  icon: Icon,
  rows,
  keyLabel,
  empty,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: Row[];
  keyLabel: string;
  empty: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-3">{keyLabel}</th>
                <th className="py-2 pr-3 text-right">Requests</th>
                <th className="py-2 pr-3 text-right">Fail %</th>
                <th className="py-2 pr-3 text-right">Tokens</th>
                <th className="py-2 pr-3 text-right">Cost</th>
                <th className="py-2 pr-3 text-right">Avg</th>
                <th className="py-2 pr-3 text-right">p95</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-mono text-xs">{r.key}</td>
                  <td className="py-2 pr-3 text-right">{fmtNum(r.requests)}</td>
                  <td className={`py-2 pr-3 text-right ${failureColor(r.failure_rate)}`}>
                    {(r.failure_rate * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 pr-3 text-right text-muted-foreground">
                    {fmtNum(r.total_tokens)}
                  </td>
                  <td className="py-2 pr-3 text-right font-medium">{fmtUsd(r.cost_usd)}</td>
                  <td className="py-2 pr-3 text-right text-muted-foreground">
                    {fmtMs(r.avg_latency_ms)}
                  </td>
                  <td className="py-2 pr-3 text-right text-muted-foreground">
                    {fmtMs(r.p95_latency_ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AiTab({ days }: { days: number }) {
  const fn = useServerFn(getAiAnalytics);
  const q = useQuery({
    queryKey: ["admin", "analytics", "ai", days],
    queryFn: () => fn({ data: { days } }),
    staleTime: 60_000,
  });

  if (q.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }
  if (q.error) {
    const msg = q.error instanceof Error ? q.error.message : String(q.error);
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to load AI analytics: {msg}
      </div>
    );
  }
  const d = q.data;
  if (!d) return null;
  const t = d.totals;

  // Adapt the AI timeseries into TrendChart's shape (day/pageviews/sessions).
  const chartData = d.timeseries.map((r) => ({
    day: r.day,
    pageviews: r.requests,
    sessions: r.failures,
    ai: Math.round(r.cost_usd * 10000) / 10000,
  }));

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <KpiCard
          label="AI Requests"
          value={t.requests}
          icon={Bot}
          deltaPct={t.requests_delta_pct ?? undefined}
        />
        <KpiCard
          label="Total Cost"
          value={t.cost_usd}
          format="currency"
          icon={Coins}
          deltaPct={t.cost_delta_pct ?? undefined}
        />
        <KpiCard label="Total Tokens" value={t.total_tokens} icon={Sparkles} />
        <KpiCard label="Avg Latency" value={Math.round(t.avg_latency_ms)} icon={Timer} hint="ms" />
        <KpiCard label="p95 Latency" value={Math.round(t.p95_latency_ms)} icon={Zap} hint="ms" />
        <KpiCard
          label="Failure Rate"
          value={Number((t.failure_rate * 100).toFixed(2))}
          format="percent"
          icon={AlertOctagon}
          hint={`${t.failures} failed`}
        />
      </section>

      {/* Token split + trend */}
      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Token usage</h3>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Input tokens</dt>
              <dd className="font-medium">{fmtNum(t.input_tokens)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Output tokens</dt>
              <dd className="font-medium">{fmtNum(t.output_tokens)}</dd>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <dt className="text-muted-foreground">Cost / request</dt>
              <dd className="font-medium">
                {t.requests > 0 ? fmtUsd(t.cost_usd / t.requests) : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Tokens / request</dt>
              <dd className="font-medium">
                {t.requests > 0 ? fmtNum(Math.round(t.total_tokens / t.requests)) : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border bg-card p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Daily requests &amp; cost</h3>
            <span className="text-xs text-muted-foreground">
              {days} days · requests (bars) · cost USD (line)
            </span>
          </div>
          {chartData.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No AI usage recorded in this window.
            </p>
          ) : (
            <TrendChart data={chartData} />
          )}
        </div>
      </section>

      {/* Breakdowns */}
      <BreakdownTable
        title="By provider"
        icon={Bot}
        rows={d.providers}
        keyLabel="Provider"
        empty="No provider data yet."
      />
      <BreakdownTable
        title="By model"
        icon={Cpu}
        rows={d.models}
        keyLabel="Model"
        empty="No model data yet."
      />
      <BreakdownTable
        title="By feature"
        icon={Sparkles}
        rows={d.features}
        keyLabel="Feature"
        empty="No feature-tagged AI calls yet."
      />

      {/* Errors */}
      <section className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Top AI errors</h3>
        </div>
        {d.top_errors.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No failed AI requests in this window. 🎉
          </p>
        ) : (
          <ul className="divide-y">
            {d.top_errors.map((e, i) => (
              <li key={i} className="flex items-start justify-between gap-3 py-2 text-sm">
                <span className="line-clamp-2 max-w-2xl font-mono text-xs">{e.message}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="font-medium">{e.count}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(e.last_seen).toLocaleString()}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
