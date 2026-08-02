import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  deltaPct?: number | null;
  icon?: LucideIcon;
  format?: "number" | "percent" | "duration" | "currency";
};

function formatValue(value: string | number, format: Props["format"]): string {
  if (typeof value === "string") return value;
  if (format === "percent") return `${value}%`;
  if (format === "currency")
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (format === "duration") {
    const s = Math.max(0, Math.round(value));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}m ${r}s` : `${r}s`;
  }
  return value.toLocaleString();
}

export function KpiCard({ label, value, hint, deltaPct, icon: Icon, format = "number" }: Props) {
  const up = typeof deltaPct === "number" && deltaPct > 0.5;
  const down = typeof deltaPct === "number" && deltaPct < -0.5;
  const flat = typeof deltaPct === "number" && !up && !down;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-1 font-serif text-2xl font-semibold text-foreground">
            {formatValue(value, format)}
          </div>
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        {typeof deltaPct === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              up && "bg-emerald-500/10 text-emerald-600",
              down && "bg-rose-500/10 text-rose-600",
              flat && "bg-muted text-muted-foreground",
            )}
          >
            {up && <ArrowUp className="h-3 w-3" />}
            {down && <ArrowDown className="h-3 w-3" />}
            {flat && <Minus className="h-3 w-3" />}
            {Math.abs(deltaPct).toFixed(1)}%
          </span>
        ) : (
          <span className="text-muted-foreground/60">—</span>
        )}
        {hint && <span className="truncate text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
