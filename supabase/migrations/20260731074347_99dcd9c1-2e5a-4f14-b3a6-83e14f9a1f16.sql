CREATE TABLE public.pdf_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  report TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  language TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'premium',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pdf_templates TO authenticated;
GRANT SELECT ON public.pdf_templates TO anon;
GRANT ALL ON public.pdf_templates TO service_role;

ALTER TABLE public.pdf_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pdf templates are readable by everyone"
  ON public.pdf_templates FOR SELECT
  USING (status = 'published' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert pdf templates"
  ON public.pdf_templates FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update pdf templates"
  ON public.pdf_templates FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete pdf templates"
  ON public.pdf_templates FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TRIGGER pdf_templates_set_updated_at
  BEFORE UPDATE ON public.pdf_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX pdf_templates_report_status_idx ON public.pdf_templates (report, status);

CREATE TABLE public.pdf_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pdf_themes TO authenticated;
GRANT SELECT ON public.pdf_themes TO anon;
GRANT ALL ON public.pdf_themes TO service_role;

ALTER TABLE public.pdf_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enabled pdf themes are readable by everyone"
  ON public.pdf_themes FOR SELECT
  USING (enabled = true OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert pdf themes"
  ON public.pdf_themes FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update pdf themes"
  ON public.pdf_themes FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete pdf themes"
  ON public.pdf_themes FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TRIGGER pdf_themes_set_updated_at
  BEFORE UPDATE ON public.pdf_themes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.pdf_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report TEXT NOT NULL,
  template_id UUID REFERENCES public.pdf_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Report',
  filename TEXT NOT NULL DEFAULT 'report.pdf',
  language TEXT NOT NULL DEFAULT 'en',
  pages INTEGER NOT NULL DEFAULT 0,
  bytes INTEGER NOT NULL DEFAULT 0,
  storage_path TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pdf_reports TO authenticated;
GRANT ALL ON public.pdf_reports TO service_role;

ALTER TABLE public.pdf_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own pdf reports"
  ON public.pdf_reports FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()))
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX pdf_reports_user_idx ON public.pdf_reports (user_id, created_at DESC);