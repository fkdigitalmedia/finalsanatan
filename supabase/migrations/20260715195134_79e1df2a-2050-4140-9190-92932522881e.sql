
-- Festival ↔ Tool auto-link registry
CREATE TABLE IF NOT EXISTS public.festival_tool_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id UUID REFERENCES public.admin_festivals(id) ON DELETE CASCADE,
  match_slug TEXT,          -- optional: match festivals by slug pattern
  match_category TEXT,      -- optional: match festivals by category
  match_deity TEXT,         -- optional: match by deity present in deities[]
  tool_slug TEXT NOT NULL,
  priority SMALLINT NOT NULL DEFAULT 100,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    festival_id IS NOT NULL
    OR match_slug IS NOT NULL
    OR match_category IS NOT NULL
    OR match_deity IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_ftr_festival ON public.festival_tool_rules(festival_id);
CREATE INDEX IF NOT EXISTS idx_ftr_category ON public.festival_tool_rules(match_category);
CREATE INDEX IF NOT EXISTS idx_ftr_deity ON public.festival_tool_rules(match_deity);

GRANT SELECT ON public.festival_tool_rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.festival_tool_rules TO authenticated;
GRANT ALL ON public.festival_tool_rules TO service_role;

ALTER TABLE public.festival_tool_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "festival_tool_rules public read"
  ON public.festival_tool_rules FOR SELECT
  USING (true);

CREATE POLICY "festival_tool_rules staff write"
  ON public.festival_tool_rules FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_ftr_updated_at
  BEFORE UPDATE ON public.festival_tool_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed a handful of high-signal defaults (category / deity based).
INSERT INTO public.festival_tool_rules (match_category, tool_slug, priority, note) VALUES
  ('vrat', 'choghadiya', 90, 'Auspicious windows for vrat observances'),
  ('vrat', 'rahu-kaal', 92, 'Avoid inauspicious window'),
  ('vrat', 'sankalp-generator', 80, 'Vrat sankalp'),
  ('major', 'todays-panchang', 70, 'Full panchang'),
  ('major', 'choghadiya', 75, 'Muhurat windows')
ON CONFLICT DO NOTHING;

INSERT INTO public.festival_tool_rules (match_deity, tool_slug, priority, note) VALUES
  ('Ganesha',   'mantra-library',      85, 'Ganesha mantras'),
  ('Lakshmi',   'deity-mantras',       85, 'Lakshmi mantras'),
  ('Shiva',     'mahamrityunjaya-mantra', 88, 'Mahamrityunjaya'),
  ('Krishna',   'gayatri-mantra',      70, 'Gayatri'),
  ('Durga',     'deity-mantras',       85, 'Durga mantras')
ON CONFLICT DO NOTHING;
