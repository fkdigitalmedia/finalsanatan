// ============================================================
// Universal API Layer — Standard response envelope
// ============================================================

import { serializeError, type ApiError } from "../errors";

export const API_VERSIONS = ["v1"] as const;
export type ApiVersion = (typeof API_VERSIONS)[number];
export const CURRENT_API_VERSION: ApiVersion = "v1";

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ResponseMetadata {
  endpoint: string;
  method: string;
  cached: boolean;
  role: string;
  engine?: string;
  rateLimit?: { limit: number; remaining: number; resetAt: string };
  [key: string]: unknown;
}

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  error?: ReturnType<typeof serializeError>;
  metadata: ResponseMetadata;
  pagination?: Pagination;
  requestId: string;
  timestamp: string;
  apiVersion: ApiVersion;
  executionTime: number;
}

export function buildPagination(page: number, pageSize: number, total: number): Pagination {
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export interface EnvelopeContext {
  requestId: string;
  startedAt: number;
  apiVersion: ApiVersion;
  metadata: ResponseMetadata;
}

export function success<T>(
  ctx: EnvelopeContext,
  data: T,
  opts: { message?: string; statusCode?: number; pagination?: Pagination } = {},
): ApiEnvelope<T> {
  return {
    success: true,
    statusCode: opts.statusCode ?? 200,
    message: opts.message ?? "OK",
    data,
    metadata: ctx.metadata,
    ...(opts.pagination ? { pagination: opts.pagination } : {}),
    requestId: ctx.requestId,
    timestamp: new Date().toISOString(),
    apiVersion: ctx.apiVersion,
    executionTime: Date.now() - ctx.startedAt,
  };
}

export function failure(ctx: EnvelopeContext, error: ApiError): ApiEnvelope<null> {
  const body = serializeError(error);
  return {
    success: false,
    statusCode: error.statusCode,
    message: body.message,
    data: null,
    error: body,
    metadata: ctx.metadata,
    requestId: ctx.requestId,
    timestamp: new Date().toISOString(),
    apiVersion: ctx.apiVersion,
    executionTime: Date.now() - ctx.startedAt,
  };
}

export function newRequestId(): string {
  const rnd = Math.random().toString(36).slice(2, 10);
  return `req_${Date.now().toString(36)}_${rnd}`;
}
