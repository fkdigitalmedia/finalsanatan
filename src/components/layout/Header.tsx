import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  User,
  X,
  ChevronDown,
  LayoutDashboard,
  Bookmark,
  Heart,
  Settings,
  LogOut,
  Bell,
  BookOpen,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/config/categories";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useTranslation } from "@/i18n/I18nProvider";
import { useCategoryLabel } from "@/i18n/useCategoryLabel";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const catLabel = useCategoryLabel();

  const primaryNav = [
    { label: t("nav.all_tools"), href: "/tools" },
    { label: t("nav.panchang"), href: "/panchang" },
    { label: t("nav.festivals"), href: "/festivals" },
    { label: t("nav.horoscope"), href: "/daily-horoscope" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.mantras"), href: "/mantras" },
    { label: t("nav.ai"), href: "/ai" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center shrink-0" aria-label={t("a11y.home")}>
          <Logo size="md" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary transition-colors">
                {t("nav.categories")} <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[560px] p-4 rounded-2xl shadow-elegant border-border"
            >
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <a
                      key={c.slug}
                      href={`/${c.slug}`}
                      className="flex items-start gap-3 rounded-xl p-3 hover:bg-secondary transition-colors group"
                    >
                      <div className="grid place-items-center size-9 rounded-lg bg-primary-soft text-accent shrink-0 group-hover:bg-gradient-brand group-hover:text-primary-foreground transition-colors">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          {catLabel(c.slug, "title", c.title)}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {c.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {primaryNav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          <BackToWorkspace />
          <LanguageSwitcher />
          <ThemeToggle />
          <AccountMenu />
          <Button size="sm" className="hidden sm:inline-flex ml-1 shadow-glow">
            {t("common.get_premium")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            aria-label={t("a11y.toggle_menu")}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border/60 transition-[max-height,opacity] duration-300",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container-page py-4 space-y-3">
          <div className="grid grid-cols-2 gap-1.5">
            {primaryNav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary"
              >
                {n.label}
              </a>
            ))}
          </div>

          <MobileWorkspaceLink onNavigate={() => setOpen(false)} />

          <div className="pt-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
              {t("nav.categories")}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.slug}
                    href={`/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary"
                  >
                    <Icon className="size-4 text-accent" />
                    <span className="truncate">{catLabel(c.slug, "short", c.short)}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const WORKSPACE_PREFIXES = [
  "/dashboard",
  "/my-kundlis",
  "/family",
  "/reports",
  "/downloads",
  "/horoscope-history",
  "/bookmarks",
  "/favorites",
  "/saved-mantras",
  "/history",
  "/profile",
  "/billing",
  "/notifications",
  "/settings",
  "/admin",
];

function MobileWorkspaceLink({ onNavigate }: { onNavigate: () => void }) {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Link
      to="/dashboard"
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-lg bg-primary-soft px-3 py-2.5 text-sm font-semibold text-accent"
    >
      <LayoutDashboard className="size-4" /> Back to Dashboard
    </Link>
  );
}

function BackToWorkspace() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inWorkspace = WORKSPACE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!user || inWorkspace) return null;
  return (
    <Link to="/dashboard" className="hidden sm:inline-flex">
      <Button variant="outline" size="sm" className="rounded-full gap-2">
        <LayoutDashboard className="size-4" />
        <span className="hidden md:inline">Back to Dashboard</span>
      </Button>
    </Link>
  );
}

function AccountMenu() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  if (!user) {
    return (
      <Link to="/auth" className="ml-1">
        <Button variant="ghost" size="sm" className="rounded-full gap-2">
          <User className="size-4" /> {t("common.sign_in")}
        </Button>
      </Link>
    );
  }
  const initial = (user.user_metadata?.display_name || user.email || "U")[0].toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="ml-1 grid place-items-center size-9 rounded-full bg-gradient-brand text-primary-foreground text-sm font-semibold"
          aria-label={t("a11y.account")}
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-elegant">
        <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="size-4" /> {t("common.dashboard")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/bookmarks" className="flex items-center gap-2">
            <Bookmark className="size-4" /> {t("common.bookmarks")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/favorites" className="flex items-center gap-2">
            <Heart className="size-4" /> {t("common.favorites")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/saved-mantras" className="flex items-center gap-2">
            <BookOpen className="size-4" /> {t("common.saved_mantras")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="flex items-center gap-2">
            <Bell className="size-4" /> {t("common.notifications")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings className="size-4" /> {t("common.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center gap-2 text-destructive"
        >
          <LogOut className="size-4" /> {t("common.sign_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
