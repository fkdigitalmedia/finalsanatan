
-- ============ translations ============
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lang TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('draft','approved')),
  version INTEGER NOT NULL DEFAULT 1,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lang, key)
);
CREATE INDEX translations_lang_idx ON public.translations(lang);
CREATE INDEX translations_status_idx ON public.translations(status);

GRANT SELECT ON public.translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.translations TO authenticated;
GRANT ALL ON public.translations TO service_role;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads approved translations"
  ON public.translations FOR SELECT
  USING (status = 'approved');
CREATE POLICY "Admins read all translations"
  ON public.translations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert translations"
  ON public.translations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update translations"
  ON public.translations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete translations"
  ON public.translations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER translations_touch
  BEFORE UPDATE ON public.translations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ translation_versions ============
CREATE TABLE public.translation_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id UUID NOT NULL REFERENCES public.translations(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  version INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','ai','import','rollback')),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX translation_versions_tid_idx ON public.translation_versions(translation_id, version DESC);

GRANT SELECT, INSERT ON public.translation_versions TO authenticated;
GRANT ALL ON public.translation_versions TO service_role;
ALTER TABLE public.translation_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read versions"
  ON public.translation_versions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert versions"
  ON public.translation_versions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ translation_queue ============
CREATE TABLE public.translation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lang TEXT NOT NULL,
  key TEXT NOT NULL,
  source_lang TEXT NOT NULL DEFAULT 'en',
  source_value TEXT NOT NULL,
  suggested_value TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','ready_for_review','approved','rejected','error')),
  error_message TEXT,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lang, key)
);
CREATE INDEX translation_queue_status_idx ON public.translation_queue(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.translation_queue TO authenticated;
GRANT ALL ON public.translation_queue TO service_role;
ALTER TABLE public.translation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage queue"
  ON public.translation_queue FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER translation_queue_touch
  BEFORE UPDATE ON public.translation_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
