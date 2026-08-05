// ============================================================
// Universal PDF Report Engine — Default template factory
// ------------------------------------------------------------
// These are DATA, not layout code. Every report gets a starter
// template built from generic sections + {{variables}}; admins
// duplicate and edit them in the PDF Manager. Unknown/future
// reports fall back to the generic narrative template, so a new
// report never requires an engine change.
// ============================================================

import { DEFAULT_THEME_NAME } from "./constants";
import type { PdfReportType, PdfTemplate, TemplateSection } from "./types";

type Draft = Partial<PdfTemplate> & { report: string };

const cover = (subtitle: string, details: TemplateSection["options"]): TemplateSection => ({
  id: "cover",
  type: "cover",
  title: "{{reportTitle}}",
  inToc: false,
  options: { subtitle, breakAfter: true, ...details },
});

const BIRTH_DETAILS = {
  details: [
    { label: "Name", value: "{{user}}" },
    { label: "Report Date", value: "{{reportDate}}" },
    { label: "Date of Birth", value: "{{birthDate}}" },
    { label: "Time of Birth", value: "{{birthTime}}" },
    { label: "Place of Birth", value: "{{birthPlace}}" },
    { label: "Lagna", value: "{{lagna}}" },
    { label: "Moon Sign", value: "{{moonSign}}" },
    { label: "Nakshatra", value: "{{nakshatra}}" },
  ],
};

const toc: TemplateSection = { id: "toc", type: "toc", title: "Table of Contents", inToc: false };
const disclaimer: TemplateSection = {
  id: "disclaimer",
  type: "disclaimer",
  title: "Disclaimer",
  newPage: false,
  inToc: false,
};
const summary = (title = "Summary"): TemplateSection => ({
  id: "summary",
  type: "summary",
  title,
  inToc: true,
  newPage: true,
  options: { text: "{{summary}}" },
});

const KUNDLI_SECTIONS: TemplateSection[] = [
  cover("Vedic Birth Chart Analysis", BIRTH_DETAILS),
  toc,
  {
    id: "intro",
    type: "introduction",
    title: "About This Report",
    inToc: true,
    newPage: true,
    options: { text: "{{introduction}}" },
  },
  {
    id: "basics",
    type: "keyvalue",
    title: "Birth Details",
    inToc: true,
    options: { itemsSource: "birthDetails", columns: 2 },
  },
  {
    id: "d1",
    type: "chart",
    title: "Rashi Chart (D1)",
    inToc: true,
    newPage: true,
    options: {
      chartSource: "kundliChart",
      style: "north",
      caption: "Rashi Chart — D1",
      align: "center",
    },
  },
  {
    id: "d9",
    type: "chart",
    title: "Navamsa Chart (D9)",
    inToc: true,
    options: {
      chartSource: "navamsaChart",
      style: "south",
      caption: "Navamsa — D9",
      align: "center",
    },
    visibleWhen: "navamsaChart",
  },
  {
    id: "wheel",
    type: "wheel-chart",
    title: "Planet Wheel",
    inToc: true,
    options: { chartSource: "kundliChart", style: "planet-wheel", align: "center" },
    visibleWhen: "kundliChart",
  },
  {
    id: "planets",
    type: "planet-table",
    title: "Planetary Positions",
    inToc: true,
    newPage: true,
    options: { planetsSource: "planetTable" },
  },
  {
    id: "houses",
    type: "house-table",
    title: "House Cusps",
    inToc: true,
    options: { housesSource: "houseTable" },
    visibleWhen: "houseTable",
  },
  {
    id: "strength",
    type: "planet-strength-table",
    title: "Planetary Strength",
    inToc: true,
    options: { entriesSource: "strengthTable" },
    visibleWhen: "strengthTable",
  },
  {
    id: "dasha",
    type: "dasha-timeline",
    title: "Vimshottari Dasha",
    inToc: true,
    newPage: true,
    options: { itemsSource: "mahadasha" },
    visibleWhen: "mahadasha",
  },
  {
    id: "antar",
    type: "timeline",
    title: "Current Antardasha",
    inToc: true,
    options: { itemsSource: "antardasha" },
    visibleWhen: "antardasha",
  },
  {
    id: "transits",
    type: "transit-timeline",
    title: "Current Transits",
    inToc: true,
    options: { itemsSource: "transits" },
    visibleWhen: "transits",
  },
  {
    id: "yogas",
    type: "yoga-summary",
    title: "Yogas",
    inToc: true,
    newPage: true,
    options: { itemsSource: "yogas" },
    visibleWhen: "yogas",
  },
  {
    id: "doshas",
    type: "dosha-summary",
    title: "Doshas",
    inToc: true,
    options: { itemsSource: "doshas" },
    visibleWhen: "doshas",
  },
  {
    id: "scores",
    type: "scorecards",
    title: "Life Area Scores",
    inToc: true,
    options: { itemsSource: "scores", columns: 3 },
    visibleWhen: "scores",
  },
  {
    id: "analysis",
    type: "markdown",
    title: "Detailed Analysis",
    inToc: true,
    newPage: true,
    options: { text: "{{analysis}}" },
    visibleWhen: "analysis",
  },
  {
    id: "remedies",
    type: "recommendations",
    title: "Recommendations & Remedies",
    inToc: true,
    options: { itemsSource: "recommendations" },
    visibleWhen: "recommendations",
  },
  summary(),
  {
    id: "appendix",
    type: "appendix",
    title: "Appendix",
    inToc: true,
    newPage: true,
    options: { itemsSource: "appendix" },
    visibleWhen: "appendix",
  },
  disclaimer,
];

