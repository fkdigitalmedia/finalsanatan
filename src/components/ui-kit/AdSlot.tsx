import { cn } from "@/lib/utils";

interface AdSlotProps {
  size?: "leaderboard" | "banner" | "square" | "sidebar" | "inline";
  label?: string;
  className?: string;
}

const sizeMap = {
  leaderboard: "h-24 md:h-28",
  banner: "h-32 md:h-40",
  square: "aspect-square",
  sidebar: "h-64",
  inline: "h-24",
};

export function AdSlot({ size = "leaderboard", label = "Advertisement", className }: AdSlotProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        "relative w-full rounded-xl border border-dashed border-border bg-muted/40 grid place-items-center",
        sizeMap[size],
        className,
      )}
    >
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground/60">Ad slot · reserved</p>
      </div>
    </div>
  );
}
