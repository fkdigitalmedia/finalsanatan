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

async function enableProviders() {
  console.log("Enabling AI Providers & Feature Mappings in database...");

  // Enable all core providers in ai_providers
  const enableRes = await fetch(`${url}/rest/v1/ai_providers?enabled=eq.false`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ enabled: true, status: "healthy" }),
  });

  if (enableRes.ok) {
    console.log("Successfully enabled all AI Providers.");
  } else {
    const errTxt = await enableRes.text();
    console.error("Failed to enable AI providers:", errTxt);
  }

  // Ensure default Lovable AI Gateway provider is set as primary default
  await fetch(`${url}/rest/v1/ai_providers?provider_type=eq.lovable`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ enabled: true, is_default: true, priority: 1, status: "healthy" }),
  });

  // Populate default AI Feature Mappings
  const defaultMappings = [
    {
      feature_key: "interpretation.daily-horoscope",
      model_name: "google/gemini-2.5-flash",
      enabled: true,
    },
    {
      feature_key: "interpretation.kundli-summary",
      model_name: "google/gemini-2.5-pro",
      enabled: true,
    },
    {
      feature_key: "interpretation.career-report",
      model_name: "openai/gpt-4o-mini",
      enabled: true,
    },
    { feature_key: "studio.article", model_name: "google/gemini-2.5-pro", enabled: true },
  ];

  for (const m of defaultMappings) {
    await fetch(`${url}/rest/v1/ai_feature_mappings`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify(m),
    });
  }

  console.log("AI Providers & Feature Mappings configuration updated.");
}

enableProviders().catch((err) => console.error(err));
