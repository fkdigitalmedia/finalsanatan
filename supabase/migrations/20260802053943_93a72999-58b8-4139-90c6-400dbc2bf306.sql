DROP POLICY IF EXISTS "Public can read active gateway metadata via view" ON public.payment_gateways;

CREATE POLICY "Anon can read active gateway metadata"
ON public.payment_gateways
FOR SELECT
TO anon
USING (active = true);

REVOKE SELECT ON public.payment_gateways FROM anon;
GRANT SELECT (id, provider, display_name, mode, is_default, sort_order, public_config, supported_currencies, active)
  ON public.payment_gateways TO anon;

GRANT SELECT ON public.public_payment_gateways TO anon, authenticated;
GRANT ALL ON public.payment_gateways TO service_role;