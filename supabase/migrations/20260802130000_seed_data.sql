-- ===================================================================
-- SANATAN DHARMA SUITE - BULLETPROOF SEED DATA MIGRATION
-- Generated: 2026-08-02T07:45:03.364Z
-- Seed Categories: Site Settings, AI Prompts, Payment Providers, Email Templates,
-- Notification Templates, Subscription Plans, Theme Settings, Legal Pages
-- ===================================================================

-- 1. Site Settings (Site Settings, SEO Settings, Feature Flags)
INSERT INTO public.site_settings (key, value, is_public) VALUES
  ('site_title', '"Sanatan Dharma Suite"'::jsonb, true),
  ('site_description', '"The largest collection of Sanatan Dharma tools, calculators, AI utilities, and Vedic resources."'::jsonb, true),
  ('site_url', '"https://sanatantools.com"'::jsonb, true),
  ('default_language', '"en"'::jsonb, true),
  ('supported_languages', '["en", "hi", "sa", "bn", "ta", "te", "mr", "gu"]'::jsonb, true),
  ('maintenance_mode', 'false'::jsonb, true),
  ('contact_email', '"support@sanatantools.com"'::jsonb, true),
  ('seo_defaults', '{"og_image": "https://sanatantools.com/og-default.jpg", "twitter_handle": "@sanatantools", "meta_keywords": ["vedic", "astrology", "panchang", "kundli", "sanatan", "dharma", "mantra"]}'::jsonb, true),
  ('feature_flags', '{"enable_ai_astrologer": true, "enable_pdf_downloads": true, "enable_payments": true, "enable_panchang_notifications": true}'::jsonb, true),
  ('theme_defaults', '{"primary_color": "#D97706", "font_family": "Inter", "dark_mode": true}'::jsonb, true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, is_public = EXCLUDED.is_public;

-- 2. AI Prompts
INSERT INTO public.ai_prompts (feature_key, name, description, system_prompt, model, temperature, max_tokens, enabled, version)
SELECT 'kundli_interpretation', 'Kundli Chart Deep Interpretation', 'Vedic Astrology chart analysis prompt', 'You are a master Vedic Astrologer (Jyotish Acharya). Analyze the given Kundli chart data, house placements, dashas, and planetary aspects. Provide clear, empathetic, and actionable guidance.', 'google/gemini-3.5-flash', 0.7, 2048, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.ai_prompts WHERE name = 'Kundli Chart Deep Interpretation');

INSERT INTO public.ai_prompts (feature_key, name, description, system_prompt, model, temperature, max_tokens, enabled, version)
SELECT 'daily_horoscope', 'Daily Vedic Horoscope', 'Daily Moon sign transit reading', 'Generate an accurate daily horoscope reading based on planetary transits for the given Rashi.', 'google/gemini-3.5-flash', 0.7, 1024, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.ai_prompts WHERE name = 'Daily Vedic Horoscope');

INSERT INTO public.ai_prompts (feature_key, name, description, system_prompt, model, temperature, max_tokens, enabled, version)
SELECT 'vastu_analysis', 'Vastu Shastra Consultation', 'Vastu property orientation guide', 'Analyze the directions and room placements of the given property layout according to Vastu Shastra principles.', 'google/gemini-3.5-flash', 0.7, 2048, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.ai_prompts WHERE name = 'Vastu Shastra Consultation');

INSERT INTO public.ai_prompts (feature_key, name, description, system_prompt, model, temperature, max_tokens, enabled, version)
SELECT 'mantra_explanation', 'Mantra Meaning & Sadhana Guide', 'Sanskrit mantra phonetic & spiritual meaning', 'Explain the Sanskrit origin, phonetic pronunciation, spiritual significance, and sadhana rules for the given mantra.', 'google/gemini-3.5-flash', 0.5, 1500, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.ai_prompts WHERE name = 'Mantra Meaning & Sadhana Guide');

INSERT INTO public.ai_prompts (feature_key, name, description, system_prompt, model, temperature, max_tokens, enabled, version)
SELECT 'muhurat_finder', 'Auspicious Time Guidance', 'Panchang muhurat calculation assistance', 'Identify the best auspicious time window for the requested activity based on tithi, nakshatra, choghadiya, and karana.', 'google/gemini-3.5-flash', 0.3, 1024, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.ai_prompts WHERE name = 'Auspicious Time Guidance');

