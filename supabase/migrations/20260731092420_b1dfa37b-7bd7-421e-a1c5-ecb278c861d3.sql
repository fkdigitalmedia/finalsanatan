-- Phase 14.8 — Notification & Communication Engine

-- 1. Channel configuration (admin editable)
CREATE TABLE public.notification_channels (
  channel TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  provider TEXT NOT NULL DEFAULT 'internal',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 600,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notification_channels TO authenticated;
GRANT ALL ON public.notification_channels TO service_role;
ALTER TABLE public.notification_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read channels" ON public.notification_channels FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins manage channels" ON public.notification_channels FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));

-- 2. Templates (per type + channel + language, versioned)
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  subject TEXT NOT NULL DEFAULT '',
  body_md TEXT NOT NULL DEFAULT '',
  body_html TEXT,
  body_text TEXT,
  link TEXT,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  version INTEGER NOT NULL DEFAULT 1,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (type, channel, language)
);
GRANT SELECT ON public.notification_templates TO authenticated;
GRANT ALL ON public.notification_templates TO service_role;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read templates" ON public.notification_templates FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage templates" ON public.notification_templates FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.notification_template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.notification_templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  changed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notification_template_versions TO authenticated;
GRANT ALL ON public.notification_template_versions TO service_role;
ALTER TABLE public.notification_template_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read template versions" ON public.notification_template_versions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- 3. Per-user preferences
CREATE TABLE public.notification_preferences (
  user_id UUID PRIMARY KEY,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT false,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  browser_enabled BOOLEAN NOT NULL DEFAULT false,
  festival_alerts BOOLEAN NOT NULL DEFAULT true,
  horoscope_alerts BOOLEAN NOT NULL DEFAULT true,
  muhurat_alerts BOOLEAN NOT NULL DEFAULT true,
  panchang_alerts BOOLEAN NOT NULL DEFAULT true,
  report_alerts BOOLEAN NOT NULL DEFAULT true,
  billing_alerts BOOLEAN NOT NULL DEFAULT true,
  marketing_emails BOOLEAN NOT NULL DEFAULT false,
  ai_recommendations BOOLEAN NOT NULL DEFAULT true,
  weekly_digest BOOLEAN NOT NULL DEFAULT true,
  monthly_digest BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start SMALLINT NOT NULL DEFAULT 22,
  quiet_hours_end SMALLINT NOT NULL DEFAULT 7,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  language TEXT NOT NULL DEFAULT 'en',
  push_subscription JSONB,
  unsubscribed_all BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;
GRANT ALL ON public.notification_preferences TO service_role;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own preferences" ON public.notification_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff read preferences" ON public.notification_preferences FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- 4. Queue (priority + retry + dead letter states)
CREATE TABLE public.notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  recipient TEXT,
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  priority SMALLINT NOT NULL DEFAULT 5,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  subject TEXT,
  body TEXT,
  link TEXT,
  dedupe_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_at TIMESTAMPTZ,
  attempts SMALLINT NOT NULL DEFAULT 0,
  max_attempts SMALLINT NOT NULL DEFAULT 3,
  last_error TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX notification_queue_dedupe_idx ON public.notification_queue (dedupe_key) WHERE dedupe_key IS NOT NULL;
CREATE INDEX notification_queue_due_idx ON public.notification_queue (status, scheduled_at, priority);
CREATE INDEX notification_queue_user_idx ON public.notification_queue (user_id, created_at DESC);
GRANT SELECT ON public.notification_queue TO authenticated;
GRANT ALL ON public.notification_queue TO service_role;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read queue" ON public.notification_queue FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage queue" ON public.notification_queue FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 5. Delivery history / analytics
CREATE TABLE public.notification_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID,
  user_id UUID,
  recipient TEXT,
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  provider TEXT,
  status TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  retry_count SMALLINT NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  error_message TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notification_deliveries_created_idx ON public.notification_deliveries (created_at DESC);
CREATE INDEX notification_deliveries_user_idx ON public.notification_deliveries (user_id, created_at DESC);
GRANT SELECT ON public.notification_deliveries TO authenticated;
GRANT ALL ON public.notification_deliveries TO service_role;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own deliveries" ON public.notification_deliveries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Staff read deliveries" ON public.notification_deliveries FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- 6. Recurring schedules (admin defined)
CREATE TABLE public.notification_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app']::text[],
  cadence TEXT NOT NULL DEFAULT 'daily',
  run_at_hour SMALLINT NOT NULL DEFAULT 6,
  run_at_minute SMALLINT NOT NULL DEFAULT 0,
  day_of_week SMALLINT,
  day_of_month SMALLINT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  audience JSONB NOT NULL DEFAULT '{"kind":"all"}'::jsonb,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notification_schedules TO authenticated;
GRANT ALL ON public.notification_schedules TO service_role;
ALTER TABLE public.notification_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read schedules" ON public.notification_schedules FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage schedules" ON public.notification_schedules FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- updated_at triggers
CREATE TRIGGER trg_notification_templates_updated BEFORE UPDATE ON public.notification_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_notification_preferences_updated BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_notification_queue_updated BEFORE UPDATE ON public.notification_queue FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_notification_schedules_updated BEFORE UPDATE ON public.notification_schedules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- seed channels
INSERT INTO public.notification_channels (channel,label,enabled,provider,sort_order) VALUES
  ('in_app','In-App Notification',true,'database',1),
  ('email','Email',false,'lovable_email',2),
  ('browser_push','Browser Push',false,'web_push',3),
  ('mobile_push','Mobile Push',false,'none',4),
  ('sms','SMS',false,'none',5),
  ('whatsapp','WhatsApp',false,'none',6),
  ('telegram','Telegram',false,'none',7),
  ('webhook','Webhook',false,'http',8);

-- seed default in-app templates for the core notification types
INSERT INTO public.notification_templates (type,channel,language,subject,body_md,link,variables) VALUES
  ('daily_horoscope','in_app','en','Your daily horoscope is ready','Namaste {{userName}}, your {{notificationDate}} horoscope is ready. {{horoscope}}','/daily-horoscope','["userName","notificationDate","horoscope"]'::jsonb),
  ('weekly_horoscope','in_app','en','This week''s horoscope','{{userName}}, your weekly forecast is published.','/weekly-horoscope','["userName"]'::jsonb),
  ('monthly_horoscope','in_app','en','This month''s horoscope','{{userName}}, your monthly forecast is published.','/monthly-horoscope','["userName"]'::jsonb),
  ('yearly_horoscope','in_app','en','Your yearly horoscope','{{userName}}, your yearly forecast is ready.','/yearly-horoscope','["userName"]'::jsonb),
  ('personalized_horoscope','in_app','en','Your personalised reading','{{userName}}, a new personalised reading is waiting in your dashboard.','/dashboard','["userName"]'::jsonb),
  ('festival_reminder','in_app','en','{{festival}} is coming up','{{festival}} falls on {{notificationDate}}. Tap to see the vidhi, muhurat and mantras.','/festivals','["festival","notificationDate"]'::jsonb),
  ('muhurat_reminder','in_app','en','Auspicious muhurat today','{{muhurat}} is today. Plan your important work accordingly.','/tools/muhurat-dashboard','["muhurat"]'::jsonb),
  ('ekadashi_reminder','in_app','en','Ekadashi vrat tomorrow','Ekadashi falls on {{notificationDate}}. Prepare your vrat.','/tools/monthly-panchang','["notificationDate"]'::jsonb),
  ('purnima_reminder','in_app','en','Purnima tomorrow','Purnima falls on {{notificationDate}}.','/tools/monthly-panchang','["notificationDate"]'::jsonb),
  ('amavasya_reminder','in_app','en','Amavasya tomorrow','Amavasya falls on {{notificationDate}}.','/tools/monthly-panchang','["notificationDate"]'::jsonb),
  ('birthday_reminder','in_app','en','Happy birthday, {{userName}}','Wishing you a blessed year ahead. Your Varshphal is ready.','/tools/varshphal','["userName"]'::jsonb),
  ('report_ready','in_app','en','{{reportName}} is ready','Your {{reportName}} has been generated. [Download]({{downloadLink}})','/dashboard/reports','["reportName","downloadLink"]'::jsonb),
  ('pdf_generated','in_app','en','Your PDF is ready','{{reportName}} PDF is available in your downloads.','/dashboard/downloads','["reportName"]'::jsonb),
  ('subscription_expiry','in_app','en','Your {{subscription}} plan expires soon','Renew before {{renewalDate}} to keep premium access.','/pricing','["subscription","renewalDate"]'::jsonb),
  ('payment_success','in_app','en','Payment received','Thank you {{userName}}. Your {{subscription}} plan is active.','/dashboard/billing','["userName","subscription"]'::jsonb),
  ('payment_failed','in_app','en','Payment could not be processed','We could not process your payment for {{subscription}}. Please try again.','/pricing','["subscription"]'::jsonb),
  ('welcome','in_app','en','Welcome to SanatanTools','Namaste {{userName}} — your spiritual toolkit is ready.','/dashboard','["userName"]'::jsonb),
  ('admin_announcement','in_app','en','{{subject}}','{{message}}',NULL,'["subject","message"]'::jsonb),
  ('system_maintenance','in_app','en','Scheduled maintenance','{{message}}',NULL,'["message"]'::jsonb);