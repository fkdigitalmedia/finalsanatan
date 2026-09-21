import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Crown,
  Sparkles,
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
  const { t, lang } = useTranslation();
  const isHindi = lang === "hi";
  const catLabel = useCategoryLabel();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Automatically close mobile menu on page navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape key press
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const primaryNav = [
    { label: "AI Astrologer", href: "/tools/ai-astrologer" },
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
      <div className="container-page flex h-16 items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 min-w-0"
          aria-label={t("a11y.home")}
          onClick={() => setOpen(false)}
        >
          <Logo size="md" className="shrink-0" />
        </Link>

        {/* Desktop Nav */}
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

        {/* Right cluster: Language, Theme, Account, and Hamburger */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
          <BackToWorkspace />
          <LanguageSwitcher />
          <ThemeToggle />
          <AccountMenu />
          <Link to="/pricing" className="hidden sm:inline-flex ml-1">
            <Button size="sm" className="h-7.5 px-3 text-xs rounded-full shadow-glow font-medium">
              {t("common.get_premium")}
            </Button>
          </Link>

          {/* Mobile Hamburger Button - Guaranteed visible with shrink-0 */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0 rounded-full h-9 w-9 text-foreground hover:bg-secondary focus-visible:ring-2 focus-visible:ring-primary ml-0.5"
            aria-label={
              open
                ? isHindi
                  ? "मेनू बंद करें"
                  : "Close menu"
                : isHindi
                  ? "मेनू खोलें"
                  : "Open menu"
            }
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <X className="size-5 text-foreground stroke-[2.5]" />
            ) : (
              <Menu className="size-5 text-foreground stroke-[2.5]" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "lg:hidden border-t border-border/60 bg-background/98 backdrop-blur-xl transition-[max-height,opacity] duration-300",
          open
            ? "max-h-[85vh] opacity-100 overflow-y-auto shadow-2xl"
            : "max-h-0 opacity-0 overflow-hidden pointer-events-none",
        )}
      >
        <div className="container-page py-4 space-y-4">
          {/* Quick Actions (Get Pro & Sign In / Dashboard) */}
          <div className="flex items-center gap-2 pb-1">
            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl bg-gradient-brand text-primary-foreground shadow-glow"
            >
              <Crown className="size-3.5" />
              {t("common.get_premium")}
            </Link>
            <MobileAuthAction onNavigate={() => setOpen(false)} />
          </div>

          {/* Primary Nav Links */}
          <div className="grid grid-cols-2 gap-1.5">
            {primaryNav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                {n.label}
              </a>
            ))}
          </div>

          <MobileWorkspaceLink onNavigate={() => setOpen(false)} />

          {/* Categories Grid */}
          <div className="pt-2 border-t border-border/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1 font-semibold">
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
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Icon className="size-4 text-accent shrink-0" />
                    <span className="truncate">{catLabel(c.slug, "short", c.short)}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer User Info */}
          <MobileDrawerFooter onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}

function MobileAuthAction({ onNavigate }: { onNavigate: () => void }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <Link
        to="/auth"
        onClick={onNavigate}
        className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground"
      >
        <User className="size-3.5" />
        {t("common.sign_in")}
      </Link>
    );
  }

  return (
    <Link
      to="/dashboard"
      onClick={onNavigate}
      className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl border border-primary/30 bg-primary/10 text-primary"
    >
      <LayoutDashboard className="size-3.5" />
      {t("common.dashboard")}
    </Link>
  );
}

function MobileDrawerFooter({ onNavigate }: { onNavigate: () => void }) {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
      <span className="truncate max-w-[200px]">{user.email}</span>
      <button
        type="button"
        onClick={() => {
          onNavigate();
          void signOut();
        }}
        className="text-destructive font-medium hover:underline inline-flex items-center gap-1 ml-2 shrink-0"
      >
        <LogOut className="size-3.5" />
        {t("common.sign_out")}
      </button>
    </div>
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
      <Button variant="outline" size="sm" className="h-7.5 px-2.5 text-xs rounded-full gap-1.5">
        <LayoutDashboard className="size-3.5" />
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
      <Link to="/auth" className="shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full gap-1.5 px-2 sm:px-3 text-xs sm:text-sm h-8 sm:h-9"
          title={t("common.sign_in")}
        >
          <User className="size-4" />
          <span className="hidden sm:inline">{t("common.sign_in")}</span>
        </Button>
      </Link>
    );
  }
  const initial = (user.user_metadata?.display_name || user.email || "U")[0].toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="shrink-0 grid place-items-center size-8 sm:size-9 rounded-full bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-semibold shadow-xs"
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
