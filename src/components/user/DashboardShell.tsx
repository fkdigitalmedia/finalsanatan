import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Bookmark,
  Heart,
  BookOpen,
  History,
  Bell,
  Settings,
  User,
  Star,
  Users,
  FileText,
  Download,
  Sparkles,
  CreditCard,
  Search,
  X,
  Compass,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGlobalSearch } from "@/lib/workspace/hooks";

const groups = [
  {
    label: "Workspace",
    items: [
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { to: "/tools", label: "All Tools", icon: Compass },
      { to: "/my-kundlis", label: "My Kundlis", icon: Star },
      { to: "/family", label: "Family", icon: Users },
      { to: "/reports", label: "Reports", icon: FileText },
      { to: "/downloads", label: "Downloads", icon: Download },
      { to: "/horoscope-history", label: "Horoscope", icon: Sparkles },
    ],
  },
  {
    label: "Library",
    items: [
      { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
      { to: "/favorites", label: "Favorites", icon: Heart },
      { to: "/saved-mantras", label: "Saved Mantras", icon: BookOpen },
      { to: "/history", label: "Activity", icon: History },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/profile", label: "Profile", icon: User },
      { to: "/billing", label: "Billing", icon: CreditCard },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

function GlobalSearch() {
  const [term, setTerm] = useState("");
  const { data, isFetching } = useGlobalSearch(term);
  const open = term.trim().length >= 2;

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search reports, kundlis, family, downloads…"
        aria-label="Search your workspace"
        className="pl-9 pr-9"
      />
      {term && (
        <button
          type="button"
          onClick={() => setTerm("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-border bg-card shadow-lg p-2">
          {isFetching && !data ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Searching…</p>
          ) : data?.length ? (
            <ul className="max-h-80 overflow-auto">
              {data.map((hit) => (
                <li key={`${hit.type}-${hit.id}`}>
                  <Link
                    to={hit.href}
                    onClick={() => setTerm("")}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <span className="truncate">{hit.title}</span>
                    <span className="shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {hit.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">No matches.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function DashboardShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SiteLayout>
      <section className="container-page py-4 sm:py-8 md:py-12 w-full min-w-0 max-w-full">
        <div className="grid lg:grid-cols-[230px_1fr] gap-5 lg:gap-8 w-full min-w-0 max-w-full">
          <aside className="w-full min-w-0 max-w-full overflow-hidden">
            <nav className="lg:sticky lg:top-24 flex lg:flex-col gap-2 sm:gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none w-full min-w-0 max-w-full touch-pan-x">
              {groups.map((g, idx) => (
                <div
                  key={g.label}
                  className={cn(
                    "flex lg:flex-col gap-1.5 sm:gap-1 shrink-0",
                    idx > 0 && "hidden lg:flex"
                  )}
                >
                  <p className="hidden lg:block px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {g.label}
                  </p>
                  {g.items.map((i) => {
                    const Icon = i.icon;
                    const active = pathname === i.to;
                    return (
                      <Link
                        key={i.to}
                        to={i.to}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors",
                          active
                            ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                            : "bg-card sm:bg-transparent border border-border/60 sm:border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <Icon className="size-3.5 sm:size-4 shrink-0" />
                        {i.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">
            <GlobalSearch />
            <header className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="shrink-0 w-full sm:w-auto">{actions}</div>}
            </header>
            {children}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
