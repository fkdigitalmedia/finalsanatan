// ============================================================
// Phase 14.7 — Programmatic landing page renderer.
// One component serves every entity family (nakshatra, rashi, yoga,
// dosha, muhurat, numerology, vastu). Adding a row to the registry
// publishes a fully-optimised page — no new component or route.
// ============================================================

import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { FAQList } from "@/components/ui-kit/FAQList";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { ShareButtons } from "@/components/share/ShareButtons";
import type { SeoEntity } from "@/config/seo-entities";
import type { LinkBlock } from "@/lib/seo/internal-links";

/** Registry paths are data, not literals — bridge them to typed Link props. */
const to = (path: string) => ({ to: path }) as unknown as LinkProps;

interface DetailProps {
  entity: SeoEntity;
  familyLabel: string;
  familyBase: string;
  links: LinkBlock[];
  faqs: { question: string; answer: string }[];
  siblings: SeoEntity[];
}

export function EntityDetailPage({
  entity,
  familyLabel,
  familyBase,
  links,
  faqs,
  siblings,
}: DetailProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 space-y-10">
      <Breadcrumbs items={[{ label: familyLabel, href: familyBase }, { label: entity.title }]} />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{familyLabel}</p>
        <h1 className="font-display text-3xl sm:text-4xl">{entity.title}</h1>
        <p className="text-muted-foreground max-w-3xl">{entity.summary}</p>
        <ShareButtons title={entity.title} />
      </header>

      {entity.facts?.length ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {entity.facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
              <dd className="mt-1 font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <article className="space-y-4 text-[15px] leading-7">
        {entity.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      {entity.related?.length ? (
        <section className="space-y-3">
          <SectionHeading title="Use these next" />
          <div className="flex flex-wrap gap-2">
            {entity.related.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary/50"
              >
                {r.label} <ArrowRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {faqs.length ? (
        <section className="space-y-3">
          <SectionHeading title="Frequently asked" />
          <FAQList items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
        </section>
      ) : null}

      {siblings.length ? (
        <section className="space-y-3">
          <SectionHeading title={`All ${familyLabel.toLowerCase()}`} />
          <div className="flex flex-wrap gap-2">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                {...to(`${familyBase}/${s.slug}`)}
                className={
                  s.slug === entity.slug
                    ? "rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground"
                    : "rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary/50"
                }
              >
                {s.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {links.map((block) => (
        <section key={block.title} className="space-y-3">
          <SectionHeading title={block.title} />
          <ul className="grid gap-2 sm:grid-cols-2">
            {block.items.map((i) => (
              <li key={i.to}>
                <Link
                  to={i.to}
                  className="block rounded-xl border border-border bg-card p-4 hover:bg-secondary/40"
                >
                  <span className="font-medium">{i.label}</span>
                  {i.description ? (
                    <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">
                      {i.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

interface IndexProps {
  familyLabel: string;
  familyBase: string;
  intro: string;
  items: SeoEntity[];
}

export function EntityIndexPage({ familyLabel, familyBase, intro, items }: IndexProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 space-y-8">
      <Breadcrumbs items={[{ label: familyLabel }]} />
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl">{familyLabel}</h1>
        <p className="text-muted-foreground max-w-3xl">{intro}</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((e) => (
          <li key={e.slug}>
            <Link
              {...to(`${familyBase}/${e.slug}`)}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 hover:shadow-card"
            >
              <span className="font-medium">{e.title}</span>
              <span className="mt-1 text-sm text-muted-foreground line-clamp-3">{e.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
