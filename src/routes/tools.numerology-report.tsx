import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hash, Sparkles, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { nameNumerology, lifePathNumber } from "@/lib/library-data";
import { useTranslation } from "@/i18n/I18nProvider";

const PLANETS: Record<number, string> = {
  1: "Surya (Sun)",
  2: "Chandra (Moon)",
  3: "Guru (Jupiter)",
  4: "Rahu",
  5: "Budh (Mercury)",
  6: "Shukra (Venus)",
  7: "Ketu",
  8: "Shani (Saturn)",
  9: "Mangal (Mars)",
};
const MEANINGS: Record<number, string> = {
  1: "Leader, pioneer, independent — Surya's vibration.",
  2: "Harmoniser, sensitive, cooperative — Chandra's vibration.",
  3: "Expressive, creative, joyful — Guru's vibration.",
  4: "Grounded, disciplined, structural — Rahu's vibration.",
  5: "Adaptable, curious, communicative — Budh's vibration.",
  6: "Nurturing, artistic, harmonious — Shukra's vibration.",
  7: "Introspective, spiritual, seeking — Ketu's vibration.",
  8: "Powerful, karmic, transformative — Shani's vibration.",
  9: "Compassionate, universal, complete — Mangal's vibration.",
};
const LUCKY: Record<number, { colors: string; days: string; gem: string }> = {
  1: { colors: "Gold, Orange", days: "Sunday", gem: "Ruby" },
  2: { colors: "White, Silver", days: "Monday", gem: "Pearl" },
  3: { colors: "Yellow", days: "Thursday", gem: "Yellow Sapphire" },
  4: { colors: "Grey, Blue", days: "Saturday", gem: "Hessonite" },
  5: { colors: "Green", days: "Wednesday", gem: "Emerald" },
  6: { colors: "Pink, White", days: "Friday", gem: "Diamond" },
  7: { colors: "Light Grey", days: "Tuesday", gem: "Cat's Eye" },
  8: { colors: "Black, Dark Blue", days: "Saturday", gem: "Blue Sapphire" },
  9: { colors: "Red, Coral", days: "Tuesday", gem: "Red Coral" },
};

const FAQS = [
  {
    q: "What is a Life Path number?",
    a: "Your Life Path number is derived from your full date of birth. It reveals your core life purpose and natural strengths.",
  },
  {
    q: "What is a Destiny (Name) number?",
    a: "Also called Expression number, it comes from the Pythagorean value of the letters in your full name — it shows your outward talents and destiny.",
  },
  {
    q: "Why do Life Path and Destiny differ?",
    a: "Life Path is what you're born with; Destiny is what you express through your name. They together give a complete picture.",
  },
];

