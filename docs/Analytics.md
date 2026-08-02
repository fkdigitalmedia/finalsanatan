# First-Party Analytics Platform Guide

## Overview

Sanatan Dharma Suite features a self-hosted, privacy-first analytics ingestion platform designed to track user activity, tool usage, performance metrics, and business intelligence without compromising user privacy.

---

## 1. Event Tracking Catalog & Conversion Funnels

| Event Name            | Category | Meta Properties               | Conversion Event? |
| :-------------------- | :------- | :---------------------------- | :---------------: |
| `pageview`            | Content  | `{ path }`                    |        No         |
| `user_registered`     | User     | `{ plan }`                    |      **Yes**      |
| `login`               | User     | `{ method }`                  |        No         |
| `tool_used`           | Tool     | `{ tool, ms }`                |      **Yes**      |
| `kundli_generated`    | Tool     | `{ ayanamsa }`                |      **Yes**      |
| `horoscope_generated` | Tool     | `{ rasi }`                    |      **Yes**      |
| `ai_report_generated` | AI       | `{ provider, model, tokens }` |      **Yes**      |
| `download`            | Tool     | `{ kind }`                    |      **Yes**      |
| `search`              | Content  | `{ q, n }`                    |        No         |
| `js_error`            | System   | `{ message, stack }`          |        No         |

---

## 2. Privacy & Anonymization Engine

- **GDPR Compliance**: Client IP addresses are hashed using SHA-256 with a daily rotating salt (`maskIp` in `/api/public/track`).
- **Opt-Out Control**: Respects `sanatan-analytics-opt-out` flag in `localStorage` via `isOptedOut()`.
- **No Sensitive Data**: Raw IP addresses and unhashed passwords are never saved.

---

## 3. Performance & Queueing Architecture

```mermaid
graph TD
    Event[track Event Called] --> OptOut{Opted Out?}
    OptOut -- Yes --> Drop[Drop Event]
    OptOut -- No --> Queue[Push to Memory Queue]
    Queue --> FlushCheck{Queue >= 20 || 2s Elapsed?}
    FlushCheck -- Yes --> Flush[Flush via sendBeacon / fetch]
    Flush --> API[/api/public/track Endpoint]
    API --> DB[(analytics_events Table)]
```

---

## 4. BI Exports & Reports

Export report data in 4 native formats:

- **CSV**: RFC 4180 escaped CSV stream.
- **Excel**: SpreadsheetML 2003 XML format.
- **PDF**: Printable HTML document synthesizer.
- **JSON**: Structured payload with audit logging.
