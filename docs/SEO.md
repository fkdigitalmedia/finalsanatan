# SEO & Webmaster Infrastructure Guide

## Overview

Sanatan Dharma Suite incorporates comprehensive Search Engine Optimization (SEO) capabilities, dynamic sitemap generators, JSON-LD structured data, canonical URL handling, and automated 301/302 redirects.

---

## 1. Dynamic XML Sitemaps

Dynamic XML sitemap endpoints are provided out-of-the-box:

- `/sitemap.xml`: Root sitemap index
- `/sitemap-tools.xml`: Astrological and calculation tool pages
- `/sitemap-horoscope.xml`: Daily, weekly, monthly, yearly horoscope pages
- `/sitemap-festivals.xml`: Hindu festival pages and calendar routes
- `/sitemap-blog.xml`: Articles and news posts
- `/sitemap-pages.xml`: Static legal and informational pages

---

## 2. Structured Data (JSON-LD)

JSON-LD schemas are generated for search engine indexing:

- **Tools Pages**: `SoftwareApplication` schema with features and rating.
- **Festival Pages**: `Event` schema with date, location (`India`), and deity info.
- **Blog Posts**: `Article` schema with publisher and author markup.

---

## 3. Programmatic & Festival SEO

- **Festival SEO**: Dynamic routes `/festivals/$slug`, `/festivals/category/$slug`, `/festivals/deity/$slug`, and `/festivals/year/$year`.
- **Tool SEO**: Dynamic routes `/rashi/$slug`, `/nakshatra/$slug`, `/dosha/$slug`, `/vastu/$slug`.

---

## 4. LLM & AI Search Optimization (`llms.txt`)

Provides AI search crawlers (Perplexity, ChatGPT, Claude) with structured site knowledge:

- `/llms.txt`: Concise site summary and core routes directory.
- `/llms-full.txt`: Complete tool documentation and Vedic astrological methodology guide.