const HOROSCOPE_SECTIONS: TemplateSection[] = [
  cover("Astrological Forecast", {
    details: [
      { label: "Name", value: "{{user}}" },
      { label: "Sign", value: "{{moonSign}}" },
      { label: "Period", value: "{{period}}" },
      { label: "Report Date", value: "{{reportDate}}" },
    ],
  }),
  toc,
  {
    id: "overview",
    type: "markdown",
    title: "Overview",
    inToc: true,
    newPage: true,
    options: { text: "{{summary}}" },
  },
  {
    id: "scores",
    type: "scorecards",
    title: "Key Scores",
    inToc: true,
    options: { itemsSource: "scores", columns: 3 },
    visibleWhen: "scores",
  },
  {
    id: "bars",
    type: "progress-bars",
    title: "Life Areas",
    inToc: true,
    options: { itemsSource: "categories" },
    visibleWhen: "categories",
  },
  {
    id: "lucky",
    type: "keyvalue",
    title: "Lucky Factors",
    inToc: true,
    options: { objectSource: "lucky", columns: 2 },
    visibleWhen: "lucky",
  },
  {
    id: "transits",
    type: "transit-timeline",
    title: "Transits",
    inToc: true,
    options: { itemsSource: "transits" },
    visibleWhen: "transits",
  },
  {
    id: "analysis",
    type: "markdown",
    title: "Detailed Guidance",
    inToc: true,
    newPage: true,
    options: { text: "{{analysis}}" },
    visibleWhen: "analysis",
  },
  {
    id: "remedies",
    type: "recommendations",
    title: "Suggestions",
    inToc: true,
    options: { itemsSource: "recommendations" },
    visibleWhen: "recommendations",
  },
  disclaimer,
];

