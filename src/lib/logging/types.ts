// Centralized logging — shared, browser-safe types.

export type LogLevel = "debug" | "info" | "warn" | "error";

/** Log channels. Each channel maps to one operational concern. */
export type LogChannel =
  | "app" // application / business logic
  | "api" // inbound API + server-function traffic
  | "security" // authz denials, suspicious input, header violations
  | "auth" // sign-in / sign-out / session lifecycle
  | "error"; // unhandled exceptions

export const LOG_CHANNELS: readonly LogChannel[] = [
  "app",
  "api",
  "security",
  "auth",
  "error",
] as const;

export const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export interface LogEntry {
  ts: string;
  level: LogLevel;
  channel: LogChannel;
  message: string;
  context?: Record<string, unknown>;
  /** Sanitized error summary — never a raw stack for clients. */
  error?: { name: string; message: string; stack?: string };
}
