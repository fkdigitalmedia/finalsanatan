type Row = { key: string; value: number; pct?: number };

export function BreakdownList({
  title,
  rows,
  formatKey,
  empty = "No data yet.",
}: {
  title: string;
  rows: Row[] | undefined;
  formatKey?: (k: string) => string;
  empty?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {(!rows || rows.length === 0) && <div className="text-xs text-muted-foreground">{empty}</div>}
      <div className="space-y-2">
        {(rows ?? []).map((r) => (
          <div key={r.key} className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-medium text-foreground">
                {formatKey ? formatKey(r.key) : r.key}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {r.value.toLocaleString()}
                {typeof r.pct === "number" && (
                  <span className="ml-1 text-muted-foreground/70">({r.pct}%)</span>
                )}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${Math.min(100, r.pct ?? 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
