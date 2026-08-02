import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/history")({
  ssr: false,
  head: () => ({
    meta: [{ title: "History — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["history", user?.id],
    enabled: !!user,
    queryFn: async () =>
      (
        await supabase
          .from("history")
          .select("*")
          .eq("user_id", user!.id)
          .order("visited_at", { ascending: false })
          .limit(100)
      ).data ?? [],
  });
  const clear = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("history").delete().eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["history"] });
      toast.success("History cleared");
    },
  });

  return (
    <DashboardShell title="History" description="Tools you've visited recently.">
      {data && data.length ? (
        <>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={() => clear.mutate()}>
              Clear history
            </Button>
          </div>
          <Card className="divide-y divide-border">
            {data.map((h) => (
              <Link
                key={h.id}
                to="/tools/$slug"
                params={{ slug: h.tool_slug }}
                className="flex items-center justify-between p-4 hover:bg-secondary/40"
              >
                <span className="text-sm font-medium">{h.tool_title ?? h.tool_slug}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(h.visited_at).toLocaleString()}
                </span>
              </Link>
            ))}
          </Card>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No history yet.</p>
      )}
    </DashboardShell>
  );
}
