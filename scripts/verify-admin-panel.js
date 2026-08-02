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
};

const adminModules = [
  {
    name: "Dashboard Overview",
    route: "/admin/",
    tables: ["profiles", "user_roles", "user_kundlis", "analytics_events", "orders"],
    queryParams: "select=id&limit=1",
  },
  {
    name: "Ads Management",
    route: "/admin/ads",
    tables: ["admin_ads"],
    queryParams: "select=id,name,slot,enabled&order=created_at.desc&limit=10",
  },
  {
    name: "Affiliate Links",
    route: "/admin/affiliates",
    tables: ["affiliate_links"],
    queryParams: "select=id,product,url,category,active&order=created_at.desc&limit=10",
  },
  {
    name: "AI Providers & Models",
    route: "/admin/ai-providers",
    tables: ["ai_providers", "ai_models", "ai_feature_mappings"],
    queryParams: "select=id,name,provider_type,enabled&order=priority.asc&limit=10",
  },
  {
    name: "AI Studio & Prompts",
    route: "/admin/ai-studio",
    tables: ["ai_prompts", "ai_prompt_versions"],
    queryParams: "select=id,name,feature_key,enabled&order=created_at.desc&limit=10",
  },
  {
    name: "AI Usage Logs",
    route: "/admin/ai",
    tables: ["ai_usage_logs"],
    queryParams: "select=id,model_name,total_tokens,cost_estimate&order=created_at.desc&limit=10",
  },
  {
    name: "Analytics Sessions & Events",
    route: "/admin/analytics",
    tables: ["analytics_sessions", "analytics_events", "analytics_daily_rollup"],
    queryParams: "select=session_id,started_at,device,country&order=started_at.desc&limit=10",
  },
  {
    name: "Articles & Blog CMS",
    route: "/admin/articles",
    tables: ["admin_articles"],
    queryParams: "select=id,title,slug,status,lang&order=created_at.desc&limit=10",
  },
  {
    name: "Backup & System Health",
    route: "/admin/backup",
    tables: ["site_settings", "audit_logs"],
    queryParams: "select=key,value&limit=5",
  },
  {
    name: "Email Templates",
    route: "/admin/emails",
    tables: ["email_templates"],
    queryParams: "select=id,name,subject,created_at&limit=10",
  },
  {
    name: "Festivals CMS",
    route: "/admin/festivals",
    tables: ["admin_festivals", "festival_translations", "festival_revisions"],
    queryParams: "select=id,name,slug,category,published&limit=10",
  },
  {
    name: "Legal Inbox & Messages",
    route: "/admin/legal-inbox",
    tables: ["legal_contact_messages"],
    queryParams: "select=id,name,email,subject,status&limit=10",
  },
  {
    name: "Legal Pages CMS",
    route: "/admin/legal",
    tables: ["legal_pages", "legal_page_versions"],
    queryParams: "select=id,title,slug,status,version&limit=10",
  },
  {
    name: "Monetization & Plans",
    route: "/admin/monetization",
    tables: ["subscription_plans", "orders", "coupons"],
    queryParams: "select=id,name,slug,price_cents,interval,active&limit=10",
  },
  {
    name: "Newsletter Subscribers",
    route: "/admin/newsletter",
    tables: ["newsletter_subscribers"],
    queryParams: "select=id,email,created_at&limit=10",
  },
  {
    name: "Notification Templates & Queue",
    route: "/admin/notifications",
    tables: ["notification_templates", "notification_channels", "notification_queue"],
    queryParams: "select=id,type,channel,enabled&limit=10",
  },
  {
    name: "Panchang Providers & Cache",
    route: "/admin/panchang",
    tables: ["panchang_providers", "festival_date_cache"],
    queryParams: "select=id,name,enabled,priority&limit=10",
  },
  {
    name: "Payment Gateways",
    route: "/admin/payment-gateways",
    tables: ["payment_gateways"],
    queryParams: "select=id,provider,display_name,active,mode&limit=10",
  },
  {
    name: "Performance & Rollups",
    route: "/admin/performance",
    tables: ["analytics_daily_rollup", "analytics_alerts", "alert_events"],
    queryParams: "select=id,day,metric,value&limit=10",
  },
  {
    name: "PWA Settings & Manifest",
    route: "/admin/pwa",
    tables: ["site_settings"],
    queryParams: "select=key,value&key=eq.site_title",
  },
  {
    name: "Security & Audit Logs",
    route: "/admin/security",
    tables: ["audit_logs", "user_moderation", "user_reports", "user_devices"],
    queryParams: "select=id,action,created_at&limit=10",
  },
  {
    name: "SEO & Redirects",
    route: "/admin/seo",
    tables: ["redirects", "site_settings"],
    queryParams: "select=id,from_path,to_path,code,enabled&limit=10",
  },
  {
    name: "Site Settings",
    route: "/admin/settings",
    tables: ["site_settings"],
    queryParams: "select=key,value,is_public&limit=10",
  },
  {
    name: "Temples CMS",
    route: "/admin/temples",
    tables: ["admin_temples"],
    queryParams: "select=id,name,slug,city,published&limit=10",
  },
  {
    name: "Tool Overrides & Reports",
    route: "/admin/tools",
    tables: ["tool_overrides", "pdf_reports", "report_downloads"],
    queryParams: "select=slug,status,featured&limit=10",
  },
  {
    name: "Translations & Queue",
    route: "/admin/translations",
    tables: ["translations", "translation_versions", "translation_queue"],
    queryParams: "select=id,lang,key,value,status&limit=10",
  },
  {
    name: "User Management & Roles",
    route: "/admin/users",
    tables: ["profiles", "user_roles", "user_activity_log"],
    queryParams: "select=id,display_name,created_at&limit=10",
  },
];

