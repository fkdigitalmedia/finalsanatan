import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Loader2,
  Plus,
  Power,
  RefreshCw,
  Star,
  TestTube2,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";
import {
  aiListProviders,
  aiListMappings,
  aiReorderProviders,
  aiSetDefaultProvider,
  aiTestProvider,
  aiUsageStats,
  aiUpsertProvider,
  aiDeleteProvider,
} from "@/lib/ai-providers.functions";

const PROVIDER_TYPES = [
  "lovable",
  "openai",
  "gemini",
  "anthropic",
  "deepseek",
  "groq",
  "openrouter",
  "mistral",
  "cohere",
  "perplexity",
  "xai",
  "custom",
];

type Provider = {
  id: string;
  name: string;
  provider_type: string;
  base_url: string | null;
  default_model: string | null;
  api_key_masked: string | null;
  organization_id: string | null;
  project_id: string | null;
  temperature: number | null;
  top_p: number | null;
  max_tokens: number | null;
  timeout_ms: number | null;
  retry_attempts: number;
  retry_delay_ms: number;
  priority: number;
  enabled: boolean;
  is_default: boolean;
  status: string;
  last_tested_at: string | null;
  notes: string | null;
  custom_headers: Record<string, string>;
  custom_params: Record<string, unknown>;
};

