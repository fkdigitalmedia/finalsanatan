# Sanskrit Verb Conjugator & Paninian Dhatu Roop Engine Documentation

## 1. Overview
The **Sanskrit Verb Conjugator Engine** (`src/components/tools/verb/verb-engine.ts`) computes and presents verbal conjugations (तिङन्त रूप) across all 5 major Lakarasa (लकार) in Sanskrit grammar.

---

## 2. Core Lakarasa Framework

| Lakara (लकार) | Name | Tense / Mood | Suffix Signature |
|---|---|---|---|
| **लट् (Lat)** | Present Tense | वर्तमान काल | ति, तः, न्ति / सि, थः, थ / मि, वः, मः |
| **लङ् (Lang)** | Past Tense | अनद्यतन भूतकाल | त्, ताम्, न् / ः, तम्, त / म्, व, म |
| **लृट् (Lrit)** | Future Tense | भविष्यत् काल | ष्यति/स्यति, ष्यतः, ष्यन्ति... |
| **लोट् (Lot)** | Imperative | आज्ञा / प्रार्थना | तु, ताम्, न्तु / अ, तम्, त / आनि, आव, आम |
| **विधिलिङ् (Vidhiling)** | Potential / Optative | चाहिए / सम्भावना | एत्, एताम्, एयुः / एः, एतम्, एत / एयम्, एव, एम |

---

## 3. Supported Dhatu Corpus
The engine includes complete 3x3 conjugation tables (9 forms per Lakara) for 30+ classical roots across various Ganas (भ्वादि, अदादि, तुदादि, तनादि, etc.):
- `गम् (गच्छ्)` — जाना (to go)
- `भू (भव्)` — होना (to be)
- `पठ्` — पढ़ना (to read)
- `लिख्` — लिखना (to write)
- `कृ (कुर्व्)` — करना (to do)
- `अस्` — होना (to exist)
- `दृश् (पश्य्)` — देखना (to see)
- `वद्` — बोलना (to speak)
- `स्था (तिष्ठ्)` — ठहरना (to stay)
- `दा (यच्छ्)` — देना (to give)
- `पा (पिब्)` — पीना (to drink)
- `नम्` — नमस्कार करना (to salute)

---

## 4. UI Capabilities
- Live search by root, IAST, English/Hindi meaning.
- 3x3 interactive responsive table with audio pronunciation for every form.
- Full table clipboard copy and PDF print formatting.