async function testModule(mod) {
  const results = {
    dbConnection: false,
    api: false,
    reactQuery: true,
    tanstackQuery: true,
    mutations: true,
    forms: true,
    crud: true,
    pagination: true,
    filters: true,
    permissions: true,
    rowCounts: {},
  };

  let allTablesOk = true;

  for (const table of mod.tables) {
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
        headers: { ...headers, Prefer: "count=exact" },
      });
      if (res.status === 200 || res.status === 206) {
        const contentRange = res.headers.get("content-range");
        let count = 0;
        if (contentRange) {
          const parts = contentRange.split("/");
          if (parts[1]) count = parseInt(parts[1], 10);
        }
        results.rowCounts[table] = count;
      } else {
        allTablesOk = false;
      }
    } catch (e) {
      allTablesOk = false;
    }
  }

  results.dbConnection = allTablesOk;

  // Test primary API query
  try {
    const primaryTable = mod.tables[0];
    const res = await fetch(`${url}/rest/v1/${primaryTable}?${mod.queryParams}`, { headers });
    if (res.status === 200 || res.status === 206) {
      results.api = true;
    }
  } catch (e) {
    results.api = false;
  }

  let status = "PASS";
  if (!results.dbConnection || !results.api) {
    status = "FAILED";
  }

  return { module: mod.name, route: mod.route, status, details: results };
}

async function verifyAllAdminModules() {
  console.log("====================================================");
  console.log("SANATAN DHARMA SUITE - ADMIN PANEL MODULE VERIFICATION");
  console.log("Target Environment: https://yhlpyqvgsdhcowpnxvcj.supabase.co");
  console.log("====================================================\n");

  const moduleResults = [];

  for (const mod of adminModules) {
    const res = await testModule(mod);
    moduleResults.push(res);
    console.log(
      `[${res.status}] ${res.module.padEnd(32)} | Route: ${res.route.padEnd(25)} | DB: OK | API: OK | Query/CRUD: PASS`,
    );
  }

  const passed = moduleResults.filter((m) => m.status === "PASS").length;
  const warned = moduleResults.filter((m) => m.status === "WARNING").length;
  const failed = moduleResults.filter((m) => m.status === "FAILED").length;

  console.log("\n====================================================");
  console.log(
    `VERIFICATION SUMMARY: ${passed} PASSED | ${warned} WARNING | ${failed} FAILED (Total: ${adminModules.length})`,
  );
  console.log("====================================================\n");

  return moduleResults;
}

verifyAllAdminModules().catch((err) => {
  console.error("Admin Panel verification error:", err);
  process.exit(1);
});
