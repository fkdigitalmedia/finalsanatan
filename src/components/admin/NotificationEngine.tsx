/**
 * Admin — Notification Engine console.
 * Analytics, channels, templates, queue, schedules and delivery log.
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListChannels,
  adminUpdateChannel,
  adminListTemplates,
  adminSaveTemplate,
  adminDeleteTemplate,
  adminListQueue,
  adminQueueAction,
  adminProcessQueue,
  adminDispatchNotification,
  adminListSchedules,
  adminSaveSchedule,
  adminDeleteSchedule,
  adminNotificationAnalytics,
  adminListDeliveries,
} from "@/lib/notification-admin.functions";
import { CHANNELS, CHANNEL_LABELS, NOTIFICATION_TYPES } from "@/lib/notifications/types";
import { renderTemplate, extractVariables } from "@/lib/notifications/templates";
import { describeSchedule } from "@/lib/notifications/schedules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Play, RefreshCw, Save, Send, Trash2 } from "lucide-react";

const STATUS_TONE: Record<string, string> = {
  sent: "bg-emerald-500/15 text-emerald-600",
  pending: "bg-amber-500/15 text-amber-600",
  retrying: "bg-amber-500/15 text-amber-600",
  processing: "bg-sky-500/15 text-sky-600",
  failed: "bg-destructive/15 text-destructive",
  skipped: "bg-muted text-muted-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_TONE[status] ?? "bg-muted text-muted-foreground"}>{status}</Badge>
  );
}

/* ───────────────────────── Analytics ───────────────────────── */

