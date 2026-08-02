
-- 1) payment_gateways table
CREATE TABLE public.payment_gateways (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('razorpay','stripe','paypal','cashfree','phonepe','paytm','custom')),
  display_name TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'test' CHECK (mode IN ('test','live')),
  active BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  credentials JSONB NOT NULL DEFAULT '{}'::jsonb,
  public_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  supported_currencies TEXT[] NOT NULL DEFAULT ARRAY['INR']::text[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_gateways TO authenticated;
GRANT ALL ON public.payment_gateways TO service_role;

ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view gateways"
  ON public.payment_gateways FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can insert gateways"
  ON public.payment_gateways FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can update gateways"
  ON public.payment_gateways FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can delete gateways"
  ON public.payment_gateways FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER trg_payment_gateways_updated
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Only one default gateway
CREATE UNIQUE INDEX payment_gateways_one_default
  ON public.payment_gateways ((is_default)) WHERE is_default = true;

CREATE INDEX payment_gateways_active_idx ON public.payment_gateways (active, sort_order);

-- 2) Safe public view (no credentials)
CREATE OR REPLACE VIEW public.public_payment_gateways
WITH (security_invoker = true) AS
SELECT
  id,
  provider,
  display_name,
  mode,
  is_default,
  sort_order,
  public_config,
  supported_currencies
FROM public.payment_gateways
WHERE active = true;

GRANT SELECT ON public.public_payment_gateways TO anon, authenticated;

-- View needs a permissive SELECT policy on the base table for anon/authenticated
-- to read active rows without exposing credentials.
CREATE POLICY "Public can read active gateway metadata via view"
  ON public.payment_gateways FOR SELECT TO anon, authenticated
  USING (active = true);

-- 3) Link orders to a gateway row
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS gateway_id UUID REFERENCES public.payment_gateways(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS orders_gateway_id_idx ON public.orders (gateway_id);
