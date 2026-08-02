-- 1. CRITICAL: drop the unconditional public SELECT policy on festival_translations
DROP POLICY IF EXISTS "Public reads festival translations" ON public.festival_translations;

-- 2. Harden touch_streak: only allow a user to touch their OWN streak
CREATE OR REPLACE FUNCTION public.touch_streak(_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  s RECORD;
  today DATE := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> _user_id THEN
    RAISE EXCEPTION 'Not authorized to update this streak';
  END IF;

  INSERT INTO public.streaks (user_id, current_streak, longest_streak, last_active_date, total_days)
    VALUES (_user_id, 1, 1, today, 1)
    ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO s FROM public.streaks WHERE user_id = _user_id;
  IF s.last_active_date = today THEN
    RETURN;
  ELSIF s.last_active_date = today - 1 THEN
    UPDATE public.streaks
      SET current_streak = s.current_streak + 1,
          longest_streak = GREATEST(s.longest_streak, s.current_streak + 1),
          last_active_date = today,
          total_days = s.total_days + 1
      WHERE user_id = _user_id;
  ELSE
    UPDATE public.streaks
      SET current_streak = 1,
          last_active_date = today,
          total_days = s.total_days + 1
      WHERE user_id = _user_id;
  END IF;
END;
$function$;