const MATCHING_SECTIONS: TemplateSection[] = [
  cover("Guna Milan Compatibility", {
    details: [
      { label: "Bride", value: "{{bride}}" },
      { label: "Groom", value: "{{groom}}" },
      { label: "Total Guna", value: "{{gunaScore}}" },
      { label: "Report Date", value: "{{reportDate}}" },
    ],
  }),
  toc,
  {
    id: "verdict",
    type: "scorecards",
    title: "Match Verdict",
    inToc: true,
    newPage: true,
    options: { itemsSource: "scores", columns: 3 },
    visibleWhen: "scores",
  },
  {
    id: "koota",
    type: "table",
    title: "Ashtakoot Breakdown",
    inToc: true,
    options: { rowsSource: "kootaTable" },
    visibleWhen: "kootaTable",
  },
  {
    id: "bars",
    type: "progress-bars",
    title: "Compatibility Areas",
    inToc: true,
    options: { itemsSource: "categories" },
    visibleWhen: "categories",
  },
  {
    id: "brideChart",
    type: "chart",
    title: "Bride Chart",
    inToc: true,
    newPage: true,
    options: { chartSource: "brideChart", style: "north", align: "center" },
    visibleWhen: "brideChart",
  },
  {
    id: "groomChart",
    type: "chart",
    title: "Groom Chart",
    inToc: true,
    options: { chartSource: "groomChart", style: "north", align: "center" },
    visibleWhen: "groomChart",
  },
  {
    id: "doshas",
    type: "dosha-summary",
    title: "Dosha Check",
    inToc: true,
    options: { itemsSource: "doshas" },
    visibleWhen: "doshas",
  },
  {
    id: "analysis",
    type: "markdown",
    title: "Interpretation",
    inToc: true,
    newPage: true,
    options: { text: "{{analysis}}" },
    visibleWhen: "analysis",
  },
  {
    id: "remedies",
    type: "recommendations",
    title: "Remedies",
    inToc: true,
    options: { itemsSource: "recommendations" },
    visibleWhen: "recommendations",
  },
  summary("Conclusion"),
  disclaimer,
];

const FESTIVAL_SECTIONS: TemplateSection[] = [
  cover("Festival Calendar", {
    details: [
      { label: "Year", value: "{{year}}" },
      { label: "Region", value: "{{region}}" },
      { label: "Report Date", value: "{{reportDate}}" },
    ],
  }),
  toc,
  {
    id: "intro",
    type: "introduction",
    title: "About",
    inToc: true,
    newPage: true,
    options: { text: "{{introduction}}" },
  },
  {
    id: "calendar",
    type: "festival-calendar",
    title: "Festival Calendar",
    inToc: true,
    options: { itemsSource: "festivals" },
  },
  {
    id: "analysis",
    type: "markdown",
    title: "Highlights",
    inToc: true,
    options: { text: "{{analysis}}" },
    visibleWhen: "analysis",
  },
  disclaimer,
];

const GENERIC_SECTIONS: TemplateSection[] = [
  cover("{{reportSubtitle|Personalised Report}}", BIRTH_DETAILS),
  toc,
  {
    id: "intro",
    type: "introduction",
    title: "Introduction",
    inToc: true,
    newPage: true,
    options: { text: "{{introduction}}" },
    visibleWhen: "introduction",
  },
  {
    id: "details",
    type: "keyvalue",
    title: "Details",
    inToc: true,
    options: { itemsSource: "details", columns: 2 },
    visibleWhen: "details",
  },
  {
    id: "scores",
    type: "scorecards",
    title: "Scores",
    inToc: true,
    options: { itemsSource: "scores", columns: 3 },
    visibleWhen: "scores",
  },
  {
    id: "bars",
    type: "progress-bars",
    title: "Ratings",
    inToc: true,
    options: { itemsSource: "categories" },
    visibleWhen: "categories",
  },
  {
    id: "chart",
    type: "chart",
    title: "Chart",
    inToc: true,
    options: { chartSource: "kundliChart", style: "north", align: "center" },
    visibleWhen: "kundliChart",
  },
  {
    id: "planets",
    type: "planet-table",
    title: "Planetary Positions",
    inToc: true,
    options: { planetsSource: "planetTable" },
    visibleWhen: "planetTable",
  },
  {
    id: "table",
    type: "table",
    title: "Data",
    inToc: true,
    options: { rowsSource: "table" },
    visibleWhen: "table",
  },
  {
    id: "timeline",
    type: "timeline",
    title: "Timeline",
    inToc: true,
    options: { itemsSource: "timeline" },
    visibleWhen: "timeline",
  },
  {
    id: "analysis",
    type: "markdown",
    title: "Analysis",
    inToc: true,
    newPage: true,
    options: { text: "{{analysis}}" },
    visibleWhen: "analysis",
  },
  {
    id: "remedies",
    type: "recommendations",
    title: "Recommendations",
    inToc: true,
    options: { itemsSource: "recommendations" },
    visibleWhen: "recommendations",
  },
  summary(),
  disclaimer,
];

