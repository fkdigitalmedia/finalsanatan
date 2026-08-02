# Developer Troubleshooting Guide

## Overview

This guide provides diagnostic solutions for common development, environment, database, AI provider, and deployment issues.

---

## 1. Supabase Connection Issues

### Symptom: `SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env`

**Cause**: Node.js script executed without environment variables loaded.  
**Solution**: Use Node 20+ native flag:

```bash
node --env-file=.env scripts/verify-admin-panel.js
```

### Symptom: RLS Permission Denied (`401 Unauthorized` / `403 Forbidden`)

**Cause**: Target table requires staff permissions or user session token.  
**Solution**: Verify that your test account has a staff role entry in `user_roles`:

```sql
INSERT INTO user_roles (user_id, role) VALUES ('your-user-uuid', 'staff');
```

---

## 2. Authentication & Session Refresh

### Symptom: Dashboard redirects to `/auth` on refresh

**Cause**: Supabase session token expired or missing local storage persistence.  
**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` match in your `.env`.

---

## 3. Build & TypeScript Errors

### Symptom: Vitest startup module resolution error (`UNRESOLVED_IMPORT`)

**Cause**: Running vitest via global node without vite environment context.  
**Solution**: Execute tests via project runner or node scripts:

```bash
npm run build
node --env-file=.env scripts/verify-e2e-system.js
```

---

## 4. Environment Variables

### Symptom: AI Provider calls fail with empty key error

**Cause**: Missing provider API keys in `.env`.  
**Solution**: Check `.env` and verify key formats:

- OpenAI: `OPENAI_API_KEY="sk-proj-..."`
- Gemini: `GEMINI_API_KEY="AIzaSy..."`

---

## 5. AI Provider Fallback & Latency

### Symptom: Primary AI provider timeout or rate limit (`429 Too Many Requests`)

**Cause**: Provider quota exceeded or API degradation.  
**Solution**: The AI system automatically falls back to secondary active providers in `ai_providers` table. Ensure at least two providers (e.g., OpenAI + Gemini or Groq) are enabled in Admin Panel (`/admin/ai-providers`).

---

## 6. Vercel & Deployment Errors

### Symptom: `500 Server Error` on public API routes in production

**Cause**: Missing `SUPABASE_SERVICE_ROLE_KEY` in deployment environment variables.  
**Solution**: Add all required production keys in Vercel / Netlify project dashboard environment settings.
