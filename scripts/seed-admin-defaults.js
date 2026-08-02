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

async function checkAndInsert(table, selectQuery, seedRows) {
  console.log(`Checking: ${table}...`);
  try {
    const res = await fetch(`${url}/rest/v1/${table}?${selectQuery}`, { headers });
    const existing = await res.json();
    if (Array.isArray(existing) && existing.length === 0) {
      console.log(`Seeding default ${table}...`);
      const insertRes = await fetch(`${url}/rest/v1/${table}`, {
        method: "POST",
        headers,
        body: JSON.stringify(seedRows),
      });
      if (insertRes.ok) {
        console.log(`Successfully seeded ${table}.`);
      } else {
        const errTxt = await insertRes.text();
        console.error(`Failed to seed ${table}: ${errTxt}`);
      }
    } else {
      console.log(
        `Table ${table} already contains data (${Array.isArray(existing) ? existing.length : 0} rows found).`,
      );
    }
  } catch (err) {
    console.error(`Error checking/seeding ${table}:`, err.message);
  }
}

async function seedAdminDefaults() {
  console.log("====================================================");
  console.log("SANATAN DHARMA SUITE - ADMIN DEFAULTS SEEDER");
  console.log("====================================================\n");

  // 1. Admin Ads
  await checkAndInsert("admin_ads", "select=id&limit=1", [
    {
      name: "Vedic Astrologer Consultation Banner",
      slot: "sidebar",
      image_url: "https://sanatantools.com/ads/banner-astrology.jpg",
      target_url: "/tools/career-report",
      enabled: true,
      weight: 10,
    },
    {
      name: "Panchang Daily Digest Banner",
      slot: "footer",
      image_url: "https://sanatantools.com/ads/banner-panchang.jpg",
      target_url: "/panchang",
      enabled: true,
      weight: 5,
    },
  ]);

  // 2. Affiliate Links
  await checkAndInsert("affiliate_links", "select=id&limit=1", [
    {
      product: "Authentic Rudraksha Mala (108 Beads)",
      url: "https://amazon.in/dp/example-rudraksha",
      network: "amazon",
      category: "spiritual_items",
      clicks: 0,
      conversions: 0,
      active: true,
    },
  ]);

  console.log("\n====================================================");
  console.log("ADMIN DEFAULTS SEEDING COMPLETE");
  console.log("====================================================");
}

seedAdminDefaults().catch((err) => console.error("Admin defaults seeding error:", err));
