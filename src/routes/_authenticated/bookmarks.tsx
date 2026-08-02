import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Bookmark } from "lucide-react";
import { SanatanLoaderInline } from "@/components/ui-kit/SanatanLoader";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/bookmarks")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Bookmarks — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookmarks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success("Removed");
    },
  });

  return (
    <DashboardShell title="Bookmarks" description="Tools you saved for quick access.">
      {isLoading ? (
        <SanatanLoaderInline label="Aapke bookmarks load ho rahe hain…" />
      ) : data && data.length ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {data.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between gap-3">
              <Link
                to="/tools/$slug"
                params={{ slug: b.tool_slug }}
                className="min-w-0 flex-1 flex items-center gap-3 hover:text-accent"
              >
                <div className="size-9 rounded-lg bg-primary-soft grid place-items-center text-accent shrink-0">
                  <Bookmark className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{b.tool_title ?? b.tool_slug}</p>
                  <p className="text-xs text-muted-foreground truncate">/tools/{b.tool_slug}</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => del.mutate(b.id)}
                aria-label="Remove"
              >
                <Trash2 className="size-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState label="No bookmarks yet" cta="Browse tools" to="/tools" />
      )}
    </DashboardShell>
  );
}

export function EmptyState({ label, cta, to }: { label: string; cta: string; to: "/tools" }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-10 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Link to={to} search={{ q: "" }}>
        <Button variant="outline" className="mt-4">
          {cta}
        </Button>
      </Link>
    </div>
  );
}
