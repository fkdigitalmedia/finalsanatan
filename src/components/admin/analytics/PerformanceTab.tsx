import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Bug, Gauge, Smartphone } from "lucide-react";
import { getPerformanceMetrics, getPerformanceErrors } from "@/lib/analytics.functions";

type VitalRow = {
  name: string;
  unit: string;
  samples: number;
  p75: number;
  p95: number;
  avg: number;
  good_pct: number;
  poor_pct: number;
  thresholds: { good: number; poor: number; unit: string };
};

function fmt(v: number, unit: string) {
  if (unit === "ms") return `${Math.round(v)} ms`;
  return v.toFixed(3);
}

function ratingColor(pct: number, positive = true) {
  if (positive) {
    if (pct >= 75) return "text-emerald-600";
    if (pct >= 50) return "text-amber-600";
    return "text-destructive";
  }
  if (pct <= 5) return "text-emerald-600";
  if (pct <= 20) return "text-amber-600";
  return "text-destructive";
}

function VitalCard({ v }: { v: VitalRow }) {
  const isGood = v.p75 <= v.thresholds.good;
  const isPoor = v.p75 > v.thresholds.poor;
  const badge = isGood ? "Good" : isPoor ? "Poor" : "Needs Improvement";
  const badgeColor = isGood
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : isPoor
      ? "bg-destructive/10 text-destructive"
      : "bg-amber-500/10 text-amber-700 dark:text-amber-400";

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-semibold">{v.name}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className="mt-3 font-serif text-3xl font-semibold">
        {v.samples ? fmt(v.p75, v.unit) : "—"}
      </div>
      <div className="text-xs text-muted-foreground">
        p75 · {v.samples.toLocaleString()} samples
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground">Avg</div>
          <div className="font-medium">{v.samples ? fmt(v.avg, v.unit) : "—"}</div>
        </div>
        <div>
          <div className="text-muted-foreground">p95</div>
          <div className="font-medium">{v.samples ? fmt(v.p95, v.unit) : "—"}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Good</div>
          <div className={`font-medium ${ratingColor(v.good_pct, true)}`}>
            {v.good_pct.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Poor</div>
          <div className={`font-medium ${ratingColor(v.poor_pct, false)}`}>
            {v.poor_pct.toFixed(0)}%
          </div>
        </div>
      </div>
      <div className="mt-3 text-[11px] text-muted-foreground">
        Good ≤ {fmt(v.thresholds.good, v.unit)} · Poor &gt; {fmt(v.thresholds.poor, v.unit)}
      </div>
    </div>
  );
}

export function PerformanceTab({ days }: { days: number }) {
  const metricsFn = useServerFn(getPerformanceMetrics);
  const errorsFn = useServerFn(getPerformanceErrors);

  const metrics = useQuery({
    queryKey: ["admin", "analytics", "perf", "metrics", days],
    queryFn: () => metricsFn({ data: { days } }),
    staleTime: 60_000,
  });
  const errors = useQuery({
    queryKey: ["admin", "analytics", "perf", "errors", days],
    queryFn: () => errorsFn({ data: { days } }),
    staleTime: 60_000,
  });

  if (metrics.isLoading || errors.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  const summary = metrics.data?.summary ?? [];
  const slowPages = metrics.data?.slowPages ?? [];
  const devices = metrics.data?.devices ?? [];
  const err = errors.data;

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Core Web Vitals · last {days} days</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {summary.map((v) => (
            <VitalCard key={v.name} v={v} />
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Slowest pages (LCP p75)</h3>
          </div>
          {slowPages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Not enough samples yet — needs ≥ 5 LCP measurements per page.
            </p>
          ) : (
            <ul className="divide-y">
              {slowPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="truncate font-mono text-xs">{p.path}</span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">{p.samples} samples</span>
                    <span
                      className={`font-medium ${
                        p.p75_lcp > 4000
                          ? "text-destructive"
                          : p.p75_lcp > 2500
                            ? "text-amber-600"
                            : "text-emerald-600"
                      }`}
                    >
                      {Math.round(p.p75_lcp)} ms
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">LCP by device (p75)</h3>
          </div>
          <ul className="divide-y">
            {devices.map((d) => (
              <li
                key={d.device}
                className="flex items-center justify-between py-2 text-sm capitalize"
              >
                <span>{d.device}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{d.samples}</span>
                  <span className="font-medium">
                    {d.samples ? `${Math.round(d.p75_lcp)} ms` : "—"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">JavaScript errors</h3>
          </div>
          {err && (
            <div className="text-xs text-muted-foreground">
              {err.total.toLocaleString()} total · {err.unique.toLocaleString()} unique ·{" "}
              <span className={ratingColor(err.rate_per_1k * 10, false)}>
                {err.rate_per_1k.toFixed(2)} / 1k pageviews
              </span>
            </div>
          )}
        </div>
        {!err || err.errors.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No JavaScript errors captured in this window. 🎉
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 pr-3">Message</th>
                  <th className="py-2 pr-3">Count</th>
                  <th className="py-2 pr-3">Pages</th>
                  <th className="py-2 pr-3">Browsers</th>
                  <th className="py-2 pr-3">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {err.errors.map((e, i) => (
                  <tr key={i} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-3">
                      <div className="line-clamp-2 max-w-md font-mono text-xs">{e.message}</div>
                      {e.top_path && (
                        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {e.top_path}
                        </div>
                      )}
                    </td>
                    <td className="py-2 pr-3 font-medium">{e.count}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{e.path_count}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      {e.browsers.slice(0, 3).join(", ") || "—"}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">
                      {new Date(e.last_seen).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
