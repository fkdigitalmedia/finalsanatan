import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, FileDown } from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, Pager, SkeletonGrid } from "@/components/user/WorkspaceUI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDownloads, useWorkspaceMutation } from "@/lib/workspace/hooks";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/downloads")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Download Centre — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useMemo(() => ({ search, page }), [search, page]);
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
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search by file name"
        aria-label="Search downloads"
        className="mb-4 max-w-xs"
      />

      {isLoading ? (
        <SkeletonGrid rows={3} />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No downloads yet"
          hint="Download a PDF from your report library and it will be tracked here."
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Your PDF downloads</caption>
            <thead className="bg-secondary/60 text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  File
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Generated
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Language
                </th>
                <th scope="col" className="px-4 py-3 font-medium sr-only">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.rows.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      <FileDown className="size-4 text-accent" />
                      {d.filename}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(d.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 uppercase text-muted-foreground">{d.language}</td>
                  <td className="px-4 py-3 text-right">
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
              ))}
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
