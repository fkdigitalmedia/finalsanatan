import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Trash2, Share2, RefreshCw, Eye, Star, StarOff } from "lucide-react";
import { FormattedMarkdown } from "@/components/ui/FormattedMarkdown";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, Pager, SkeletonGrid } from "@/components/user/WorkspaceUI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useReports, useWorkspaceMutation } from "@/lib/workspace/hooks";
import * as api from "@/lib/workspace/api";
import { downloadReportPdf } from "@/lib/workspace/download";
import { REPORT_KINDS, type UserReport } from "@/lib/workspace/types";

export const Route = createFileRoute("/_authenticated/reports")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Report Library — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<UserReport | null>(null);

  const query = useMemo(() => ({ search, kind, page }), [search, kind, page]);
  const { data, isLoading } = useReports(query);
  const mutate = useWorkspaceMutation(async (fn: () => Promise<unknown>) => fn());

  const download = async (r: UserReport) => {
    try {
      toast.loading("Preparing PDF…", { id: r.id });
      await downloadReportPdf(r, {
        userId: user!.id,
        userName: user?.email?.split("@")[0] ?? "User",
      });
      toast.success("Download ready", { id: r.id });
    } catch (e) {
      toast.error((e as Error).message, { id: r.id });
    }
  };

  const share = async (r: UserReport) => {
    const token = await api.setReportShared(r.id, !r.is_shared, r.share_token);
    if (token) {
      const url = `${window.location.origin}/reports/shared/${token}`;
      await navigator.clipboard?.writeText(url).catch(() => undefined);
      toast.success("Share link copied");
    } else {
      toast.success("Sharing disabled");
    }
  };

  return (
    <DashboardShell
      title="Report Library"
      description="Every report you generate is stored here — preview, download, share, regenerate or delete."
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search reports"
          className="max-w-xs"
          aria-label="Search reports"
        />
        <select
          value={kind}
          onChange={(e) => {
            setKind(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by report type"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All types</option>
          {REPORT_KINDS.map((k) => (
            <option key={String(k.value)} value={String(k.value)}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No reports yet"
          hint="Generate a Kundli, horoscope or numerology report and it will appear here automatically."
        />
      ) : (
        <div className="space-y-3">
          {data.rows.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.kind} · v{r.version} · {r.language.toUpperCase()} ·{" "}
                    {new Date(r.created_at).toLocaleString()}
                    {r.is_shared && " · shared"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreview(preview?.id === r.id ? null : r)}
                  >
                    <Eye className="size-3.5" /> Preview
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => download(r)}>
                    <Download className="size-3.5" /> PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => share(r)}>
                    <Share2 className="size-3.5" /> {r.is_shared ? "Unshare" : "Share"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await mutate.mutateAsync(() =>
                        api.updateReport(r.id, { version: r.version + 1, status: "regenerating" }),
                      );
                      toast.success("Regeneration queued");
                    }}
                  >
                    <RefreshCw className="size-3.5" /> Regenerate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Toggle favourite"
                    onClick={() =>
                      mutate.mutate(() => api.updateReport(r.id, { is_favorite: !r.is_favorite }))
                    }
                  >
                    {r.is_favorite ? (
                      <Star className="size-3.5 fill-current text-accent" />
                    ) : (
                      <StarOff className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Delete report"
                    onClick={async () => {
                      await mutate.mutateAsync(() => api.deleteReport(r.id));
                      toast.success("Report deleted");
                    }}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              {preview?.id === r.id && (
                <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-4 prose prose-sm dark:prose-invert max-w-none">
                  <FormattedMarkdown
                    content={r.content_md || "_No written content stored for this report._"}
                  />
                </div>
              )}
            </Card>
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
