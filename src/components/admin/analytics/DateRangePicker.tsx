import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
];

type Props = {
  days: number;
  onChange: (days: number) => void;
};

export function DateRangePicker({ days, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border bg-card p-1">
      {PRESETS.map((p) => (
        <Button
          key={p.days}
          size="sm"
          variant="ghost"
          className={cn(
            "h-7 px-3 text-xs",
            days === p.days &&
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
          )}
          onClick={() => onChange(p.days)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
