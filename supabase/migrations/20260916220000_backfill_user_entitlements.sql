-- 1. Ensure default entitlement keys on standard subscription plans
UPDATE public.subscription_plans
SET entitlement_key = 'lifetime_vip'
WHERE (LOWER(slug) LIKE '%lifetime%' OR LOWER(name) LIKE '%lifetime%')
  AND (entitlement_key IS NULL OR entitlement_key = '');

UPDATE public.subscription_plans
SET entitlement_key = 'premium_access'
WHERE (LOWER(slug) LIKE '%pro%' OR LOWER(name) LIKE '%pro%' OR LOWER(slug) LIKE '%premium%' OR LOWER(name) LIKE '%premium%')
  AND (entitlement_key IS NULL OR entitlement_key = '');

-- 2. Grant premium_access and kundli_premium_report to any user who already has a lifetime entitlement
INSERT INTO public.user_entitlements (user_id, entitlement_key, active, source)
SELECT DISTINCT ue.user_id, 'premium_access', true, 'lifetime'
FROM public.user_entitlements ue
WHERE ue.entitlement_key IN ('lifetime', 'lifetime_vip', 'lifetime_access') AND ue.active = true
ON CONFLICT (user_id, entitlement_key) DO UPDATE SET active = true;

INSERT INTO public.user_entitlements (user_id, entitlement_key, active, source)
SELECT DISTINCT ue.user_id, 'kundli_premium_report', true, 'lifetime'
FROM public.user_entitlements ue
WHERE ue.entitlement_key IN ('lifetime', 'lifetime_vip', 'lifetime_access') AND ue.active = true
ON CONFLICT (user_id, entitlement_key) DO UPDATE SET active = true;

INSERT INTO public.user_entitlements (user_id, entitlement_key, active, source)
SELECT DISTINCT ue.user_id, 'lifetime_vip', true, 'lifetime'
FROM public.user_entitlements ue
WHERE ue.entitlement_key IN ('lifetime', 'lifetime_access') AND ue.active = true
ON CONFLICT (user_id, entitlement_key) DO UPDATE SET active = true;

-- 3. Backfill entitlements for any users with paid orders
INSERT INTO public.user_entitlements (user_id, entitlement_key, plan_id, order_id, active, source)
SELECT DISTINCT
  o.user_id,
  COALESCE(p.entitlement_key, 'premium_access'),
  o.plan_id,
  o.id,
  true,
  COALESCE(p.product_type, 'subscription')
FROM public.orders o
JOIN public.subscription_plans p ON o.plan_id = p.id
WHERE o.status = 'paid' AND o.user_id IS NOT NULL
ON CONFLICT (user_id, entitlement_key) DO UPDATE SET active = true;

-- Ensure all paid order users have premium_access
INSERT INTO public.user_entitlements (user_id, entitlement_key, plan_id, order_id, active, source)
SELECT DISTINCT
  o.user_id,
  'premium_access',
  o.plan_id,
  o.id,
  true,
  COALESCE(p.product_type, 'subscription')
FROM public.orders o
LEFT JOIN public.subscription_plans p ON o.plan_id = p.id
WHERE o.status = 'paid' AND o.user_id IS NOT NULL
ON CONFLICT (user_id, entitlement_key) DO UPDATE SET active = true;

-- Ensure all paid order users have kundli_premium_report
INSERT INTO public.user_entitlements (user_id, entitlement_key, plan_id, order_id, active, source)
SELECT DISTINCT
  o.user_id,
  'kundli_premium_report',
  o.plan_id,
  o.id,
  true,
  COALESCE(p.product_type, 'subscription')
FROM public.orders o
LEFT JOIN public.subscription_plans p ON o.plan_id = p.id
WHERE o.status = 'paid' AND o.user_id IS NOT NULL
ON CONFLICT (user_id, entitlement_key) DO UPDATE SET active = true;

-- If paid order was for lifetime plan, also grant lifetime_vip
INSERT INTO public.user_entitlements (user_id, entitlement_key, plan_id, order_id, active, source)
SELECT DISTINCT
  o.user_id,
  'lifetime_vip',
  o.plan_id,
  o.id,
  true,
  'lifetime'
FROM public.orders o
JOIN public.subscription_plans p ON o.plan_id = p.id
WHERE o.status = 'paid' AND o.user_id IS NOT NULL
  AND (LOWER(p.slug) LIKE '%lifetime%' OR LOWER(p.name) LIKE '%lifetime%')
ON CONFLICT (user_id, entitlement_key) DO UPDATE SET active = true;
