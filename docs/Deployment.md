# Deployment & Production Operations Guide

## Overview

Sanatan Dharma Suite can be deployed to modern serverless edge platforms (Vercel, Netlify, Cloudflare Pages) or containerized environments (Docker, AWS ECS, DigitalOcean App Platform).

---

## 1. Vercel & GitHub Setup

1. **Connect GitHub Repository**: Link your GitHub repository to Vercel.
2. **Configure Environment Variables**: Add all environment variables listed in `.env.example` in Vercel Project Settings.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

---

## 2. Production Deployment Checklist

- [ ] Supabase production instance created and migrations applied.
- [ ] Environment variables set (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, AI provider keys).
- [ ] Seed script executed (`node --env-file=.env scripts/seed-admin-defaults.js`).
- [ ] Admin panel verification executed (`node --env-file=.env scripts/verify-admin-panel.js`).
- [ ] E2E system audit executed (`node --env-file=.env scripts/verify-e2e-system.js`).
- [ ] Custom domain & SSL configured.

---

## 3. Backup & Rollback Strategy

- **Database Backup**: Supabase automatic daily Point-In-Time Recovery (PITR) & manual WAL log backups.
- **Application Rollback**: Vercel instant deployment rollback via dashboard or CLI (`vercel rollback`).
