# Devanagari & Sanskrit Typing Studio Engine Documentation

## 1. Overview
The **Devanagari & Sanskrit Typing Studio Engine** (`src/components/tools/devanagari/devanagari-engine.ts`) provides a comprehensive phonetic typing, script transliteration, virtual keyboard mapping, and linguistic analytics environment for Devanagari and Sanskrit text.

---

## 2. Core Capabilities

### 2.1 Smart Phonetic Transliteration
- Converts standard English/Hinglish keyboard inputs into pure Devanagari in real-time.
- Features multi-character Sanskrit conjunct detection (`ksha` -> `क्ष`, `tra` -> `त्र`, `gya` -> `ज्ञ`, `shra` -> `श्र`, `sta` -> `स्त`, `ddha` -> `द्ध`, `dva` -> `द्व`, `dya` -> `द्य`).
- Inherent vowel removal and dependent matra binding (`k` + `aa` -> `का`, `sh` + `ri` -> `श्री`).
- Special Sanatan sacred symbols (`om` / `aum` -> `ॐ`, `swaha` -> `स्वाहा`, `namah` -> `नमः`).

### 2.2 Virtual Keyboards
- **Varnamala Layout**:
  - *Swar (Vowels)*: 15 independent vowels (अ to अः).
  - *Vyanjan (Consonants)*: 7 varga rows (Ka-varga, Cha-varga, Ta-varga, Ta-varga dental, Pa-varga, Antahastha, Ushma).
  - *Matras*: 16 dependent vowel signs and halanta.
  - *Sanyuktakshar*: Common classical conjuncts.
  - *Vedic Accents*: Udatta (॑), Anudatta (॒), Svarita, Om (ॐ), Swastika (卐), Purna Virama (।), Deergha Virama (॥).
  - *Numerals*: Devanagari numbers ० to ९.
- **Inscript Standard Keyboard**:
  - Full Indian Government Inscript keyboard mapping with Shift toggle.

### 2.3 Script Transliteration Converters
- **Devanagari ↔ IAST (International Alphabet of Sanskrit Transliteration)** with full diacritics (*ā, ī, ū, ṛ, ṝ, ḷ, ṁ, ḥ, ś, ṣ, ṭ, ḍ, ṇ, ñ, ṅ*).
- **Devanagari ↔ Harvard-Kyoto (HK)** notation.

### 2.4 Real-Time Text Metrics & Linguistic Analytics
- Character count (with & without spaces)
- Word count & Line count
- Akshara (Syllable) counter (accounting for viramas and consonants)
- Matra count, Swar count, and Vyanjan count

### 2.5 Calligraphy Card PNG Generator
- Generates high-resolution 1200x700px shareable Sanskrit cards via HTML5 Canvas.
- Customizable visual themes: *Bhagwa / Saffron Temple*, *Gold / Pitambari*, *Dark / Midnight*, and *Parchment / Manuscript*.
