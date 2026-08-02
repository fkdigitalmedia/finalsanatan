import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Activity, Database, Gauge, RefreshCw, Trash2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { flushPerformanceCaches, getPerformanceSnapshot } from "@/lib/perf/perf.functions";

export const Route = createFileRoute("/_authenticated/_admin/admin/performance")({
  component: PerformancePage,
  head: () => ({
    meta: [{ title: "Admin — Performance" }, { name: "robots", content: "noindex" }],
  }),
});

const VERDICT_STYLES: Record<string, string> = {
  ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warn: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  critical: "bg-destructive/15 text-destructive",
  unknown: "bg-muted text-muted-foreground",
};

const STATUS_STYLES: Record<string, string> = {
  ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  degraded: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  down: "bg-destructive/15 text-destructive",
  skipped: "bg-muted text-muted-foreground",
};

function ms(value: number | null | undefined): string {
  if (value == null) return "—";
  return value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

function PerformancePage() {
  const queryClient = useQueryClient();
  const fetchSnapshot = useServerFn(getPerformanceSnapshot);
  const flush = useServerFn(flushPerformanceCaches);

  const snapshot = useQuery({
    queryKey: ["admin", "performance"],
    queryFn: () => fetchSnapshot(),
    refetchInterval: 30_000,
  });

  const flushMutation = useMutation({
    mutationFn: (namespace?: string) => flush({ data: { namespace } }),
    onSuccess: (res: any) => {
      toast.success(`Cache flushed: ${res?.cleared ?? "all"}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "performance"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not flush cache"),
  });

  const data = snapshot.data;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Performance</h1>
          <p className="text-sm text-muted-foreground">
            Live server health, cache efficiency, latency percentiles and budget grades.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => snapshot.refetch()}
            disabled={snapshot.isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${snapshot.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => flushMutation.mutate(undefined)}
            disabled={flushMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Flush all caches
          </Button>
        </div>
      </header>

      {snapshot.isLoading && <SanatanLoader title="Measuring system performance" compact />}
      {snapshot.isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {(snapshot.error as Error)?.message ?? "Failed to load performance data."}
        </div>
      )}

      {data && (
        <>
          {/* ---------- headline tiles ---------- */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Server health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className={STATUS_STYLES[data.health.status]}>{data.health.status}</Badge>
                <p className="mt-2 text-xs text-muted-foreground">
                  v{data.health.version} · uptime {Math.round(data.uptimeSeconds / 60)} min
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Cache hit rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {(data.cacheHitRate * 100).toFixed(1)}%
                </div>
                <Progress value={data.cacheHitRate * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" /> API p95
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {ms(data.metrics.find((m) => m.group === "api")?.p95Ms ?? null)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {data.metrics.find((m) => m.group === "api")?.count ?? 0} requests sampled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Database className="h-4 w-4" /> Queue depth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {data.database.pendingNotifications ?? "—"}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">pending notifications</p>
              </CardContent>
            </Card>
          </div>

          {/* ---------- budgets ---------- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance budgets</CardTitle>
              <CardDescription>Measured against the Phase 15.2 targets.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.budgets.map((b) => (
                <div key={b.key} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{b.label}</span>
                    <Badge className={VERDICT_STYLES[b.verdict]}>{b.verdict}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {ms(b.actualMs)} <span className="opacity-60">/ target {ms(b.targetMs)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ---------- components ---------- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dependencies</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.health.components.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <span className="font-medium capitalize">{c.name}</span>
                  <span className="flex items-center gap-2">
                    {c.latencyMs != null && (
                      <span className="text-xs text-muted-foreground">{ms(c.latencyMs)}</span>
                    )}
                    <Badge className={STATUS_STYLES[c.status]}>{c.status}</Badge>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ---------- latency by subsystem ---------- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latency by subsystem</CardTitle>
              <CardDescription>
                Rolling window of the last 200 samples per operation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.metrics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No traffic sampled yet on this server instance.
                </p>
              )}
              {data.metrics.map((group) => (
                <div key={group.group}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide">{group.group}</h3>
                    <span className="text-xs text-muted-foreground">
                      {group.count} calls · {group.errors} errors · avg {ms(group.avgMs)}
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="p-2 text-left">Operation</th>
                          <th className="p-2 text-right">Calls</th>
                          <th className="p-2 text-right">Avg</th>
                          <th className="p-2 text-right">p95</th>
                          <th className="p-2 text-right">p99</th>
                          <th className="p-2 text-right">Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {group.operations.map((op) => (
                          <tr key={op.name}>
                            <td className="p-2 font-mono text-xs">{op.name}</td>
                            <td className="p-2 text-right">{op.count}</td>
                            <td className="p-2 text-right">{ms(op.avgMs)}</td>
                            <td className="p-2 text-right">{ms(op.p95Ms)}</td>
                            <td className="p-2 text-right">{ms(op.p99Ms)}</td>
                            <td className="p-2 text-right">{ms(op.maxMs)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ---------- caches ---------- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cache namespaces</CardTitle>
              <CardDescription>
                Driver: {data.cache[0]?.stats.driver ?? "memory"} — swap to Redis/Upstash without
                code changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.cache.length === 0 ? (
                <p className="text-sm text-muted-foreground">No namespace has been used yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="p-2 text-left">Namespace</th>
                        <th className="p-2 text-right">Entries</th>
                        <th className="p-2 text-right">Hits</th>
                        <th className="p-2 text-right">Misses</th>
                        <th className="p-2 text-right">Hit rate</th>
                        <th className="p-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.cache.map((c) => (
                        <tr key={c.namespace}>
                          <td className="p-2 font-medium">{c.namespace}</td>
                          <td className="p-2 text-right">
                            {c.stats.size < 0 ? "—" : c.stats.size}
                          </td>
                          <td className="p-2 text-right">{c.stats.hits}</td>
                          <td className="p-2 text-right">{c.stats.misses}</td>
                          <td className="p-2 text-right">{(c.hitRate * 100).toFixed(1)}%</td>
                          <td className="p-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => flushMutation.mutate(c.namespace)}
                              disabled={flushMutation.isPending}
                            >
                              Flush
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ---------- workload ---------- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workload (last 24h)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "AI calls", value: data.database.aiCallsLast24h },
                {
                  label: "AI cost (USD)",
                  value: data.database.aiCostLast24h,
                },
                { label: "PDF reports", value: data.database.reportsLast24h },
                { label: "Translations queued", value: data.database.queuedTranslations },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-xl font-semibold">{item.value ?? "—"}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
