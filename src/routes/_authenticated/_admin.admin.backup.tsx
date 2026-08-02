import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { exportTable, importTable } from "@/lib/admin.functions";

const TABLES = [
  "admin_articles",
  "admin_festivals",
  "admin_temples",
  "admin_ads",
  "affiliate_links",
  "tool_overrides",
  "newsletter_subscribers",
  "email_templates",
  "redirects",
  "site_settings",
  "ai_prompts",
  "panchang_providers",
  "subscription_plans",
  "coupons",
];

export const Route = createFileRoute("/_authenticated/_admin/admin/backup")({
  component: BackupPage,
  head: () => ({ meta: [{ title: "Admin — Backup" }, { name: "robots", content: "noindex" }] }),
});

function BackupPage() {
  const [table, setTable] = useState("admin_articles");
  const [importJson, setImportJson] = useState("");
  const exp = useServerFn(exportTable);
  const imp = useServerFn(importTable);

  const expMut = useMutation({
    mutationFn: () => exp({ data: { table } }),
    onSuccess: (r) => {
      const blob = new Blob([JSON.stringify(r.rows, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${table}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${r.rows.length} rows`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const impMut = useMutation({
    mutationFn: (rows: Record<string, unknown>[]) => imp({ data: { table, rows } }),
    onSuccess: (r) => toast.success(`Imported ${r.inserted} rows`),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-semibold">Backup & Restore</h1>
        <p className="text-sm text-muted-foreground">
          Per-table JSON export/import. For a full database dump, use Cloud → Advanced settings →
          Export data.
        </p>
      </header>

      <div className="rounded-xl border bg-card p-4">
        <label className="text-xs font-medium">Table</label>
        <Select value={table} onValueChange={setTable}>
          <SelectTrigger className="w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TABLES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-4">
          <h2 className="font-medium">Export</h2>
          <p className="mb-3 text-sm text-muted-foreground">Downloads the entire table as JSON.</p>
          <Button onClick={() => expMut.mutate()} disabled={expMut.isPending}>
            {expMut.isPending ? "Exporting…" : "Download JSON"}
          </Button>
        </section>
        <section className="rounded-xl border bg-card p-4">
          <h2 className="font-medium">Import</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Paste a JSON array of rows to upsert.
          </p>
          <Textarea
            rows={8}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="font-mono text-xs"
            placeholder='[{"slug":"foo","name":"Foo"}]'
          />
          <Button
            className="mt-2"
            disabled={impMut.isPending}
            onClick={() => {
              try {
                const rows = JSON.parse(importJson);
                if (!Array.isArray(rows)) throw new Error("JSON must be an array");
                impMut.mutate(rows);
              } catch (e) {
                toast.error((e as Error).message);
              }
            }}
          >
            {impMut.isPending ? "Importing…" : "Import"}
          </Button>
        </section>
      </div>
    </div>
  );
}
