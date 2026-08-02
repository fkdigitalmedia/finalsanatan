-- Legal & Compliance System — schema

CREATE TABLE public.legal_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'policy',
  title TEXT NOT NULL,
  subtitle TEXT,
  summary TEXT,
  body_md TEXT NOT NULL DEFAULT '',
  toc JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_image TEXT,
  schema_type TEXT NOT NULL DEFAULT 'WebPage',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','archived')),
  effective_date TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  version INT NOT NULL DEFAULT 1,
  is_system BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX legal_pages_status_idx ON public.legal_pages(status, sort_order);
CREATE INDEX legal_pages_category_idx ON public.legal_pages(category);
GRANT SELECT ON public.legal_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_pages TO authenticated;
GRANT ALL ON public.legal_pages TO service_role;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published legal pages" ON public.legal_pages
  FOR SELECT USING (status = 'published');
CREATE POLICY "Staff can read all legal pages" ON public.legal_pages
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert legal pages" ON public.legal_pages
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update legal pages" ON public.legal_pages
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete non-system legal pages" ON public.legal_pages
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()) AND is_system = false);
CREATE TRIGGER legal_pages_touch BEFORE UPDATE ON public.legal_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.legal_page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.legal_pages(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  summary TEXT,
  body_md TEXT NOT NULL DEFAULT '',
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_id, locale)
);
GRANT SELECT ON public.legal_page_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_page_translations TO authenticated;
GRANT ALL ON public.legal_page_translations TO service_role;
ALTER TABLE public.legal_page_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published translations" ON public.legal_page_translations
  FOR SELECT USING (status = 'published');
CREATE POLICY "Staff manage translations" ON public.legal_page_translations
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER legal_page_translations_touch BEFORE UPDATE ON public.legal_page_translations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.legal_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.legal_pages(id) ON DELETE CASCADE,
  version INT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  body_md TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  effective_date TIMESTAMPTZ,
  snapshot JSONB NOT NULL,
  change_note TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX legal_page_versions_page_idx ON public.legal_page_versions(page_id, version DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_page_versions TO authenticated;
GRANT ALL ON public.legal_page_versions TO service_role;
ALTER TABLE public.legal_page_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage versions" ON public.legal_page_versions
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.legal_contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  topic TEXT NOT NULL DEFAULT 'general' CHECK (topic IN ('support','bug','feature','partnership','media','business','general','privacy','copyright')),
  message TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','spam')),
  handled_by UUID,
  handled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX legal_contact_status_idx ON public.legal_contact_messages(status, created_at DESC);
GRANT INSERT ON public.legal_contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_contact_messages TO authenticated;
GRANT ALL ON public.legal_contact_messages TO service_role;
ALTER TABLE public.legal_contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact messages" ON public.legal_contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read contact messages" ON public.legal_contact_messages
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update contact messages" ON public.legal_contact_messages
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete contact messages" ON public.legal_contact_messages
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER legal_contact_messages_touch BEFORE UPDATE ON public.legal_contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();