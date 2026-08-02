
-- 1. analytics_events
CREATE TABLE public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  user_id UUID,
  session_id TEXT NOT NULL,
  tool_slug TEXT,
  category TEXT,
  path TEXT,
  referrer TEXT,
  lang TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  screen TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_hash TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ae_created ON public.analytics_events (created_at DESC);
CREATE INDEX idx_ae_event_created ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX idx_ae_tool_created ON public.analytics_events (tool_slug, created_at DESC) WHERE tool_slug IS NOT NULL;
CREATE INDEX idx_ae_session ON public.analytics_events (session_id);
CREATE INDEX idx_ae_user ON public.analytics_events (user_id) WHERE user_id IS NOT NULL;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read analytics_events" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- 2. analytics_sessions
CREATE TABLE public.analytics_sessions (
  session_id TEXT PRIMARY KEY,
  user_id UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pages INTEGER NOT NULL DEFAULT 1,
  country TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  lang TEXT,
  entry_path TEXT,
  is_bounce BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX idx_as_last_seen ON public.analytics_sessions (last_seen_at DESC);
CREATE INDEX idx_as_started ON public.analytics_sessions (started_at DESC);
GRANT SELECT ON public.analytics_sessions TO authenticated;
GRANT ALL ON public.analytics_sessions TO service_role;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read analytics_sessions" ON public.analytics_sessions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- 3. analytics_daily_rollup
CREATE TABLE public.analytics_daily_rollup (
  id BIGSERIAL PRIMARY KEY,
  day DATE NOT NULL,
  metric TEXT NOT NULL,
  dimension TEXT NOT NULL DEFAULT '_total',
  value NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (day, metric, dimension)
);
CREATE INDEX idx_adr_day ON public.analytics_daily_rollup (day DESC);
CREATE INDEX idx_adr_metric_day ON public.analytics_daily_rollup (metric, day DESC);
GRANT SELECT ON public.analytics_daily_rollup TO authenticated;
GRANT ALL ON public.analytics_daily_rollup TO service_role;
ALTER TABLE public.analytics_daily_rollup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read analytics_daily_rollup" ON public.analytics_daily_rollup
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- 4. integration_settings
CREATE TABLE public.integration_settings (
  key TEXT PRIMARY KEY,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integration_settings TO authenticated;
GRANT ALL ON public.integration_settings TO service_role;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read integration_settings" ON public.integration_settings
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write integration_settings" ON public.integration_settings
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
-- Public keys (for pixel loading) — expose only the enabled/config for pixels via a separate SECURITY DEFINER function later. For now, integration data is staff-only.

-- 5. search_queries
CREATE TABLE public.search_queries (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  user_id UUID,
  session_id TEXT,
  lang TEXT,
  path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sq_created ON public.search_queries (created_at DESC);
CREATE INDEX idx_sq_query ON public.search_queries (lower(query));
GRANT SELECT ON public.search_queries TO authenticated;
GRANT ALL ON public.search_queries TO service_role;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read search_queries" ON public.search_queries
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- 6. analytics_alerts + alert_events
CREATE TABLE public.analytics_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  kind TEXT NOT NULL,
  condition JSONB NOT NULL DEFAULT '{}'::jsonb,
  threshold NUMERIC,
  channel TEXT NOT NULL DEFAULT 'in_app',
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_alerts TO authenticated;
GRANT ALL ON public.analytics_alerts TO service_role;
ALTER TABLE public.analytics_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage analytics_alerts" ON public.analytics_alerts
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.alert_events (
  id BIGSERIAL PRIMARY KEY,
  alert_id UUID NOT NULL REFERENCES public.analytics_alerts(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  value NUMERIC,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX idx_al_ev_alert ON public.alert_events (alert_id, triggered_at DESC);
GRANT SELECT, INSERT ON public.alert_events TO authenticated;
GRANT ALL ON public.alert_events TO service_role;
ALTER TABLE public.alert_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read alert_events" ON public.alert_events
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- updated_at trigger for integration_settings + analytics_alerts
CREATE TRIGGER trg_integration_settings_touch
  BEFORE UPDATE ON public.integration_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_analytics_alerts_touch
  BEFORE UPDATE ON public.analytics_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
