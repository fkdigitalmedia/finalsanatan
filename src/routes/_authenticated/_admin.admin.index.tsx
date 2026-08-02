import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  BookOpen,
  Calendar,
  Coins,
  FileText,
  Landmark,
  Link as LinkIcon,
  Mail,
  Megaphone,
  MousePointer,
  Users,
} from "lucide-react";
import { dashboardStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/_admin/admin/")({
  component: AdminIndex,
  head: () => ({ meta: [{ title: "Admin — Overview" }, { name: "robots", content: "noindex" }] }),
});

const CARDS: { key: string; label: string; icon: typeof Users }[] = [
  { key: "users", label: "Users", icon: Users },
  { key: "articles", label: "Articles", icon: FileText },
  { key: "festivals", label: "Festivals", icon: Calendar },
  { key: "temples", label: "Temples", icon: Landmark },
  { key: "ads", label: "Ads", icon: Megaphone },
  { key: "affiliates", label: "Affiliate links", icon: LinkIcon },
  { key: "subscribers", label: "Subscribers", icon: Mail },
  { key: "clicks", label: "Affiliate clicks", icon: MousePointer },
  { key: "plans", label: "Plans", icon: Coins },
];

function AdminIndex() {
  const fn = useServerFn(dashboardStats);
  const q = useQuery({ queryKey: ["admin", "dashboard"], queryFn: () => fn({}) });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif font-semibold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Platform vitals at a glance.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {CARDS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-3xl font-serif font-semibold">
              {q.data?.counts?.[key] ?? (q.isLoading ? "…" : 0)}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border bg-card">
        <div className="flex items-center gap-2 border-b p-4">
          <Activity className="h-4 w-4" />
          <h2 className="font-medium">Recent activity</h2>
        </div>
        <div className="divide-y">
          {q.data?.recentActivity?.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              No admin actions yet. Every edit shows up here.
            </div>
          )}
          {q.data?.recentActivity?.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between gap-3 p-3 text-sm">
              <div className="min-w-0">
                <div className="font-medium">
                  {a.action} · <span className="text-muted-foreground">{a.resource_type}</span>
                </div>
                <div className="truncate font-mono text-xs text-muted-foreground">
                  {a.resource_id ?? "—"}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(a.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <h2 className="font-medium">Docs</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Every table listed in the sidebar supports search, inline create/edit, delete and full
          audit logging via the admin server functions.
        </p>
      </section>
    </div>
  );
}
