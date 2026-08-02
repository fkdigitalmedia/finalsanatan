import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Mail, MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { FAQList } from "@/components/ui-kit/FAQList";
import { Button } from "@/components/ui/button";
import { allSiteFaqs } from "@/config/faqs";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  ldJson,
  SITE_URL,
  webPageSchema,
} from "@/lib/seo/schema";

const TITLE = "Support & Help Centre | SanatanTools";
const DESC =
  "Get help with Kundli reports, Panchang, horoscopes, billing and your account — browse quick answers or contact the SanatanTools team.";

const CARDS = [
  {
    icon: MessageCircleQuestion,
    title: "Common questions",
    body: "Answers to the questions we get most.",
    to: "/faq",
    cta: "Read the FAQ",
  },
  {
    icon: Mail,
    title: "Contact us",
    body: "Send a message and we will reply by email.",
    to: "/contact",
    cta: "Open contact form",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & policies",
    body: "How your data is handled, plus refund terms.",
    to: "/legal",
    cta: "View policies",
  },
  {
    icon: LifeBuoy,
    title: "Your dashboard",
    body: "Manage saved Kundlis, reports and billing.",
    to: "/dashboard",
    cta: "Go to dashboard",
  },
] as const;

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/support` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/support` }],
    scripts: [
      ldJson(
        graph(
          webPageSchema({ name: TITLE, description: DESC, path: "/support" }),
          faqSchema(allSiteFaqs().slice(0, 6)),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Support", path: "/support" },
          ]),
        ),
      ),
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <SiteLayout>
      <div className="container-page py-10 space-y-12">
        <SectionHeading eyebrow="Help centre" title="How can we help?" description={DESC} />

        <div className="grid gap-5 sm:grid-cols-2">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-accent">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-4 font-serif text-lg">{c.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                <Button asChild size="sm" variant="outline" className="mt-4">
                  <Link to={c.to}>{c.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>

        <section>
          <h2 className="font-serif text-xl">Quick answers</h2>
          <div className="mt-4">
            <FAQList
              items={allSiteFaqs()
                .slice(0, 8)
                .map((f) => ({ q: f.question, a: f.answer }))}
            />
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
