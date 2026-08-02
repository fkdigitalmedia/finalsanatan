import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category?: string;
  tag?: "new" | "popular" | "premium" | "ai";
  href?: string;
}

const tagStyles: Record<NonNullable<ToolCardProps["tag"]>, string> = {
  new: "bg-success/15 text-success border-success/30",
  popular: "bg-primary-soft text-accent border-primary/30",
  premium: "bg-gold/20 text-gold-foreground border-gold/40",
  ai: "bg-info/15 text-info border-info/30",
};

export function ToolCard({ icon, title, description, category, tag, href = "#" }: ToolCardProps) {
  return (
    <a
      href={href}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant hover:border-primary/40"
    >
      <div className="flex items-start justify-between">
        <div className="grid place-items-center size-11 rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
          {icon}
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">{title}</h3>
          {tag && (
            <Badge
              variant="outline"
              className={cn("text-[10px] uppercase tracking-wider", tagStyles[tag])}
            >
              {tag}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      {category && (
        <span className="mt-auto text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
          {category}
        </span>
      )}
    </a>
  );
}
