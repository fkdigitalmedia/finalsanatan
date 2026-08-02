import { createFileRoute } from "@tanstack/react-router";
import { Home, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { useTranslation } from "@/i18n/I18nProvider";

const FAQS = [
  {
    q: "What is Vastu Shastra?",
    a: "Vastu Shastra is the traditional Indian science of architecture that harmonises buildings with natural energies of the five elements and eight directions.",
  },
  {
    q: "Do I need to demolish my home to follow Vastu?",
    a: "No. Most Vastu doshas can be corrected using remedies — colours, plants, mirrors, yantras, or repositioning furniture.",
  },
  {
    q: "Which is the most important direction?",
    a: "The main entrance direction is most important. North, East and North-East entrances are traditionally most auspicious.",
  },
];

export const Route = createFileRoute("/tools/vastu-report")({
  head: () => ({
    meta: [
      { title: "Vastu Shastra Guide — Directions, Elements & Home Remedies" },
      {
        name: "description",
        content:
          "Complete Vastu guide — 8 directions, ruling planets & deities, room placements and simple remedies for a harmonious home.",
      },
      { property: "og:title", content: "Vastu Shastra Guide — Directions & Remedies" },
      {
        property: "og:description",
        content: "Learn the Vastu of every direction and how to fix common home doshas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Vastu Report",
          description: "Vastu Shastra directional guide with room placement and remedies.",
          url: "https://sanatantools.com/tools/vastu-report",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, raw } = useTranslation();
  return (
    <PremiumToolShell
      title={t("premium_tools.vastu.title")}
      tagline={t("premium_tools.vastu.tagline")}
      breadcrumb={t("premium_tools.vastu.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.vastu.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.vastu.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.vastu.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.vastu.related.kundli.title"),
          href: "/kundli",
          description: t("premium_tools.vastu.related.kundli.description"),
        },
        {
          title: t("premium_tools.vastu.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.vastu.related.muhurat.description"),
        },
        {
          title: t("premium_tools.vastu.related.gemstone.title"),
          href: "/tools/numerology-report",
          description: t("premium_tools.vastu.related.gemstone.description"),
        },
      ]}
      premiumNote={t("premium_tools.vastu.premium_note")}
    >
      <VastuGuide />
    </PremiumToolShell>
  );
}

function VastuGuide() {
  const { t, raw } = useTranslation();
  const DIRECTIONS =
    raw<
      {
        name: string;
        element: string;
        deity: string;
        planet: string;
        ideal: string;
        avoid: string;
        remedy: string;
      }[]
    >("premium_tools.vastu.directions") ?? DEFAULT_DIRECTIONS;
  return (
    <>
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 font-semibold mb-2">
          <Compass className="size-4" /> {t("premium_tools.vastu.how_to_read_heading")}
        </div>
        <p className="text-sm text-muted-foreground">{t("premium_tools.vastu.how_to_read_body")}</p>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {DIRECTIONS.map((d) => (
          <Card key={d.name} className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg flex items-center gap-2">
                <Home className="size-4" /> {d.name}
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">{d.element}</Badge>
                <Badge variant="outline">{d.planet}</Badge>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("premium_tools.vastu.ruling_deity_label")} {d.deity}
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="text-emerald-600 font-medium">
                  {t("premium_tools.vastu.ideal_label")}
                </span>{" "}
                {d.ideal}
              </div>
              <div>
                <span className="text-red-600 font-medium">
                  {t("premium_tools.vastu.avoid_label")}
                </span>{" "}
                {d.avoid}
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium">{t("premium_tools.vastu.remedy_label")}</span>{" "}
                {d.remedy}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

const DEFAULT_DIRECTIONS = [
  {
    name: "East",
    element: "Air",
    deity: "Indra",
    planet: "Sun",
    ideal: "Main entrance, living room, prayer room",
    avoid: "Toilets, storage of heavy items",
    remedy: "Keep clean & clutter-free; place a Surya yantra.",
  },
  {
    name: "West",
    element: "Water",
    deity: "Varuna",
    planet: "Saturn",
    ideal: "Children's rooms, dining, study",
    avoid: "Main door of new homes (unless supported)",
    remedy: "Heavy furniture on West wall balances energies.",
  },
  {
    name: "North",
    element: "Water",
    deity: "Kubera",
    planet: "Mercury",
    ideal: "Cash locker, home office, main entrance",
    avoid: "Toilets, kitchen",
    remedy: "Keep open, clean and light-coloured — attracts wealth.",
  },
  {
    name: "South",
    element: "Fire",
    deity: "Yama",
    planet: "Mars",
    ideal: "Master bedroom, heavy storage",
    avoid: "Main entrance, water tanks",
    remedy: "Use red or terracotta tones; keep grounded.",
  },
  {
    name: "North-East",
    element: "Water",
    deity: "Ishaan (Shiva)",
    planet: "Jupiter",
    ideal: "Pooja room, water source, well",
    avoid: "Toilets, kitchen, staircase, bedroom",
    remedy: "Keep sacred and clear; place a copper kalash.",
  },
  {
    name: "South-East",
    element: "Fire",
    deity: "Agni",
    planet: "Venus",
    ideal: "Kitchen, electrical panels, generator",
    avoid: "Bedroom (esp. head direction)",
    remedy: "Face East while cooking; keep gas stove here.",
  },
  {
    name: "South-West",
    element: "Earth",
    deity: "Nairitya",
    planet: "Rahu",
    ideal: "Master bedroom, heavy storage",
    avoid: "Water sources, entrance, kitchen",
    remedy: "Place heaviest furniture and elder's room here.",
  },
  {
    name: "North-West",
    element: "Air",
    deity: "Vayu",
    planet: "Moon",
    ideal: "Guest room, children's room, bathroom",
    avoid: "Master bedroom, kitchen",
    remedy: "Good for guest & short-term stays.",
  },
];
