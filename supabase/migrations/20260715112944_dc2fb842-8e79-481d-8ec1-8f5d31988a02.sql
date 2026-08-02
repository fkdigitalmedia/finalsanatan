
-- ---------- Roles ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin'
                 AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'super_admin';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'editor'
                 AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'editor';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'content_manager'
                 AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'content_manager';
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = ANY (ARRAY['admin','super_admin','editor','content_manager','moderator'])
  );
$$;

-- ============================================================
-- ARTICLES
-- ============================================================
CREATE TABLE public.admin_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content_md text NOT NULL DEFAULT '',
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  featured_image text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published')),
  published_at timestamptz,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_articles_status_idx ON public.admin_articles(status, published_at DESC);
CREATE INDEX admin_articles_category_idx ON public.admin_articles(category);
GRANT SELECT ON public.admin_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_articles TO authenticated;
GRANT ALL ON public.admin_articles TO service_role;
ALTER TABLE public.admin_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published articles" ON public.admin_articles FOR SELECT
  USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));
CREATE POLICY "Staff read all articles" ON public.admin_articles FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write articles" ON public.admin_articles FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER admin_articles_touch BEFORE UPDATE ON public.admin_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FESTIVALS
CREATE TABLE public.admin_festivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  event_date date,
  is_recurring boolean NOT NULL DEFAULT true,
  images text[] NOT NULL DEFAULT '{}',
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_festivals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_festivals TO authenticated;
GRANT ALL ON public.admin_festivals TO service_role;
ALTER TABLE public.admin_festivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published festivals" ON public.admin_festivals FOR SELECT USING (published);
CREATE POLICY "Staff read all festivals" ON public.admin_festivals FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write festivals" ON public.admin_festivals FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER admin_festivals_touch BEFORE UPDATE ON public.admin_festivals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TEMPLES
CREATE TABLE public.admin_temples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  state text, city text, address text,
  lat double precision, lng double precision,
  photos text[] NOT NULL DEFAULT '{}',
  history text,
  opening_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_temples TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_temples TO authenticated;
GRANT ALL ON public.admin_temples TO service_role;
ALTER TABLE public.admin_temples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published temples" ON public.admin_temples FOR SELECT USING (published);
CREATE POLICY "Staff read all temples" ON public.admin_temples FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write temples" ON public.admin_temples FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER admin_temples_touch BEFORE UPDATE ON public.admin_temples
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ADS
CREATE TABLE public.admin_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot text NOT NULL CHECK (slot IN ('homepage','sidebar','tool','article','footer')),
  name text NOT NULL,
  html text, image_url text, target_url text,
  weight integer NOT NULL DEFAULT 1,
  enabled boolean NOT NULL DEFAULT true,
  starts_at timestamptz, ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_ads_slot_enabled_idx ON public.admin_ads(slot, enabled);
GRANT SELECT ON public.admin_ads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_ads TO authenticated;
GRANT ALL ON public.admin_ads TO service_role;
ALTER TABLE public.admin_ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads enabled ads" ON public.admin_ads FOR SELECT USING (enabled);
CREATE POLICY "Staff read all ads" ON public.admin_ads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write ads" ON public.admin_ads FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER admin_ads_touch BEFORE UPDATE ON public.admin_ads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AFFILIATE
CREATE TABLE public.affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text, product text NOT NULL, url text NOT NULL, network text,
  active boolean NOT NULL DEFAULT true,
  clicks integer NOT NULL DEFAULT 0,
  conversions integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.affiliate_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_links TO authenticated;