-- 3. Payment Gateways
INSERT INTO public.payment_gateways (provider, display_name, mode, active, is_default, sort_order, public_config)
SELECT 'razorpay', 'Razorpay Payments', 'test', true, true, 1, '{"key_id": "rzp_test_sample", "currency": "INR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.payment_gateways WHERE provider = 'razorpay');

INSERT INTO public.payment_gateways (provider, display_name, mode, active, is_default, sort_order, public_config)
SELECT 'stripe', 'Stripe Card Payments', 'test', false, false, 2, '{"publishable_key": "pk_test_sample", "currency": "USD"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.payment_gateways WHERE provider = 'stripe');

-- 4. Email Templates
INSERT INTO public.email_templates (name, subject, body_html, variables)
SELECT 'welcome_email', 'Welcome to Sanatan Dharma Suite!', '<h1>Welcome to Sanatan Dharma Suite</h1><p>Namaste! Thank you for joining us.</p>', '["name", "email"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.email_templates WHERE name = 'welcome_email');

INSERT INTO public.email_templates (name, subject, body_html, variables)
SELECT 'password_reset', 'Reset your password - Sanatan Dharma Suite', '<p>Click the link below to reset your password.</p>', '["reset_url"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.email_templates WHERE name = 'password_reset');

INSERT INTO public.email_templates (name, subject, body_html, variables)
SELECT 'order_confirmation', 'Your Sanatan Dharma Suite Order Confirmation', '<p>Thank you for purchasing your Kundli/Vedic Report!</p>', '["order_id", "product_name", "amount"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.email_templates WHERE name = 'order_confirmation');

INSERT INTO public.email_templates (name, subject, body_html, variables)
SELECT 'daily_panchang', 'Today''s Panchang & Auspicious Timings', '<p>Here is your daily Panchang update.</p>', '["tithi", "nakshatra", "muhurat"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.email_templates WHERE name = 'daily_panchang');

-- 5. Notification Templates
INSERT INTO public.notification_templates (type, channel, language, subject, body_text, enabled)
SELECT 'panchang_daily', 'in_app', 'en', 'Today''s Panchang Update', 'Tithi: {{tithi}}, Nakshatra: {{nakshatra}}, Abhijit Muhurat: {{muhurat}}', true
WHERE NOT EXISTS (SELECT 1 FROM public.notification_templates WHERE type = 'panchang_daily');

INSERT INTO public.notification_templates (type, channel, language, subject, body_text, enabled)
SELECT 'festival_alert', 'push', 'en', 'Upcoming Festival: {{festival_name}}', '{{festival_name}} is coming up on {{date}}. Learn auspicious rituals and timings.', true
WHERE NOT EXISTS (SELECT 1 FROM public.notification_templates WHERE type = 'festival_alert');

INSERT INTO public.notification_templates (type, channel, language, subject, body_text, enabled)
SELECT 'streak_reminder', 'in_app', 'en', 'Maintain Your Sadhana Streak!', 'You are on a {{streak_count}} day streak. Complete today''s japa/mantra to keep it going.', true
WHERE NOT EXISTS (SELECT 1 FROM public.notification_templates WHERE type = 'streak_reminder');

-- 6. Subscription Plans
INSERT INTO public.subscription_plans (name, slug, description, price_cents, currency, interval, features, active, sort_order)
SELECT 'Free Seeker', 'free', 'Access to basic panchang, daily horoscope, and public tools.', 0, 'INR', 'month', '["Basic Panchang", "Daily Rashi", "5 AI Queries/mo", "Standard Kundli"]'::jsonb, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'free');

INSERT INTO public.subscription_plans (name, slug, description, price_cents, currency, interval, features, active, sort_order)
SELECT 'Sadhak Pro (Monthly)', 'pro-monthly', 'Full access to all 100+ Vedic tools, PDF downloads, and unlimited AI guidance.', 49900, 'INR', 'month', '["All 100+ Tools", "Unlimited PDF Reports", "50 AI Queries/mo", "Ad-Free Experience", "Priority Support"]'::jsonb, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'pro-monthly');

INSERT INTO public.subscription_plans (name, slug, description, price_cents, currency, interval, features, active, sort_order)
SELECT 'Sadhak Pro (Yearly)', 'pro-yearly', 'Full access for 1 year with 2 months free.', 499900, 'INR', 'year', '["All Pro Features", "Save 20%", "Kundli Matching Deep Reports", "Vastu & Muhurat Planners"]'::jsonb, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'pro-yearly');

