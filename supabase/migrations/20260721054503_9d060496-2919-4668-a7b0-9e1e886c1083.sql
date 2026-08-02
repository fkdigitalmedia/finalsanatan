
CREATE TABLE public.kundli_interpretations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chart_hash TEXT NOT NULL,
  section TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  text TEXT NOT NULL,
  provider TEXT,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chart_hash, section, language)
);
CREATE INDEX idx_kundli_interpretations_lookup ON public.kundli_interpretations (chart_hash, language);
GRANT SELECT ON public.kundli_interpretations TO anon, authenticated;
GRANT ALL ON public.kundli_interpretations TO service_role;
ALTER TABLE public.kundli_interpretations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cached interpretations"
  ON public.kundli_interpretations FOR SELECT
  USING (true);
