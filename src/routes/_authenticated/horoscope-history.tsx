import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, Download } from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, Pager, SkeletonGrid } from "@/components/user/WorkspaceUI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useHoroscopeHistory, useWorkspaceMutation } from "@/lib/workspace/hooks";
import * as api from "@/lib/workspace/api";
import { HOROSCOPE_PERIODS, type HoroscopeHistoryRow } from "@/lib/workspace/types";
import { generatePdf } from "@/lib/pdf";

export const Route = createFileRoute("/_authenticated/horoscope-history")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Horoscope History — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: HoroscopeHistoryPage,
});

function HoroscopeHistoryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);

  const query = useMemo(() => ({ search, period, page }), [search, period, page]);
  const { data, isLoading } = useHoroscopeHistory(query);
  const mutate = useWorkspaceMutation(async (fn: () => Promise<unknown>) => fn());

  const download = async (row: HoroscopeHistoryRow) => {
    try {
      const result = await generatePdf({
        report: "horoscope",
        language: row.language,
        filename: `${row.period}-horoscope-${row.target_date}`,
        data: {
          user: user?.email?.split("@")[0] ?? "User",
          title: `${row.period} horoscope`,
          summary: row.summary ?? "",
          analysis: row.summary ?? "",
        },
      });
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.filename}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      await api.logDownload({
        user_id: user!.id,
        filename: `${result.filename}.pdf`,
        language: row.language,
      });
      toast.success("Downloaded");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <DashboardShell
      title="Horoscope History"
      description="Daily, weekly, monthly, yearly and personalised readings you have viewed."
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search readings"
          aria-label="Search horoscope history"
          className="max-w-xs"
        />
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by period"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm capitalize"
        >
          <option value="all">All periods</option>
          {HOROSCOPE_PERIODS.map((p) => (
            <option key={String(p)} value={String(p)}>
              {String(p)}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <SkeletonGrid rows={3} />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No horoscope history yet"
          hint="Readings you open are saved here so you can revisit and download them."
        />
      ) : (
        <div className="space-y-3">
          {data.rows.map((h) => (
            <Card key={h.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium capitalize">
                    {h.period} · {h.sign ?? "personal"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {h.target_date} · {h.language.toUpperCase()} · saved{" "}
                    {new Date(h.created_at).toLocaleDateString()}
                  </p>
                  {h.summary && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{h.summary}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => download(h)}>
                    <Download className="size-3.5" /> PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Delete entry"
                    onClick={async () => {
                      await mutate.mutateAsync(() => api.deleteHoroscopeEntry(h.id));
                      toast.success("Deleted");
                    }}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
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