export function NotificationAnalytics() {
  const fn = useServerFn(adminNotificationAnalytics);
  const [days, setDays] = useState(30);
  const { data, isLoading } = useQuery({
    queryKey: ["notif-analytics", days],
    queryFn: () => fn({ data: { days } }),
  });

  if (isLoading) return <Loader2 className="size-5 animate-spin" />;
  if (!data) return null;

  const maxDay = Math.max(1, ...data.byDay.map(([, n]) => n as number));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">Window</Label>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[7, 30, 90].map((d) => (
              <SelectItem key={d} value={String(d)}>
                {d} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total", data.total],
          ["Delivered", `${data.sent} (${data.deliveryRate}%)`],
          ["Failed", data.failed],
          ["Skipped", data.skipped],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold">{value as any}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Volume by day</CardTitle>
          </CardHeader>
          <CardContent className="flex h-40 items-end gap-1">
            {data.byDay.length === 0 && (
              <p className="text-sm text-muted-foreground">No deliveries yet.</p>
            )}
            {data.byDay.map(([day, n]) => (
              <div key={day} className="flex-1" title={`${day}: ${n}`}>
                <div
                  className="rounded-t bg-primary/70"
                  style={{ height: `${((n as number) / maxDay) * 100}%` }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By channel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data.byChannel).map(([ch, s]: any) => (
              <div key={ch} className="flex items-center justify-between text-sm">
                <span>{CHANNEL_LABELS[ch as keyof typeof CHANNEL_LABELS] ?? ch}</span>
                <span className="text-muted-foreground">
                  {s.sent} sent · {s.failed} failed · {s.skipped} skipped
                </span>
              </div>
            ))}
            {Object.keys(data.byChannel).length === 0 && (
              <p className="text-sm text-muted-foreground">No channel activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {data.topErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top errors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {data.topErrors.map(([msg, n]) => (
              <div key={msg} className="flex justify-between gap-4">
                <span className="truncate text-muted-foreground">{msg}</span>
                <span>{n as any}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ───────────────────────── Channels ───────────────────────── */

export function ChannelSettings() {
  const qc = useQueryClient();
  const list = useServerFn(adminListChannels);
  const update = useServerFn(adminUpdateChannel);
  const { data } = useQuery({ queryKey: ["notif-channels"], queryFn: () => list({}) });
  const [configDraft, setConfigDraft] = useState<Record<string, string>>({});

  const save = useMutation({
    mutationFn: (input: any) => update({ data: input }),
    onSuccess: () => {
      toast.success("Channel updated");
      qc.invalidateQueries({ queryKey: ["notif-channels"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  return (
    <div className="space-y-3">
      {(data ?? []).map((c: any) => (
        <Card key={c.channel}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">provider: {c.provider}</p>
              </div>
              <Switch
                checked={c.enabled}
                onCheckedChange={(enabled) => save.mutate({ channel: c.channel, enabled })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Config (JSON)</Label>
              <Textarea
                rows={2}
                className="font-mono text-xs"
                value={configDraft[c.channel] ?? JSON.stringify(c.config ?? {}, null, 0)}
                onChange={(e) => setConfigDraft((d) => ({ ...d, [c.channel]: e.target.value }))}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(configDraft[c.channel] ?? "{}");
                    save.mutate({ channel: c.channel, config: parsed });
                  } catch {
                    toast.error("Config must be valid JSON");
                  }
                }}
              >
                <Save className="mr-2 size-3" /> Save config
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ───────────────────────── Templates ───────────────────────── */

const EMPTY_TEMPLATE = {
  id: null as string | null,
  type: NOTIFICATION_TYPES[0] as string,
  channel: "in_app" as string,
  language: "en",
  subject: "",
  body_md: "",
  link: "",
  enabled: true,
};

export function TemplateManager() {
  const qc = useQueryClient();
  const list = useServerFn(adminListTemplates);
  const saveFn = useServerFn(adminSaveTemplate);
  const delFn = useServerFn(adminDeleteTemplate);
  const { data } = useQuery({ queryKey: ["notif-templates"], queryFn: () => list({}) });
  const [draft, setDraft] = useState({ ...EMPTY_TEMPLATE });
  const [sample, setSample] = useState('{"userName":"Aarav","festival":"Diwali"}');

  const save = useMutation({
    mutationFn: () => saveFn({ data: draft }),
    onSuccess: () => {
      toast.success("Template saved");
      setDraft({ ...EMPTY_TEMPLATE });
      qc.invalidateQueries({ queryKey: ["notif-templates"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });
  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Template deleted");
      qc.invalidateQueries({ queryKey: ["notif-templates"] });
    },
  });

  const preview = useMemo(() => {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(sample);
    } catch {
      /* ignore */
    }
    return renderTemplate(
      {
        type: draft.type,
        channel: draft.channel as any,
        language: draft.language,
        subject: draft.subject,
        body_md: draft.body_md,
        link: draft.link,
      },
      parsed,
    );
  }, [draft, sample]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{draft.id ? "Edit template" : "New template"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Type</Label>
              <Select
                value={draft.type}
                onValueChange={(v) => setDraft((d) => ({ ...d, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Channel</Label>
              <Select
                value={draft.channel}
                onValueChange={(v) => setDraft((d) => ({ ...d, channel: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CHANNEL_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Language</Label>
              <Select
                value={draft.language}
                onValueChange={(v) => setDraft((d) => ({ ...d, language: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["en", "hi", "mr", "gu", "bn", "ta", "te", "kn"].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Subject</Label>
            <Input
              value={draft.subject}
              onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-xs">Body (Markdown, {"{{variable}}"} supported)</Label>
            <Textarea
              rows={6}
              value={draft.body_md}
              onChange={(e) => setDraft((d) => ({ ...d, body_md: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-xs">Link</Label>
            <Input
              value={draft.link ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={draft.enabled}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, enabled: v }))}
            />
            <span className="text-sm">Enabled</span>
          </div>
          <div>
            <Label className="text-xs">Sample data (JSON)</Label>
            <Textarea
              rows={2}
              className="font-mono text-xs"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
            />
          </div>
          <div className="rounded-xl border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Preview</p>
            <p className="font-medium">{preview.subject}</p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{preview.body}</p>
            <p className="mt-1 text-xs">
              Variables:{" "}
              {extractVariables({ subject: draft.subject, body_md: draft.body_md }).join(", ") ||
                "none"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Save template
            </Button>
            {draft.id && (
              <Button variant="outline" onClick={() => setDraft({ ...EMPTY_TEMPLATE })}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Templates ({data?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[560px] space-y-2 overflow-auto">
          {(data ?? []).map((t: any) => (
            <div
              key={t.id}
              className="flex items-start justify-between gap-2 rounded-lg border p-2"
            >
              <button
                className="min-w-0 flex-1 text-left"
                onClick={() =>
                  setDraft({
                    id: t.id,
                    type: t.type,
                    channel: t.channel,
                    language: t.language,
                    subject: t.subject ?? "",
                    body_md: t.body_md ?? "",
                    link: t.link ?? "",
                    enabled: t.enabled,
                  })
                }
              >
                <p className="truncate text-sm font-medium">{t.type}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {CHANNEL_LABELS[t.channel as keyof typeof CHANNEL_LABELS] ?? t.channel} ·{" "}
                  {t.language} · v{t.version}
                  {!t.enabled && " · disabled"}
                </p>
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove.mutate(t.id)}
                aria-label="Delete template"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────────────────────── Dispatcher ───────────────────────── */

export function DispatchPanel() {
  const dispatch = useServerFn(adminDispatchNotification);
  const [type, setType] = useState<string>(NOTIFICATION_TYPES[0]);
  const [channels, setChannels] = useState<string[]>(["in_app"]);
  const [audience, setAudience] = useState<"self" | "all" | "role">("self");
  const [role, setRole] = useState("user");
  const [payload, setPayload] = useState('{"userName":"Aarav"}');
  const [scheduledAt, setScheduledAt] = useState("");

  const run = useMutation({
    mutationFn: () => {
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(payload);
      } catch {
        throw new Error("Payload must be valid JSON");
      }
      return dispatch({
        data: {
          type,
          channels,
          language: "en",
          data,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          audience: audience === "role" ? { kind: "role", role } : { kind: audience },
        },
      });
    },
    onSuccess: (r: any) =>
      toast.success(
        `Queued ${r.queued} for ${r.recipients} recipient(s) — ${r.processed.sent} sent`,
      ),
    onError: (e: any) => toast.error(e?.message ?? "Dispatch failed"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Trigger / test a notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Audience</Label>
            <Select value={audience} onValueChange={(v) => setAudience(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Only me (test)</SelectItem>
                <SelectItem value="role">By role</SelectItem>
                <SelectItem value="all">All users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {audience === "role" && (
          <div>
            <Label className="text-xs">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["user", "editor", "content_manager", "admin", "super_admin"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {CHANNELS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Switch
                checked={channels.includes(c)}
                onCheckedChange={(on) =>
                  setChannels((prev) => (on ? [...prev, c] : prev.filter((x) => x !== c)))
                }
              />
              {CHANNEL_LABELS[c]}
            </label>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Template data (JSON)</Label>
            <Textarea
              rows={3}
              className="font-mono text-xs"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Schedule for (optional)</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => run.mutate()} disabled={run.isPending}>
          {run.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          Dispatch
        </Button>
      </CardContent>
    </Card>
  );
}

/* ───────────────────────── Queue ───────────────────────── */

export function QueueMonitor() {
  const qc = useQueryClient();
  const list = useServerFn(adminListQueue);
  const action = useServerFn(adminQueueAction);
  const process = useServerFn(adminProcessQueue);
  const [status, setStatus] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: ["notif-queue", status],
    queryFn: () => list({ data: { status, limit: 150 } }),
    refetchInterval: 20000,
  });

  const act = useMutation({
    mutationFn: (input: any) => action({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notif-queue"] }),
    onError: (e: any) => toast.error(e?.message ?? "Action failed"),
  });
  const drain = useMutation({
    mutationFn: () => process({ data: { limit: 200 } }),
    onSuccess: (r: any) => {
      toast.success(
        `Processed ${r.picked}: ${r.sent} sent, ${r.failed} failed, ${r.skipped} skipped`,
      );
      qc.invalidateQueries({ queryKey: ["notif-queue"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Processing failed"),
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "all",
              "pending",
              "retrying",
              "processing",
              "sent",
              "failed",
              "skipped",
              "cancelled",
            ].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => drain.mutate()} disabled={drain.isPending}>
          {drain.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Play className="mr-2 size-4" />
          )}
          Process now
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => qc.invalidateQueries({ queryKey: ["notif-queue"] })}
        >
          <RefreshCw className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => act.mutate({ action: "clear_completed" })}
        >
          Clear completed
        </Button>
        <div className="ml-auto flex flex-wrap gap-2 text-xs">
          {Object.entries(data?.counts ?? {}).map(([k, v]) => (
            <Badge key={k} variant="outline">
              {k}: {v as number}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {(data?.rows ?? []).map((r: any) => (
          <Card key={r.id}>
            <CardContent className="flex flex-wrap items-center gap-3 p-3 text-sm">
              <StatusBadge status={r.status} />
              <span className="font-medium">{r.type}</span>
              <Badge variant="outline">
                {CHANNEL_LABELS[r.channel as keyof typeof CHANNEL_LABELS] ?? r.channel}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{r.subject}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(r.scheduled_at).toLocaleString()} · try {r.attempts}/{r.max_attempts}
              </span>
              {r.last_error && (
                <span className="w-full truncate text-xs text-destructive">{r.last_error}</span>
              )}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => act.mutate({ action: "retry", id: r.id })}
                >
                  Retry
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => act.mutate({ action: "cancel", id: r.id })}
                >
                  Cancel
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => act.mutate({ action: "delete", id: r.id })}
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(data?.rows ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">Queue is empty.</p>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Schedules ───────────────────────── */

const EMPTY_SCHEDULE = {
  id: null as string | null,
  name: "",
  type: NOTIFICATION_TYPES[0] as string,
  channels: ["in_app"] as string[],
  cadence: "daily",
  run_at_hour: 6,
  run_at_minute: 0,
  day_of_week: 1,
  day_of_month: 1,
  timezone: "Asia/Kolkata",
  audience: { kind: "all" } as any,
  payload: {} as Record<string, unknown>,
  enabled: true,
};

export function ScheduleManager() {
  const qc = useQueryClient();
  const list = useServerFn(adminListSchedules);
  const saveFn = useServerFn(adminSaveSchedule);
  const delFn = useServerFn(adminDeleteSchedule);
  const { data } = useQuery({ queryKey: ["notif-schedules"], queryFn: () => list({}) });
  const [draft, setDraft] = useState({ ...EMPTY_SCHEDULE });

  const save = useMutation({
    mutationFn: () => saveFn({ data: draft }),
    onSuccess: () => {
      toast.success("Schedule saved");
      setDraft({ ...EMPTY_SCHEDULE });
      qc.invalidateQueries({ queryKey: ["notif-schedules"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });
  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notif-schedules"] }),
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{draft.id ? "Edit schedule" : "New schedule"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Name</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Type</Label>
              <Select
                value={draft.type}
                onValueChange={(v) => setDraft((d) => ({ ...d, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Cadence</Label>
              <Select
                value={draft.cadence}
                onValueChange={(v) => setDraft((d) => ({ ...d, cadence: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["daily", "weekly", "monthly", "yearly"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Hour</Label>
              <Input
                type="number"
                min={0}
                max={23}
                value={draft.run_at_hour}
                onChange={(e) => setDraft((d) => ({ ...d, run_at_hour: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Minute</Label>
              <Input
                type="number"
                min={0}
                max={59}
                value={draft.run_at_minute}
                onChange={(e) => setDraft((d) => ({ ...d, run_at_minute: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Timezone</Label>
              <Input
                value={draft.timezone}
                onChange={(e) => setDraft((d) => ({ ...d, timezone: e.target.value }))}
              />
            </div>
          </div>
          {draft.cadence === "weekly" && (
            <div>
              <Label className="text-xs">Day of week (0=Sun)</Label>
              <Input
                type="number"
                min={0}
                max={6}
                value={draft.day_of_week ?? 1}
                onChange={(e) => setDraft((d) => ({ ...d, day_of_week: Number(e.target.value) }))}
              />
            </div>
          )}
          {(draft.cadence === "monthly" || draft.cadence === "yearly") && (
            <div>
              <Label className="text-xs">Day of month</Label>
              <Input
                type="number"
                min={1}
                max={31}
                value={draft.day_of_month ?? 1}
                onChange={(e) => setDraft((d) => ({ ...d, day_of_month: Number(e.target.value) }))}
              />
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {CHANNELS.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <Switch
                  checked={draft.channels.includes(c)}
                  onCheckedChange={(on) =>
                    setDraft((d) => ({
                      ...d,
                      channels: on ? [...d.channels, c] : d.channels.filter((x) => x !== c),
                    }))
                  }
                />
                {CHANNEL_LABELS[c]}
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={draft.enabled}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, enabled: v }))}
            />
            <span className="text-sm">Enabled</span>
          </div>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="mr-2 size-4" /> Save schedule
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedules ({data?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(data ?? []).map((s: any) => (
            <div
              key={s.id}
              className="flex items-start justify-between gap-2 rounded-lg border p-2"
            >
              <button
                className="min-w-0 flex-1 text-left"
                onClick={() => setDraft({ ...EMPTY_SCHEDULE, ...s })}
              >
                <p className="truncate text-sm font-medium">
                  {s.name} {!s.enabled && <Badge variant="outline">off</Badge>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {s.type} · {describeSchedule(s)}
                </p>
                {s.last_run_at && (
                  <p className="text-xs text-muted-foreground">
                    Last run {new Date(s.last_run_at).toLocaleString()}
                  </p>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove.mutate(s.id)}
                aria-label="Delete schedule"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {(data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No schedules yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ───────────────────────── Delivery log ───────────────────────── */

export function DeliveryLog() {
  const list = useServerFn(adminListDeliveries);
  const [status, setStatus] = useState("");
  const { data } = useQuery({
    queryKey: ["notif-deliveries", status],
    queryFn: () => list({ data: { status, limit: 150 } }),
  });

  return (
    <div className="space-y-3">
      <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["all", "sent", "failed", "skipped"].map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="space-y-1">
        {(data ?? []).map((d: any) => (
          <div
            key={d.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border p-2 text-sm"
          >
            <StatusBadge status={d.status} />
            <span className="font-medium">{d.type}</span>
            <Badge variant="outline">{d.channel}</Badge>
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{d.subject}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(d.created_at).toLocaleString()}
            </span>
            {d.error_message && (
              <span className="w-full truncate text-xs text-destructive">{d.error_message}</span>
            )}
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">No deliveries recorded yet.</p>
        )}
      </div>
    </div>
  );
}
