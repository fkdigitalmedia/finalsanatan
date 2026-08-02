/**
 * Admin Translation Panel — hub with tabs:
 *   • Editor — search, edit and save individual translations
 *   • Missing — detect keys present in en.json but absent from the target lang
 *   • Queue — AI translation queue (pending / ready / approved / rejected)
 *   • Import / Export — JSON round-trip per language
 *
 * All mutations go through admin-only server functions in
 * `@/lib/translations.functions`. The public site picks up approved edits
 * on next language switch via `getPublicOverrides`.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LANGUAGES } from "@/i18n/config";
import { flattenDict } from "@/i18n/loader";
import enSource from "@/i18n/translations/en.json";
import {
  deleteTranslation,
  detectMissingKeys,
  enqueueForAI,
  exportTranslations,
  importTranslations,
  listQueue,
  listTranslations,
  listVersions,
  processQueueBatch,
  reviewQueueItem,
  rollbackTranslation,
  upsertTranslation,
} from "@/lib/translations.functions";

export const Route = createFileRoute("/_authenticated/_admin/admin/translations")({
  component: TranslationsAdmin,
  head: () => ({
    meta: [
      { title: "Translation Manager — SanatanTools Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const EN_FLAT = flattenDict(enSource as Record<string, unknown>);
const EN_KEYS = Object.keys(EN_FLAT).sort();

function TranslationsAdmin() {
  const [lang, setLang] = useState<string>("hi");
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-serif font-semibold">Translation Manager</h1>
          <p className="text-sm text-muted-foreground">
            {EN_KEYS.length} source keys · {LANGUAGES.length} languages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.filter((l) => l.enabled).map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.nativeLabel} ({l.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
          <TabsTrigger value="queue">AI Queue</TabsTrigger>
          <TabsTrigger value="io">Import / Export</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <EditorTab lang={lang} />
        </TabsContent>
        <TabsContent value="missing">
          <MissingTab lang={lang} />
        </TabsContent>
        <TabsContent value="queue">
          <QueueTab lang={lang} />
        </TabsContent>
        <TabsContent value="io">
          <ImportExportTab lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// -------------------- EDITOR --------------------

function EditorTab({ lang }: { lang: string }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "approved">("all");
  const [editing, setEditing] = useState<{
    key: string;
    value: string;
    status: string;
    id?: string;
  } | null>(null);

  const qc = useQueryClient();
  const list = useServerFn(listTranslations);
  const upsert = useServerFn(upsertTranslation);
  const del = useServerFn(deleteTranslation);

  const q = useQuery({
    queryKey: ["tms", "list", lang, search, statusFilter],
    queryFn: () => list({ data: { lang, search, status: statusFilter } }),
  });

  const saveMut = useMutation({
    mutationFn: (input: { lang: string; key: string; value: string; status: string }) =>
      upsert({ data: input }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["tms"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["tms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search key or value…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setEditing({ key: "", value: "", status: "approved" })}
        >
          + New key
        </Button>
      </div>

      {editing && (
        <EditorForm
          lang={lang}
          entry={editing}
          saving={saveMut.isPending}
          onCancel={() => setEditing(null)}
          onSave={(v) => saveMut.mutate({ lang, ...v })}
        />
      )}

      <div className="rounded-lg border">
        <div className="grid grid-cols-[1fr_2fr_120px_100px_120px] gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
          <div>Key</div>
          <div>Value</div>
          <div>Status</div>
          <div>v</div>
          <div>Actions</div>
        </div>
        {q.isLoading && <div className="p-4 text-sm text-muted-foreground">Loading…</div>}
        {q.data?.rows?.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">
            No translations yet for this language. Use "New key" or the Missing tab.
          </div>
        )}
        {q.data?.rows?.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_2fr_120px_100px_120px] items-start gap-2 border-b px-3 py-2 text-sm last:border-b-0"
          >
            <div className="font-mono text-xs">{row.key}</div>
            <div className="whitespace-pre-wrap break-words">{row.value}</div>
            <div>
              <Badge variant={row.status === "approved" ? "default" : "secondary"}>
                {row.status}
              </Badge>
            </div>
            <div className="font-mono text-xs">v{row.version}</div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => setEditing(row)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  if (confirm(`Delete "${row.key}"?`)) delMut.mutate(row.id);
                }}
              >
                Del
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorForm({
  lang,
  entry,
  saving,
  onCancel,
  onSave,
}: {
  lang: string;
  entry: { key: string; value: string; status: string; id?: string };
  saving: boolean;
  onCancel: () => void;
  onSave: (v: { key: string; value: string; status: string }) => void;
}) {
  const [key, setKey] = useState(entry.key);
  const [value, setValue] = useState(entry.value);
  const [status, setStatus] = useState(entry.status);
  const listV = useServerFn(listVersions);
  const rollback = useServerFn(rollbackTranslation);
  const qc = useQueryClient();

  const versionsQ = useQuery({
    queryKey: ["tms", "versions", entry.id],
    queryFn: () =>
      entry.id ? listV({ data: { translationId: entry.id } }) : Promise.resolve({ versions: [] }),
    enabled: !!entry.id,
  });

  const rollMut = useMutation({
    mutationFn: (versionId: string) => rollback({ data: { versionId } }),
    onSuccess: () => {
      toast.success("Rolled back");
      qc.invalidateQueries({ queryKey: ["tms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const enValue = EN_FLAT[key];

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium">Key (dotted)</label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} disabled={!!entry.id} />
          {enValue && (
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium">EN:</span> {enValue}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved (visible on site)</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium">Value ({lang})</label>
          <Textarea rows={4} value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={saving || !key || !value} onClick={() => onSave({ key, value, status })}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {entry.id && versionsQ.data && versionsQ.data.versions.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium">History</h3>
          <div className="max-h-64 space-y-1 overflow-y-auto text-xs">
            {versionsQ.data.versions.map((v) => (
              <div key={v.id} className="flex items-start justify-between gap-3 rounded border p-2">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] text-muted-foreground">
                    v{v.version} · {v.source} · {new Date(v.created_at).toLocaleString()}
                  </div>
                  <div className="mt-1 break-words">{v.value}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rollMut.mutate(v.id)}
                  disabled={rollMut.isPending}
                >
                  Rollback
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- MISSING --------------------

function MissingTab({ lang }: { lang: string }) {
  const detect = useServerFn(detectMissingKeys);
  const enqueue = useServerFn(enqueueForAI);
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const missingQ = useQuery({
    queryKey: ["tms", "missing", lang],
    queryFn: () => detect({ data: { lang, keys: EN_KEYS } }),
  });

  const enqueueMut = useMutation({
    mutationFn: (keys: string[]) =>
      enqueue({
        data: {
          lang,
          items: keys.map((k) => ({ key: k, source_value: EN_FLAT[k] ?? "" })),
        },
      }),
    onSuccess: (r) => {
      toast.success(`Queued ${r.count} for AI translation`);
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["tms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const missing = missingQ.data?.missing ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">
          {missingQ.isLoading ? "Scanning…" : `${missing.length} missing of ${EN_KEYS.length} keys`}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelected(new Set(missing))}
            disabled={missing.length === 0}
          >
            Select all
          </Button>
          <Button
            size="sm"
            onClick={() => enqueueMut.mutate(Array.from(selected))}
            disabled={selected.size === 0 || enqueueMut.isPending}
          >
            Queue {selected.size} for AI
          </Button>
        </div>
      </div>
      <div className="max-h-[520px] overflow-y-auto rounded-lg border">
        {missing.map((k) => (
          <label
            key={k}
            className="flex cursor-pointer items-start gap-2 border-b px-3 py-2 text-sm last:border-b-0 hover:bg-muted/40"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={selected.has(k)}
              onChange={(e) => {
                const next = new Set(selected);
                if (e.target.checked) next.add(k);
                else next.delete(k);
                setSelected(next);
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-xs">{k}</div>
              <div className="text-xs text-muted-foreground">{EN_FLAT[k]}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// -------------------- QUEUE --------------------

function QueueTab({ lang }: { lang: string }) {
  const [statusFilter, setStatusFilter] = useState<string>("ready_for_review");
  const listQ = useServerFn(listQueue);
  const processFn = useServerFn(processQueueBatch);
  const reviewFn = useServerFn(reviewQueueItem);
  const qc = useQueryClient();

  const queueQ = useQuery({
    queryKey: ["tms", "queue", lang, statusFilter],
    queryFn: () =>
      listQ({ data: { lang, status: statusFilter === "all" ? undefined : statusFilter } }),
  });

  const processMut = useMutation({
    mutationFn: () => processFn({ data: { limit: 20 } }),
    onSuccess: (r) => {
      toast.success(`Processed ${r.processed} (${r.errors} errors)`);
      qc.invalidateQueries({ queryKey: ["tms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reviewMut = useMutation({
    mutationFn: (v: { id: string; decision: "approve" | "reject"; override_value?: string }) =>
      reviewFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="ready_for_review">Ready for review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => processMut.mutate()} disabled={processMut.isPending}>
          {processMut.isPending ? "Processing…" : "Process next 20 (AI)"}
        </Button>
      </div>
      <div className="rounded-lg border">
        {queueQ.data?.rows?.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">Queue is empty for this filter.</div>
        )}
        {queueQ.data?.rows?.map((r) => (
          <QueueRow
            key={r.id}
            row={r}
            onApprove={(override) =>
              reviewMut.mutate({ id: r.id, decision: "approve", override_value: override })
            }
            onReject={() => reviewMut.mutate({ id: r.id, decision: "reject" })}
            pending={reviewMut.isPending}
          />
        ))}
      </div>
    </div>
  );
}

function QueueRow({
  row,
  onApprove,
  onReject,
  pending,
}: {
  row: {
    id: string;
    lang: string;
    key: string;
    source_value: string;
    suggested_value: string | null;
    status: string;
    error_message: string | null;
  };
  onApprove: (override?: string) => void;
  onReject: () => void;
  pending: boolean;
}) {
  const [override, setOverride] = useState<string>(row.suggested_value ?? "");
  const canReview = row.status === "ready_for_review";
  return (
    <div className="border-b p-3 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs">{row.key}</div>
        <Badge>{row.status}</Badge>
      </div>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-muted-foreground">EN source</div>
          <div className="whitespace-pre-wrap text-sm">{row.source_value}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            AI suggestion ({row.lang})
          </div>
          {canReview ? (
            <Textarea rows={3} value={override} onChange={(e) => setOverride(e.target.value)} />
          ) : (
            <div className="whitespace-pre-wrap text-sm">{row.suggested_value ?? "—"}</div>
          )}
          {row.error_message && (
            <div className="mt-1 text-xs text-destructive">{row.error_message}</div>
          )}
        </div>
      </div>
      {canReview && (
        <div className="mt-2 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={onReject} disabled={pending}>
            Reject
          </Button>
          <Button size="sm" onClick={() => onApprove(override)} disabled={pending || !override}>
            Approve
          </Button>
        </div>
      )}
    </div>
  );
}

// -------------------- IMPORT / EXPORT --------------------

function ImportExportTab({ lang }: { lang: string }) {
  const exp = useServerFn(exportTranslations);
  const imp = useServerFn(importTranslations);
  const qc = useQueryClient();
  const [importText, setImportText] = useState("");

  const exportMut = useMutation({
    mutationFn: () => exp({ data: { lang } }),
    onSuccess: (r) => {
      const blob = new Blob([JSON.stringify(r.translations, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `translations-${lang}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${r.count} entries`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const importMut = useMutation({
    mutationFn: (entries: Record<string, string>) =>
      imp({ data: { lang, entries, status: "approved" } }),
    onSuccess: (r) => {
      toast.success(`Imported ${r.inserted} entries`);
      setImportText("");
      qc.invalidateQueries({ queryKey: ["tms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const parsed = useMemo(() => {
    if (!importText.trim()) return null;
    try {
      const j = JSON.parse(importText) as Record<string, unknown>;
      const flat = flattenDict(j);
      return flat;
    } catch {
      return null;
    }
  }, [importText]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Export {lang}</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Downloads all approved TMS entries for this language as a flat JSON file keyed by dotted
          paths.
        </p>
        <Button onClick={() => exportMut.mutate()} disabled={exportMut.isPending}>
          {exportMut.isPending ? "Exporting…" : "Download JSON"}
        </Button>
      </section>
      <section className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Import into {lang}</h3>
        <p className="mb-2 text-xs text-muted-foreground">
          Paste flat OR nested JSON. Nested structures are auto-flattened to dotted keys before
          upserting.
        </p>
        <Textarea
          rows={8}
          placeholder='{"nav": {"home": "Ghar"}} or {"nav.home": "Ghar"}'
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          className="font-mono text-xs"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {parsed ? `${Object.keys(parsed).length} entries detected` : "Invalid JSON"}
          </span>
          <Button
            disabled={!parsed || importMut.isPending}
            onClick={() => parsed && importMut.mutate(parsed)}
          >
            {importMut.isPending ? "Importing…" : "Import"}
          </Button>
        </div>
      </section>
    </div>
  );
}
