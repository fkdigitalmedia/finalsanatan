
-- Extend subscription_plans to support razorpay + product type + downloadable
ALTER TABLE public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_provider_check;
ALTER TABLE public.subscription_plans ADD CONSTRAINT subscription_plans_provider_check
  CHECK (provider IS NULL OR provider = ANY (ARRAY['stripe','lemonsqueezy','paddle','razorpay']));

ALTER TABLE public.subscription_plans
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'subscription',
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS cta_label text,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS download_url text,
  ADD COLUMN IF NOT EXISTS entitlement_key text;

ALTER TABLE public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_product_type_check;
ALTER TABLE public.subscription_plans ADD CONSTRAINT subscription_plans_product_type_check
  CHECK (product_type = ANY (ARRAY['subscription','one_time']));

-- Orders table (Razorpay + generic)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  provider_signature text,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'created',
  product_type text NOT NULL DEFAULT 'one_time',
  customer_email text,
  customer_name text,
  customer_phone text,
  notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_provider_order_idx ON public.orders(provider_order_id);

GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Staff view all orders" ON public.orders FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage orders" ON public.orders FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Entitlements: what a user has unlocked (subscription active or one-time purchase)
CREATE TABLE IF NOT EXISTS public.user_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entitlement_key text NOT NULL,
  plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'one_time',
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, entitlement_key)
);
CREATE INDEX IF NOT EXISTS user_entitlements_user_idx ON public.user_entitlements(user_id);

GRANT SELECT ON public.user_entitlements TO authenticated;
GRANT ALL ON public.user_entitlements TO service_role;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own entitlements" ON public.user_entitlements FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Staff manage entitlements" ON public.user_entitlements FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER user_entitlements_touch BEFORE UPDATE ON public.user_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
