CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $do$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'analytics-tick',
      '*/15 * * * *',
      $$ select net.http_post(url:='https://project--34cbf9a2-ce98-4d75-92f0-7d3795f08abe.lovable.app/api/public/hooks/analytics-tick', headers:=jsonb_build_object('Content-Type','application/json','apikey','sb_publishable_nWraxVAh3mcx64eYFkz0Gg_b-IzJ-Op'), body:='{}'::jsonb) $$
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'pg_cron or pg_net unavailable, skipping cron.schedule';
END $do$;