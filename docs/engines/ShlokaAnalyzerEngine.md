# Sanskrit Shloka & Pingala Chhandas Analyzer Engine Documentation

## 1. Overview
The **Sanskrit Shloka & Chhandas Analyzer Engine** (`src/components/tools/shloka/shloka-engine.ts`) provides a deterministic metrical scansion and linguistic analysis environment for Sanskrit poetry based on **Pingala Chhandas Shastra** (पिङ्गल छन्दःशास्त्र).

---

## 2. Theoretical Framework & Calculation Logic

### 2.1 Laghu-Guru Scansion Rules
Each syllable (अक्षर) is evaluated according to the classic Shastriya axioms:
1. **ह्रस्व स्वर (Short Vowels)**: *a, i, u, ṛ, ḷ* (अ, इ, उ, ऋ, ऌ) = **Laghu (`।`, 1 Matra)**.
2. **दीर्घ स्वर (Long Vowels)**: *ā, ī, ū, ṝ, e, ai, o, au* (आ, ई, ऊ, ॠ, ए, ऐ, ओ, औ) = **Guru (`ऽ`, 2 Matras)**.
3. **अनुस्वार/विसर्ग (Anusvara/Visarga)**: Syllables bearing `ं`, `ँ`, or `ः` = **Guru (`ऽ`, 2 Matras)**.
4. **संयोगे गुरु (Conjunct Consonant Lookahead)**: Short vowels followed by a consonant cluster (e.g. `क्त`, `र्म`, `स्त`, `ण्ड`) = **Guru (`ऽ`, 2 Matras)**.
5. **पादान्ते विकल्प (Pada-Final Flexibility)**: Final syllable of a quarter can act as Guru if the meter requires.

---

## 3. Pingala 8-Gana Resolution Matrix
Tri-syllabic groups (त्रिक) are matched against the canonical formula *यमाता राजभानसलगाम्*:

| Gana (गण) | Name (नाम) | Pattern (मात्रा रूप) | Pingala Characteristic (लक्षण) |
|---|---|---|---|
| **य-गण (Ya)** | LGG | `। ऽ ऽ` | आद्यलघु (First short, rest long) |
| **म-गण (Ma)** | GGG | `ऽ ऽ ऽ` | सर्वगुरु (All three long) |
| **त-गण (Ta)** | GGL | `ऽ ऽ ।` | अन्तलघु (Last short) |
| **र-गण (Ra)** | GLG | `ऽ । ऽ` | मध्यलघु (Middle short) |
| **ज-गण (Ja)** | LGL | `। ऽ ।` | मध्यगुरु (Middle long) |
| **भ-गण (Bha)** | GLL | `ऽ । ।` | आदिगुरु (First long) |
| **न-गण (Na)** | LLL | `। । ।` | सर्वलघु (All three short) |
| **स-गण (Sa)** | LLG | `। । ऽ` | अन्तगुरु (Last long) |
| **ल (Laghu)** | L | `।` | Single short syllable (1 Matra) |
| **ग (Guru)** | G | `ऽ` | Single long syllable (2 Matras) |

---

## 4. Supported Classical & Vedic Meters Database
The engine includes signature profiles and Lakshana verses (लक्षण श्लोक) for:
- **Vedic**: *Gayatri (24)*, *Ushnik (28)*, *Anushtup (32)*, *Brihati (36)*, *Trishtup (44)*, *Jagati (48)*.
- **Sama-Vritta Classical**: *Indravajra (11)*, *Upendravajra (11)*, *Upajati (11)*, *Shalini (11)*, *Rathoddhata (11)*, *Vamshastha (12)*, *Bhujangaprayata (12)*, *Totaka (12)*, *Drutavilambita (12)*, *Vasantatilaka (14)*, *Malini (15)*, *Panchachamara (16)*, *Shikharini (17)*, *Mandakranta (17)*, *Shardulavikridita (19)*, *Sragdhara (21)*.
- **Matra-Vritta**: *Arya (12+18+12+15)*.

---

## 5. UI Features & Analytics
- **Interactive Pada Scansion Grid**: Color-coded badges for every syllable with Laghu/Guru markings and matra counts.
- **Gana Sequence Breakdown**: Pada-by-pada visual triplet grouping.
- **Lakshana & Yati Display**: Shows definition verse, pause points, and confidence percentage.
- **Classic Verse Presets**: Bhagavad Gita (1.1, 2.47), Shiv Tandav, Saraswati Vandana, Meghadootam, Tvameva Mata.
- **Padacheda (पदच्छेद)**: Word tokenization and syllable stats.
- **Audio Recitation Guide & PDF Export**: Text-to-Speech playback and dedicated print layout.
