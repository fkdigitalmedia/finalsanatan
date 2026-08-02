
-- USER KUNDLIS
CREATE TABLE public.user_kundlis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'male',
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL DEFAULT '12:00',
  place_name TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  tz_offset_minutes INTEGER NOT NULL DEFAULT 330,
  language TEXT NOT NULL DEFAULT 'en',
  chart JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  family_member_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_kundlis TO authenticated;
GRANT ALL ON public.user_kundlis TO service_role;
ALTER TABLE public.user_kundlis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own kundlis" ON public.user_kundlis FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_user_kundlis_user ON public.user_kundlis(user_id, created_at DESC);
CREATE TRIGGER trg_user_kundlis_updated BEFORE UPDATE ON public.user_kundlis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FAMILY MEMBERS
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'other',
  gender TEXT NOT NULL DEFAULT 'male',
  photo_url TEXT,
  birth_date DATE,
  birth_time TIME,
  place_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  tz_offset_minutes INTEGER NOT NULL DEFAULT 330,
  notes TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT ALL ON public.family_members TO service_role;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own family" ON public.family_members FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_family_members_user ON public.family_members(user_id, created_at DESC);
CREATE TRIGGER trg_family_members_updated BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_kundlis
  ADD CONSTRAINT user_kundlis_family_fk FOREIGN KEY (family_member_id)
  REFERENCES public.family_members(id) ON DELETE SET NULL;

-- HOROSCOPE HISTORY
CREATE TABLE public.horoscope_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period TEXT NOT NULL DEFAULT 'daily',
  sign TEXT,
  kundli_id UUID REFERENCES public.user_kundlis(id) ON DELETE SET NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  language TEXT NOT NULL DEFAULT 'en',
  target_date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  summary TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.horoscope_history TO authenticated;
GRANT ALL ON public.horoscope_history TO service_role;
ALTER TABLE public.horoscope_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own horoscope history" ON public.horoscope_history FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_horoscope_history_user ON public.horoscope_history(user_id, created_at DESC);

-- REPORT LIBRARY
CREATE TABLE public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'ready',
  kundli_id UUID REFERENCES public.user_kundlis(id) ON DELETE SET NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  pdf_report_id UUID REFERENCES public.pdf_reports(id) ON DELETE SET NULL,
  content_md TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  version INTEGER NOT NULL DEFAULT 1,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_reports TO authenticated;
GRANT SELECT ON public.user_reports TO anon;
GRANT ALL ON public.user_reports TO service_role;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reports" ON public.user_reports FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shared reports readable" ON public.user_reports FOR SELECT TO anon, authenticated
  USING (is_shared = true AND share_token IS NOT NULL);
CREATE INDEX idx_user_reports_user ON public.user_reports(user_id, created_at DESC);
CREATE TRIGGER trg_user_reports_updated BEFORE UPDATE ON public.user_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DOWNLOADS
ALTER TABLE public.pdf_reports ADD COLUMN IF NOT EXISTS download_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE public.report_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pdf_report_id UUID REFERENCES public.pdf_reports(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.user_reports(id) ON DELETE SET NULL,
  filename TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.report_downloads TO authenticated;
GRANT ALL ON public.report_downloads TO service_role;
ALTER TABLE public.report_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own downloads" ON public.report_downloads FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_report_downloads_user ON public.report_downloads(user_id, created_at DESC);

-- DEVICES
CREATE TABLE public.user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_label TEXT NOT NULL DEFAULT 'Unknown device',
  user_agent TEXT,
  platform TEXT,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, device_label, platform)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_devices TO authenticated;
GRANT ALL ON public.user_devices TO service_role;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own devices" ON public.user_devices FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ACTIVITY LOG
CREATE TABLE public.user_activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'dashboard',
  resource_id TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.user_activity_log TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.user_activity_log_id_seq TO authenticated;
GRANT ALL ON public.user_activity_log TO service_role;
GRANT ALL ON SEQUENCE public.user_activity_log_id_seq TO service_role;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own activity read" ON public.user_activity_log FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "own activity write" ON public.user_activity_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_user_activity_user ON public.user_activity_log(user_id, created_at DESC);
