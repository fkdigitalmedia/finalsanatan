import { useMemo } from "react";
import { Sun, Moon, Star, Sparkles, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  DEFAULT_LOCATION,
  getTithi,
  getNakshatra,
  getYoga,
  getSunTimes,
  fmtTime,
} from "@/lib/panchang";

interface Props {
  isoDate: string;
  festivalName: string;
}

/**
 * Client-side Panchang snapshot for a festival date.
 * Uses the internal Panchang engine (astronomy-engine) with the default
 * location (New Delhi). Users can drill into /panchang for their own city.
 */
export function FestivalPanchangSnapshot({ isoDate, festivalName }: Props) {
  const snapshot = useMemo(() => {
    try {
      // Compute at local sunrise for accurate tithi/nakshatra at day-start
      const loc = DEFAULT_LOCATION;
      const noon = new Date(`${isoDate}T06:30:00Z`); // ~ IST sunrise
      const suns = getSunTimes(noon, loc);
      const ref = suns.sunrise ?? noon;
      return {
        tithi: getTithi(ref),
        nakshatra: getNakshatra(ref),
        yoga: getYoga(ref),
        suns,
        loc,
      };
    } catch {
      return null;
    }
  }, [isoDate]);

  if (!snapshot) return null;
  const { tithi, nakshatra, yoga, suns, loc } = snapshot;

  const items = [
    { icon: Moon, label: "Tithi", value: tithi.name, sub: tithi.paksha },
    {
      icon: Star,
      label: "Nakshatra",
      value: nakshatra.name,
      sub: nakshatra.pada ? `Pada ${nakshatra.pada}` : "",
    },
    { icon: Sparkles, label: "Yoga", value: yoga.name, sub: "" },
    { icon: Sun, label: "Sunrise", value: fmtTime(suns.sunrise, loc.tz), sub: loc.label },
    { icon: Sun, label: "Sunset", value: fmtTime(suns.sunset, loc.tz), sub: loc.label },
    { icon: Clock, label: "Solar noon", value: fmtTime(suns.solarNoon, loc.tz), sub: loc.label },
  ];

  return (
    <section className="container-page py-10 border-t border-border/60">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-accent">
            <Star className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Panchang information
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
            {festivalName} — day's Panchang
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Computed by our internal engine for {loc.label} at sunrise. Set your city on the
            Panchang tool.
          </p>
        </div>
        <Link
          to="/panchang"
          search={{ date: isoDate } as any}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition"
        >
          Open full Panchang →
        </Link>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-accent">
              <it.icon className="size-4" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                {it.label}
              </span>
            </div>
            <div className="mt-1 font-display text-lg font-semibold">{it.value}</div>
            {it.sub && <div className="text-xs text-muted-foreground">{it.sub}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
