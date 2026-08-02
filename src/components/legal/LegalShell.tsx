/**
 * Shared legal-page layout.
 *
 * - Sticky TOC (auto-built from markdown H2s)
 * - Print-friendly styles via `.legal-print`
 * - Effective / Last-updated dates
 * - Article JSON-LD provided by the route's head()
 * - Client-side text search across the rendered body
 */

import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type LegalPage = {
  slug: string;
  category: string;
  title: string;
  subtitle: string | null;
  body_md: string;
  effective_date: string | null;
  last_updated_at: string;
  published_at: string | null;
  version: number;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function buildToc(md: string): { id: string; text: string; level: 2 | 3 }[] {
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  for (const line of md.split("\n")) {
    const m2 = /^##\s+(.+?)\s*$/.exec(line);
    if (m2) out.push({ id: slugify(m2[1]), text: m2[1], level: 2 });
  }
  return out;
}

export function LegalShell({ page }: { page: LegalPage }) {
  const [query, setQuery] = useState("");
  const toc = useMemo(() => buildToc(page.body_md), [page.body_md]);

  const body = useMemo(() => {
    if (!query.trim()) return page.body_md;
    // Split body into sections by H2 and keep only sections that match
    const sections = page.body_md.split(/(?=^##\s)/m);
    const q = query.toLowerCase();
    const filtered = sections.filter((s) => s.toLowerCase().includes(q));
    return filtered.length ? filtered.join("\n") : `> _No matches for **"${query}"**._`;
  }, [page.body_md, query]);

  return (
    <div className="container-page py-10 print:py-4">
      {/* Hero card */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 md:p-10 print:mb-4 print:border-0 print:bg-transparent print:p-0">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl print:hidden" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link to={"/legal" as never} className="hover:text-foreground">
              Legal
            </Link>
            <span>/</span>
            <span className="text-foreground">{page.title}</span>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <Badge variant="secondary" className="capitalize">
              {page.category}
            </Badge>
            <Badge variant="outline" className="border-primary/30 text-primary">
              v{page.version}
            </Badge>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {page.subtitle}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {page.effective_date && (
              <span className="text-muted-foreground">
                Effective{" "}
                <b className="text-foreground">
                  {new Date(page.effective_date).toLocaleDateString()}
                </b>
              </span>
            )}
            <span className="text-muted-foreground">
              Last updated{" "}
              <b className="text-foreground">
                {new Date(page.last_updated_at).toLocaleDateString()}
              </b>
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto print:hidden"
              onClick={() => window.print()}
            >
              <Printer className="mr-1 h-3.5 w-3.5" /> Print
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr] print:grid-cols-1">
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-24 space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search this page…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <nav aria-label="On this page" className="rounded-xl border bg-card/50 p-4 text-sm">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              <ul className="space-y-2">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="block border-l-2 border-transparent pl-3 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <article className="legal-body max-w-3xl">
          <ReactMarkdown
            components={{
              h2: ({ children }) => {
                const text = String(children);
                return (
                  <h2
                    id={slugify(text)}
                    className="mt-12 scroll-mt-24 border-b pb-2 font-serif text-2xl font-semibold tracking-tight text-foreground first:mt-0 md:text-3xl"
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => (
                <h3 className="mt-8 font-serif text-xl font-semibold text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mt-4 text-[15px] leading-7 text-foreground/85">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mt-4 space-y-2 pl-5 text-[15px] leading-7 text-foreground/85 [&>li]:list-disc [&>li]:marker:text-primary/70">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-foreground/85 marker:text-primary/70">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mt-6 rounded-r-lg border-l-4 border-primary/60 bg-primary/5 px-4 py-3 text-[15px] italic text-foreground/80">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-10 border-border/60" />,
              code: ({ children }) => (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
                  {children}
                </code>
              ),
              a: ({ href, children }) => {
                if (href && href.startsWith("/")) {
                  return (
                    <Link
                      to={href as never}
                      className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                    >
                      {children}
                    </Link>
                  );
                }
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {body}
          </ReactMarkdown>
        </article>
      </div>

      <div className="mt-14 rounded-xl border bg-card/50 p-5 text-sm text-muted-foreground print:hidden">
        Is document ke baare me sawaal hain?{" "}
        <Link to={"/contact" as never} className="font-medium text-primary hover:underline">
          Humein likhein →
        </Link>
      </div>
    </div>
  );
}
