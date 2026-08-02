import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Save, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import {
  getAdminIntegrations,
  upsertAdminIntegration,
  getGscStatus,
} from "@/lib/integrations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Row = { key: string; config: Record<string, unknown>; enabled: boolean };

const SPECS = [
  {
    key: "ga4",
    title: "Google Analytics 4",
    description: "Adds gtag.js to every page. Enter your Measurement ID (starts with G-).",
    fields: [{ id: "measurement_id", label: "Measurement ID", placeholder: "G-XXXXXXXXXX" }],
    docs: "https://support.google.com/analytics/answer/9539598",
  },
  {
    key: "clarity",
    title: "Microsoft Clarity",
    description: "Session recordings & heatmaps. Enter your Clarity project ID.",
    fields: [{ id: "project_id", label: "Project ID", placeholder: "abcdefghij" }],
    docs: "https://clarity.microsoft.com/",
  },
  {
    key: "gsc",
    title: "Google Search Console",
    description:
      "Pulls clicks, impressions, CTR and top queries. Uses the Lovable Google Search Console connector — the site URL below picks which verified property to query.",
    fields: [
      {
        id: "site_url",
        label: "Site URL",
        placeholder: "sc-domain:example.com or https://example.com/",
      },
    ],
    docs: "https://search.google.com/search-console",
  },
] as const;

export function IntegrationsTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(getAdminIntegrations);
  const upsertFn = useServerFn(upsertAdminIntegration);
  const gscFn = useServerFn(getGscStatus);

  const listQ = useQuery({
    queryKey: ["admin", "integrations"],
    queryFn: () => listFn(),
    staleTime: 30_000,
  });
  const gscQ = useQuery({
    queryKey: ["admin", "integrations", "gsc-status"],
    queryFn: () => gscFn(),
    staleTime: 30_000,
  });

  const rows = (listQ.data as Row[] | undefined) ?? [];

  return (
    <div className="space-y-4">
      {SPECS.map((spec) => {
        const row = rows.find((r) => r.key === spec.key);
        return (
          <IntegrationCard
            key={spec.key}
            spec={spec}
            row={row}
            gscConnected={spec.key === "gsc" ? gscQ.data?.connected : undefined}
            gscSites={spec.key === "gsc" ? gscQ.data?.sites : undefined}
            gscError={spec.key === "gsc" ? gscQ.data?.error : undefined}
            onSave={async (config, enabled) => {
              try {
                await upsertFn({ data: { key: spec.key, config, enabled } });
                toast.success(`${spec.title} saved`);
                qc.invalidateQueries({ queryKey: ["admin", "integrations"] });
                qc.invalidateQueries({ queryKey: ["public-integrations"] });
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Failed to save");
              }
            }}
          />
        );
      })}
    </div>
  );
}

function IntegrationCard({
  spec,
  row,
  gscConnected,
  gscSites,
  gscError,
  onSave,
}: {
  spec: (typeof SPECS)[number];
  row?: Row;
  gscConnected?: boolean;
  gscSites?: { siteUrl: string; permissionLevel: string }[];
  gscError?: string;
  onSave: (config: Record<string, string>, enabled: boolean) => Promise<void>;
}) {
  const [enabled, setEnabled] = useState(row?.enabled ?? false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of spec.fields) {
      init[f.id] = String((row?.config?.[f.id] as string | undefined) ?? "");
    }
    return init;
  });
  const [saving, setSaving] = useState(false);

  const showGscStatus = spec.key === "gsc";
  const connected = !!gscConnected;

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold">{spec.title}</h3>
            {showGscStatus &&
              (connected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                  <XCircle className="h-3 w-3" /> Not connected
                </span>
              ))}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{spec.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`en-${spec.key}`} className="text-xs text-muted-foreground">
            Enabled
          </Label>
          <Switch id={`en-${spec.key}`} checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {spec.fields.map((f) => (
          <div key={f.id} className="space-y-1.5">
            <Label htmlFor={`${spec.key}-${f.id}`} className="text-xs">
              {f.label}
            </Label>
            <Input
              id={`${spec.key}-${f.id}`}
              placeholder={f.placeholder}
              value={values[f.id] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              autoComplete="off"
            />
          </div>
        ))}
      </div>

      {showGscStatus && !connected && (
        <div className="mt-4 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
          Ask the Lovable assistant: <em>"Connect Google Search Console"</em>. Once linked, refresh
          this page and your verified properties will appear below.
          {gscError ? <div className="mt-2 text-destructive/80">{gscError}</div> : null}
        </div>
      )}

      {showGscStatus && connected && gscSites && gscSites.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Verified properties (pick one to paste above)
          </div>
          <div className="flex flex-wrap gap-2">
            {gscSites.map((s) => (
              <button
                key={s.siteUrl}
                type="button"
                onClick={() => setValues((v) => ({ ...v, site_url: s.siteUrl }))}
                className="rounded-full border bg-muted/40 px-3 py-1 text-xs hover:bg-muted"
              >
                {s.siteUrl}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <a
          href={spec.docs}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Docs <ExternalLink className="h-3 w-3" />
        </a>
        <Button
          size="sm"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(values, enabled);
            setSaving(false);
          }}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
