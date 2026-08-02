# Technical Architecture Guide

## Overview

Sanatan Dharma Suite is built on a modern, full-stack architecture leveraging **TanStack React Start**, **TanStack Router**, **Vite 8**, and **Supabase (PostgreSQL + Auth)**. It combines server-side rendering (SSR), server functions, and interactive client hydration for high-performance astrological computations.

---

## 1. System Architecture Overview

```mermaid
graph TD
    User[User / Web Client] --> Router[TanStack Router File-Based Routes]
    Router --> Layout[Root Layout & Analytics Tracker]
    Layout --> ServerFn[TanStack Start Server Functions]
    ServerFn --> Supabase[(Supabase PostgreSQL + RLS)]
    ServerFn --> AIStudio[Multi-Provider AI Engine]
    ServerFn --> Analytics[Internal Ingestion Engine]
    AIStudio --> OpenAI[OpenAI API]
    AIStudio --> Gemini[Google Gemini API]
    AIStudio --> Groq[Groq Llama 3.3]
```

---

## 2. Frontend Architecture

- **Framework**: TanStack React Start (SSR + Client Hydration).
- **Routing**: File-based routes located in `src/routes/`. Authenticated & admin routes are guarded under `src/routes/_authenticated/`.
- **State Management**: TanStack React Query handles server state caching and optimistic updates.
- **UI & Layout Kit**: TailwindCSS 4, Radix UI primitives, Lucide React icons, and Sonner toast notifications.

```mermaid
graph LR
    Page[Route Page Component] --> Hook[useQuery / useServerFn]
    Hook --> ServerFn[Server Function]
    ServerFn --> DB[(Supabase DB)]
    Page --> UI[Radix UI Component]
    Page --> Toast[Sonner Notification]
```

---

## 3. Backend & Data Architecture

- **Database**: PostgreSQL hosted on Supabase.
- **Row Level Security (RLS)**: Enforces table policies by user ownership (`auth.uid() = user_id`) and staff authorization (`is_staff`).
- **Server Functions**: Type-safe handlers (`createServerFn`) executing with authenticated Supabase context.

```mermaid
graph TD
    ClientReq[Client Request] --> AuthMiddleware[requireSupabaseAuth Middleware]
    AuthMiddleware --> StaffCheck{Assert Staff Role?}
    StaffCheck -- Yes --> RPC[RPC: is_staff]
    StaffCheck -- No --> UserQuery[User Scope RLS Query]
    RPC -- Valid --> AdminQuery[Service Role Admin Query]
    RPC -- Denied --> Forbidden[403 Forbidden Error]
```

---

## 4. Multi-Provider AI Architecture

```mermaid
graph TD
    Req[AI Generation Request] --> Router[AI Fallback Router]
    Router --> Primary[Primary Provider: OpenAI / Gemini]
    Primary -- Success --> Resp[Return AI Completion]
    Primary -- Fail / RateLimit --> Secondary[Secondary Provider: Groq / OpenRouter]
    Secondary -- Success --> Resp
    Resp --> Log[Log Tokens & Cost to ai_usage_logs]
```

---

## 5. Folder Structure Reference

```text
src/
├── components/          # Reusable UI components & feature modules
│   ├── admin/           # Admin panel screens & CRUD drivers
│   ├── analytics/       # Script injection & tracker components
│   ├── horoscope/       # Horoscope card rendering
│   ├── kundli/          # Birth chart rendering & Dasha tables
│   ├── ui/              # Radix UI primitives
│   └── tools/           # Individual Vedic tool modules
├── integrations/        # Supabase client initialization & auth middleware
├── lib/                 # Core server functions & algorithms
│   ├── analytics/       # Analytics engine, validators, export helpers
│   ├── notifications/   # Email, SMS & WebPush delivery engines
│   └── ai/              # Multi-provider AI SDK glue
├── routes/              # TanStack Start file-based routing tree
└── styles.css           # Global CSS & design system tokens
```
