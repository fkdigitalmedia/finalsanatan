import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}
    >
      <Link to="/" className="flex items-center gap-1 hover:text-foreground">
        <Home className="size-3.5" /> Home
      </Link>
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5" />
            {c.href && !last ? (
              <a href={c.href} className="hover:text-foreground">
                {c.label}
              </a>
            ) : (
              <span className="text-foreground font-medium">{c.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
