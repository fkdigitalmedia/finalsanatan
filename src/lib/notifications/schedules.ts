/**
 * Recurring schedule evaluation (pure) — decides which schedules are due.
 */

export interface ScheduleRow {
  id: string;
  cadence: string; // daily | weekly | monthly | yearly
  run_at_hour: number;
  run_at_minute: number;
  day_of_week?: number | null; // 0=Sunday
  day_of_month?: number | null;
  timezone: string;
  enabled: boolean;
  last_run_at?: string | null;
}

function partsInTz(date: Date, timeZone: string) {
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      hour12: false,
    });
    const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      day: Number(p.day),
      month: Number(p.month),
      year: Number(p.year),
      hour: Number(p.hour) % 24,
      minute: Number(p.minute),
      weekday: weekdays.indexOf(String(p.weekday)),
      dateKey: `${p.year}-${p.month}-${p.day}`,
    };
  } catch {
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      weekday: date.getUTCDay(),
      dateKey: date.toISOString().slice(0, 10),
    };
  }
}

/**
 * A schedule is due when the local time has passed its run time today and it
 * has not already run in this local day/week/month.
 */
export function isScheduleDue(schedule: ScheduleRow, now: Date = new Date()): boolean {
  if (!schedule.enabled) return false;
  const t = partsInTz(now, schedule.timezone || "Asia/Kolkata");
  const minutesNow = t.hour * 60 + t.minute;
  const minutesTarget = (schedule.run_at_hour ?? 0) * 60 + (schedule.run_at_minute ?? 0);
  if (minutesNow < minutesTarget) return false;

  if (schedule.cadence === "weekly" && t.weekday !== (schedule.day_of_week ?? 1)) return false;
  if (schedule.cadence === "monthly" && t.day !== (schedule.day_of_month ?? 1)) return false;
  if (schedule.cadence === "yearly") {
    if (t.day !== (schedule.day_of_month ?? 1) || t.month !== 1) return false;
  }

  if (!schedule.last_run_at) return true;
  const last = partsInTz(new Date(schedule.last_run_at), schedule.timezone || "Asia/Kolkata");
  return last.dateKey !== t.dateKey;
}

/** Human summary used in the admin table. */
export function describeSchedule(s: ScheduleRow) {
  const time = `${String(s.run_at_hour).padStart(2, "0")}:${String(s.run_at_minute).padStart(2, "0")}`;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  switch (s.cadence) {
    case "weekly":
      return `Every ${days[s.day_of_week ?? 1]} at ${time} (${s.timezone})`;
    case "monthly":
      return `Day ${s.day_of_month ?? 1} of each month at ${time} (${s.timezone})`;
    case "yearly":
      return `Every 1 January at ${time} (${s.timezone})`;
    default:
      return `Daily at ${time} (${s.timezone})`;
  }
}
