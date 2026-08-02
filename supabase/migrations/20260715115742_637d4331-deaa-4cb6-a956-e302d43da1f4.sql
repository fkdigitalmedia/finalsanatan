
-- ============ ai_providers ============
CREATE TABLE public.ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  provider_type TEXT NOT NULL,
  base_url TEXT,
  api_key TEXT,
  organization_id TEXT,
  project_id TEXT,
  default_model TEXT,
  temperature NUMERIC(4,2) DEFAULT 0.7,
  top_p NUMERIC(4,2) DEFAULT 1.0,
  max_tokens INT DEFAULT 2048,
  timeout_ms INT DEFAULT 60000,
  streaming BOOLEAN NOT NULL DEFAULT false,
  retry_attempts INT NOT NULL DEFAULT 2,
  retry_delay_ms INT NOT NULL DEFAULT 500,
  custom_headers JSONB NOT NULL DEFAULT '{}',
  custom_params JSONB NOT NULL DEFAULT '{}',
  priority INT NOT NULL DEFAULT 100,
  enabled BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'unknown',
  notes TEXT,
  last_tested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ai_providers_priority_idx ON public.ai_providers(enabled, priority);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_providers TO authenticated;
GRANT ALL ON public.ai_providers TO service_role;
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage providers" ON public.ai_providers
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER ai_providers_touch BEFORE UPDATE ON public.ai_providers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ai_models ============
CREATE TABLE public.ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.ai_providers(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  display_name TEXT,
  context_window INT,
  input_cost_per_1k NUMERIC(10,6),
  output_cost_per_1k NUMERIC(10,6),
  enabled BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider_id, model_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_models TO authenticated;
GRANT ALL ON public.ai_models TO service_role;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage models" ON public.ai_models
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER ai_models_touch BEFORE UPDATE ON public.ai_models
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ai_feature_mappings ============
CREATE TABLE public.ai_feature_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  provider_id UUID REFERENCES public.ai_providers(id) ON DELETE SET NULL,
  model_name TEXT,
  fallback_provider_ids UUID[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_feature_mappings TO authenticated;
GRANT ALL ON public.ai_feature_mappings TO service_role;
ALTER TABLE public.ai_feature_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage feature mappings" ON public.ai_feature_mappings
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER ai_feature_mappings_touch BEFORE UPDATE ON public.ai_feature_mappings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ai_usage_logs ============
CREATE TABLE public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.ai_providers(id) ON DELETE SET NULL,
  provider_name TEXT,
  model_name TEXT,
  feature_key TEXT,
  user_id UUID,
  input_tokens INT,
  output_tokens INT,
  total_tokens INT,
  latency_ms INT,
  cost_estimate NUMERIC(12,6),
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ai_usage_logs_created_idx ON public.ai_usage_logs(created_at DESC);
CREATE INDEX ai_usage_logs_provider_idx ON public.ai_usage_logs(provider_id, created_at DESC);
CREATE INDEX ai_usage_logs_feature_idx ON public.ai_usage_logs(feature_key, created_at DESC);
GRANT SELECT ON public.ai_usage_logs TO authenticated;
GRANT ALL ON public.ai_usage_logs TO service_role;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read usage" ON public.ai_usage_logs
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- ============ Extend ai_prompts ============
ALTER TABLE public.ai_prompts
  ADD COLUMN IF NOT EXISTS feature_key TEXT,
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS ai_prompts_feature_idx ON public.ai_prompts(feature_key);

-- ============ ai_prompt_versions ============
CREATE TABLE public.ai_prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES public.ai_prompts(id) ON DELETE CASCADE,
  version INT NOT NULL,
  system_prompt TEXT,
  model TEXT,
  temperature NUMERIC(4,2),
  max_tokens INT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (prompt_id, version)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_prompt_versions TO authenticated;
GRANT ALL ON public.ai_prompt_versions TO service_role;
ALTER TABLE public.ai_prompt_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage prompt versions" ON public.ai_prompt_versions
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ Seed built-in providers (disabled) ============
INSERT INTO public.ai_providers (name, provider_type, base_url, default_model, priority, enabled, notes) VALUES
  ('Lovable AI Gateway', 'lovable', 'https://ai.gateway.lovable.dev/v1', 'google/gemini-3.5-flash', 10, true, 'Built-in gateway. Uses LOVABLE_API_KEY.'),
  ('OpenAI', 'openai', 'https://api.openai.com/v1', 'gpt-4o-mini', 20, false, 'Set API key to enable.'),
  ('Google Gemini', 'gemini', 'https://generativelanguage.googleapis.com/v1beta/openai', 'gemini-2.5-flash', 30, false, 'OpenAI-compatible endpoint.'),
  ('Anthropic Claude', 'anthropic', 'https://api.anthropic.com/v1', 'claude-3-5-sonnet-latest', 40, false, 'Uses Anthropic messages API.'),
  ('DeepSeek', 'deepseek', 'https://api.deepseek.com/v1', 'deepseek-chat', 50, false, 'OpenAI-compatible.'),
  ('Groq', 'groq', 'https://api.groq.com/openai/v1', 'llama-3.3-70b-versatile', 60, false, 'OpenAI-compatible.'),
  ('OpenRouter', 'openrouter', 'https://openrouter.ai/api/v1', 'openai/gpt-4o-mini', 70, false, 'OpenAI-compatible, any model.'),
  ('Mistral AI', 'mistral', 'https://api.mistral.ai/v1', 'mistral-large-latest', 80, false, 'OpenAI-compatible.'),
  ('Cohere', 'cohere', 'https://api.cohere.ai/compatibility/v1', 'command-r-plus', 90, false, 'OpenAI-compatible endpoint.')
ON CONFLICT (name) DO NOTHING;

UPDATE public.ai_providers SET is_default = true WHERE name = 'Lovable AI Gateway';
