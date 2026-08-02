import fs from "node:fs";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

const templatesToSeed = [
  {
    name: "Janam Kundli Standard Template",
    report: "kundli",
    status: "published",
    language: "en",
    theme: "premium",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Kundli Matching Compatibility Template",
    report: "matching",
    status: "published",
    language: "en",
    theme: "premium",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Career Horoscope Template",
    report: "career",
    status: "published",
    language: "en",
    theme: "modern",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Marriage & Relationship Template",
    report: "marriage",
    status: "published",
    language: "en",
    theme: "premium",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Astrological Horoscope Template",
    report: "horoscope",
    status: "published",
    language: "en",
    theme: "gold",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Auspicious Muhurat Guide Template",
    report: "muhurat",
    status: "published",
    language: "en",
    theme: "vedic",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Numerology Profile Template",
    report: "numerology",
    status: "published",
    language: "en",
    theme: "modern",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Vastu Shastra Guide Template",
    report: "vastu",
    status: "published",
    language: "en",
    theme: "classic",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
  {
    name: "Festival Calendar & Panchang Template",
    report: "festival",
    status: "published",
    language: "en",
    theme: "vedic",
    is_default: true,
    config: { pageOrientation: "portrait", paperSize: "a4" },
  },
];

async function seedPdfTemplates() {
  console.log("Seeding default PDF templates into pdf_templates table...");
  for (const t of templatesToSeed) {
    const res = await fetch(`${url}/rest/v1/pdf_templates`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(t),
    });
    if (res.ok) {
      console.log(`Seeded template for report [${t.report}] (${t.name})`);
    } else {
      const errTxt = await res.text();
      console.error(`Failed to seed template for [${t.report}]: ${errTxt}`);
    }
  }
  console.log("PDF templates seeding complete.");
}

seedPdfTemplates().catch((err) => console.error(err));
