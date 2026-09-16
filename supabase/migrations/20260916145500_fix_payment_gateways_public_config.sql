-- Fix any existing payment_gateways rows where public_config is NULL
-- (caused by admin form sending null instead of empty object)
UPDATE public.payment_gateways
SET public_config = '{}'::jsonb
WHERE public_config IS NULL;

-- Ensure the column default is set correctly (idempotent)
ALTER TABLE public.payment_gateways
  ALTER COLUMN public_config SET DEFAULT '{}'::jsonb;
