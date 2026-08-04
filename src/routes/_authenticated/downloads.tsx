import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, FileDown, Laptop, Globe } from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, Pager, SkeletonGrid } from "@/components/user/WorkspaceUI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDownloads, useWorkspaceMutation } from "@/lib/workspace/hooks";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/downloads")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Download Centre — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: DownloadsPage,
});

const TIMEFRAME_FILTERS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

function DownloadsPage() {
  const [search, setSearch] = useState("");
  const [timeframe, setTimeframe] = useState<"all" | "today" | "week" | "month">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const query = useMemo(() => ({ search, timeframe, sortBy, page }), [search, timeframe, sortBy, page]);
  const { data, isLoading } = useDownloads(query);

  const mutate = useWorkspaceMutation(async (id: string) => {
    const { error } = await supabase.from("report_downloads").delete().eq("id", id);
    if (error) throw error;
  });

  return (
    <DashboardShell
      title="Download Centre"
      description="Every PDF you generated, with language, version and download history."
    >
      {/* Time Filters & Search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {TIMEFRAME_FILTERS.map((tf) => (
            <Button
              key={tf.value}
              size="sm"
              variant={timeframe === tf.value ? "default" : "outline"}
              className="rounded-full text-xs"
              onClick={() => {
                setTimeframe(tf.value as "all" | "today" | "week" | "month");
                setPage(1);
              }}
            >
              {tf.label}
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
            placeholder="Search by file name…"
            aria-label="Search downloads"
            className="w-48 sm:w-64 h-9 text-xs"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            aria-label="Sort downloads"
            className="h-9 rounded-md border border-input bg-background px-3 text-xs"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid rows={3} />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No downloads found"
          hint="Download a PDF from your report library and it will be tracked here automatically."
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Your PDF downloads</caption>
            <thead className="bg-secondary/60 text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Report File Name
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Date & Time
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Language
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Size
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Device & Browser
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.rows.map((d) => {
                const rec = d as Record<string, unknown>;
                const fileType = (rec.file_type as string) || "PDF";
                const fileSize = (rec.file_size as string) || "2.4 MB";
                const device = (rec.device as string) || "Desktop";
                const browser = (rec.browser as string) || "Web";

                return (
                  <tr key={d.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <FileDown className="size-4 text-accent shrink-0" />
                        <span className="truncate max-w-xs">{d.filename}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                      {new Date(d.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="secondary" className="text-xs">
                        {fileType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 uppercase text-muted-foreground text-xs font-semibold">
                      {d.language || "EN"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {fileSize}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Laptop className="size-3.5 text-muted-foreground" />
                        {device}
                        <span className="text-muted-foreground/60">•</span>
                        <Globe className="size-3.5 text-muted-foreground" />
                        {browser}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`Remove ${d.filename} from history`}
                        onClick={async () => {
                          await mutate.mutateAsync(d.id);
                          toast.success("Entry removed");
                        }}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
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