function ProviderEditor({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<Provider> | null;
  onSaved: () => void;
}) {
  const upsert = useServerFn(aiUpsertProvider);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        id: initial?.id,
        name: initial?.name ?? "",
        provider_type: initial?.provider_type ?? "openai",
        base_url: initial?.base_url ?? "",
        api_key: "",
        organization_id: initial?.organization_id ?? "",
        project_id: initial?.project_id ?? "",
        default_model: initial?.default_model ?? "",
        temperature: initial?.temperature ?? 0.7,
        top_p: initial?.top_p ?? 1,
        max_tokens: initial?.max_tokens ?? 2048,
        timeout_ms: initial?.timeout_ms ?? 60000,
        retry_attempts: initial?.retry_attempts ?? 2,
        retry_delay_ms: initial?.retry_delay_ms ?? 500,
        priority: initial?.priority ?? 100,
        enabled: initial?.enabled ?? false,
        notes: initial?.notes ?? "",
      });
    }
  }, [open, initial]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await upsert({ data: form });
      toast.success("Provider saved");
      onSaved();
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Edit provider" : "Add provider"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => set("name", e.target.value)}
                placeholder="OpenAI Production"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Type *</Label>
              <Select value={form.provider_type} onValueChange={(v) => set("provider_type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Base URL</Label>
            <Input
              value={form.base_url || ""}
              onChange={(e) => set("base_url", e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>
              API Key{" "}
              {initial?.id && (
                <span className="text-xs text-muted-foreground">
                  (leave blank to keep existing)
                </span>
              )}
            </Label>
            <Input
              type="password"
              value={form.api_key || ""}
              onChange={(e) => set("api_key", e.target.value)}
              placeholder={initial?.id ? "••••••••" : "sk-..."}
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Organization ID</Label>
              <Input
                value={form.organization_id || ""}
                onChange={(e) => set("organization_id", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Project ID</Label>
              <Input
                value={form.project_id || ""}
                onChange={(e) => set("project_id", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Default model *</Label>
            <Input
              value={form.default_model || ""}
              onChange={(e) => set("default_model", e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label>Temperature</Label>
              <Input
                type="number"
                step="0.1"
                value={form.temperature ?? ""}
                onChange={(e) => set("temperature", parseFloat(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Top P</Label>
              <Input
                type="number"
                step="0.1"
                value={form.top_p ?? ""}
                onChange={(e) => set("top_p", parseFloat(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Max tokens</Label>
              <Input
                type="number"
                value={form.max_tokens ?? ""}
                onChange={(e) => set("max_tokens", parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label>Timeout (ms)</Label>
              <Input
                type="number"
                value={form.timeout_ms ?? ""}
                onChange={(e) => set("timeout_ms", parseInt(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Retry attempts</Label>
              <Input
                type="number"
                value={form.retry_attempts ?? ""}
                onChange={(e) => set("retry_attempts", parseInt(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Retry delay (ms)</Label>
              <Input
                type="number"
                value={form.retry_delay_ms ?? ""}
                onChange={(e) => set("retry_delay_ms", parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Notes</Label>
            <Textarea
              rows={2}
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={!!form.enabled} onCheckedChange={(v) => set("enabled", v)} />
            <Label>Enabled</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProvidersTab() {
  const list = useServerFn(aiListProviders);
  const reorder = useServerFn(aiReorderProviders);
  const setDefault = useServerFn(aiSetDefaultProvider);
  const test = useServerFn(aiTestProvider);
  const upsert = useServerFn(aiUpsertProvider);
  const del = useServerFn(aiDeleteProvider);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const rows = (await list()) as any as Provider[];
      setProviders(rows);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...providers];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setProviders(next);
    await reorder({ data: { ordered_ids: next.map((p) => p.id) } });
  };

  const toggleEnabled = async (p: Provider) => {
    await upsert({
      data: { id: p.id, name: p.name, provider_type: p.provider_type, enabled: !p.enabled },
    });
    toast.success(!p.enabled ? "Enabled" : "Disabled");
    refresh();
  };

  const makeDefault = async (p: Provider) => {
    await setDefault({ data: { id: p.id } });
    toast.success(`${p.name} is now default`);
    refresh();
  };

  const runTest = async (p: Provider) => {
    setTesting(p.id);
    try {
      const res = await test({ data: { id: p.id } });
      if (res.ok) toast.success(`${p.name} OK (${res.latencyMs}ms)`);
      else toast.error(`${p.name}: ${res.message.slice(0, 200)}`);
      refresh();
    } finally {
      setTesting(null);
    }
  };

  const remove = async (p: Provider) => {
    if (!confirm(`Delete provider "${p.name}"?`)) return;
    await del({ data: { id: p.id } });
    toast.success("Deleted");
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Providers</h2>
          <p className="text-sm text-muted-foreground">
            Drag priority with arrows. First enabled provider handles requests; on failure the
            router falls through the list.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
          >
            <Plus className="size-4 mr-2" />
            Add provider
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        {providers.map((p, i) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-3 border-b last:border-b-0 px-4 py-3"
          >
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                <ArrowUp className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => move(i, 1)}
                disabled={i === providers.length - 1}
              >
                <ArrowDown className="size-3" />
              </Button>
            </div>
            <div className="w-8 text-center text-sm font-mono text-muted-foreground">{i + 1}</div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <span className="font-medium">{p.name}</span>
                {p.is_default && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="size-3" /> Default
                  </Badge>
                )}
                <Badge variant="outline">{p.provider_type}</Badge>
                {p.status === "healthy" && (
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    healthy
                  </Badge>
                )}
                {p.status === "error" && <Badge variant="destructive">error</Badge>}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {p.default_model || "no model"} · key: {p.api_key_masked ?? "(none, env fallback)"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={p.enabled} onCheckedChange={() => toggleEnabled(p)} />
              <span className="text-xs text-muted-foreground">{p.enabled ? "on" : "off"}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => runTest(p)}
              disabled={testing === p.id}
            >
              {testing === p.id ? (
                <Loader2 className="size-4 mr-1 animate-spin" />
              ) : (
                <TestTube2 className="size-4 mr-1" />
              )}
              Test
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => makeDefault(p)}
              disabled={p.is_default}
            >
              <Star className="size-4 mr-1" />
              Default
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(p);
                setEditorOpen(true);
              }}
            >
              Edit
            </Button>
            <Button variant="ghost" size="icon" onClick={() => remove(p)}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
        {!providers.length && !loading && (
          <div className="p-8 text-center text-sm text-muted-foreground">No providers yet.</div>
        )}
      </div>

      <ProviderEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={editing}
        onSaved={refresh}
      />
    </div>
  );
}

function ModelsTab() {
  const config: CrudConfig = {
    table: "ai_models",
    keyColumn: "id",
    title: "Models",
    description: "Models available under each provider. Reference these from feature mappings.",
    searchColumn: "model_name",
    fields: [
      {
        name: "provider_id",
        label: "Provider ID",
        type: "text",
        required: true,
        placeholder: "UUID from Providers tab",
      },
      {
        name: "model_name",
        label: "Model name",
        type: "text",
        required: true,
        placeholder: "gpt-4o-mini",
      },
      { name: "display_name", label: "Display name", type: "text" },
      { name: "context_window", label: "Context window", type: "number" },
      { name: "input_cost_per_1k", label: "Input $/1k tokens", type: "number" },
      { name: "output_cost_per_1k", label: "Output $/1k tokens", type: "number" },
      { name: "enabled", label: "Enabled", type: "boolean" },
      { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
    ],
  };
  return <CrudTable config={config} />;
}

function MappingsTab() {
  const list = useServerFn(aiListMappings);
  const listProviders = useServerFn(aiListProviders);
  const [mappings, setMappings] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    list().then(setMappings);
    listProviders().then(setProviders as any);
  }, []);

  const providerName = (id: string | null) => providers.find((p) => p.id === id)?.name ?? "—";

  const config: CrudConfig = {
    table: "ai_feature_mappings",
    keyColumn: "id",
    title: "Feature Mapping",
    description:
      "Pin a specific provider + model to each app feature (chat, article-generator, translation, seo, summarizer, tool:*, studio:*).",
    searchColumn: "feature_key",
    fields: [
      {
        name: "feature_key",
        label: "Feature key",
        type: "text",
        required: true,
        placeholder: "chat, studio:article, tool:dharma-assistant",
      },
      {
        name: "provider_id",
        label: "Provider ID",
        type: "text",
        required: true,
        placeholder: "UUID from Providers tab",
      },
      { name: "model_name", label: "Model (optional override)", type: "text" },
      { name: "enabled", label: "Enabled", type: "boolean" },
      { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
    ],
  };

  return (
    <div className="space-y-4">
      <CrudTable config={config} />
      {mappings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current mapping preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1 font-mono">
              {mappings.map((m) => (
                <div key={m.id}>
                  <span className="text-muted-foreground">{m.feature_key}</span> →{" "}
                  <span>{providerName(m.provider_id)}</span>
                  {m.model_name && <span className="text-muted-foreground"> ({m.model_name})</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function UsageTab() {
  const stats = useServerFn(aiUsageStats);
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const load = async (d: number) => {
    setLoading(true);
    try {
      setData(await stats({ data: { days: d } }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(days);
  }, [days]);

  const providerRows = useMemo(() => (data ? Object.entries<any>(data.byProvider) : []), [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Usage</h2>
          <p className="text-sm text-muted-foreground">Aggregated from ai_usage_logs.</p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(parseInt(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24h</SelectItem>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard icon={Activity} label="Requests" value={data?.total ?? "—"} />
        <StatCard
          icon={CheckCircle2}
          label="Success rate"
          value={data ? `${data.successRate}%` : "—"}
        />
        <StatCard icon={XCircle} label="Failures" value={data?.failures ?? "—"} />
        <StatCard icon={Power} label="Avg latency" value={data ? `${data.avgLatencyMs}ms` : "—"} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <StatCard label="Total tokens" value={data?.totalTokens?.toLocaleString?.() ?? "—"} />
        <StatCard label="Estimated cost" value={data ? `$${data.estimatedCost}` : "—"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">By provider</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <Loader2 className="size-4 animate-spin" />}
          <div className="text-sm">
            <div className="grid grid-cols-5 gap-2 font-medium text-muted-foreground pb-2 border-b">
              <div>Provider</div>
              <div>Requests</div>
              <div>Success</div>
              <div>Tokens</div>
              <div>Avg latency</div>
            </div>
            {providerRows.map(([name, r]) => (
              <div key={name} className="grid grid-cols-5 gap-2 py-2 border-b last:border-b-0">
                <div className="font-medium">{name}</div>
                <div>{r.requests}</div>
                <div>{r.success}</div>
                <div>{r.tokens?.toLocaleString?.() ?? 0}</div>
                <div>{r.latency}ms</div>
              </div>
            ))}
            {!providerRows.length && !loading && (
              <div className="text-muted-foreground py-6 text-center">No usage in this window.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs font-mono space-y-1 max-h-96 overflow-auto">
            {(data?.recent ?? []).map((r: any, i: number) => (
              <div key={i} className={r.success ? "" : "text-destructive"}>
                {new Date(r.created_at).toLocaleTimeString()} · {r.provider_name} · {r.model_name} ·{" "}
                {r.feature_key} · {r.latency_ms}ms · {r.total_tokens ?? 0}t ·{" "}
                {r.success ? "OK" : `FAIL: ${(r.error_message ?? "").slice(0, 80)}`}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon?: any; label: string; value: any }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        {Icon && <Icon className="size-5 text-primary" />}
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function AIProvidersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Providers</h1>
        <p className="text-sm text-muted-foreground">
          Manage every AI provider from one place. Swap defaults, add fallbacks, pin providers to
          specific features, and monitor usage — no redeploy needed.
        </p>
      </div>
      <Tabs defaultValue="providers">
        <TabsList>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="mapping">Feature Mapping</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="providers" className="mt-4">
          <ProvidersTab />
        </TabsContent>
        <TabsContent value="models" className="mt-4">
          <ModelsTab />
        </TabsContent>
        <TabsContent value="mapping" className="mt-4">
          <MappingsTab />
        </TabsContent>
        <TabsContent value="usage" className="mt-4">
          <UsageTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/_admin/admin/ai-providers")({
  component: AIProvidersPage,
  head: () => ({
    meta: [{ title: "Admin — AI Providers" }, { name: "robots", content: "noindex" }],
  }),
});
