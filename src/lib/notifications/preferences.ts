/**
 * Preference gating + quiet-hours logic. Pure so it is unit-testable and
 * usable from both the queue processor and the admin preview UI.
 */

import {
  CRITICAL_TYPES,
  DEFAULT_PREFERENCES,
  TYPE_CATEGORY,
  type Channel,
  type NotificationPreferences,
} from "./types";

export function withDefaults(
  prefs: Partial<NotificationPreferences> | null | undefined,
  userId = "",
): NotificationPreferences {
  return { user_id: userId, ...DEFAULT_PREFERENCES, ...(prefs ?? {}) };
}

const CHANNEL_SWITCH: Partial<Record<Channel, keyof NotificationPreferences>> = {
  in_app: "in_app_enabled",
  email: "email_enabled",
  browser_push: "browser_enabled",
  mobile_push: "push_enabled",
};

export interface GateResult {
  allowed: boolean;
  reason?: string;
}

export function isChannelAllowed(prefs: NotificationPreferences, channel: Channel): boolean {
  const key = CHANNEL_SWITCH[channel];
  if (!key) return true; // sms/whatsapp/telegram/webhook governed by admin channel config
  return Boolean(prefs[key]);
}

/** Should this (type, channel) be delivered for this user? */
export function shouldSend(
  prefs: NotificationPreferences,
  type: string,
  channel: Channel,
): GateResult {
  const critical = CRITICAL_TYPES.has(type);
  if (prefs.unsubscribed_all && !critical) {
    return { allowed: false, reason: "user_unsubscribed" };
  }
  if (!critical && !isChannelAllowed(prefs, channel)) {
    return { allowed: false, reason: `channel_disabled:${channel}` };
  }
  const categoryKey = TYPE_CATEGORY[type];
  if (!critical && categoryKey && prefs[categoryKey] === false) {
    return { allowed: false, reason: `category_disabled:${String(categoryKey)}` };
  }
  return { allowed: true };
}

/** Hour (0-23) in the user's timezone for a given instant. */
export function hourInTimezone(date: Date, timezone: string): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    });
    return Number(fmt.format(date)) % 24;
  } catch {
    return date.getUTCHours();
  }
}

export function isQuietHour(prefs: NotificationPreferences, at: Date): boolean {
  if (!prefs.quiet_hours_enabled) return false;
  const h = hourInTimezone(at, prefs.timezone);
  const { quiet_hours_start: s, quiet_hours_end: e } = prefs;
  if (s === e) return false;
  return s < e ? h >= s && h < e : h >= s || h < e;
}

/**
 * If the send falls inside quiet hours, move it to the end of the window.
 * Critical notifications ignore quiet hours.
 */
export function deferForQuietHours(prefs: NotificationPreferences, type: string, at: Date): Date {
  if (CRITICAL_TYPES.has(type) || !isQuietHour(prefs, at)) return at;
  const next = new Date(at.getTime());
  for (let i = 1; i <= 24; i += 1) {
    next.setTime(at.getTime() + i * 3600_000);
    if (!isQuietHour(prefs, next)) return next;
  }
  return at;
}

/** Exponential backoff (minutes) for a failed attempt. */
export function retryDelayMs(attempts: number): number {
  const minutes = Math.min(60, 2 ** Math.max(0, attempts - 1) * 2);
  return minutes * 60_000;
}
