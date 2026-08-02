import { ArrowUpRight, Sparkles, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { categoryFor, type Tool } from "@/config/tools";
import { useTranslation } from "@/i18n/I18nProvider";
import { useCategoryLabel } from "@/i18n/useCategoryLabel";
import { useLocalizedTool } from "@/i18n/useToolI18n";

interface Props {
  tool: Tool;
  variant?: "grid" | "row";
  showCategory?: boolean;
}

const statusStyle: Record<Tool["status"], string> = {
  live: "bg-success/15 text-success border-success/30",
  beta: "bg-info/15 text-info border-info/30",
  "coming-soon": "bg-secondary text-muted-foreground border-border",
};

export function ToolListCard({ tool, variant = "grid", showCategory = true }: Props) {
  const cat = categoryFor(tool);
  const Icon = cat?.icon;
  const { t, lang } = useTranslation();
  const catLabel = useCategoryLabel();
  const { title, description } = useLocalizedTool(tool);
  const catTitle = cat ? catLabel(cat.slug, "title", cat.title) : "";

  const statusLabel: Record<Tool["status"], string> = {
    live: t("tool_hub.filter_status_live"),
    beta: t("tool_hub.filter_status_beta"),
    "coming-soon": t("tool_hub.filter_status_coming"),
  };

  return (
    <a
      href={`/tools/${tool.slug}`}
      className={cn(
        "group relative flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant hover:border-primary/40",
        variant === "grid" ? "flex-col" : "flex-row items-center",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid place-items-center size-11 rounded-xl bg-gradient-brand text-primary-foreground shadow-glow shrink-0">
          {Icon ? <Icon className="size-5" /> : <Sparkles className="size-5" />}
        </div>
        {variant === "grid" && (
          <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center flex-wrap gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight truncate">{title}</h3>
          <Badge
            variant="outline"
            className={cn("text-[10px] uppercase tracking-wider", statusStyle[tool.status])}
          >
            {statusLabel[tool.status]}
          </Badge>
          {tool.featured && (
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider bg-primary-soft text-accent border-primary/30"
            >
              <Flame className="size-3 mr-1" /> {t("tool_hub.featured_eyebrow")}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
        {showCategory && cat && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="uppercase tracking-wider">{catTitle}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" /> {formatDate(tool.addedAt, lang)}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}

function formatDate(iso: string, lang: string) {
  const locale = lang === "hi" ? "hi-IN" : "en-US";
  return new Date(iso).toLocaleDateString(locale, { month: "short", day: "numeric" });
}
