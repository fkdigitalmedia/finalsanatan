import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HoroscopeDetailPage } from "@/components/horoscope/HoroscopePages";
import { NotFoundRashi } from "@/components/horoscope/NotFoundRashi";
import { findSign, horoscopeFaqs } from "@/lib/horoscope-public";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
  ldJson,
  SITE_URL,
} from "@/lib/seo/schema";

const PERIOD = "yearly" as const;

export const Route = createFileRoute("/yearly-horoscope/$sign")({
  loader: ({ params }) => {
    const sign = findSign(params.sign);
    if (!sign) throw notFound();
    return { sign };
  },
  head: ({ params, loaderData }) => {
    const sign = loaderData?.sign;
    const path = `/yearly-horoscope/${params.sign}`;
    const url = `${SITE_URL}${path}`;
    if (!sign) {
      return {
        meta: [
          { title: "Horoscope not found — SanatanTools" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${sign.english} (${sign.sanskrit}) Yearly Horoscope | SanatanTools`;
    const desc = `Today's yearly horoscope for ${sign.english} (${sign.hindi}) — career, money, love, health and lucky number, colour and direction from live Vedic planetary calculations.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        ldJson(
          graph(
            articleSchema({ headline: title, description: desc, path }),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Yearly Horoscope", path: "/yearly-horoscope" },
              { name: sign.english, path },
            ]),
            faqSchema(horoscopeFaqs(PERIOD, sign)),
          ),
        ),
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <NotFoundRashi to="/yearly-horoscope" />
    </SiteLayout>
  ),
  component: SignHoroscope,
});

function SignHoroscope() {
  const { sign } = Route.useLoaderData();
  return (
    <SiteLayout>
      <HoroscopeDetailPage period={PERIOD} sign={sign} />
    </SiteLayout>
  );
}
