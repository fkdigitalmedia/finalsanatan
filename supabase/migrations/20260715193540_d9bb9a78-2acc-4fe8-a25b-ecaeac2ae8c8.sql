
GRANT SELECT ON public.admin_festivals TO anon, authenticated;
GRANT ALL ON public.admin_festivals TO service_role;

GRANT SELECT ON public.festival_date_cache TO anon, authenticated;
GRANT ALL ON public.festival_date_cache TO service_role;

GRANT SELECT ON public.festival_translations TO anon, authenticated;
GRANT ALL ON public.festival_translations TO service_role;

-- Ensure festival_translations has an anon-readable policy
DROP POLICY IF EXISTS "Public reads festival translations" ON public.festival_translations;
CREATE POLICY "Public reads festival translations"
  ON public.festival_translations FOR SELECT
  TO public
  USING (true);