export const Route = createFileRoute("/tools/numerology-report")({
  head: () => ({
    meta: [
      { title: "Numerology Report — Free Life Path & Destiny Number" },
      {
        name: "description",
        content:
          "Free numerology report — get your Life Path number, Destiny number, and Vedic planetary vibration in seconds.",
      },
      { property: "og:title", content: "Numerology Report — Life Path & Destiny" },
      {
        property: "og:description",
        content: "Free Vedic numerology with Life Path, Destiny number and planetary meaning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Numerology Report",
          description: "Life Path & Destiny numerology with Vedic planetary meaning.",
          url: "https://sanatantools.com/tools/numerology-report",
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
      title={t("premium_tools.numerology.title")}
      tagline={t("premium_tools.numerology.tagline")}
      breadcrumb={t("premium_tools.numerology.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.numerology.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.numerology.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.numerology.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.numerology.related.baby_names.title"),
          href: "/tools/baby-name-generator",
          description: t("premium_tools.numerology.related.baby_names.description"),
        },
        {
          title: t("premium_tools.numerology.related.kundli_matching.title"),
          href: "/tools/kundli-matching",
          description: t("premium_tools.numerology.related.kundli_matching.description"),
        },
        {
          title: t("premium_tools.numerology.related.kundli.title"),
          href: "/kundli",
          description: t("premium_tools.numerology.related.kundli.description"),
        },
      ]}
    >
      <NumTool />
    </PremiumToolShell>
  );
}

function NumTool() {
  const { t, raw } = useTranslation();
  const planets = raw<Record<number, string>>("premium_tools.numerology.planets") ?? PLANETS;
  const meanings = raw<Record<number, string>>("premium_tools.numerology.meanings") ?? MEANINGS;
  const lucky =
    raw<Record<number, { colors: string; days: string; gem: string }>>(
      "premium_tools.numerology.lucky",
    ) ?? LUCKY;

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [report, setReport] = useState<null | {
    life: number;
    dest: { number: number; meaning: string };
    soul: { number: number; meaning: string };
    personality: { number: number; meaning: string };
    birthday: number;
  }>(null);

  const generate = () => {
    if (!name.trim()) {
      toast.error(t("premium_tools.numerology.error_name"));
      return;
    }
    if (!dob) {
      toast.error(t("premium_tools.numerology.error_dob"));
      return;
    }
    const vowels = name.replace(/[^aeiouAEIOU]/g, "");
    const consonants = name.replace(/[^a-zA-Z]/g, "").replace(/[aeiouAEIOU]/g, "");
    const day = Number(dob.split("-")[2] ?? "0");
    const birthday = day > 9 ? [...String(day)].reduce((s, d) => s + Number(d), 0) : day;
    setReport({
      life: lifePathNumber(dob),
      dest: nameNumerology(name),
      soul: nameNumerology(vowels),
      personality: nameNumerology(consonants),
      birthday: birthday || 1,
    });
    setTimeout(
      () =>
        document
          .getElementById("num-report")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  };

  const reset = () => {
    setName("");
    setDob("");
    setReport(null);
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 font-semibold">
          <Hash className="size-4" /> {t("premium_tools.numerology.enter_details")}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t("premium_tools.numerology.full_birth_name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("premium_tools.numerology.name_placeholder")}
            />
          </div>
          <div>
            <Label>{t("premium_tools.shared.date_of_birth")}</Label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={generate} size="lg" className="gap-2">
            <Sparkles className="size-4" /> {t("premium_tools.numerology.generate_button")}
          </Button>
          {report && (
            <Button onClick={reset} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="size-4" /> {t("premium_tools.numerology.reset_button")}
            </Button>
          )}
        </div>
      </Card>

      {report && (
        <div id="num-report" className="mt-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <NumberCard
              label={t("premium_tools.numerology.life_path_number")}
              number={report.life}
              accent="from-primary/10 to-orange-500/5"
              planets={planets}
              meanings={meanings}
            />
            <NumberCard
              label={t("premium_tools.numerology.destiny_number")}
              number={report.dest.number}
              accent="from-rose-500/10 to-amber-500/5"
              planets={planets}
              meanings={meanings}
            />
            <NumberCard
              label={t("premium_tools.numerology.soul_urge_number")}
              number={report.soul.number}
              accent="from-violet-500/10 to-pink-500/5"
              planets={planets}
              meanings={meanings}
            />
            <NumberCard
              label={t("premium_tools.numerology.personality_number")}
              number={report.personality.number}
              accent="from-emerald-500/10 to-teal-500/5"
              planets={planets}
              meanings={meanings}
            />
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-3">
              {t("premium_tools.numerology.birthday_number_label")}{" "}
              <span className="text-primary">{report.birthday}</span>
            </h3>
            <p className="text-sm text-muted-foreground">{meanings[report.birthday]}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">
              {t("premium_tools.numerology.lucky_attributes_heading", { number: report.life })}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("premium_tools.numerology.ruling_planet")}
                </div>
                <div className="font-semibold mt-1">{planets[report.life]}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("premium_tools.numerology.lucky_colours")}
                </div>
                <div className="font-semibold mt-1">{lucky[report.life]?.colors}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("premium_tools.numerology.lucky_day")}
                </div>
                <div className="font-semibold mt-1">{lucky[report.life]?.days}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("premium_tools.numerology.recommended_gemstone")}
                </div>
                <div className="font-semibold mt-1">{lucky[report.life]?.gem}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("premium_tools.numerology.lucky_number")}
                </div>
                <div className="font-semibold mt-1">{report.life}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  {t("premium_tools.numerology.compatible_numbers")}
                </div>
                <div className="font-semibold mt-1">
                  {[1, 3, 5, 6]
                    .filter((n) => n !== report.life)
                    .slice(0, 3)
                    .join(", ")}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-primary/5">
            <Badge variant="secondary" className="mb-3">
              {t("premium_tools.numerology.summary_badge")}
            </Badge>
            <p className="text-sm leading-relaxed">
              <strong>{name}</strong>
              {t("premium_tools.numerology.summary_after_name", { dob })}{" "}
              <strong>{report.life}</strong>{" "}
              {t("premium_tools.numerology.summary_after_life", { planet: planets[report.life] })}{" "}
              {t("premium_tools.numerology.summary_after_planet")}{" "}
              <strong>{report.dest.number}</strong> — {report.dest.meaning}{" "}
              {t("premium_tools.numerology.summary_after_dest_meaning")}{" "}
              <strong>{report.soul.number}</strong>,{" "}
              {t("premium_tools.numerology.summary_after_soul")}{" "}
              <strong>{report.personality.number}</strong> — {report.personality.meaning}
            </p>
          </Card>
        </div>
      )}
    </>
  );
}

function NumberCard({
  label,
  number,
  accent,
  planets,
  meanings,
}: {
  label: string;
  number: number;
  accent: string;
  planets: Record<number, string>;
  meanings: Record<number, string>;
}) {
  return (
    <Card className={`p-6 text-center bg-gradient-to-br ${accent}`}>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-2 text-6xl font-black text-primary">{number}</div>
      <div className="mt-2 text-xs font-semibold text-primary/80">{planets[number]}</div>
      <p className="mt-3 text-sm text-muted-foreground">{meanings[number]}</p>
    </Card>
  );
}
