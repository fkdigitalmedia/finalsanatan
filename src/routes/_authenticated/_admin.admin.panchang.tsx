import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";
import { clearPanchangCache } from "@/lib/admin.functions";

const config: CrudConfig = {
  table: "panchang_providers",
  keyColumn: "id",
  title: "Panchang Providers",
  description: "Ranked providers used to compute Panchang. Lower priority runs first.",
  searchColumn: "name",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "priority", label: "Priority", type: "number" },
    { name: "enabled", label: "Enabled", type: "boolean" },
    { name: "cache_ttl_minutes", label: "Cache TTL (minutes)", type: "number" },
    { name: "config", label: "Config (JSON)", type: "json", hideInTable: true },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/panchang")({
  component: PanchangPage,
  head: () => ({ meta: [{ title: "Admin — Panchang" }, { name: "robots", content: "noindex" }] }),
});

function PanchangPage() {
  const clearFn = useServerFn(clearPanchangCache);
  const clearMut = useMutation({
    mutationFn: () => clearFn({}),
    onSuccess: () => toast.success("Cache cleared — next request will refetch."),
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-4">
        <h2 className="font-medium">Cache</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Force a refresh across all cached Panchang responses.
        </p>
        <Button className="mt-3" onClick={() => clearMut.mutate()} disabled={clearMut.isPending}>
          {clearMut.isPending ? "Clearing…" : "Refresh cache"}
        </Button>
      </div>
      <CrudTable config={config} />
    </div>
  );
}
