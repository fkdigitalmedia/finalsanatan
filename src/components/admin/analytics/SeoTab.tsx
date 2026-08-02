import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MousePointerClick, Eye, TrendingUp, Target } from "lucide-react";

import { getGscStatus, getGscAnalytics, getAdminIntegrations } from "@/lib/integrations.functions";
import { KpiCard } from "@/components/admin/analytics/KpiCard";
import { Button } from "@/components/ui/button";

type Row = { key: string; config: Record<string, unknown>; enabled: boolean };

export function SeoTab({ days }: { days: number }) {
  const statusFn = useServerFn(getGscStatus);
  const listFn = useServerFn(getAdminIntegrations);
  const gscFn = useServerFn(getGscAnalytics);

  const statusQ = useQuery({
    queryKey: ["admin", "integrations", "gsc-status"],
    queryFn: () => statusFn(),
    staleTime: 60_000,
  });
  const listQ = useQuery({
    queryKey: ["admin", "integrations"],
    queryFn: () => listFn(),
    staleTime: 60_000,
  });

  const gscConfig = ((listQ.data as Row[] | undefined) ?? []).find((r) => r.key === "gsc");
  const configuredSiteUrl = (gscConfig?.config?.site_url as string | undefined) ?? "";
  const sites = statusQ.data?.sites ?? [];
  const firstVerified = sites[0]?.siteUrl ?? "";

  const [siteUrl, setSiteUrl] = useState<string>("");
  const [dimension, setDimension] = useState<"query" | "page" | "country" | "device">("query");

  const effectiveSite = siteUrl || configuredSiteUrl || firstVerified;
  const gscDays = Math.min(Math.max(days, 1), 90);

  const dataQ = useQuery({
    queryKey: ["admin", "gsc", effectiveSite, gscDays, dimension],
    queryFn: () =>
      gscFn({ data: { siteUrl: effectiveSite, days: gscDays, dimension, rowLimit: 25 } }),
    enabled: !!effectiveSite && !!statusQ.data?.connected,
    staleTime: 5 * 60_000,
  });

  if (statusQ.isLoading) return <div className="h-40 animate-pulse rounded-xl bg-muted" />;

  if (!statusQ.data?.connected) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
        <h3 className="font-serif text-lg font-semibold">Google Search Console not connected</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Ask the Lovable assistant to <em>"Connect Google Search Console"</em>, verify the site you
          want to monitor, then return here.
        </p>
        {statusQ.data?.error ? (
          <div className="mx-auto mt-3 max-w-lg rounded-md bg-destructive/5 p-2 text-xs text-destructive">
            {statusQ.data.error}
          </div>
        ) : null}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
        <h3 className="font-serif text-lg font-semibold">No verified properties</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The connected Google account has no verified Search Console properties. Verify your site
          in Search Console first.
        </p>
      </div>
    );
  }

  const totalClicks = dataQ.data?.totals.clicks ?? 0;
  const totalImpr = dataQ.data?.totals.impressions ?? 0;
  const ctr = totalImpr > 0 ? totalClicks / totalImpr : 0;
  const avgPos = dataQ.data?.rows.length
    ? dataQ.data.rows.reduce((a, r) => a + r.position, 0) / dataQ.data.rows.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-muted-foreground">Property</label>
        <select
          className="rounded-md border bg-background px-2 py-1 text-sm"
          value={effectiveSite}
          onChange={(e) => setSiteUrl(e.target.value)}
        >
          {sites.map((s) => (
            <option key={s.siteUrl} value={s.siteUrl}>
              {s.siteUrl}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-muted-foreground">
          last {gscDays} days • GSC max window 90d
        </span>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Clicks" value={totalClicks} icon={MousePointerClick} />
        <KpiCard label="Impressions" value={totalImpr} icon={Eye} />
        <KpiCard label="CTR" value={ctr} format="percent" icon={TrendingUp} />
        <KpiCard label="Avg. Position" value={Number(avgPos.toFixed(1))} icon={Target} />
      </section>

      <div className="flex flex-wrap gap-2">
        {(["query", "page", "country", "device"] as const).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={dimension === d ? "default" : "outline"}
            onClick={() => setDimension(d)}
          >
            {d[0].toUpperCase() + d.slice(1)}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card">
        <div className="border-b p-3 text-sm font-semibold">
          Top {dimension === "query" ? "queries" : dimension === "page" ? "pages" : dimension}
        </div>
        {dataQ.isLoading ? (
          <div className="h-40 animate-pulse bg-muted/40" />
        ) : dataQ.error ? (
          <div className="p-4 text-sm text-destructive">
            {dataQ.error instanceof Error ? dataQ.error.message : "Failed to load"}
          </div>
        ) : !dataQ.data?.rows.length ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No data yet. Search Console usually needs 2–3 days to backfill.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="p-3 text-left font-medium">
                    {dimension === "query" ? "Query" : dimension === "page" ? "Page" : dimension}
                  </th>
                  <th className="p-3 text-right font-medium">Clicks</th>
                  <th className="p-3 text-right font-medium">Impr.</th>
                  <th className="p-3 text-right font-medium">CTR</th>
                  <th className="p-3 text-right font-medium">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {dataQ.data.rows.map((r) => (
                  <tr key={r.key} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="max-w-[380px] truncate p-3">{r.key}</td>
                    <td className="p-3 text-right tabular-nums">{r.clicks}</td>
                    <td className="p-3 text-right tabular-nums">
                      {r.impressions.toLocaleString()}
                    </td>
                    <td className="p-3 text-right tabular-nums">{(r.ctr * 100).toFixed(2)}%</td>
                    <td className="p-3 text-right tabular-nums">{r.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
