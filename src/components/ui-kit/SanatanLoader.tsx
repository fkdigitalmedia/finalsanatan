import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles, Flower2, Star, BookOpen } from "lucide-react";

const DEFAULT_TIPS = [
  "Ayurveda ke anusaar din ki shuruat Brahma Muhurat (04:00–06:00 AM) me karna sabse shubh mana jata hai.",
  "Har Tithi ka apna devta hota hai — jaise Chaturthi Ganesh ji ki, aur Ekadashi Vishnu ji ki.",
  "Rahu Kaal me koi bhi naya shubh kaarya shuru nahi karna chahiye.",
  "Abhijit Muhurat din ka sabse shubh 48-minute ka samay hota hai — dopahar ke aas paas.",
  "Sanatan Dharma me 27 Nakshatra aur 12 Rashi hote hain, jo aapke jeevan par prabhav dalte hain.",
  '"Om" mantra sabhi Vedic mantron ka moola hai — Rig, Yajur, Sam, aur Atharva Veda me warnit.',
  "Panchang ke paanch ang hain: Tithi, Vara, Nakshatra, Yoga, aur Karana.",
  "Puja se pehle Sankalp lena zaroori hai — apna naam, gotra, sthaan aur uddeshya bolkar.",
  "Ganga jal ka use har puja me hota hai — yeh shudhikaran ka pratik hai.",
  "Suryodaya aur Sooryast aapke shahar ke exact longitude par depend karte hain.",
];

const ICONS = [Sun, Moon, Sparkles, Flower2, Star, BookOpen] as const;

export type SanatanLoaderProps = {
  title?: string;
  subtitle?: string;
  tips?: string[];
  compact?: boolean;
  className?: string;
};

export function SanatanLoader({
  title = "Data load ho raha hai",
  subtitle = "Krupya kuch pal pratiksha karein…",
  tips = DEFAULT_TIPS,
  compact = false,
  className = "",
}: SanatanLoaderProps) {
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    if (!tips.length) return;
    const id = setInterval(() => setTipIdx((i) => (i + 1) % tips.length), 2800);
    return () => clearInterval(id);
  }, [tips.length]);

  return (
    <div
      className={`rounded-3xl border border-border bg-gradient-to-br from-primary-soft/40 via-card to-card ${
        compact ? "p-6" : "p-8 md:p-10"
      } shadow-elegant overflow-hidden ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`relative ${compact ? "size-14" : "size-20"} mb-5`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 via-primary/20 to-indigo-500/30 blur-xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sun
              className={`${compact ? "size-7" : "size-10"} text-amber-500 animate-[spin_6s_linear_infinite]`}
            />
          </div>
          <Moon
            className={`absolute -right-1 -bottom-1 ${compact ? "size-4" : "size-6"} text-indigo-500 animate-pulse`}
          />
          <Sparkles
            className={`absolute -left-1 -top-1 ${compact ? "size-3.5" : "size-5"} text-accent animate-pulse`}
          />
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{title}</div>
        {subtitle && (
          <div
            className={`mt-2 font-display ${compact ? "text-lg" : "text-xl md:text-2xl"} font-semibold`}
          >
            {subtitle}
          </div>
        )}
        {tips.length > 0 && (
          <div
            key={tipIdx}
            className="mt-4 min-h-[3rem] max-w-lg text-sm text-muted-foreground animate-fade-in"
          >
            {tips[tipIdx]}
          </div>
        )}
        <div className="mt-6 flex items-center gap-1.5">
          <span
            className="size-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="size-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="size-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

/** Small inline variant for lists / dashboards. */
export function SanatanLoaderInline({ label = "Load ho raha hai…" }: { label?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % ICONS.length), 900);
    return () => clearInterval(id);
  }, []);
  const Icon = ICONS[i];
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 py-10 px-6 text-sm text-muted-foreground animate-fade-in">
      <Icon className="size-5 text-accent animate-pulse" />
      <span>{label}</span>
      <span className="flex items-center gap-1 ml-1">
        <span
          className="size-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="size-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="size-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </span>
    </div>
  );
}
