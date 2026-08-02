ALTER TABLE public.coupons ALTER COLUMN redemptions SET DEFAULT 0;
UPDATE public.coupons SET redemptions = 0 WHERE redemptions IS NULL;