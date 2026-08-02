// Centralized logger.
//
// One entry point for every log line in the app. Channels separate
// application, API, security, auth and error logs; every payload passes
// through redaction so credentials and PII never reach the log sink.

import { redactContext, redactString } from "./redact";
import { LOG_LEVEL_WEIGHT, type LogChannel, type LogEntry, type LogLevel } from "./types";

export * from "./types";
export { redact, redactString, redactContext, REDACTED } from "./redact";

function isProd(): boolean {
  try {
    if (typeof process !== "undefined" && process.env?.NODE_ENV) {
      return process.env.NODE_ENV === "production";
    }
  } catch {
    /* noop */
  }
  return Boolean(import.meta.env?.PROD);
}

function minLevel(): LogLevel {
  const raw = (typeof process !== "undefined" ? process.env?.LOG_LEVEL : undefined) ?? "";
  if (raw === "debug" || raw === "info" || raw === "warn" || raw === "error") return raw;
  return isProd() ? "info" : "debug";
}

type Sink = (entry: LogEntry) => void;

const sinks: Sink[] = [];

/** Register an extra sink (e.g. ship security logs to the DB). */
export function addLogSink(sink: Sink): () => void {
  sinks.push(sink);
  return () => {
    const i = sinks.indexOf(sink);
    if (i >= 0) sinks.splice(i, 1);
  };
}

function toErrorSummary(error: unknown): LogEntry["error"] | undefined {
  if (!error) return undefined;
  if (error instanceof Error) {
    return {
      name: error.name,
      message: redactString(error.message),
      // Stacks stay server-side; API responses never include them.
      stack: isProd() ? undefined : error.stack,
    };
  }
  return { name: "UnknownError", message: redactString(String(error)) };
}

function emit(entry: LogEntry): void {
  if (LOG_LEVEL_WEIGHT[entry.level] < LOG_LEVEL_WEIGHT[minLevel()]) return;

  const line = JSON.stringify(entry);
  if (entry.level === "error") console.error(`[${entry.channel}]`, line);
  else if (entry.level === "warn") console.warn(`[${entry.channel}]`, line);
  else console.log(`[${entry.channel}]`, line);

  for (const sink of sinks) {
    try {
      sink(entry);
    } catch {
      /* a broken sink must never break the request */
    }
  }
}

export function log(
  channel: LogChannel,
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: unknown,
): LogEntry {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    channel,
    message: redactString(message),
    context: redactContext(context),
    error: toErrorSummary(error),
  };
  emit(entry);
  return entry;
}

function channelLogger(channel: LogChannel) {
  return {
    debug: (m: string, c?: Record<string, unknown>) => log(channel, "debug", m, c),
    info: (m: string, c?: Record<string, unknown>) => log(channel, "info", m, c),
    warn: (m: string, c?: Record<string, unknown>) => log(channel, "warn", m, c),
    error: (m: string, c?: Record<string, unknown>, e?: unknown) => log(channel, "error", m, c, e),
  };
}

export const appLog = channelLogger("app");
export const apiLog = channelLogger("api");
export const securityLog = channelLogger("security");
export const authLog = channelLogger("auth");
export const errorLog = channelLogger("error");

export const logger = {
  app: appLog,
  api: apiLog,
  security: securityLog,
  auth: authLog,
  error: errorLog,
  log,
  addSink: addLogSink,
};

export default logger;
