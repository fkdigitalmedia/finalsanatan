import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { listLegalPages } from "@/lib/legal.functions";
import { Card } from "@/components/ui/card";

const CATEGORY_ORDER = ["privacy", "terms", "disclaimer", "policy", "company", "future"] as const;
const CATEGORY_LABEL: Record<string, string> = {
  privacy: "Privacy",
  terms: "Terms",
  disclaimer: "Disclaimers",
  policy: "Policies",
  company: "Company",
  future: "Coming soon",
};

const listQuery = queryOptions({
  queryKey: ["legal-index"],
  queryFn: () => listLegalPages(),
  staleTime: 5 * 60_000,
});

export const Route = createFileRoute("/legal/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery),
  head: () => {
    const url = "https://dharma-divine-tools.lovable.app/legal";
    const title = "Legal & Compliance — SanatanTools";
    const description =
      "All SanatanTools legal documents: Privacy Policy, Terms & Conditions, AI Disclaimer, Cookie Policy, Refund Policy, and more.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: LegalIndex,
});

function LegalIndex() {
  const { data } = useSuspenseQuery(listQuery);
  const byCategory = new Map<string, typeof data.pages>();
  for (const p of data.pages) {
    const arr = byCategory.get(p.category) ?? [];
    arr.push(p);
    byCategory.set(p.category, arr);
  }
  return (
    <SiteLayout>
      <div className="container-page py-12">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Legal & Compliance</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every policy that governs your use of SanatanTools — privacy, terms, disclaimers, and
          more.
        </p>
        <div className="mt-10 space-y-10">
          {CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((c) => (
            <section key={c}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABEL[c] ?? c}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(byCategory.get(c) ?? []).map((p) => (
                  <Card key={p.slug} className="p-5">
                    <Link
                      to="/legal/$slug"
                      params={{ slug: p.slug }}
                      className="block hover:text-primary transition-colors"
                    >
                      <h3 className="font-serif text-lg font-semibold">{p.title}</h3>
                      {p.subtitle && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {p.subtitle}
                        </p>
                      )}
                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Updated {new Date(p.last_updated_at).toLocaleDateString()}
                      </p>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
