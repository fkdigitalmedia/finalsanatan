import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/_admin/admin/security")({
  component: SecurityPage,
  head: () => ({ meta: [{ title: "Admin — Security" }, { name: "robots", content: "noindex" }] }),
});

function SecurityPage() {
  const fn = useServerFn(adminList);
  const q = useQuery({
    queryKey: ["admin", "audit_logs"],
    queryFn: () => fn({ data: { table: "audit_logs", limit: 500, order: "created_at" } }),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-semibold">Security & Audit</h1>
        <p className="text-sm text-muted-foreground">
          Every admin mutation is logged. Session, 2FA and API security is managed by Supabase Auth.
        </p>
      </header>

      <section className="rounded-xl border bg-card">
        <div className="border-b p-4 font-medium">Audit log</div>
        <div className="max-h-[600px] overflow-y-auto divide-y">
          {q.data?.rows?.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No entries yet.</div>
          )}
          {q.data?.rows?.map((a: any) => (
            <div key={a.id} className="flex items-start justify-between gap-3 p-3 text-sm">
              <div className="min-w-0 flex-1">
                <div className="font-medium">
                  {a.action} · <span className="text-muted-foreground">{a.resource_type}</span>
                </div>
                <div className="truncate font-mono text-xs text-muted-foreground">
                  {a.resource_id ?? "—"}
                </div>
                {a.meta && Object.keys(a.meta).length > 0 && (
                  <code className="mt-1 block truncate text-[10px]">{JSON.stringify(a.meta)}</code>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(a.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
