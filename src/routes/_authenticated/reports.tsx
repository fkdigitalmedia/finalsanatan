import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Trash2, Share2, RefreshCw, Eye, Star, StarOff, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { FormattedMarkdown } from "@/components/ui/FormattedMarkdown";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, Pager, SkeletonGrid } from "@/components/user/WorkspaceUI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useReports, useWorkspaceMutation } from "@/lib/workspace/hooks";
import * as api from "@/lib/workspace/api";
import { trackPdfDownload } from "@/lib/workspace/tracker";
import { downloadReportPdf } from "@/lib/workspace/download";
import { type UserReport } from "@/lib/workspace/types";

export const Route = createFileRoute("/_authenticated/reports")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Report Library — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: ReportsPage,
});

const REPORT_FILTER_CATEGORIES = [
  { value: "all", label: "All Reports" },
  { value: "janam-kundli", label: "Janam Kundli" },
  { value: "varshphal", label: "Varshphal" },
  { value: "kundli-matching", label: "Matching" },
  { value: "numerology", label: "Numerology" },
  { value: "muhurat", label: "Muhurat" },
];

function ReportsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title_asc">("newest");
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<UserReport | null>(null);

  const query = useMemo(() => ({ search, kind, sortBy, page }), [search, kind, sortBy, page]);
  const { data, isLoading } = useReports(query);
  const mutate = useWorkspaceMutation(async (fn: () => Promise<unknown>) => fn());

  const download = async (r: UserReport) => {
    try {
      toast.loading("Preparing PDF…", { id: r.id });
      await downloadReportPdf(r, {
        userId: user!.id,
        userName: user?.email?.split("@")[0] ?? "User",
      });
      // Requirement #2: Log PDF Download
      void trackPdfDownload(user?.id, {
        filename: `${r.title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        language: r.language,
        file_type: "PDF",
        file_size: "2.4 MB",
        report_id: r.id,
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
      {/* Category Pills & Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {REPORT_FILTER_CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              size="sm"
              variant={kind === cat.value ? "default" : "outline"}
              className="rounded-full text-xs"
              onClick={() => {
                setKind(cat.value);
                setPage(1);
              }}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search reports…"
            className="w-48 sm:w-64 h-9 text-xs"
            aria-label="Search reports"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title_asc")}
            aria-label="Sort reports"
            className="h-9 rounded-md border border-input bg-background px-3 text-xs"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title_asc">Title A-Z</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No reports found"
          hint="Generate a Janam Kundli, Varshphal, Matching, Numerology or Muhurat report to view it here."
        />
      ) : (
        <div className="space-y-3">
          {data.rows.map((r) => {
            const status = (r as Record<string, unknown>).status as string || "Completed";
            const pdfVer = (r as Record<string, unknown>).pdf_version as string || "v40.0";
            const engineVer = (r as Record<string, unknown>).engine_version as string || "Vedic Engine v4.0";

            return (
              <Card key={r.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-base truncate">{r.title}</p>
                      <Badge variant="outline" className="capitalize text-xs">
                        {r.kind.replace(/-/g, " ")}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        v{r.version}
                      </Badge>
                      {status === "Completed" && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="size-3.5" /> Completed
                        </span>
                      )}
                      {status === "Processing" && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                          <Clock className="size-3.5" /> Processing
                        </span>
                      )}
                      {status === "Failed" && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                          <AlertCircle className="size-3.5" /> Failed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                      <span>Language: {r.language.toUpperCase()}</span>
                      <span>•</span>
                      <span>PDF: {pdfVer}</span>
                      <span>•</span>
                      <span>Engine: {engineVer}</span>
                      <span>•</span>
                      <span>Generated: {new Date(r.created_at).toLocaleString()}</span>
                      {r.is_shared && <span className="text-accent font-medium">• Shared</span>}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
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
                          api.updateReport(r.id, { version: r.version + 1, status: "Processing" }),
                        );
                        toast.success(`Regenerating ${r.title} (v${r.version + 1})`);
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
            );
          })}
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
