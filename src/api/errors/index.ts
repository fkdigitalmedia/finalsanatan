// ============================================================
// Universal API Layer — Errors
// ------------------------------------------------------------
// One error type, one catalogue of codes, one translator that
// turns ANY thrown value into a safe, client-facing shape.
// Internal exception text never leaves this module.
// ============================================================

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export const ERROR_STATUS: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RATE_LIMITED: 429,
  UPSTREAM_ERROR: 502,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
};

export interface FieldIssue {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly issues: FieldIssue[];
  readonly details?: Record<string, unknown>;
  /** Safe to show to the caller? Internal errors are always masked. */
  readonly exposeMessage: boolean;

  constructor(
    code: ApiErrorCode,
    message: string,
    opts: { issues?: FieldIssue[]; details?: Record<string, unknown>; expose?: boolean } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = ERROR_STATUS[code];
    this.issues = opts.issues ?? [];
    this.details = opts.details;
    this.exposeMessage = opts.expose ?? code !== "INTERNAL_ERROR";
  }
}

export const badRequest = (m: string, issues?: FieldIssue[]) =>
  new ApiError("BAD_REQUEST", m, { issues });
export const validationError = (issues: FieldIssue[]) =>
  new ApiError("VALIDATION_ERROR", "Request validation failed.", { issues });
export const unauthorized = (m = "Authentication is required for this endpoint.") =>
  new ApiError("UNAUTHORIZED", m);
export const forbidden = (m = "You do not have permission to access this resource.") =>
  new ApiError("FORBIDDEN", m);
export const notFound = (m = "Resource not found.") => new ApiError("NOT_FOUND", m);
export const methodNotAllowed = (m = "HTTP method not supported for this endpoint.") =>
  new ApiError("METHOD_NOT_ALLOWED", m);
export const payloadTooLarge = (m = "Request body is too large.") =>
  new ApiError("PAYLOAD_TOO_LARGE", m);
export const rateLimited = (m: string, details?: Record<string, unknown>) =>
  new ApiError("RATE_LIMITED", m, { details });
export const upstreamError = (m = "An upstream service failed.") =>
  new ApiError("UPSTREAM_ERROR", m);
export const internalError = () =>
  new ApiError("INTERNAL_ERROR", "Something went wrong while processing this request.", {
    expose: true,
  });

/** Normalize any thrown value into an ApiError without leaking internals. */
export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  const raw = err instanceof Error ? err.message : String(err ?? "");
  // Map well-known engine failures onto public codes; never echo raw text
  // for anything we do not explicitly recognise.
  if (/unauthori[sz]ed|no authorization header|invalid token/i.test(raw)) return unauthorized();
  if (/forbidden|not authorized/i.test(raw)) return forbidden();
  if (/not found/i.test(raw)) return notFound();
  if (/rate limit|429/i.test(raw)) return rateLimited("Upstream provider rate limit reached.");
  if (/no enabled ai providers|unavailable|503/i.test(raw))
    return new ApiError("SERVICE_UNAVAILABLE", "This service is temporarily unavailable.");
  if (/^invalid |must be|required|out of range|is required/i.test(raw))
    return new ApiError("VALIDATION_ERROR", raw);

  return internalError();
}

/** Client-facing error body (no stacks, no internals). */
export function serializeError(e: ApiError): {
  code: ApiErrorCode;
  message: string;
  issues?: FieldIssue[];
  details?: Record<string, unknown>;
} {
  return {
    code: e.code,
    message: e.exposeMessage ? e.message : "Something went wrong while processing this request.",
    ...(e.issues.length ? { issues: e.issues } : {}),
    ...(e.details ? { details: e.details } : {}),
  };
}