INSERT INTO public.subscription_plans (name, slug, description, price_cents, currency, interval, features, active, sort_order)
SELECT 'Lifetime Moksha Pass', 'lifetime', 'One-time payment for lifetime unlimited access to all present & future features.', 1499900, 'INR', 'one_time', '["Lifetime Access", "All Premium PDFs", "Unlimited AI Astrologer", "VIP Community Access"]'::jsonb, true, 4
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE slug = 'lifetime');

-- 7. PDF Themes (Theme Settings)
INSERT INTO public.pdf_themes (name, label, config, enabled)
SELECT 'saffron_classic', 'Saffron Vedic Classic', '{"primary": "#D97706", "secondary": "#92400E", "background": "#FFFBEB", "text": "#1F2937", "font": "Cinzel"}'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM public.pdf_themes WHERE name = 'saffron_classic');

INSERT INTO public.pdf_themes (name, label, config, enabled)
SELECT 'vedic_gold', 'Royal Vedic Gold', '{"primary": "#B45309", "secondary": "#78350F", "background": "#FEF3C7", "text": "#111827", "font": "Merriweather"}'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM public.pdf_themes WHERE name = 'vedic_gold');

INSERT INTO public.pdf_themes (name, label, config, enabled)
SELECT 'spiritual_dark', 'Deep Spiritual Midnight', '{"primary": "#F59E0B", "secondary": "#FBBF24", "background": "#0F172A", "text": "#F8FAFC", "font": "Inter"}'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM public.pdf_themes WHERE name = 'spiritual_dark');

-- 8. Legal Pages
INSERT INTO public.legal_pages (title, slug, body_md, status, version, seo_title, seo_description)
SELECT 'Privacy Policy', 'privacy-policy', '# Privacy Policy

At Sanatan Dharma Suite, we respect your privacy and protect your personal and astronomical data.

## Data Collection
We collect birth details solely to generate accurate astrological charts and Panchang data.

## Contact Us
For questions, contact support@sanatantools.com.', 'published', 1, 'Privacy Policy - Sanatan Dharma Suite', 'Privacy policy and data protection guidelines for Sanatan Dharma Suite.'
WHERE NOT EXISTS (SELECT 1 FROM public.legal_pages WHERE slug = 'privacy-policy');

INSERT INTO public.legal_pages (title, slug, body_md, status, version, seo_title, seo_description)
SELECT 'Terms of Service', 'terms-of-service', '# Terms of Service

Welcome to Sanatan Dharma Suite. By using our platform, you agree to these terms.

## Educational & Spiritual Nature
Our tools provide astronomical, spiritual, and educational insights based on traditional Vedic texts.', 'published', 1, 'Terms of Service - Sanatan Dharma Suite', 'Terms of service and user agreements for Sanatan Dharma Suite.'
WHERE NOT EXISTS (SELECT 1 FROM public.legal_pages WHERE slug = 'terms-of-service');

INSERT INTO public.legal_pages (title, slug, body_md, status, version, seo_title, seo_description)
SELECT 'Astrological & Spiritual Disclaimer', 'disclaimer', '# Astrological Disclaimer

Astrological predictions and Vastu recommendations are based on traditional Vedic calculations and are intended for guidance and educational purposes only.', 'published', 1, 'Astrological Disclaimer - Sanatan Dharma Suite', 'Astrological and spiritual guidance disclaimer.'
WHERE NOT EXISTS (SELECT 1 FROM public.legal_pages WHERE slug = 'disclaimer');

INSERT INTO public.legal_pages (title, slug, body_md, status, version, seo_title, seo_description)
SELECT 'Cancellation & Refund Policy', 'refund-policy', '# Refund Policy

Digital reports and subscription purchases are subject to our 7-day satisfaction policy.', 'published', 1, 'Refund Policy - Sanatan Dharma Suite', 'Refund and cancellation terms for digital reports.'
WHERE NOT EXISTS (SELECT 1 FROM public.legal_pages WHERE slug = 'refund-policy');

INSERT INTO public.legal_pages (title, slug, body_md, status, version, seo_title, seo_description)
SELECT 'Contact Us', 'contact-us', '# Contact Us

We would love to hear from you. Reach out to our team at support@sanatantools.com.', 'published', 1, 'Contact Us - Sanatan Dharma Suite', 'Contact details for Sanatan Dharma Suite team.'
WHERE NOT EXISTS (SELECT 1 FROM public.legal_pages WHERE slug = 'contact-us');
