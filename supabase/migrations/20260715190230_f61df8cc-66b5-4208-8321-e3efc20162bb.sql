
INSERT INTO public.integration_settings (key, config, enabled)
VALUES
  ('ga4',     jsonb_build_object('measurement_id', ''), false),
  ('gsc',     jsonb_build_object('site_url', ''), false),
  ('clarity', jsonb_build_object('project_id', ''), false)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_public_integrations()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'ga4_measurement_id', COALESCE((
      SELECT config->>'measurement_id'
      FROM public.integration_settings
      WHERE key = 'ga4' AND enabled = true
    ), ''),
    'clarity_project_id', COALESCE((
      SELECT config->>'project_id'
      FROM public.integration_settings
      WHERE key = 'clarity' AND enabled = true
    ), '')
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_public_integrations() TO anon, authenticated;
