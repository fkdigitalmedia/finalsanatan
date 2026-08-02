# Changelog

All notable changes to the **Sanatan Dharma Suite** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.1.0] - 2026-08-02

### Added

- **Vedic Astrology Engine**: Swetest / Astronomy Engine integration for high-precision Janam Kundli birth chart calculation, planetary positions, Vimshottari Dasha, and Ashtakoota Guna Milan matching.
- **Panchang & Festivals**: High-precision Tithi, Nakshatra, Yoga, Karana, Choghadiya, Rahu Kalam calculation, and festival calendar CMS.
- **Multi-Provider AI System**: Unified AI studio supporting OpenAI, Google Gemini, Groq, DeepSeek, and OpenRouter with automatic provider fallback routing, prompt versioning, and token usage cost tracking.
- **PDF Report Engine**: Server-side and client-side PDF synthesizer supporting Kundli charts, Panchang print documents, and AI-narrated astrological reports.
- **Multi-Channel Notification System**: Notification engine supporting Email (SMTP / React Email), Web Push, and SMS queues with customizable templates.
- **First-Party Analytics & BI**: Privacy-first analytics ingestion pipeline with GDPR SHA-256 IP anonymization, GA4 integration, and enterprise export engine (CSV, Excel XML, Printable PDF, JSON).
- **Enterprise Admin Panel**: 27+ administration modules for User Moderation, Monetization Plans, Payment Gateways, Ad Placements, CMS Articles, AI Studio, Site Settings, and Audit Logs.
- **System Testing & Documentation Suite**: Automated verification scripts (`verify-auth.js`, `verify-admin-panel.js`, `verify-ai-system.js`, `verify-pdf-system.js`, `verify-analytics.js`, `verify-e2e-system.js`) and 10 technical architecture guides in `docs/`.

### Changed

- Standardized file routing with TanStack React Start and Vite 8.
- Upgraded styling to TailwindCSS 4 and Radix UI design kit.

### Fixed

- Fixed PostgREST bulk event schema keys uniformity in analytics ingestion.
- Fixed PDF template layout rendering and page break calculations.

### Removed

- Removed temporary build artifacts and redundant scratch scripts.
