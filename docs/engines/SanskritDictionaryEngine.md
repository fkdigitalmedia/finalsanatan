# Sanskrit Lexicon & Amarakosha Dictionary Engine Documentation

## 1. Overview
The **Sanskrit Lexicon & Amarakosha Dictionary Engine** (`src/components/tools/dictionary/dictionary-engine.ts`) delivers a comprehensive search, etymology, and morphological lookup system for Sanskrit and Vedic vocabulary.

---

## 2. Core Functional Pillars

### 2.1 Multi-Faceted Search Engine
- **Devanagari Search**: Supports searching by native Sanskrit text (e.g. `धर्म`, `सत्यम्`, `मोक्षः`).
- **IAST Romanization Search**: Search via international romanized transliteration (e.g. `dharma`, `brahman`, `atman`).
- **English & Hindi Semantic Search**: Search by meaning keywords (e.g. `liberation`, `truth`, `nature`, `मुक्ति`).
- **Alphabetical Varnamala Picker**: Direct letter filtering across `अ-ह`.

### 2.2 Rich Morphological & Paninian Fields
For every lexicon entry, the engine provides:
- **Linga (Gender)**: *पुंल्लिङ्गम्, स्त्रीलिङ्गम्, नपुंसकलिंगम्, अव्ययम्*.
- **Part of Speech (शब्द भेद)**: *संज्ञा, विशेषणम्, क्रियापदम्, अव्ययम्*.
- **Dhatu Root & Nirukta Etymology (धातु मूल व व्युत्पत्ति)**: Canonical grammatical breakdown with Paninian Pratyayas.
- **Scriptural Authority (शास्त्र प्रमाण)**: Verifiable citations from Upanishads, Bhagavad Gita, and Manu Smriti.
- **Amarakosha Synonym Clusters**: Classical synonym groupings for cosmic and natural elements (*Surya, Agni, Jala, Chandra, Ganga, Prithvi*).
- **Daily Conversational Phrases**: Practical phrases with audio guidance (*Namaste, Dhanyavada, Suprabhatam, Kripaya*).

---

## 3. UI & Integration
- **Interactive Word Cards**: Fast browsing with category tags, expandable details, and 1-click clipboard export.
- **Natural Voice Synthesis**: Native Web Speech API integration for Sanskrit pronunciation.
- **Print / PDF Layout**: Clean print styles for offline study and reference.
