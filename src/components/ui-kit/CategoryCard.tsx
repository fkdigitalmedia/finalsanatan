import * as React from "react";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  hue?: "saffron" | "maroon" | "gold" | "info" | "success";
}

const hueMap: Record<NonNullable<CategoryCardProps["hue"]>, string> = {
  saffron: "from-primary/20 to-primary/5 text-primary",
  maroon: "from-accent/25 to-accent/5 text-accent",
  gold: "from-gold/30 to-gold/5 text-gold-foreground",
  info: "from-info/20 to-info/5 text-info",
  success: "from-success/20 to-success/5 text-success",
};

export function CategoryCard({ icon, title, count, hue = "saffron" }: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant hover:border-primary/40 cursor-pointer h-full">
      <div className={`absolute inset-0 bg-gradient-to-br opacity-60 ${hueMap[hue]}`} aria-hidden />
      <div className="relative flex flex-col gap-4">
        <div className="grid place-items-center size-12 rounded-xl bg-background/70 backdrop-blur-sm border border-border/60">
          {icon}
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{count} tools & resources</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground/90 group-hover:gap-2 transition-all">
          Explore <ArrowRight className="size-3.5" />
        </span>
      </div>
    </div>
  );
}
