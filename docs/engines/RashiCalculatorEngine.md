# Vedic Rashi, Chandra Kundli & Avakahada Engine Documentation

## 1. Overview
The **Vedic Rashi & Moon Sign Studio** (`src/components/tools/rashi/rashi-engine.ts`) calculates sidereal Moon Sign (चन्द्र राशि), Sun Sign (सूर्य राशि), Ascendant (लग्न), Janma Nakshatra, and full Avakahada Chakra along with an intelligent Name-Syllable phonetic matcher.

---

## 2. Core Astronomical Capabilities

### 2.1 Astronomical Tri-Sign Resolution
- **Chandra Rashi (Moon Sign)**: Evaluated at exact local birth coordinates and time via Lahiri Ayanamsa and Swiss-level sidereal ephemeris.
- **Surya Rashi (Sun Sign)**: Sidereal solar placement indicating core vitality and soul trajectory.
- **Lagna Rashi (Ascendant)**: Exact rising sign at eastern horizon during birth time.

### 2.2 Avakahada Chakra (अवकहड़ा चक्र)
Calculates all 6 primary Vedic compatibility components:
- **Varna (वर्ण)**: Brahmin, Kshatriya, Vaishya, Shudra
- **Vashya (वश्य)**: Chatushpada, Dvipada, Jalachara, Vanachara, Keeta
- **Yoni (योनि)**: Animal symbol indicating natural instinct
- **Gana (गण)**: Deva, Manushya, Rakshasa
- **Nadi (नाड़ी)**: Adi, Madhya, Antya
- **Tattva (तत्व)**: Fire, Earth, Air, Water

---

## 3. Name-Syllable Rashi Finder (नामाक्षर राशि निर्णय)
- Covers the traditional 108 Nakshatra Pada phonetic syllables (e.g. *चू, चे, चो, ला, ली, लू, ले, लो, अ* $\rightarrow$ Mesha).
- Performs instantaneous prefix matching across English and Devanagari names.

---

## 4. Astrological Insights & Remedies
- **Lucky Attributes**: Numbers, Colors, Days, Direction, Gemstones, and Deity.
- **Compatibility Matrix**: Friendly and challenging Rashi dynamics.
- **Shani Sade Sati Transit Engine**: Determines real-time Saturn Gochar impact (1st Phase, Peak Janma Shani, 3rd Phase, or Dhaiya).
- **Vedic Mantras**: Rashi Beej Mantra with Web Speech API audio chanting.
