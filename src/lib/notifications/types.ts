/**
 * Phase 14.8 — Notification & Communication Engine
 * Shared, browser-safe types and constants.
 */

export const CHANNELS = [
  "in_app",
  "email",
  "browser_push",
  "mobile_push",
  "sms",
  "whatsapp",
  "telegram",
  "webhook",
] as const;
export type Channel = (typeof CHANNELS)[number];

export const NOTIFICATION_TYPES = [
  "daily_horoscope",
  "weekly_horoscope",
  "monthly_horoscope",
  "yearly_horoscope",
  "personalized_horoscope",
  "festival_reminder",
  "muhurat_reminder",
  "ekadashi_reminder",
  "purnima_reminder",
  "amavasya_reminder",
  "birthday_reminder",
  "report_ready",
  "pdf_generated",
  "subscription_expiry",
  "payment_success",
  "payment_failed",
  "welcome",
  "admin_announcement",
  "system_maintenance",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** Preference switch that gates each notification type. */
export const TYPE_CATEGORY: Record<string, keyof NotificationPreferences> = {
  daily_horoscope: "horoscope_alerts",
  weekly_horoscope: "horoscope_alerts",
  monthly_horoscope: "horoscope_alerts",
  yearly_horoscope: "horoscope_alerts",
  personalized_horoscope: "horoscope_alerts",
  festival_reminder: "festival_alerts",
  muhurat_reminder: "muhurat_alerts",
  ekadashi_reminder: "panchang_alerts",
  purnima_reminder: "panchang_alerts",
  amavasya_reminder: "panchang_alerts",
  birthday_reminder: "festival_alerts",
  report_ready: "report_alerts",
  pdf_generated: "report_alerts",
  subscription_expiry: "billing_alerts",
  payment_success: "billing_alerts",
  payment_failed: "billing_alerts",
  welcome: "in_app_enabled",
  admin_announcement: "in_app_enabled",
  system_maintenance: "in_app_enabled",
};

/** Types that must always be delivered, ignoring preferences. */
export const CRITICAL_TYPES = new Set<string>([
  "payment_success",
  "payment_failed",
  "subscription_expiry",
  "system_maintenance",
]);

export const PRIORITY = {
  critical: 1,
  high: 3,
  normal: 5,
  low: 8,
} as const;
export type PriorityName = keyof typeof PRIORITY;

export type QueueStatus =
  "pending" | "processing" | "sent" | "failed" | "retrying" | "cancelled" | "skipped";

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  browser_enabled: boolean;
  festival_alerts: boolean;
  horoscope_alerts: boolean;
  muhurat_alerts: boolean;
  panchang_alerts: boolean;
  report_alerts: boolean;
  billing_alerts: boolean;
  marketing_emails: boolean;
  ai_recommendations: boolean;
  weekly_digest: boolean;
  monthly_digest: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: number;
  quiet_hours_end: number;
  timezone: string;
  language: string;
  unsubscribed_all: boolean;
}

export const DEFAULT_PREFERENCES: Omit<NotificationPreferences, "user_id"> = {
  email_enabled: true,
  push_enabled: false,
  in_app_enabled: true,
  browser_enabled: false,
  festival_alerts: true,
  horoscope_alerts: true,
  muhurat_alerts: true,
  panchang_alerts: true,
  report_alerts: true,
  billing_alerts: true,
  marketing_emails: false,
  ai_recommendations: true,
  weekly_digest: true,
  monthly_digest: false,
  quiet_hours_enabled: false,
  quiet_hours_start: 22,
  quiet_hours_end: 7,
  timezone: "Asia/Kolkata",
  language: "en",
  unsubscribed_all: false,
};

export interface NotificationTemplate {
  id?: string;
  type: string;
  channel: Channel;
  language: string;
  subject: string;
  body_md: string;
  link?: string | null;
  variables?: string[];
  enabled?: boolean;
}

export interface EnqueueInput {
  userId?: string | null;
  recipient?: string | null;
  type: NotificationType | string;
  channels?: Channel[];
  language?: string;
  priority?: PriorityName | number;
  data?: Record<string, unknown>;
  scheduledAt?: string | Date;
  dedupeKey?: string;
  maxAttempts?: number;
  createdBy?: string | null;
}

export const CHANNEL_LABELS: Record<Channel, string> = {
  in_app: "In-App",
  email: "Email",
  browser_push: "Browser Push",
  mobile_push: "Mobile Push",
  sms: "SMS",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  webhook: "Webhook",
};
