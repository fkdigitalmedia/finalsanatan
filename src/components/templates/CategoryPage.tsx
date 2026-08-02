import { Link } from "@tanstack/react-router";
import { ChevronRight, Home, Sparkles, Bell, ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdSlot } from "@/components/ui-kit/AdSlot";
import { CategoryCard } from "@/components/ui-kit/CategoryCard";
import { ToolListCard } from "@/components/ui-kit/ToolListCard";
import type { Category } from "@/config/categories";
import { CATEGORIES } from "@/config/categories";
import { toolsByCategory } from "@/config/tools";

interface Props {
  category: Category;
}

export function CategoryPage({ category }: Props) {
  const Icon = category.icon;
  const related = CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 6);
  const tools = toolsByCategory(category.slug);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-soft/40 to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-12 md:py-16">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6"
          >
            <Link to="/" className="flex items-center gap-1 hover:text-foreground">
              <Home className="size-3.5" /> Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">{category.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid place-items-center size-14 rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <Icon className="size-6" />
                </div>
                {category.devanagari && (
                  <span className="font-devanagari text-2xl text-accent">
                    {category.devanagari}
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
                {category.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
                {category.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="gap-1.5 border-primary/40 bg-primary-soft text-accent"
                >
                  <Sparkles className="size-3" />
                  {category.plannedTools.length}+ tools coming
                </Badge>
                <Badge variant="secondary">Free forever</Badge>
                <Badge variant="secondary">Mobile-ready</Badge>
              </div>
            </div>

            {/* Notify card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center size-10 rounded-xl bg-primary-soft text-accent shrink-0">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">Notify me when live</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get an email the moment {category.title} tools launch.
                  </p>
                </div>
              </div>
              <form className="mt-4 flex gap-2">
                <Input type="email" placeholder="you@example.com" className="bg-background" />
                <Button aria-label="Notify me">
                  <ArrowRight className="size-4" />
                </Button>
              </form>
              <p className="mt-3 text-[11px] text-muted-foreground">
                We'll never spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANNED TOOLS GRID */}
      <section className="container-page py-14 md:py-20">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary">
              Coming soon
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Tools we're crafting for {category.short}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Every tool is being designed to be beautiful, fast, accurate and free.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolListCard key={tool.slug} tool={tool} showCategory={false} />
          ))}
        </div>

        <div className="mt-10">
          <AdSlot size="leaderboard" />
        </div>
      </section>

      {/* RELATED CATEGORIES */}
      <section className="container-page pb-20">
        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary">Explore more</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Related categories
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {related.map((c) => (
            <a key={c.slug} href={`/${c.slug}`} className="contents">
              <CategoryCard
                icon={<c.icon className="size-5" />}
                title={c.title}
                count={c.plannedTools.length}
                hue={c.hue}
              />
            </a>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
