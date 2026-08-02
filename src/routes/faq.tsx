import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { FAQList } from "@/components/ui-kit/FAQList";
import { SITE_FAQ_GROUPS, allSiteFaqs } from "@/config/faqs";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  ldJson,
  SITE_URL,
  webPageSchema,
} from "@/lib/seo/schema";

const TITLE = "Frequently Asked Questions | SanatanTools";
const DESC =
  "Answers about Kundli reports, Panchang accuracy, horoscopes, payments, refunds, languages, privacy and using SanatanTools offline.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/faq` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/faq` }],
    scripts: [
      ldJson(
        graph(
          webPageSchema({ name: TITLE, description: DESC, path: "/faq" }),
          faqSchema(allSiteFaqs()),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ),
      ),
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <SiteLayout>
      <div className="container-page py-10 space-y-12">
        <SectionHeading eyebrow="Help" title="Frequently asked questions" description={DESC} />
        {SITE_FAQ_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="font-serif text-xl">{group.title}</h2>
            <div className="mt-4">
              <FAQList items={group.items.map((f) => ({ q: f.question, a: f.answer }))} />
            </div>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
