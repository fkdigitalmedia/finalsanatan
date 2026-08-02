import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ExternalLink, Star, EyeOff, Eye, Search, Pencil, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { TOOLS } from "@/config/tools";
import { CATEGORIES } from "@/config/categories";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";
import { adminList, adminUpsert, adminDelete } from "@/lib/admin.functions";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Override = {
  slug: string;
  featured?: boolean | null;
  status?: string | null;
  sort_order?: number | null;
  related_slugs?: string[] | null;
  seo?: Record<string, unknown> | null;
};

const overrideConfig: CrudConfig = {
  table: "tool_overrides",
  keyColumn: "slug",
  title: "Raw override rows",
  description: "Advanced: edit raw tool_overrides rows.",
  searchColumn: "slug",
  fields: [
    { name: "slug", label: "Tool slug", type: "text", required: true, placeholder: "panchang" },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "related_slugs", label: "Related tool slugs", type: "array", hideInTable: true },
    { name: "seo", label: "SEO override (JSON)", type: "json", hideInTable: true },
  ],
};

function ToolsAdminPage() {
  const listFn = useServerFn(adminList);
  const upsertFn = useServerFn(adminUpsert);
  const deleteFn = useServerFn(adminDelete);
  const qc = useQueryClient();

  const overridesQuery = useQuery({
    queryKey: ["admin", "tool_overrides", "map"],
    queryFn: async () => {
      const res = (await listFn({ data: { table: "tool_overrides", order: "slug" } })) as {
        rows: Override[];
      };
      const map = new Map<string, Override>();
      for (const r of res.rows ?? []) map.set(r.slug, r);
      return map;
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "tool_overrides"] });
    qc.invalidateQueries({ queryKey: ["admin", "tool_overrides", "map"] });
  };

  const upsert = useMutation({
    mutationFn: async (values: Override) =>
      upsertFn({ data: { table: "tool_overrides", values, onConflict: "slug" } }),
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const remove = useMutation({
    mutationFn: async (slug: string) =>
      deleteFn({ data: { table: "tool_overrides", column: "slug", value: slug } }),
    onSuccess: () => {
      invalidate();
      toast.success("Override removed — tool reset to defaults");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [editing, setEditing] = useState<{ slug: string; title: string; ov: Override } | null>(
    null,
  );
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (status !== "all" && t.status !== status) return false;
      if (!query) return true;
      return (
        t.slug.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }).sort((a, b) => b.popularity - a.popularity);
  }, [q, cat, status]);

  const overrides = overridesQuery.data;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
        <p className="text-sm text-muted-foreground">
          {TOOLS.length} tools across {CATEGORIES.length} categories. Feature, edit, hide or remove
          any tool from here.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools by name, slug, tag…"
              className="pl-9"
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
              <SelectItem value="coming-soon">Coming soon</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground ml-auto">
            Showing <strong>{rows.length}</strong> of {TOOLS.length}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Tool</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Pop.</th>
                <th className="px-3 py-2">Featured</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tool) => {
                const ov = overrides?.get(tool.slug);
                const isFeatured = ov?.featured ?? tool.featured ?? false;
                const effStatus = ov?.status ?? tool.status;
                const hidden = ov?.status === "draft";
                const hasOverride = Boolean(ov);
                return (
                  <tr key={tool.slug} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2">
                      <div className="font-medium flex items-center gap-2">
                        {tool.title}
                        {hasOverride && (
                          <Badge variant="outline" className="text-[10px]">
                            override
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">/{tool.slug}</div>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="capitalize">
                        {tool.category}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant={
                          effStatus === "live" || effStatus === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {effStatus}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{tool.popularity}</td>
                    <td className="px-3 py-2">
                      {isFeatured ? (
                        <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">
                          ★ Featured
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={upsert.isPending}
                          title={isFeatured ? "Unfeature" : "Feature"}
                          onClick={() => upsert.mutate({ slug: tool.slug, featured: !isFeatured })}
                        >
                          <Star
                            className={`size-4 ${isFeatured ? "fill-amber-500 text-amber-500" : ""}`}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={upsert.isPending}
                          title={hidden ? "Publish" : "Hide (draft)"}
                          onClick={() =>
                            upsert.mutate({
                              slug: tool.slug,
                              status: hidden ? "published" : "draft",
                            })
                          }
                        >
                          {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Edit override"
                          onClick={() =>
                            setEditing({
                              slug: tool.slug,
                              title: tool.title,
                              ov: ov ?? { slug: tool.slug },
                            })
                          }
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title={hasOverride ? "Reset to defaults" : "No override to reset"}
                          disabled={!hasOverride || remove.isPending}
                          onClick={() => setConfirmDel(tool.slug)}
                        >
                          {hasOverride ? (
                            <Trash2 className="size-4 text-destructive" />
                          ) : (
                            <RotateCcw className="size-4 opacity-30" />
                          )}
                        </Button>
                        <Button size="sm" variant="ghost" asChild title="Open tool">
                          <Link to="/tools/$slug" params={{ slug: tool.slug }} target="_blank">
                            <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    No tools match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <EditOverrideDialog
        open={!!editing}
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(values) => {
          upsert.mutate(values, { onSuccess: () => setEditing(null) });
        }}
        saving={upsert.isPending}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove override for /{confirmDel}?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the admin override row. The tool itself stays live and reverts to the
              built-in defaults (title, description, category, status). To permanently remove a tool
              from the codebase, edit <code>src/config/tools.ts</code>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDel) remove.mutate(confirmDel, { onSuccess: () => setConfirmDel(null) });
              }}
            >
              Remove override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section>
        <CrudTable config={overrideConfig} />
      </section>
    </div>
  );
}

function EditOverrideDialog({
  open,
  editing,
  onClose,
  onSave,
  saving,
}: {
  open: boolean;
  editing: { slug: string; title: string; ov: Override } | null;
  onClose: () => void;
  onSave: (values: Override) => void;
  saving: boolean;
}) {
  const ov = editing?.ov;
  const [featured, setFeatured] = useState<boolean>(!!ov?.featured);
  const [status, setStatus] = useState<string>(ov?.status ?? "published");
  const [sort, setSort] = useState<string>(String(ov?.sort_order ?? 0));
  const [related, setRelated] = useState<string>((ov?.related_slugs ?? []).join(", "));
  const [seo, setSeo] = useState<string>(JSON.stringify(ov?.seo ?? {}, null, 2));
  const [seoErr, setSeoErr] = useState<string | null>(null);

  // reset when editing target changes
  useMemo(() => {
    setFeatured(!!ov?.featured);
    setStatus(ov?.status ?? "published");
    setSort(String(ov?.sort_order ?? 0));
    setRelated((ov?.related_slugs ?? []).join(", "));
    setSeo(JSON.stringify(ov?.seo ?? {}, null, 2));
    setSeoErr(null);
  }, [editing?.slug]);

  if (!editing) return null;

  const submit = () => {
    let seoParsed: Record<string, unknown> = {};
    try {
      seoParsed = seo.trim() ? JSON.parse(seo) : {};
    } catch (e) {
      setSeoErr((e as Error).message);
      return;
    }
    const relArr = related
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({
      slug: editing.slug,
      featured,
      status,
      sort_order: Number(sort) || 0,
      related_slugs: relArr,
      seo: seoParsed,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit — {editing.title}</DialogTitle>
          <DialogDescription>
            Override /{editing.slug}. Base title, description and content live in the code registry;
            here you can pin featured status, publish/hide, tune sort order, related tools and SEO
            JSON.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft (hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input type="number" value={sort} onChange={(e) => setSort(e.target.value)} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured on hub &amp; category pages
          </label>

          <div className="space-y-2">
            <Label>Related tool slugs (comma separated)</Label>
            <Input
              value={related}
              onChange={(e) => setRelated(e.target.value)}
              placeholder="panchang, rahu-kaal, choghadiya"
            />
          </div>

          <div className="space-y-2">
            <Label>SEO override (JSON)</Label>
            <Textarea
              value={seo}
              onChange={(e) => {
                setSeo(e.target.value);
                setSeoErr(null);
              }}
              rows={8}
              className="font-mono text-xs"
              placeholder='{"title":"...","description":"..."}'
            />
            {seoErr && <p className="text-xs text-destructive">Invalid JSON: {seoErr}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Saving…" : "Save override"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/_authenticated/_admin/admin/tools")({
  component: ToolsAdminPage,
  head: () => ({ meta: [{ title: "Admin — Tools" }, { name: "robots", content: "noindex" }] }),
});
