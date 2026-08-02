import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FestivalCardProps {
  name: string;
  date: string;
  daysAway: number;
  devanagari?: string;
  region?: string;
}

export function FestivalCard({ name, date, daysAway, devanagari, region }: FestivalCardProps) {
  return (
    <a
      href="#"
      className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="grid place-items-center size-14 shrink-0 rounded-xl bg-gradient-sunrise text-primary-foreground">
        <div className="text-center leading-tight">
          <div className="text-[10px] uppercase tracking-wider opacity-90">In</div>
          <div className="text-lg font-bold">{daysAway}d</div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-display font-semibold truncate">{name}</h4>
          {region && (
            <Badge variant="secondary" className="text-[10px]">
              {region}
            </Badge>
          )}
        </div>
        {devanagari && <p className="font-devanagari text-sm text-accent truncate">{devanagari}</p>}
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3" /> {date}
        </p>
      </div>
    </a>
  );
}
