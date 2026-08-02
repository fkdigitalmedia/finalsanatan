
-- Phase 15.2 — Performance indexes (additive only, no schema/logic changes)

-- User-scoped listings
CREATE INDEX IF NOT EXISTS idx_user_kundlis_user_created ON public.user_kundlis (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_user_created ON public.user_reports (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_user_status ON public.user_reports (user_id, status);
CREATE INDEX IF NOT EXISTS idx_report_downloads_user_created ON public.report_downloads (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_family_members_user_created ON public.family_members (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON public.bookmarks (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_created ON public.favorites (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_user_visited ON public.history (user_id, visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_horoscope_history_user_created ON public.horoscope_history (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_mantras_user_created ON public.saved_mantras (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_created ON public.user_activity_log (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_user_created ON public.pdf_reports (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_devices_user_created ON public.user_devices (user_id, created_at DESC);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_deliveries_user_sent ON public.notification_deliveries (user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_deliveries_status ON public.notification_deliveries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_queue_pending ON public.notification_queue (status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notif_queue_created ON public.notification_queue (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_schedules_active ON public.notification_schedules (enabled, next_run_at);
CREATE INDEX IF NOT EXISTS idx_notif_tpl_versions_template ON public.notification_template_versions (template_id, created_at DESC);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_cat_created ON public.analytics_events (category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user ON public.analytics_sessions (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_created ON public.ai_usage_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_queries_created ON public.search_queries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_queries_user ON public.search_queries (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created ON public.affiliate_clicks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at DESC);

-- Commerce
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON public.orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_active ON public.user_entitlements (user_id, active);
CREATE INDEX IF NOT EXISTS idx_entitlements_order ON public.user_entitlements (order_id);

-- Content / public pages
CREATE INDEX IF NOT EXISTS idx_legal_pages_status_pub ON public.legal_pages (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_legal_page_tr_page_locale ON public.legal_page_translations (page_id, locale);
CREATE INDEX IF NOT EXISTS idx_legal_page_versions_page ON public.legal_page_versions (page_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_legal_msgs_created ON public.legal_contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_articles_status_pub ON public.admin_articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_festivals_status ON public.admin_festivals (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_temples_created ON public.admin_temples (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_festival_translations_lang ON public.festival_translations (festival_id, language);
CREATE INDEX IF NOT EXISTS idx_festival_revisions_created ON public.festival_revisions (festival_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_status_created ON public.newsletter_subscribers (status, created_at DESC);

-- Translations / config
CREATE INDEX IF NOT EXISTS idx_translations_key_lang ON public.translations (key, lang);
CREATE INDEX IF NOT EXISTS idx_translation_queue_key ON public.translation_queue (key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_translation_versions_key ON public.translation_versions (key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_templates_status ON public.pdf_templates (status);
CREATE INDEX IF NOT EXISTS idx_tool_overrides_status ON public.tool_overrides (status);
CREATE INDEX IF NOT EXISTS idx_ai_providers_status ON public.ai_providers (status);
CREATE INDEX IF NOT EXISTS idx_kundli_interp_created ON public.kundli_interpretations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kundli_interp_lookup ON public.kundli_interpretations (chart_hash, section, language);
