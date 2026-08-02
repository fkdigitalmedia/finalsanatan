# API Architecture & Endpoint Specification

## Overview

Sanatan Dharma Suite exposes REST API routes via TanStack React Start server handlers (`src/routes/api/...`) and type-safe server functions (`createServerFn`).

---

## 1. First-Party Analytics Ingestion API

### Endpoint: `/api/public/track`

Ingests batched client analytics events, anonymizes IP addresses using SHA-256 with a daily salt, and upserts session records.

- **Method**: `POST`, `OPTIONS`
- **Authentication**: None (Public Ingestion Endpoint)
- **Permissions**: Public access
- **Content-Type**: `application/json`

#### Request Payload Schema

```json
{
  "events": [
    {
      "event_name": "tool_used",
      "session_id": "sess_987654321",
      "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "tool_slug": "kundli-matching",
      "category": "tool",
      "path": "/kundli-matching",
      "referrer": "https://google.com",
      "lang": "en",
      "device": "desktop",
      "browser": "Chrome",
      "os": "Windows",
      "screen": "1920x1080",
      "meta": { "ms": 140 }
    }
  ]
}
```

#### Success Response (`200 OK`)

```json
{
  "ok": true,
  "ingested": 1
}
```

#### Error Responses

- `400 Bad Request`: `Invalid payload` (Payload validation failed)
- `500 Internal Server Error`: `Server error`

---

## 2. Server Functions API Reference

Server functions are staff-gated or authenticated endpoints powered by TanStack React Start (`createServerFn`).

### 2.1 Analytics KPIs (`getAnalyticsKpis`)

- **Method**: `POST`
- **Authentication**: Required (`requireSupabaseAuth`)
- **Permissions**: Staff role required (`is_staff`)
- **Input**: `{ "days": 30, "from": "ISO_DATE", "to": "ISO_DATE" }`
- **Output**: 18 overview KPI metric cards (Total Users, Active Users, Sessions, Pageviews, Bounce Rate, AI Requests, Revenue, etc.).

### 2.2 Analytics Timeseries (`getAnalyticsTimeseries`)

- **Method**: `POST`
- **Authentication**: Required (`requireSupabaseAuth`)
- **Permissions**: Staff role required (`is_staff`)
- **Input**: `{ "days": 30 }`
- **Output**: Daily bucketed pageviews, sessions, and AI requests series.

### 2.3 Analytics Breakdown (`getAnalyticsBreakdown`)

- **Method**: `POST`
- **Authentication**: Required (`requireSupabaseAuth`)
- **Permissions**: Staff role required (`is_staff`)
- **Input**: `{ "dimension": "country" | "device" | "browser" | "os" | "referrer" | "path" | "lang" | "tool_slug", "limit": 20 }`
- **Output**: Ranked percentage and count breakdown by dimension.

### 2.4 AI Usage Analytics (`getAiAnalytics`)

- **Method**: `POST`
- **Authentication**: Required (`requireSupabaseAuth`)
- **Permissions**: Staff role required (`is_staff`)
- **Input**: `{ "days": 30 }`
- **Output**: Provider, model, and feature token totals, cost estimates, latencies, and failure error logs.

### 2.5 BI Dashboard (`getBiDashboard`)

- **Method**: `POST`
- **Authentication**: Required (`requireSupabaseAuth`)
- **Permissions**: Staff role required (`is_staff`)
- **Input**: `{ "days": 30, "filters": {} }`
- **Output**: Comprehensive BI metric objects, active alert states, and cohort retention.

### 2.6 BI Export (`exportBiReport`)

- **Method**: `POST`
- **Authentication**: Required (`requireSupabaseAuth`)
- **Permissions**: Staff role required (`is_staff`)
- **Input**: `{ "type": "overview" | "users" | "ai" | "tools", "format": "csv" | "xlsx" | "pdf" | "json" }`
- **Output**: `{ "filename": "report.csv", "contentType": "text/csv", "content": "..." }`
- **Audit**: Writes audit trail record to `audit_logs` table.

---

## 3. Public Integrations API (`getPublicIntegrations`)

- **Method**: `GET`
- **Authentication**: None
- **Permissions**: Public access
- **Output**: Enabled public integration IDs (`ga4_measurement_id`, `clarity_project_id`).
