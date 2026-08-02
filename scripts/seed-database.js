import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function seedDatabase() {
  console.log("====================================================");
  console.log("SANATAN DHARMA SUITE - SEED DATA RUNNER");
  console.log("Target URL:", url);
  console.log("====================================================\n");

  // 1. Site Settings (Site Settings, SEO Settings, Feature Flags)
  console.log("Seeding: Site Settings, SEO Settings, Feature Flags...");
  const siteSettings = [
    { key: "site_title", value: JSON.stringify("Sanatan Dharma Suite") },
    {
      key: "site_description",
      value: JSON.stringify(
        "The largest collection of Sanatan Dharma tools, calculators, AI utilities, and Vedic resources.",
      ),
    },
    { key: "site_url", value: JSON.stringify("https://sanatantools.com") },
    { key: "default_language", value: JSON.stringify("en") },
    {
      key: "supported_languages",
      value: JSON.stringify(["en", "hi", "sa", "bn", "ta", "te", "mr", "gu"]),
    },
    { key: "maintenance_mode", value: JSON.stringify(false) },
    { key: "contact_email", value: JSON.stringify("support@sanatantools.com") },
    {
      key: "seo_defaults",
      value: JSON.stringify({
        og_image: "https://sanatantools.com/og-default.jpg",
        twitter_handle: "@sanatantools",
        meta_keywords: ["vedic", "astrology", "panchang", "kundli", "sanatan", "dharma", "mantra"],
      }),
    },
    {
      key: "feature_flags",
      value: JSON.stringify({
        enable_ai_astrologer: true,
        enable_pdf_downloads: true,
        enable_payments: true,
        enable_panchang_notifications: true,
      }),
    },
    {
      key: "theme_defaults",
      value: JSON.stringify({ primary_color: "#D97706", font_family: "Inter", dark_mode: true }),
    },
  ];
  const { error: ssErr } = await supabase
    .from("site_settings")
    .upsert(siteSettings, { onConflict: "key" });
  if (ssErr) console.error("Site settings seed notice:", ssErr.message);
  else console.log("Site settings seeded successfully.");

  // 2. AI Providers & Models
  console.log("Seeding: AI Providers & Models...");
  const aiProviders = [
    {
      id: "e1111111-1111-1111-1111-111111111111",
      name: "OpenAI",
      provider_type: "openai",
      api_key_env_var: "OPENAI_API_KEY",
      is_active: true,
      priority: 1,
    },
    {
      id: "e2222222-2222-2222-2222-222222222222",
      name: "Google Gemini",
      provider_type: "gemini",
      api_key_env_var: "GEMINI_API_KEY",
      is_active: true,
      priority: 2,
    },
    {
      id: "e3333333-3333-3333-3333-333333333333",
      name: "Anthropic Claude",
      provider_type: "anthropic",
      api_key_env_var: "ANTHROPIC_API_KEY",
      is_active: true,
      priority: 3,
    },
  ];
  const { error: aiPErr } = await supabase
    .from("ai_providers")
    .upsert(aiProviders, { onConflict: "id" });
  if (aiPErr) console.error("AI providers seed notice:", aiPErr.message);

  const aiModels = [
    {
      id: "m1111111-1111-1111-1111-111111111111",
      provider_id: "e1111111-1111-1111-1111-111111111111",
      name: "GPT-4o",
      model_code: "gpt-4o",
      cost_per_1k_tokens: 0.005,
      is_active: true,
    },
    {
      id: "m2222222-2222-2222-2222-222222222222",
      provider_id: "e2222222-2222-2222-2222-222222222222",
      name: "Gemini 1.5 Pro",
      model_code: "gemini-1.5-pro",
      cost_per_1k_tokens: 0.003,
      is_active: true,
    },
    {
      id: "m3333333-3333-3333-3333-333333333333",
      provider_id: "e3333333-3333-3333-3333-333333333333",
      name: "Claude 3.5 Sonnet",
      model_code: "claude-3-5-sonnet-20241022",
      cost_per_1k_tokens: 0.004,
      is_active: true,
    },
  ];
  const { error: aiMErr } = await supabase.from("ai_models").upsert(aiModels, { onConflict: "id" });
  if (aiMErr) console.error("AI models seed notice:", aiMErr.message);
  else console.log("AI Providers & Models seeded successfully.");

  // 3. Prompt Categories & Prompts
  console.log("Seeding: Prompt Categories & AI Prompts...");
  const aiPrompts = [
    {
      id: "p1111111-1111-1111-1111-111111111111",
      key: "kundli_interpretation",
      name: "Kundli Chart Deep Interpretation",
      category: "astrology",
      prompt_text:
        "You are a master Vedic Astrologer (Jyotish Acharya). Analyze the given Kundli chart data, house placements, dashas, and planetary aspects. Provide clear, empathetic, and actionable guidance.",
      is_active: true,
    },
    {
      id: "p2222222-2222-2222-2222-222222222222",
      key: "daily_horoscope",
      name: "Daily Vedic Horoscope",
      category: "horoscope",
      prompt_text:
        "Generate an accurate daily horoscope reading based on planetary transits for the given Rashi.",
      is_active: true,
    },
    {
      id: "p3333333-3333-3333-3333-333333333333",
      key: "vastu_analysis",
      name: "Vastu Shastra Consultation",
      category: "vastu",
      prompt_text:
        "Analyze the directions and room placements of the given property layout according to Vastu Shastra principles.",
      is_active: true,
    },
    {
      id: "p4444444-4444-4444-4444-444444444444",
      key: "mantra_explanation",
      name: "Mantra Meaning & Sadhana Guide",
      category: "spirituality",
      prompt_text:
        "Explain the Sanskrit origin, phonetic pronunciation, spiritual significance, and sadhana rules for the given mantra.",
      is_active: true,
    },
    {
      id: "p5555555-5555-5555-5555-555555555555",
      key: "muhurat_finder",
      name: "Auspicious Time (Muhurat) Guidance",
      category: "panchang",
      prompt_text:
        "Identify the best auspicious time window for the requested activity based on tithi, nakshatra, choghadiya, and karana.",
      is_active: true,
    },
  ];
  const { error: pErr } = await supabase.from("ai_prompts").upsert(aiPrompts, { onConflict: "id" });
  if (pErr) console.error("AI prompts seed notice:", pErr.message);
  else console.log("AI Prompts seeded successfully.");

  // 4. Payment Providers
  console.log("Seeding: Payment Providers...");
  const paymentGateways = [
    {
      id: "g1111111-1111-1111-1111-111111111111",
      provider: "razorpay",
      is_active: true,
      is_test_mode: true,
      config: { key_id: "rzp_test_sample", currency: "INR" },
    },
    {
      id: "g2222222-2222-2222-2222-222222222222",
      provider: "lemon_squeezy",
      is_active: true,
      is_test_mode: true,
      config: { store_id: "ls_sample", currency: "USD" },
    },
    {
      id: "g3333333-3333-3333-3333-333333333333",
      provider: "stripe",
      is_active: false,
      is_test_mode: true,
      config: { publishable_key: "pk_test_sample", currency: "USD" },
    },
  ];
  const { error: pgErr } = await supabase
    .from("payment_gateways")
    .upsert(paymentGateways, { onConflict: "id" });
  if (pgErr) console.error("Payment gateways seed notice:", pgErr.message);
  else console.log("Payment Gateways seeded successfully.");

  // 5. Email Templates
  console.log("Seeding: Email Templates...");
  const emailTemplates = [
    {
      id: "t1111111-1111-1111-1111-111111111111",
      key: "welcome_email",
      name: "Welcome Email",
      subject: "Welcome to Sanatan Dharma Suite!",
      body_html:
        "<h1>Welcome to Sanatan Dharma Suite</h1><p>Namaste! Thank you for joining us.</p>",
      body_text: "Namaste! Thank you for joining Sanatan Dharma Suite.",
    },
    {
      id: "t2222222-2222-2222-2222-222222222222",
      key: "password_reset",
      name: "Password Reset",
      subject: "Reset your password - Sanatan Dharma Suite",
      body_html: "<p>Click the link below to reset your password.</p>",
      body_text: "Reset your password using the provided link.",
    },
    {
      id: "t3333333-3333-3333-3333-333333333333",
      key: "order_confirmation",
      name: "Order Confirmation",
      subject: "Your Sanatan Dharma Suite Order Confirmation",
      body_html: "<p>Thank you for purchasing your Kundli/Vedic Report!</p>",
      body_text: "Thank you for purchasing your report.",
    },
    {
      id: "t4444444-4444-4444-4444-444444444444",
      key: "daily_panchang",
      name: "Daily Panchang Digest",
      subject: "Today's Panchang & Auspicious Timings",
      body_html: "<p>Here is your daily Panchang update.</p>",
      body_text: "Today's Panchang update.",
    },
  ];
  const { error: etErr } = await supabase
    .from("email_templates")
    .upsert(emailTemplates, { onConflict: "id" });
  if (etErr) console.error("Email templates seed notice:", etErr.message);
  else console.log("Email Templates seeded successfully.");

  // 6. Notification Templates
  console.log("Seeding: Notification Templates...");
  const notifTemplates = [
    {
      id: "n1111111-1111-1111-1111-111111111111",
      key: "panchang_daily",
      title_template: "Today's Panchang Update",
      body_template: "Tithi: {{tithi}}, Nakshatra: {{nakshatra}}, Abhijit Muhurat: {{muhurat}}",
      channel: "in_app",
      is_active: true,
    },
    {
      id: "n2222222-2222-2222-2222-222222222222",
      key: "festival_alert",
      title_template: "Upcoming Festival: {{festival_name}}",
      body_template:
        "{{festival_name}} is coming up on {{date}}. Learn auspicious rituals and timings.",
      channel: "push",
      is_active: true,
    },
    {
      id: "n3333333-3333-3333-3333-333333333333",
      key: "streak_reminder",
      title_template: "Maintain Your Sadhana Streak!",
      body_template:
        "You are on a {{streak_count}} day streak. Complete today's japa/mantra to keep it going.",
      channel: "in_app",
      is_active: true,
    },
  ];
  const { error: ntErr } = await supabase
    .from("notification_templates")
    .upsert(notifTemplates, { onConflict: "id" });
  if (ntErr) console.error("Notification templates seed notice:", ntErr.message);
  else console.log("Notification Templates seeded successfully.");

  // 7. Subscription Plans
  console.log("Seeding: Subscription Plans...");
  const subPlans = [
    {
      id: "s1111111-1111-1111-1111-111111111111",
      name: "Free Seeker",
      slug: "free",
      description: "Access to basic panchang, daily horoscope, and public tools.",
      price_inr: 0,
      price_usd: 0,
      billing_period: "monthly",
      features: ["Basic Panchang", "Daily Rashi", "5 AI Queries/mo", "Standard Kundli"],
      is_active: true,
    },
    {
      id: "s2222222-2222-2222-2222-222222222222",
      name: "Sadhak Pro (Monthly)",
      slug: "pro-monthly",
      description: "Full access to all 100+ Vedic tools, PDF downloads, and unlimited AI guidance.",
      price_inr: 499,
      price_usd: 9.99,
      billing_period: "monthly",
      features: [
        "All 100+ Tools",
        "Unlimited PDF Reports",
        "50 AI Queries/mo",
        "Ad-Free Experience",
        "Priority Support",
      ],
      is_active: true,
    },
    {
      id: "s3333333-3333-3333-3333-333333333333",
      name: "Sadhak Pro (Yearly)",
      slug: "pro-yearly",
      description: "Full access for 1 year with 2 months free.",
      price_inr: 4999,
      price_usd: 89.99,
      billing_period: "yearly",
      features: [
        "All Pro Features",
        "Save 20%",
        "Kundli Matching Deep Reports",
        "Vastu & Muhurat Planners",
      ],
      is_active: true,
    },
    {
      id: "s4444444-4444-4444-4444-444444444444",
      name: "Lifetime Moksha Pass",
      slug: "lifetime",
      description:
        "One-time payment for lifetime unlimited access to all present & future features.",
      price_inr: 14999,
      price_usd: 299.99,
      billing_period: "lifetime",
      features: [
        "Lifetime Access",
        "All Premium PDFs",
        "Unlimited AI Astrologer",
        "VIP Community Access",
      ],
      is_active: true,
    },
  ];
  const { error: spErr } = await supabase
    .from("subscription_plans")
    .upsert(subPlans, { onConflict: "id" });
  if (spErr) console.error("Subscription plans seed notice:", spErr.message);
  else console.log("Subscription Plans seeded successfully.");

  // 8. Theme Settings (PDF Themes)
  console.log("Seeding: PDF Themes & Settings...");
  const pdfThemes = [
    {
      id: "th111111-1111-1111-1111-111111111111",
      key: "saffron_classic",
      name: "Saffron Vedic Classic",
      colors: { primary: "#D97706", secondary: "#92400E", background: "#FFFBEB", text: "#1F2937" },
      font_family: "Cinzel",
      is_active: true,
    },
    {
      id: "th222222-2222-2222-2222-222222222222",
      key: "vedic_gold",
      name: "Royal Vedic Gold",
      colors: { primary: "#B45309", secondary: "#78350F", background: "#FEF3C7", text: "#111827" },
      font_family: "Merriweather",
      is_active: true,
    },
    {
      id: "th333333-3333-3333-3333-333333333333",
      key: "spiritual_dark",
      name: "Deep Spiritual Midnight",
      colors: { primary: "#F59E0B", secondary: "#FBBF24", background: "#0F172A", text: "#F8FAFC" },
      font_family: "Inter",
      is_active: true,
    },
  ];
  const { error: thErr } = await supabase
    .from("pdf_themes")
    .upsert(pdfThemes, { onConflict: "id" });
  if (thErr) console.error("PDF themes seed notice:", thErr.message);
  else console.log("PDF Themes seeded successfully.");

  // 9. Legal Pages
  console.log("Seeding: Legal Pages...");
  const legalPages = [
    {
      id: "l1111111-1111-1111-1111-111111111111",
      slug: "privacy-policy",
      title: "Privacy Policy",
      content_md:
        "# Privacy Policy\n\nAt Sanatan Dharma Suite, we respect your privacy and protect your personal and astronomical data.\n\n## Data Collection\nWe collect birth details solely to generate accurate astrological charts and Panchang data.\n\n## Contact Us\nFor questions, contact support@sanatantools.com.",
      meta_description: "Privacy policy and data protection guidelines for Sanatan Dharma Suite.",
      is_published: true,
    },
    {
      id: "l2222222-2222-2222-2222-222222222222",
      slug: "terms-of-service",
      title: "Terms of Service",
      content_md:
        "# Terms of Service\n\nWelcome to Sanatan Dharma Suite. By using our platform, you agree to these terms.\n\n## Educational & Spiritual Nature\nOur tools provide astronomical, spiritual, and educational insights based on traditional Vedic texts.",
      meta_description: "Terms of service and user agreements for Sanatan Dharma Suite.",
      is_published: true,
    },
    {
      id: "l3333333-3333-3333-3333-333333333333",
      slug: "disclaimer",
      title: "Astrological & Spiritual Disclaimer",
      content_md:
        "# Astrological Disclaimer\n\nAstrological predictions and Vastu recommendations are based on traditional Vedic calculations and are intended for guidance and educational purposes only.",
      meta_description: "Astrological and spiritual guidance disclaimer.",
      is_published: true,
    },
    {
      id: "l4444444-4444-4444-4444-444444444444",
      slug: "refund-policy",
      title: "Cancellation & Refund Policy",
      content_md:
        "# Refund Policy\n\nDigital reports and subscription purchases are subject to our 7-day satisfaction policy.",
      meta_description: "Refund and cancellation terms for digital reports.",
      is_published: true,
    },
    {
      id: "l5555555-5555-5555-5555-555555555555",
      slug: "contact-us",
      title: "Contact Us",
      content_md:
        "# Contact Us\n\nWe would love to hear from you. Reach out to our team at support@sanatantools.com.",
      meta_description: "Contact details for Sanatan Dharma Suite team.",
      is_published: true,
    },
  ];
  const { error: lpErr } = await supabase
    .from("legal_pages")
    .upsert(legalPages, { onConflict: "id" });
  if (lpErr) console.error("Legal pages seed notice:", lpErr.message);
  else console.log("Legal Pages seeded successfully.");

  // 10. Languages / Translations
  console.log("Seeding: Languages & Base Translations...");
  const translations = [
    {
      id: "tr111111-1111-1111-1111-111111111111",
      namespace: "common",
      lang: "en",
      key: "welcome",
      value: "Namaste & Welcome",
    },
    {
      id: "tr222222-2222-2222-2222-222222222222",
      namespace: "common",
      lang: "hi",
      key: "welcome",
      value: "नमस्ते एवं स्वागत है",
    },
    {
      id: "tr333333-3333-3333-3333-333333333333",
      namespace: "common",
      lang: "sa",
      key: "welcome",
      value: "नमो नमः स्वागतम्",
    },
  ];
  const { error: trErr } = await supabase
    .from("translations")
    .upsert(translations, { onConflict: "id" });
  if (trErr) console.error("Translations seed notice:", trErr.message);
  else console.log("Translations seeded successfully.");

  console.log("\n====================================================");
  console.log("SEEDING ATTEMPT COMPLETE");
  console.log("====================================================");
}

seedDatabase().catch((err) => {
  console.error("Seed runner error:", err);
});
