import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, ExternalLink, Landmark } from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { listPublicTemples, type PublicTemple } from "@/lib/temples-public.functions";

export const Route = createFileRoute("/temples")({
  head: () => ({
    meta: [
      { title: "Famous Hindu Temples of India — SanatanTools" },
      {
        name: "description",
        content:
          "Browse a curated directory of famous Hindu temples across India — Jyotirlingas, Shakti Peethas, Divya Desams and more. Get address, coordinates, and directions.",
      },
      { property: "og:title", content: "Famous Hindu Temples of India" },
      {
        property: "og:description",
        content: "Curated directory of famous Hindu temples across India with directions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/temples" }],
  }),
  component: TemplesPage,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="container-page py-20 text-center text-muted-foreground">
        Failed to load temples: {error.message}
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-20 text-center">Page not found.</div>
    </SiteLayout>
  ),
});

function TemplesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-temples"],
    queryFn: () => listPublicTemples(),
    staleTime: 5 * 60 * 1000,
  });

  const [q, setQ] = useState("");
  const [state, setState] = useState<string>("all");

  const temples = data ?? [];

  const states = useMemo(() => {
    const set = new Set<string>();
    for (const t of temples) if (t.state) set.add(t.state);
    return Array.from(set).sort();
  }, [temples]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return temples.filter((t) => {
      if (state !== "all" && t.state !== state) return false;
      if (!needle) return true;
      return (
        t.name.toLowerCase().includes(needle) ||
        (t.city ?? "").toLowerCase().includes(needle) ||
        (t.state ?? "").toLowerCase().includes(needle)
      );
    });
  }, [temples, q, state]);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden />
        <div className="container-page relative py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid place-items-center size-14 rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Landmark className="size-6" />
            </div>
            <span className="font-devanagari text-2xl text-accent">मंदिर</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Famous Hindu Temples of India
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            A curated directory of Jyotirlingas, Shakti Peethas, Divya Desams and other sacred
            shrines. Search by name or city, filter by state, and get directions in one tap.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-primary/40 bg-primary-soft text-accent">
              {temples.length} temples listed
            </Badge>
            <Badge variant="secondary">Free forever</Badge>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="container-page py-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search temple, city or state…"
              className="pl-9"
            />
          </div>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Filter by state"
          >
            <option value="all">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* GRID */}
        <div className="mt-8">
          {isLoading ? (
            <SanatanLoader />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No temples match your search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <TempleCard key={t.id} temple={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function TempleCard({ temple }: { temple: PublicTemple }) {
  const mapsHref =
    temple.lat != null && temple.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${temple.lat},${temple.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${temple.name} ${temple.city ?? ""} ${temple.state ?? ""}`,
        )}`;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-elegant transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug">{temple.name}</h3>
        <Landmark className="size-4 text-accent shrink-0 mt-1" />
      </div>
      {(temple.city || temple.state) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          <span>{[temple.city, temple.state].filter(Boolean).join(", ")}</span>
        </div>
      )}
      {temple.history && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{temple.history}</p>
      )}
      <div className="mt-auto pt-4">
        <Button asChild size="sm" variant="outline" className="w-full">
          <a href={mapsHref} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5 mr-1.5" />
            Directions
          </a>
        </Button>
      </div>
    </article>
  );
}
