import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HoroscopeHubPage } from "@/components/horoscope/HoroscopePages";
import { SIGNS, horoscopeFaqs } from "@/lib/horoscope-public";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqSchema,
  graph,
  ldJson,
  SITE_URL,
} from "@/lib/seo/schema";

const PERIOD = "monthly" as const;
const TITLE = "Monthly Horoscope Today — All 12 Rashis | SanatanTools";
const DESC =
  "Free Vedic monthly horoscope for all 12 Rashis — career, finance, love, health and lucky factors, calculated live from sidereal planetary positions.";
const PATH = "/monthly-horoscope";

export const Route = createFileRoute("/monthly-horoscope/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}${PATH}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}${PATH}` }],
    scripts: [
      ldJson(
        graph(
          collectionPageSchema({
            name: TITLE,
            description: DESC,
            path: PATH,
            items: SIGNS.map((s) => ({
              name: `${s.english} Monthly Horoscope`,
              path: `${PATH}/${s.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Monthly Horoscope", path: PATH },
          ]),
          faqSchema(horoscopeFaqs(PERIOD)),
        ),
      ),
    ],
  }),
  component: () => (
    <SiteLayout>
      <HoroscopeHubPage period={PERIOD} />
    </SiteLayout>
  ),
});
