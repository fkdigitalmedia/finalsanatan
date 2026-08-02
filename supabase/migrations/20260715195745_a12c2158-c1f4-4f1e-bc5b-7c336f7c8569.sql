
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS festival_reminders_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS festival_reminder_lead_days integer[] NOT NULL DEFAULT ARRAY[1,3]::integer[],
  ADD COLUMN IF NOT EXISTS festival_reminder_channels text[] NOT NULL DEFAULT ARRAY['in_app']::text[];