const VARSHPHAL_SECTIONS: TemplateSection[] = [
  cover("Varshphal Annual Return Horoscope", BIRTH_DETAILS),
  toc,
  {
    id: "varshphal_summary",
    type: "introduction",
    title: "Annual Solar Return Executive Summary",
    inToc: true,
    newPage: true,
    options: { text: "{{summary}}" },
  },
  {
    id: "muntha_analysis",
    type: "markdown",
    title: "Muntha Analysis & Tajika Predictions",
    inToc: true,
    newPage: false,
    options: { text: "{{munthaAnalysis}}" },
  },
  {
    id: "varshesh_analysis",
    type: "markdown",
    title: "Varshapati (Year Lord) & Tajika Sahams",
    inToc: true,
    newPage: false,
    options: { text: "{{varsheshAnalysis}}" },
  },
  {
    id: "monthly_timeline",
    type: "timeline",
    title: "12-Month Month-by-Month Forecast",
    inToc: true,
    newPage: true,
    options: { itemsSource: "monthlyTimeline" },
  },
  summary("Annual Guidance & Vedic Remedies"),
  disclaimer,
];

const SECTION_PRESETS: Record<string, TemplateSection[]> = {
  "janam-kundli": KUNDLI_SECTIONS,
  varshphal: VARSHPHAL_SECTIONS,
  "personalized-horoscope": HOROSCOPE_SECTIONS,
  "daily-horoscope": HOROSCOPE_SECTIONS,
  "weekly-horoscope": HOROSCOPE_SECTIONS,
  "monthly-horoscope": HOROSCOPE_SECTIONS,
  "yearly-horoscope": HOROSCOPE_SECTIONS,
  "kundli-matching": MATCHING_SECTIONS,
  "marriage-compatibility": MATCHING_SECTIONS,
  "festival-report": FESTIVAL_SECTIONS,
  "numerology-report": GENERIC_SECTIONS,
  "muhurat-report": GENERIC_SECTIONS,
  "career-report": GENERIC_SECTIONS,
  "marriage-report": MATCHING_SECTIONS,
  "business-report": GENERIC_SECTIONS,
  "health-report": GENERIC_SECTIONS,
  "foreign-settlement": GENERIC_SECTIONS,
};

const THEME_PRESETS: Record<string, string> = {
  "janam-kundli": "premium",
  "kundli-matching": "temple",
  "marriage-compatibility": "temple",
  "festival-report": "temple",
  "numerology-report": "modern",
  "vastu-report": "modern",
  "career-report": "luxury",
  "business-report": "luxury",
};

/** Build a starter template object for any report key. */
export function buildDefaultTemplate(report: PdfReportType): Draft {
  const key = String(report);
  const sections = SECTION_PRESETS[key] ?? GENERIC_SECTIONS;
  return {
    report: key,
    theme: THEME_PRESETS[key] ?? DEFAULT_THEME_NAME,
    status: "published",
    version: 1,
    sections: JSON.parse(JSON.stringify(sections)) as TemplateSection[],
  };
}

export const DEFAULT_SECTION_PRESETS = SECTION_PRESETS;
export const GENERIC_TEMPLATE_SECTIONS = GENERIC_SECTIONS;
