/**
 * Generic admin CRUD table.
 * Drive it with a config: table name, columns, editable fields.
 * Handles list, inline create/edit dialog, delete, and audit logging on the server.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { adminDelete, adminList, adminUpsert } from "@/lib/admin.functions";

export type FieldType =
  "text" | "textarea" | "number" | "boolean" | "date" | "datetime" | "select" | "json" | "array";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hideInTable?: boolean;
};

export type CrudConfig = {
  table: string;
  keyColumn: string; // usually "id"
  title: string;
  description?: string;
  fields: FieldDef[];
  order?: string;
  searchColumn?: string;
};

function renderCell(field: FieldDef, value: unknown) {
  if (value === null || value === undefined)
    return <span className="text-muted-foreground">—</span>;
  if (field.type === "boolean")
    return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>;
  if (field.type === "array" && Array.isArray(value))
    return (
      <span className="text-xs">
        {value.slice(0, 3).join(", ")}
        {value.length > 3 ? "…" : ""}
      </span>
    );
  if (field.type === "json")
    return <code className="text-xs">{JSON.stringify(value).slice(0, 60)}</code>;
  if (field.type === "datetime" || field.type === "date") {
    try {
      return <span className="text-xs">{new Date(String(value)).toLocaleString()}</span>;
    } catch {
      return String(value);
    }
  }
  const s = String(value);
  return <span className="line-clamp-2">{s.length > 100 ? s.slice(0, 100) + "…" : s}</span>;
}

function coerceValue(field: FieldDef, raw: string | boolean): unknown {
  if (field.type === "boolean") return !!raw;
  if (field.type === "number") {
    if (raw === "" || raw === null || raw === undefined) return null;
    const n = Number(raw);
    if (!Number.isFinite(n)) return null;
    // Numeric columns in this app are integers (cents/paise, counts, sort order, days).
    // Round decimal input so a user typing "4.99" doesn't hit a Postgres integer error.
    return Math.round(n);
  }
  if (field.type === "array")
    return String(raw)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  if (field.type === "json") {
    try {
      return raw ? JSON.parse(String(raw)) : {};
    } catch {
      return {};
    }
  }
  if (raw === "") return null;
  return raw;
}

function initialValue(field: FieldDef, row?: Record<string, unknown>): string | boolean {
  const v = row?.[field.name];
  if (field.type === "boolean") return !!v;
  if (v === null || v === undefined) return "";
  if (field.type === "array" && Array.isArray(v)) return v.join(", ");
  if (field.type === "json") return JSON.stringify(v, null, 2);
  return String(v);
}

export function CrudTable({ config }: { config: CrudConfig }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Record<string, unknown> | null>(null);

  const qc = useQueryClient();

  const listFn = useServerFn(adminList);
  const upsertFn = useServerFn(adminUpsert);
  const delFn = useServerFn(adminDelete);

  const listQ = useQuery({
    queryKey: ["admin", config.table, search],
    queryFn: () =>
      listFn({
        data: {
          table: config.table,
          order: config.order ?? "created_at",
          search,
          searchColumn: config.searchColumn,
        },
      }),
  });

  const saveMut = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      upsertFn({ data: { table: config.table, values } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", config.table] });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) =>
      delFn({ data: { table: config.table, column: config.keyColumn, value: id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", config.table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const columns = config.fields.filter((f) => !f.hideInTable);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-serif font-semibold">{config.title}</h2>
          {config.description && (
            <p className="text-sm text-muted-foreground">{config.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {config.searchColumn && (
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
          )}
          <Button
            onClick={() => {
              setEditing({});
              setOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> New
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              {columns.map((f) => (
                <th key={f.name} className="px-3 py-2 font-medium">
                  {f.label}
                </th>
              ))}
              <th className="px-3 py-2 w-24" />
            </tr>
          </thead>
          <tbody>
            {listQ.isLoading && (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {listQ.data?.rows?.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-muted-foreground">
                  No entries yet.
                </td>
              </tr>
            )}
            {listQ.data?.rows?.map((row: Record<string, unknown>) => (
              <tr key={String(row[config.keyColumn])} className="border-t">
                {columns.map((f) => (
                  <td key={f.name} className="px-3 py-2 align-top">
                    {renderCell(f, row[f.name])}
                  </td>
                ))}
                <td className="px-3 py-2 align-top">
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setViewing(row)}
                      title="View"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(row);
                        setOpen(true);
                      }}
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      title="Delete"
                      onClick={() => {
                        if (confirm("Delete this entry?"))
                          delMut.mutate(String(row[config.keyColumn]));
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.[config.keyColumn] ? "Edit" : "New"} — {config.title}
            </DialogTitle>
          </DialogHeader>
          <CrudForm
            config={config}
            row={editing ?? {}}
            saving={saveMut.isPending}
            onSubmit={(values) => saveMut.mutate(values)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View — {config.title}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              {config.fields.map((f) => {
                const value = viewing[f.name];
                const isLong = f.type === "textarea" || f.type === "json";
                const display =
                  value === null || value === undefined || value === ""
                    ? "—"
                    : f.type === "json"
                      ? JSON.stringify(value, null, 2)
                      : f.type === "array" && Array.isArray(value)
                        ? value.join(", ")
                        : f.type === "datetime" || f.type === "date"
                          ? new Date(String(value)).toLocaleString()
                          : String(value);
                return (
                  <div key={f.name} className="grid gap-1">
                    <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {f.label}
                    </Label>
                    {isLong ? (
                      <div className="whitespace-pre-wrap rounded-md border bg-muted/40 p-3 text-sm">
                        {display}
                      </div>
                    ) : (
                      <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {display}
                      </div>
                    )}
                  </div>
                );
              })}
              {viewing.email ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild size="sm">
                    <a
                      href={`mailto:${String(viewing.email)}${
                        viewing.subject
                          ? `?subject=Re:%20${encodeURIComponent(String(viewing.subject))}`
                          : ""
                      }`}
                    >
                      Reply via email
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(viewing);
                      setViewing(null);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CrudForm({
  config,
  row,
  saving,
  onSubmit,
}: {
  config: CrudConfig;
  row: Record<string, unknown>;
  saving: boolean;
  onSubmit: (values: Record<string, unknown>) => void;
}) {
  const [state, setState] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    for (const f of config.fields) init[f.name] = initialValue(f, row);
    return init;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: Record<string, unknown> = {};
    for (const f of config.fields) values[f.name] = coerceValue(f, state[f.name]);
    if (row[config.keyColumn]) values[config.keyColumn] = row[config.keyColumn];
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {config.fields.map((f) => (
        <div key={f.name} className="grid gap-1">
          <Label className="text-xs">
            {f.label}
            {f.required ? " *" : ""}
          </Label>
          {f.type === "textarea" || f.type === "json" ? (
            <Textarea
              rows={f.type === "json" ? 6 : 4}
              value={String(state[f.name] ?? "")}
              onChange={(e) => setState({ ...state, [f.name]: e.target.value })}
              placeholder={f.placeholder}
              className={f.type === "json" ? "font-mono text-xs" : ""}
            />
          ) : f.type === "boolean" ? (
            <Switch
              checked={!!state[f.name]}
              onCheckedChange={(v) => setState({ ...state, [f.name]: v })}
            />
          ) : f.type === "select" ? (
            <Select
              value={String(state[f.name] ?? "")}
              onValueChange={(v) => setState({ ...state, [f.name]: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {f.options?.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={
                f.type === "number"
                  ? "number"
                  : f.type === "date"
                    ? "date"
                    : f.type === "datetime"
                      ? "datetime-local"
                      : "text"
              }
              value={String(state[f.name] ?? "")}
              onChange={(e) => setState({ ...state, [f.name]: e.target.value })}
              placeholder={f.placeholder}
              required={f.required}
            />
          )}
          {f.type === "array" && (
            <p className="text-[10px] text-muted-foreground">Comma-separated values</p>
          )}
        </div>
      ))}
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}
