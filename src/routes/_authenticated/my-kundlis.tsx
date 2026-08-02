import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Star,
  StarOff,
  Copy,
  Trash2,
  Archive,
  ArchiveRestore,
  Plus,
  FileDown,
  GitCompare,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, Pager, SkeletonGrid } from "@/components/user/WorkspaceUI";
import {
  KundliForm,
  emptyKundliForm,
  toFormValue,
  toInsert,
  type KundliFormValue,
} from "@/components/user/KundliForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useKundlis, useWorkspaceMutation } from "@/lib/workspace/hooks";
import * as api from "@/lib/workspace/api";
import { birthInputFromKundli, summarizeDasha } from "@/lib/workspace/insights";
import type { UserKundli } from "@/lib/workspace/types";

export const Route = createFileRoute("/_authenticated/my-kundlis")({
  ssr: false,
  head: () => ({
    meta: [{ title: "My Kundlis — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: MyKundlisPage,
});

function MyKundlisPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [archived, setArchived] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; value: KundliFormValue } | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const query = useMemo(() => ({ search, page, archived }), [search, page, archived]);
  const { data, isLoading } = useKundlis(query);

  const save = useWorkspaceMutation((v: { value: KundliFormValue; id?: string }) =>
    api.saveKundli(toInsert(v.value, user!.id, v.id)),
  );
  const mutate = useWorkspaceMutation(async (fn: () => Promise<unknown>) => fn());

  const run = async (label: string, fn: () => Promise<unknown>) => {
    try {
      await mutate.mutateAsync(fn);
      if (user) void api.logActivity(user.id, label, "kundli");
      toast.success(label);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const toggleCompare = (id: string) =>
    setCompare((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 2
          ? [...prev, id]
          : [prev[1], id],
    );

  return (
    <DashboardShell
      title="My Kundlis"
      description="Every saved birth chart — create, duplicate, archive, compare and generate reports."
      actions={
        <Button onClick={() => setEditing({ value: emptyKundliForm() })}>
          <Plus className="size-4" /> New Kundli
        </Button>
      }
    >
      {editing && (
        <div className="mb-6">
          <KundliForm
            initial={editing.value}
            submitting={save.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={async (value) => {
              try {
                await save.mutateAsync({ value, id: editing.id });
                toast.success(editing.id ? "Chart updated" : "Chart saved");
                setEditing(null);
              } catch (e) {
                toast.error((e as Error).message);
              }
            }}
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Filter by name or place"
          className="max-w-xs"
          aria-label="Filter charts"
        />
        <Button
          variant={archived ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setArchived(!archived);
            setPage(1);
          }}
        >
          {archived ? "Showing archived" : "Show archived"}
        </Button>
        {compare.length === 2 && (
          <Link to="/kundli-matching" className="inline-flex">
            <Button size="sm" variant="secondary">
              <GitCompare className="size-4" /> Compare selected
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : !data?.rows.length ? (
        <EmptyState
          title={archived ? "No archived charts" : "No saved charts yet"}
          hint="Save a birth chart to unlock dasha, gochar and report generation from your dashboard."
          action={
            <Button onClick={() => setEditing({ value: emptyKundliForm() })}>
              Create your first Kundli
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {data.rows.map((k) => (
            <KundliCard
              key={k.id}
              row={k}
              selected={compare.includes(k.id)}
              onSelect={() => toggleCompare(k.id)}
              onEdit={() => setEditing({ id: k.id, value: toFormValue(k) })}
              onFavorite={() =>
                run("Favourite updated", () =>
                  api.updateKundli(k.id, { is_favorite: !k.is_favorite }),
                )
              }
              onArchive={() =>
                run(k.is_archived ? "Chart restored" : "Chart archived", () =>
                  api.updateKundli(k.id, { is_archived: !k.is_archived }),
                )
              }
              onDuplicate={() => run("Chart duplicated", () => api.duplicateKundli(k))}
              onDelete={() => run("Chart deleted", () => api.deleteKundli(k.id))}
            />
          ))}
        </div>
      )}

      <Pager
        page={page}
        pageSize={data?.pageSize ?? 12}
        total={data?.total ?? 0}
        onPage={setPage}
      />
    </DashboardShell>
  );
}

function KundliCard({
  row,
  selected,
  onSelect,
  onEdit,
  onFavorite,
  onArchive,
  onDuplicate,
  onDelete,
}: {
  row: UserKundli;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onFavorite: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { data: dasha } = useQuery({
    queryKey: ["ws", "kundli-dasha", row.id, row.birth_date, row.birth_time],
    staleTime: 6 * 60 * 60 * 1000,
    queryFn: async () => summarizeDasha(birthInputFromKundli(row)),
  });

  return (
    <Card className={`p-5 ${selected ? "ring-2 ring-accent" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold truncate">{row.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {row.birth_date} · {String(row.birth_time).slice(0, 5)} · {row.place_name || "—"}
          </p>
        </div>
        <button onClick={onFavorite} aria-label="Toggle favourite" className="text-accent">
          {row.is_favorite ? (
            <Star className="size-5 fill-current" />
          ) : (
            <StarOff className="size-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Mahadasha <span className="font-medium text-foreground">{dasha?.mahadasha ?? "…"}</span>
        {" · "}Antardasha{" "}
        <span className="font-medium text-foreground">{dasha?.antardasha ?? "…"}</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button size="sm" variant="outline" onClick={onDuplicate}>
          <Copy className="size-3.5" /> Duplicate
        </Button>
        <Button size="sm" variant="outline" onClick={onArchive}>
          {row.is_archived ? (
            <ArchiveRestore className="size-3.5" />
          ) : (
            <Archive className="size-3.5" />
          )}
          {row.is_archived ? "Restore" : "Archive"}
        </Button>
        <Button size="sm" variant="outline" onClick={onSelect}>
          {selected ? "Selected" : "Compare"}
        </Button>
        <Link to="/kundli">
          <Button size="sm" variant="secondary">
            <FileDown className="size-3.5" /> Reports
          </Button>
        </Link>
        <Button size="sm" variant="ghost" onClick={onDelete} aria-label="Delete chart">
          <Trash2 className="size-3.5 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
