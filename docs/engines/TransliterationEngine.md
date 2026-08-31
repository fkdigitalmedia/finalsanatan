# Sanskrit & Indic Universal Transliteration Engine Documentation

## 1. Overview
The **Universal Indic & Sanskrit Transliteration Engine** (`src/components/tools/transliteration/transliteration-engine.ts`) performs bidirectional script conversion across 13 Indian scripts and international Romanization standards with phonetic conjunct support and Vedic accents.

---

## 2. Supported Scripts & Schemes

### 2.1 Indian Brahmic Scripts (भारतीय लिपियाँ)
- **Devanagari (देवनागरी)**: Hindi, Sanskrit, Marathi, Nepali
- **Bengali (বাংলা)**: Bengali, Assamese
- **Tamil (தமிழ்)**: Classical Tamil script
- **Telugu (తెలుగు)**: Telugu script
- **Kannada (ಕನ್ನಡ)**: Kannada script
- **Malayalam (മലയാളം)**: Malayalam script
- **Gujarati (ગુજરાતી)**: Gujarati script
- **Gurmukhi (ਗੁਰਮੁਖੀ)**: Punjabi script
- **Odia (ଓଡ଼ିଆ)**: Odia script

### 2.2 Romanization Schemes (रोमन लिप्यन्तरण पद्धतियाँ)
- **IAST (International Alphabet of Sanskrit Transliteration)**: Standard academic diacritics (*ā, ī, ū, ṛ, ṝ, ḷ, ṅ, ñ, ṭ, ḍ, ṇ, ś, ṣ, ṃ, ḥ*).
- **ITRANS (Indian languages TRANSliteration)**: ASCII representation (*aa/A, ii/I, uu/U, RRi, ch, Ch, sh, Sh, M, H*).
- **Harvard-Kyoto (HK)**: Compact ASCII notation (*A, I, U, R, G, J, T, D, N, z, S, M, H*).
- **SLP1 (Sanskrit Library Phonetic Basic Scheme)**: 1-to-1 ASCII mapping.

---

## 3. Core Engine Architecture
1. **Normalization Phase**: Normalizes input script to canonical Devanagari Unicode codepoints.
2. **Phonetic & Conjunct Engine**: Resolves halanta clusters, independent vowels vs. dependent matras, anusvara, and visarga.
3. **Target Script Matrix**: Transforms Devanagari to target Brahmic block via relative Unicode block offsets or Roman substitution tables.
4. **All-Script Matrix**: Simultaneously outputs across all 13 supported scripts in parallel.

---

## 4. UI Capabilities
- **Direct 1-to-1 Converter**: Dynamic script selector with 1-click script swapping and size controls.
- **Multi-Script Comparison Matrix**: Complete comparative layout displaying the text in all 13 scripts side-by-side.
- **Classical Presets**: Quick insert for *Gayatri Mantra, Mahamrityunjaya, Shanti Mantra, Gita 2.47, Shiva Tandava*.
- **Speech & Export**: Web Speech API audio recitation, single-script copying, batch text file download, and PDF printing.
