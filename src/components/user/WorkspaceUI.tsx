import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Card>
  );
}

export function Pager({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Pagination">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </Button>
      <span className="text-xs text-muted-foreground">
        Page {page} of {pages} · {total} items
      </span>
      <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Next
      </Button>
    </nav>
  );
}

export function SkeletonGrid({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} className="p-5">
          <div className="h-4 w-1/3 rounded bg-secondary animate-pulse" />
          <div className="mt-3 h-3 w-2/3 rounded bg-secondary animate-pulse" />
          <div className="mt-2 h-3 w-1/2 rounded bg-secondary animate-pulse" />
        </Card>
      ))}
    </div>
  );
}