GRANT ALL ON public.affiliate_links TO service_role;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active affiliate links" ON public.affiliate_links FOR SELECT USING (active);
CREATE POLICY "Staff read all affiliate links" ON public.affiliate_links FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write affiliate links" ON public.affiliate_links FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER affiliate_links_touch BEFORE UPDATE ON public.affiliate_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  referrer text, user_agent text, country text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX affiliate_clicks_link_idx ON public.affiliate_clicks(link_id, created_at DESC);
GRANT INSERT ON public.affiliate_clicks TO anon;
GRANT SELECT, INSERT ON public.affiliate_clicks TO authenticated;
GRANT ALL ON public.affiliate_clicks TO service_role;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a click" ON public.affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read clicks" ON public.affiliate_clicks FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- TOOL OVERRIDES
CREATE TABLE public.tool_overrides (
  slug text PRIMARY KEY,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  sort_order integer NOT NULL DEFAULT 0,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  related_slugs text[] NOT NULL DEFAULT '{}',
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tool_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tool_overrides TO authenticated;
GRANT ALL ON public.tool_overrides TO service_role;
ALTER TABLE public.tool_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads tool overrides" ON public.tool_overrides FOR SELECT USING (true);
CREATE POLICY "Staff write tool overrides" ON public.tool_overrides FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tool_overrides_touch BEFORE UPDATE ON public.tool_overrides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- NEWSLETTER
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','unsubscribed','bounced')),
  source text, confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff manage subscribers" ON public.newsletter_subscribers FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER newsletter_subscribers_touch BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- EMAIL TEMPLATES
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  variables jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage email templates" ON public.email_templates FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER email_templates_touch BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- REDIRECTS
CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text UNIQUE NOT NULL,
  to_path text NOT NULL,
  code integer NOT NULL DEFAULT 301 CHECK (code IN (301,302,307,308)),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads enabled redirects" ON public.redirects FOR SELECT USING (enabled);
CREATE POLICY "Staff manage redirects" ON public.redirects FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER redirects_touch BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads public settings" ON public.site_settings FOR SELECT USING (is_public);
CREATE POLICY "Staff read all settings" ON public.site_settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_created_idx ON public.audit_logs(created_at DESC);
CREATE INDEX audit_logs_resource_idx ON public.audit_logs(resource_type, resource_id);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert audit logs" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()) AND auth.uid() = actor_user_id);

-- AI PROMPTS
CREATE TABLE public.ai_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  system_prompt text NOT NULL,
  model text NOT NULL DEFAULT 'google/gemini-2.5-flash',
  temperature real NOT NULL DEFAULT 0.7,
  max_tokens integer NOT NULL DEFAULT 1024,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_prompts TO authenticated;
GRANT ALL ON public.ai_prompts TO service_role;
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage ai prompts" ON public.ai_prompts FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER ai_prompts_touch BEFORE UPDATE ON public.ai_prompts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PANCHANG PROVIDERS
CREATE TABLE public.panchang_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  priority integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  cache_ttl_minutes integer NOT NULL DEFAULT 60,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panchang_providers TO authenticated;
GRANT ALL ON public.panchang_providers TO service_role;
ALTER TABLE public.panchang_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage panchang providers" ON public.panchang_providers FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER panchang_providers_touch BEFORE UPDATE ON public.panchang_providers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SUBSCRIPTION PLANS
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  interval text NOT NULL DEFAULT 'month' CHECK (interval IN ('month','year','one_time')),
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  provider text CHECK (provider IN ('stripe','lemonsqueezy','paddle')),
  provider_price_id text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscription_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscription_plans TO authenticated;
GRANT ALL ON public.subscription_plans TO service_role;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active plans" ON public.subscription_plans FOR SELECT USING (active);
CREATE POLICY "Staff manage plans" ON public.subscription_plans FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER subscription_plans_touch BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- COUPONS
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  percent_off integer CHECK (percent_off IS NULL OR (percent_off BETWEEN 1 AND 100)),
  amount_off_cents integer,
  currency text DEFAULT 'USD',
  valid_from timestamptz, valid_to timestamptz,
  max_redemptions integer,
  redemptions integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage coupons" ON public.coupons FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER coupons_touch BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- USER MODERATION
CREATE TABLE public.user_moderation (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  banned boolean NOT NULL DEFAULT false,
  warnings integer NOT NULL DEFAULT 0,
  notes text,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_moderation TO authenticated;
GRANT ALL ON public.user_moderation TO service_role;
ALTER TABLE public.user_moderation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage moderation" ON public.user_moderation FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
