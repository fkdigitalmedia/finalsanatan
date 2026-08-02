
-- =========================================================
-- Phase F1: Festival Management System schema
-- =========================================================

-- 1. Extend admin_festivals with all new columns (idempotent)
ALTER TABLE public.admin_festivals
  ADD COLUMN IF NOT EXISTS alt_names TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS detailed_description TEXT,
  ADD COLUMN IF NOT EXISTS history TEXT,
  ADD COLUMN IF NOT EXISTS significance TEXT,
  ADD COLUMN IF NOT EXISTS why_celebrated TEXT,
  ADD COLUMN IF NOT EXISTS mythological_story TEXT,
  ADD COLUMN IF NOT EXISTS regional_variations JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS deities TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS sub_category TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_trending BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_popular BOOLEAN NOT NULL DEFAULT false,

  -- Date engine
  ADD COLUMN IF NOT EXISTS date_type TEXT NOT NULL DEFAULT 'fixed',
  ADD COLUMN IF NOT EXISTS fixed_month SMALLINT,
  ADD COLUMN IF NOT EXISTS fixed_day SMALLINT,
  ADD COLUMN IF NOT EXISTS lunar_rule JSONB,
  ADD COLUMN IF NOT EXISTS solar_rule JSONB,
  ADD COLUMN IF NOT EXISTS is_multi_day BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS duration_days SMALLINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS year_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS region_rules JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Puja
  ADD COLUMN IF NOT EXISTS puja_vidhi TEXT,
  ADD COLUMN IF NOT EXISTS preparation TEXT,
  ADD COLUMN IF NOT EXISTS samagri JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mantras JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS aarti TEXT,
  ADD COLUMN IF NOT EXISTS bhajans JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS chalisa TEXT,
  ADD COLUMN IF NOT EXISTS stotra TEXT,
  ADD COLUMN IF NOT EXISTS prasad TEXT,
  ADD COLUMN IF NOT EXISTS dress_colors JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Vrat / Fasting
  ADD COLUMN IF NOT EXISTS vrat_rules JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Media
  ADD COLUMN IF NOT EXISTS featured_image TEXT,
  ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS videos JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS audio JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pdfs JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS downloadables JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- SEO / relations
  ADD COLUMN IF NOT EXISTS faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_articles UUID[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_festivals UUID[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_tools TEXT[] NOT NULL DEFAULT '{}',

  -- Publishing
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unpublish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS author_id UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1,

  -- Monetization
  ADD COLUMN IF NOT EXISTS affiliate_products JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS donation_cta JSONB;

-- Backfill status from legacy `published` column
UPDATE public.admin_festivals
  SET status = CASE WHEN published THEN 'published' ELSE 'draft' END
  WHERE status = 'draft' AND published = true;

-- Constraints via triggers (avoid CHECK on evolving enums)
CREATE OR REPLACE FUNCTION public.validate_festival_row()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status NOT IN ('draft','scheduled','published','archived') THEN
    RAISE EXCEPTION 'Invalid status: %', NEW.status;
  END IF;
  IF NEW.date_type NOT IN ('fixed','lunar','solar','dynamic') THEN
    RAISE EXCEPTION 'Invalid date_type: %', NEW.date_type;
  END IF;
  IF NEW.duration_days < 1 OR NEW.duration_days > 60 THEN
    RAISE EXCEPTION 'duration_days out of range';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS admin_festivals_validate ON public.admin_festivals;
CREATE TRIGGER admin_festivals_validate
  BEFORE INSERT OR UPDATE ON public.admin_festivals
  FOR EACH ROW EXECUTE FUNCTION public.validate_festival_row();

-- Update public read policy to respect status + publish window
DROP POLICY IF EXISTS "Public reads published festivals" ON public.admin_festivals;
CREATE POLICY "Public reads published festivals" ON public.admin_festivals
  FOR SELECT
  USING (
    status = 'published'
    AND (publish_at IS NULL OR publish_at <= now())
    AND (unpublish_at IS NULL OR unpublish_at > now())
  );

-- Helpful indexes
CREATE INDEX IF NOT EXISTS admin_festivals_status_idx ON public.admin_festivals(status);
CREATE INDEX IF NOT EXISTS admin_festivals_category_idx ON public.admin_festivals(category);
CREATE INDEX IF NOT EXISTS admin_festivals_publish_at_idx ON public.admin_festivals(publish_at);
CREATE INDEX IF NOT EXISTS admin_festivals_tags_gin ON public.admin_festivals USING GIN(tags);
CREATE INDEX IF NOT EXISTS admin_festivals_deities_gin ON public.admin_festivals USING GIN(deities);

-- =========================================================
-- 2. festival_revisions (snapshot history)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.festival_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_id UUID NOT NULL REFERENCES public.admin_festivals(id) ON DELETE CASCADE,
  version INT NOT NULL,
  snapshot JSONB NOT NULL,
  change_note TEXT,
  changed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS festival_revisions_fid_idx ON public.festival_revisions(festival_id, version DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.festival_revisions TO authenticated;
GRANT ALL ON public.festival_revisions TO service_role;

ALTER TABLE public.festival_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage festival revisions" ON public.festival_revisions
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- 3. festival_translations (per-language JSON overrides)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.festival_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_id UUID NOT NULL REFERENCES public.admin_festivals(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (festival_id, language)
);
CREATE INDEX IF NOT EXISTS festival_translations_lang_idx ON public.festival_translations(language);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.festival_translations TO authenticated;
GRANT SELECT ON public.festival_translations TO anon;
GRANT ALL ON public.festival_translations TO service_role;

ALTER TABLE public.festival_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads festival translations for published festivals"
  ON public.festival_translations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.admin_festivals f
    WHERE f.id = festival_translations.festival_id
      AND f.status = 'published'
      AND (f.publish_at IS NULL OR f.publish_at <= now())
      AND (f.unpublish_at IS NULL OR f.unpublish_at > now())
  ));

CREATE POLICY "Staff manage festival translations" ON public.festival_translations
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

DROP TRIGGER IF EXISTS festival_translations_touch ON public.festival_translations;
CREATE TRIGGER festival_translations_touch
  BEFORE UPDATE ON public.festival_translations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- 4. festival_date_cache (computed Panchang timings)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.festival_date_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  festival_id UUID NOT NULL REFERENCES public.admin_festivals(id) ON DELETE CASCADE,
  year INT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  occurrences JSONB NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (festival_id, year, lat, lng)
);
CREATE INDEX IF NOT EXISTS festival_date_cache_year_idx ON public.festival_date_cache(year);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.festival_date_cache TO authenticated;
GRANT SELECT ON public.festival_date_cache TO anon;
GRANT ALL ON public.festival_date_cache TO service_role;

ALTER TABLE public.festival_date_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads festival date cache"
  ON public.festival_date_cache FOR SELECT USING (true);

CREATE POLICY "Staff writes festival date cache" ON public.festival_date_cache
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff updates festival date cache" ON public.festival_date_cache
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff deletes festival date cache" ON public.festival_date_cache
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
