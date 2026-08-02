// ============================================================
// Universal API Layer — Core contracts
// ============================================================

import type { ApiRole, AuthContext } from "./auth";
import type { ApiVersion, Pagination, ResponseMetadata } from "./responses";

export interface HandlerContext {
  request: Request;
  url: URL;
  /** Parsed + size-guarded JSON body (empty object for GET). */
  body: unknown;
  /** Sanitized query-string values. */
  query: Record<string, string>;
  /** Path params extracted from the route pattern. */
  params: Record<string, string>;
  auth: AuthContext;
  requestId: string;
  apiVersion: ApiVersion;
}

export interface HandlerResult<T = unknown> {
  data: T;
  message?: string;
  statusCode?: number;
  pagination?: Pagination;
  metadata?: Partial<ResponseMetadata>;
}

export type Handler<T = unknown> = (ctx: HandlerContext) => Promise<HandlerResult<T>>;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteDefinition {
  method: HttpMethod;
  /** Pattern relative to /api/{version}, e.g. "kundli/:id". */
  path: string;
  handler: Handler;
  /** Minimum role required. Omit for public/guest endpoints. */
  minRole?: ApiRole;
  /** Cache TTL in ms. 0 / omitted disables response caching. */
  cacheTtlMs?: number;
  cacheTags?: string[];
  /** Rate-limit cost. AI + PDF endpoints cost more. */
  rateCost?: number;
  group: string;
  summary: string;
  description?: string;
  /** OpenAPI example request body. */
  requestExample?: Record<string, unknown>;
  /** Engine that ultimately serves this endpoint (documentation only). */
  engine?: string;
}
