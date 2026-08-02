import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  targetIso: string; // YYYY-MM-DD
  label?: string;
}

function diff(target: Date) {
  const now = Date.now();
  const ms = Math.max(0, target.getTime() - now);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: ms === 0,
  };
}

export function FestivalCountdown({ targetIso, label = "Starts in" }: Props) {
  const target = new Date(targetIso + "T06:00:00");
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (t.done) {
    return (
      <div className="rounded-2xl border border-success/40 bg-success/5 p-4 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-success">
          Being observed today
        </div>
      </div>
    );
  }

  const cells: Array<[number, string]> = [
    [t.days, "Days"],
    [t.hours, "Hours"],
    [t.minutes, "Min"],
    [t.seconds, "Sec"],
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-accent">
        <Clock className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {cells.map(([v, l]) => (
          <div key={l} className="rounded-xl bg-primary/5 border border-primary/20 py-2">
            <div className="font-display text-2xl font-semibold tabular-nums">
              {String(v).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
