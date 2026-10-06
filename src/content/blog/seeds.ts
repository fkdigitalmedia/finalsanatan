export interface SeedBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image: string;
  published_at: string;
  updated_at: string;
  lang: string;
  content_md: string;
  seo: Record<string, string | number | boolean | null>;
}

export const SEED_BLOG_POSTS: SeedBlogPost[] = [
  {
    slug: "understanding-your-janam-kundli",
    title: "Janam Kundli: A Comprehensive Guide to Reading Your Vedic Birth Chart (D1, Houses & Planets)",
    excerpt:
      "Discover what a Janam Kundli (Vedic birth chart) is, how to read the 12 houses (Bhavas), 9 planets (Grahas), and major yogas with authentic classical principles.",
    category: "ASTROLOGY",
    tags: ["Kundli", "Vedic Astrology", "Horoscope", "Bhavas", "Grahas", "Yogas"],
    featured_image: "/blog/kundli-guide.jpg",
    published_at: "2026-01-15T00:00:00.000Z",
    updated_at: "2026-09-15T00:00:00.000Z",
    lang: "en",
    seo: {
      meta_title: "Janam Kundli: A Comprehensive Guide to Reading Your Vedic Birth Chart (D1, Houses & Planets)",
      meta_description:
        "Discover what a Janam Kundli (Vedic birth chart) is, how to read the 12 houses (Bhavas), 9 planets (Grahas), and major yogas with authentic classical principles.",
      canonical: "https://www.sanatantools.com/blog/understanding-your-janam-kundli",
      og_type: "article",
    },
    content_md: `> **Quick Answer (Summary)**
> A **Janam Kundli** (also known as a *Janmapatrika* or Vedic Birth Chart) is an astronomical snapshot of the celestial sky at the precise second and location of an individual's birth. Calculated using the sidereal zodiac (*Nirayana*), it maps the **Ascendant (*Lagna*)**, **12 Houses (*Bhavas*)**, and **9 Celestial Influences (*Navagrahas*)**. In Vedic astrology (*Jyotisha*), your Kundli serves as a cosmic blueprint outlining inherent behavioral traits, strengths, challenges, and life cycles (*Dashas*).

---

## The Foundations of Vedic Astrology: How a Janam Kundli is Formed

In traditional Vedic thought, *Jyotisha* translates to the "Science of Light." A Janam Kundli is not a fortune-teller's crystal ball; it is a calculated astronomical chart mapped into a two-dimensional geometric grid.

When a person takes their first breath, the planets occupy specific degrees within twelve 30-degree divisions of the celestial ecliptic (the 12 zodiac signs or *Rashis*). Simultaneously, looking eastward on the horizon from that specific latitude and longitude, one specific zodiac sign is rising. That rising sign becomes the **Ascendant** or **Lagna**, anchoring the entire chart as **House 1**.

\`\`\`
       [Ascendant / Rising Sign at East Horizon]
                          │
       ┌──────────────────┴──────────────────┐
       ▼                                     ▼
 12 Houses (Bhavas)                   9 Planets (Grahas)
 (Domains of Life)                    (Cosmic Energies)
       │                                     │
       └──────────────────┬──────────────────┘
                          ▼
            [Calculated Janam Kundli (D1)]
\`\`\`

### 1. The Exact Coordinates: Time, Date, and Geographical Position
Because the Earth completes a full 360-degree rotation every 24 hours, the rising sign (*Lagna*) changes approximately every two hours. A difference of just 4 to 5 minutes can shift the exact degree of the Ascendant, modify divisional charts (such as the *Navamsha* or D9), and shift the precise timing of planetary periods (*Vimshottari Dasha*).

To generate a mathematically precise Kundli, three inputs are mandatory:
1. **Date of Birth** (Day, Month, Year)
2. **Accurate Time of Birth** (Hour, Minute, and ideally Seconds)
3. **Exact Place of Birth** (City, State, Country for precise Geographic Latitude and Longitude)

> 💡 **Create Your Free Chart**: If you have your exact birth details, you can generate your accurate sidereal birth chart instantly using our [Free Janam Kundli Calculator](https://www.sanatantools.com/kundli).

---

### 2. The Sidereal Zodiac (Nirayana) vs. Tropical Zodiac (Sayana)
A fundamental difference between Western astrology and Vedic astrology is the zodiac system used:

* **Tropical Zodiac (Western / *Sayana*)**: Anchors $0^\\circ$ Aries to the Vernal Equinox (the moment spring begins in the Northern Hemisphere). Because of the Earth's axial precession (precession of the equinoxes), the tropical zodiac slowly drifts over centuries.
* **Sidereal Zodiac (Vedic / *Nirayana*)**: Anchors $0^\\circ$ Aries to observable, fixed background constellations. To reconcile the drifting equinox with fixed constellations, Vedic astrology applies an astronomical correction known as the **Ayanamsha** (most commonly the *Lahiri / Chitra Paksha Ayanamsha*).

As a result, your Vedic Sun or Moon sign is frequently one sign earlier (approximately 24 degrees offset) than your Western sun sign.

---

### 3. North Indian vs. South Indian Chart Styles

Depending on regional traditions in India, Kundlis are drawn in distinct visual formats. While the visual geometry differs, the mathematical data (planets in signs and degrees) remains identical.

\`\`\`
       NORTH INDIAN FORMAT (Diamond)               SOUTH INDIAN FORMAT (Square Grid)
         ┌─────────┬─────────┐                        ┌─────┬─────┬─────┬─────┐
         │ \\  12 / │ \\   2 / │                        │ Psc │ Ari │ Tau │ Gem │
         │   \\  /  │   \\  /  │                        ├─────┼─────┼─────┼─────┤
         │11  ╳  1 │ 3  ╳  1 │                        │ Aqu │           │ Can │
         │   /  \\  │   /  \\  │                        ├─────┤ Fixed Sign ├─────┤
         │ /   10\\ │ /   4 \\ │                        │ Cap │ Placement │ Leo │
         ├─────────┼─────────┤                        ├─────┼─────┼─────┼─────┤
         │ \\   8 / │ \\   6 / │                        │ Sag │ Sco │ Lib │ Vir │
         │   \\  /  │   \\  /  │                        └─────┴─────┴─────┴─────┘
         │ 9  ╳  7 │ 5  ╳  7 │
         └─────────┴─────────┘
         (Houses are Fixed; Signs Move)              (Signs are Fixed; Houses Move)
\`\`\`

1. **North Indian Style (Diamond Chart)**:
   * **Houses are permanently fixed** in their positions. The top central diamond is *always* House 1 (Lagna).
   * Zodiac signs are indicated by numerical values ($1 = \\text{Aries}, 2 = \\text{Taurus}, \\dots, 12 = \\text{Pisces}$).
   * Counter-clockwise house numbering.

2. **South Indian Style (Box/Grid Chart)**:
   * **Zodiac signs are permanently fixed** in their respective boxes (Pisces top-left, Aries second box, etc.).
   * The Ascendant is indicated by a diagonal slash or label (*Lagna* / *Asc*), and houses are counted clockwise from that point.

---

## The Core Pillar: Understanding the 12 Houses (Bhavas)

In a birth chart, the 360-degree celestial sphere is partitioned into twelve 30-degree sectors called **Bhavas** (Houses). Each Bhava governs specific aspects of human experience, from physical health and psychology to career, relationships, and spiritual realization.

\`\`\`
                    10 (Karma / Career)
                   ┌───────────────────┐
     9 (Dharma)   │                   │   11 (Labha / Gains)
         ◄────────┤     12 HOUSES     ├────────►
                  │      (BHAVAS)     │
     1 (Tanu/Self)│                   │   7 (Jaya / Marriage)
                   └───────────────────┘
                     4 (Sukha / Home)
\`\`\`

### Classification of Houses

Vedic astrology groups the 12 houses into functional categories:

* **Kendras (Angles / Pillars — Houses 1, 4, 7, 10)**: The foundational pillars of life representing vitality, home life, partnerships, and public vocation. Planets placed here have strong active expression.
* **Trikonas (Trines / Auspicious Houses — Houses 1, 5, 9)**: The houses of *Lakshmi* and *Dharma*, governing intellect, righteous action, past-life merits (*Purva Punya*), and wisdom.
* **Dusthanas (Challenging / Growth Houses — Houses 6, 8, 12)**: The houses of obstacles, transformation, illness, debts, and dissolution. While demanding, they build resilience and spiritual detachment.
* **Upachayas (Houses of Growth — Houses 3, 6, 10, 11)**: Houses where malefic planets often produce constructive drive, yielding increasing success over time through effort.

---

### Comprehensive Reference Table of the 12 Bhavas

| House | Sanskrit Name | Core Domains of Life | Natural Sign & Ruler | Body Part Associated |
| :--- | :--- | :--- | :--- | :--- |
| **1st** | *Tanu Bhava* | Physical body, personality, life force, vitality, outward temperament | Aries (Mars) | Head, Brain, Face |
| **2nd** | *Dhana Bhava* | Accumulated wealth, family lineage, speech, nutrition, early upbringing | Taurus (Venus) | Eyes, Throat, Mouth, Teeth |
| **3rd** | *Sahaja Bhava* | Courage (*Parakrama*), younger siblings, short journeys, communication, manual skills | Gemini (Mercury) | Shoulders, Arms, Hands, Respiratory tract |
| **4th** | *Sukha Bhava* | Mother, domestic happiness, real estate, vehicles, inner peace, formal education | Cancer (Moon) | Chest, Lungs, Heart |
| **5th** | *Putra Bhava* | Intellect, children, creativity, speculative gains, mantras, *Purva Punya* (past merit) | Leo (Sun) | Stomach, Upper Abdomen, Spine |
| **6th** | *Ari / Shatru Bhava* | Daily routine, health disorders, debts, litigations, service, overcoming enemies | Virgo (Mercury) | Intestines, Digestive system |
| **7th** | *Jaya / Kalatra Bhava*| Spouse, long-term partnerships, public contracts, foreign travel, business relations | Libra (Venus) | Lower abdomen, Reproductive organs |
| **8th** | *Randhra Bhava* | Longevity (*Ayur*), sudden changes, occult knowledge, inheritance, psychological transformation | Scorpio (Mars/Ketu) | Excretory organs, Pelvic floor |
| **9th** | *Dharma / Bhagya Bhava*| Fortune, father, higher philosophy, spiritual guides (*Guru*), pilgrimage, long-distance journeys | Sagittarius (Jupiter) | Thighs, Hips |
| **10th**| *Karma Bhava* | Profession, social status, reputation, authority figures, public actions | Capricorn (Saturn) | Knees, Joints, Skeletal structure |
| **11th**| *Labha Bhava* | Ambitions, cash flow, social networks, older siblings, recognition, fulfilling desires | Aquarius (Saturn/Rahu)| Calves, Ankles, Shins |
| **12th**| *Vyaya Bhava* | Subconscious mind, expenditures, foreign settlement, meditation, isolation, liberation (*Moksha*)| Pisces (Jupiter/Ketu)| Feet, Toes, Sleep cycle |

---

## The Nine Celestial Influences: The Navagrahas

In Jyotisha, planets are called **Grahas**, derived from the Sanskrit root *Grah* (to grasp, attract, or hold). They symbolize cosmic lenses focusing specific archetypal energies upon an individual.

\`\`\`
                     NAVAGRAHAS (9 GRAHAS)
      ┌─────────────────────────┴─────────────────────────┐
      ▼                                                   ▼
Luminaries & Planetary Bodies                       Lunar Nodes (Shadow Planets)
(Surya, Chandra, Mangal, Budha,                     (Rahu - North Node
 Guru, Shukra, Shani)                                Ketu - South Node)
\`\`\`

### 1. The Grahas and Their Core Significances (*Karakatvas*)

1. **Surya (Sun)**: The *Atmakaraka* (significator of Soul), representing self-worth, leadership, father, vitality, and authority.
2. **Chandra (Moon)**: Significator of the emotional mind (*Manas*), mother, memory, intuition, and mental equilibrium.
3. **Mangal (Mars)**: Significator of physical energy, courage, initiative, siblings, property, and technical acumen.
4. **Budha (Mercury)**: Significator of logical intellect (*Buddhi*), speech, commercial transactions, humor, and analytical skills.
5. **Guru (Jupiter)**: Significator of wisdom, divine grace (*Kripa*), children, teachers, ethics, and expansion.
6. **Shukra (Venus)**: Significator of aesthetic refinement, romance, marital harmony, arts, luxury, and diplomacy.
7. **Shani (Saturn)**: Significator of discipline, perseverance, karmic accountability, longevity, and service.
8. **Rahu (North Node of Moon)**: Shadow planet representing worldly ambition, unconventional pursuits, innovation, and intense desires.
9. **Ketu (South Node of Moon)**: Shadow planet representing detachment, spirituality (*Moksha*), introspection, and past-life mastery.

---

### 2. Dignities: Exaltation, Debilitation, and Ownership

A planet's behavior in a chart depends heavily on its **Dignity** (*Avastha* and placement in signs):

| Graha (Planet) | Own Sign(s) (*Swakshetra*) | Exalted Sign (*Uccha*) | Debilitated Sign (*Neecha*) | Functional Nature |
| :--- | :--- | :--- | :--- | :--- |
| **Surya** (Sun) | Leo ($5$) | Aries ($10^\\circ$) | Libra ($10^\\circ$) | Mild Malefic / Pure Sattva |
| **Chandra** (Moon) | Cancer ($4$) | Taurus ($3^\\circ$) | Scorpio ($3^\\circ$) | Benefic (Waxing) / Malefic (Waning) |
| **Mangal** (Mars) | Aries ($1$), Scorpio ($8$) | Capricorn ($28^\\circ$) | Cancer ($28^\\circ$) | Natural Malefic |
| **Budha** (Mercury) | Gemini ($3$), Virgo ($6$) | Virgo ($15^\\circ$) | Pisces ($15^\\circ$) | Adaptable Benefic |
| **Guru** (Jupiter) | Sagittarius ($9$), Pisces ($12$) | Cancer ($5^\\circ$) | Capricorn ($5^\\circ$) | Supreme Natural Benefic |
| **Shukra** (Venus) | Taurus ($2$), Libra ($7$) | Pisces ($27^\\circ$) | Virgo ($27^\\circ$) | Natural Benefic |
| **Shani** (Saturn) | Capricorn ($10$), Aquarius ($11$)| Libra ($20^\\circ$) | Aries ($20^\\circ$) | Natural Malefic |
| **Rahu** (North Node)| Co-rules Aquarius | Taurus / Gemini (classical variants) | Scorpio / Sagittarius | Shadow Malefic |
| **Ketu** (South Node)| Co-rules Scorpio | Scorpio / Sagittarius (classical variants)| Taurus / Gemini | Shadow Spiritualizing |

---

## The Ascendant (Lagna) and Moon Sign (Chandra Rashi): Why Both Matter

Many people familiar only with Western sun-sign horoscopes are surprised to discover that Vedic astrology prioritizes the **Lagna (Ascendant)** and the **Chandra Rashi (Moon Sign)**.

\`\`\`
   ┌──────────────────────────────────────────────────────────────────────┐
   │                          THE VEDIC TRIPOD                            │
   │                                                                      │
   │   1. LAGNA (Ascendant)      ──► Physical Reality, Health & Path      │
   │   2. CHANDRA RASHI (Moon)   ──► Inner Psychology, Emotions & Mind    │
   │   3. SURYA RASHI (Sun)      ──► Soul Purpose, Willpower & Authority  │
   └──────────────────────────────────────────────────────────────────────┘
\`\`\`

* **The Ascendant (*Lagna*)**: Represents the body, tangible life circumstances, and external persona. The house placement and dignity of the **Lagna Lord (*Lagnadhipati*)** dictates the primary trajectory of your lifetime.
* **The Moon Sign (*Chandra Rashi*)**: Represents the perceptual framework—how you process stress, relationships, and experiences. Planetary periods (*Vimshottari Dasha*) are calculated directly from the Moon's exact degree and associated **Nakshatra** (lunar mansion).
* **The Nakshatras**: The 12 signs are further subdivided into 27 lunar constellations of $13^\\circ 20'$ each. To uncover your birth star and its deity, use the [SanatanTools Nakshatra Finder](https://www.sanatantools.com/tools/nakshatra-finder).

---

## Important Yogas and Doshas in a Kundli

In Vedic astrology, a **Yoga** is a specific algebraic combination of planets, signs, and houses that produces distinct life themes.

\`\`\`
                             KUNDLI COMBINATIONS
         ┌────────────────────────────┴────────────────────────────┐
         ▼                                                         ▼
  AUSPICIOUS YOGAS                                         CHALLENGING DOSHAS
  (Raja, Dhana, Mahapurusha)                               (Mangal, Kaal Sarp, Sade Sati)
\`\`\`

### 1. Auspicious Yogas

1. **Raja Yogas (Yogas of Success & Influence)**:
   Formed when lords of the *Kendras* (Houses 1, 4, 7, 10) form conjunctions, mutual aspects, or sign exchanges with lords of the *Trikonas* (Houses 1, 5, 9). This aligns action (*Kendra*) with grace (*Trikona*).
2. **Dhana Yogas (Yogas of Prosperity)**:
   Formed when the 1st, 2nd, 5th, 9th, and 11th houses and their lords interlink harmoniously.
3. **Pancha Mahapurusha Yogas**:
   Five specific royal planetary combinations formed when Mars (*Ruchaka*), Mercury (*Bhadra*), Jupiter (*Hamsa*), Venus (*Malavya*), or Saturn (*Sasa*) is placed in its own sign or exaltation sign within a *Kendra* house.
   * *Explore your combinations in detail with the [SanatanTools Vedic Yoga Directory & Calculators](https://www.sanatantools.com/yoga).*

---

### 2. Common Challenging Planetary Configurations (Doshas)

1. **Mangal Dosha (Kuja Dosha)**:
   Occurs when Mars is positioned in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna or Moon. Traditionally analyzed in relationship compatibility to assess passion, temperament, and conflict resolution. In modern astrology, numerous classical exceptions (*Apavadas*) neutralize this placement.
2. **Kaal Sarp Yoga / Dosha**:
   Occurs when all visible planetary bodies are hemmed between the nodal axis of Rahu and Ketu. It often indicates concentrated life lessons during early years followed by significant growth after maturity.
3. **Shani Sade Sati**:
   A 7.5-year planetary transit during which Saturn traverses the 12th, 1st, and 2nd houses relative to your natal Moon sign. Rather than a purely negative period, it functions as a phase of structural discipline and emotional grounding.

> 🔍 **Check Your Compatibility**: Evaluate planetary dynamics and Koota scores using our [Kundli Matching Tool](https://www.sanatantools.com/tools/kundli-matching) and explore potential mitigations with our [Dosha Analysis Engine](https://www.sanatantools.com/dosha).

---

## How to Read a Janam Kundli: A 4-Step Practical Framework

If you are looking at your newly generated birth chart, follow this systematic order of evaluation:

\`\`\`
  ┌─────────────────────────────────────────────────────────────┐
  │              STEP-BY-STEP CHART READING PROCESS             │
  │                                                             │
  │  [Step 1] Identify Lagna, Lagna Lord & House Placements     │
  │                             │                               │
  │                             ▼                               │
  │  [Step 2] Check Graha Dignities (Exalted/Debilitated) & Drishi│
  │                             │                               │
  │                             ▼                               │
  │  [Step 3] Identify Active Vimshottari Mahadasha / Antardasha│
  │                             │                               │
  │                             ▼                               │
  │  [Step 4] Cross-verify Real-Time Planetary Transits (Gochar)│
  └─────────────────────────────────────────────────────────────┘
\`\`\`

### Step 1: Identify the Ascendant (Lagna) and its Ruler
Look at House 1 (the top diamond in North Indian charts). Note the number written in that box:
* If the number is $1$, your Ascendant is Aries, ruled by Mars.
* If the number is $7$, your Ascendant is Libra, ruled by Venus.
Locate where the ruler of that sign is placed. The house occupied by your Lagna lord highlights your central focus in life.

### Step 2: Evaluate Planetary Strengths & Aspects (*Drishti*)
* Are planets placed in friendly, exaltation, or debilitation signs?
* Check planetary aspects: All planets cast a direct 7th house aspect ($180^\\circ$). Additionally, Saturn (3rd and 10th), Mars (4th and 8th), and Jupiter/Rahu/Ketu (5th and 9th) possess special planetary aspects (*Vishesh Drishti*).

### Step 3: Check Your Active Planetary Cycle (Dasha System)
A planet can only deliver its potential when its time arrives. The 120-year **Vimshottari Dasha system** designates which planet’s energetic influence is currently active.
* Calculate your exact active periods using our [Vimshottari Dasha Calculator](https://www.sanatantools.com/tools/dasha-calculator).

### Step 4: Overlay Current Transits (*Gochar*)
While the birth chart is your static natal blueprint, planets continue moving in real time. Major slow-moving planets (Jupiter, Saturn, Rahu, and Ketu) activate natal chart potentials when they transit key houses or natal planets.
* Monitor real-time celestial events with the [Daily Panchang & Planetary Ephemeris](https://www.sanatantools.com/panchang).

---

## Common Misconceptions in Kundli Interpretation

1. **"Debilitated Planets are Always Harmful"**:
   Debilitation often brings humility, adaptability, or specialized non-traditional achievements. Furthermore, classical rules of cancellation (*Neechbhanga Raja Yoga*) can transform a debilitated planet into a potent asset over time.
2. **"Astrology Determines Everything with Rigid Fatalism"**:
   Classical Vedic philosophy classifies Karma into four layers: *Sanchita* (accumulated), *Prarabdha* (allotted for this life), *Kriyamana* (current conscious action/free will), and *Agami* (future intentions). A Kundli maps the terrain (*Prarabdha*), but conscious effort and ethical choices (*Kriyamana*) determine how you navigate it.
3. **"Expensive Gemstones are Mandatory for Overcoming Hardships"**:
   Classical texts emphasize *Sadhana* (spiritual practice), self-discipline, charity (*Dāna*), and psychological awareness far above commercial remedies.

---

## Frequently Asked Questions (FAQs)

### Can a Janam Kundli be generated without an accurate birth time?
An approximate birth chart can be cast for the day (a *Surya Kundli* or *Chandra Kundli*), but precise house cusps (*Bhavas*) and divisional charts (*Vargas*) require an exact time of birth. If the time is approximate within a window of a few hours, professional astrologers use birth time rectification techniques.

### What is the difference between D1 (Rashi Chart) and D9 (Navamsha Chart)?
The **D1 Chart** is the primary map of your physical, external life circumstances. The **D9 (Navamsha)** is a microscopic division (1/9th part of each sign) that reveals the underlying strength of planets, marital compatibility, and spiritual maturity after the age of 30–35.

### What should I do if my chart shows a challenging Dosha?
Challenging configurations reflect areas demanding self-discipline and mindful growth. Rather than approaching them with anxiety, recognize them as areas requiring conscious focus—such as improving communication during relationship conflicts or cultivating financial discipline.

---

## Interactive Vedic Astrology Suite on SanatanTools

Deepen your astronomical and astrological understanding with our dedicated suite of calculation tools:

* 📊 **[Free Janam Kundli Generator](https://www.sanatantools.com/kundli)**: Generate North, South, and East Indian birth charts with complete divisional charts.
* 🌌 **[Moon Sign (Rashi) Calculator](https://www.sanatantools.com/tools/rashi-calculator)**: Find your exact Vedic Moon sign and element.
* 🌟 **[Nakshatra Finder](https://www.sanatantools.com/tools/nakshatra-finder)**: Discover your birth star, deity, and lunar characteristics.
* ⏳ **[Vimshottari Dasha Engine](https://www.sanatantools.com/tools/dasha-calculator)**: View your full timeline of Mahadasha, Antardasha, and Pratyantardasha cycles.
* 💍 **[Kundli Milan & Gun Milan Calculator](https://www.sanatantools.com/tools/kundli-matching)**: Perform traditional 36-Guna matching for marriage compatibility.
* 📅 **[Daily Vedic Panchang](https://www.sanatantools.com/panchang)**: Access accurate Tithi, Nakshatra, Yoga, Karana, and auspicious timings (*Muhurta*).
`,
  },
  {
    slug: "kundli-matching-36-guna-milan-guide",
    title: "Kundli Matching: Complete Guide to 36 Guna Milan & Vedic Horoscope Compatibility",
    excerpt:
      "Learn what Kundli Matching (Kundli Milan) is, how the 36 Guna Ashta Koota system works, scoring rules, Mangal Dosha cancellations, and real marriage compatibility.",
    category: "ASTROLOGY",
    tags: ["Kundli Matching", "Gun Milan", "36 Gunas", "Marriage Compatibility", "Mangal Dosha", "Vedic Astrology"],
    featured_image: "/blog/kundli-guide.jpg",
    published_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-09-15T00:00:00.000Z",
    lang: "en",
    seo: {
      meta_title: "Kundli Matching (Kundli Milan): Complete Guide to 36 Guna Milan for Marriage",
      meta_description:
        "Learn what Kundli Matching is, how the 36 Guna Ashta Koota system works, scoring rules, Mangal Dosha cancellations, and real marriage compatibility.",
      canonical: "https://www.sanatantools.com/blog/kundli-matching-36-guna-milan-guide",
      og_type: "article",
    },
    content_md: `> **Quick Answer (Summary)**
> **Kundli Matching** (also known as *Kundli Milan* or *Patrika Milan*) is the Vedic astrological method of assessing long-term marital harmony between two prospective partners. Rooted in the **Ashta Koota system**, it analyzes **8 distinct dimensions of compatibility** worth a total of **36 Gunas (points)** based on the birth Moon's constellation (*Nakshatra*) and sign (*Rashi*). A minimum of **18 Gunas** is traditionally required for an acceptable match, while comprehensive analysis also checks Mars placement (*Mangal Dosha*), the 7th house, and divisional charts (*Navamsha*).

---

## Why Kundli Matching Matters: Beyond Mere Superstition

In traditional Vedic culture, marriage (*Vivaha*) is regarded not merely as a social contract between two individuals, but as a lifelong spiritual and karmic union (*Samskara*) linking two family lineages.

\`\`\`
       [Partner 1 Birth Chart]                 [Partner 2 Birth Chart]
       (Moon, Nakshatra, Lagna)                (Moon, Nakshatra, Lagna)
                  │                                       │
                  └───────────────────┬───────────────────┘
                                      ▼
                         [ASHTA KOOTA MILAN (36 GUNAS)]
                         ├─ 1. Varna (1 pt)  - Ego & Work
                         ├─ 2. Vashya (2 pt) - Attraction & Dominance
                         ├─ 3. Tara (3 pt)   - Destiny & Longevity
                         ├─ 4. Yoni (4 pt)   - Biological Intimacy
                         ├─ 5. Maitri (5 pt) - Mental Harmony
                         ├─ 6. Gana (6 pt)   - Temperament
                         ├─ 7. Bhakoot (7 pt)- Emotional Resonance
                         └─ 8. Nadi (8 pt)   - Genetic & Health Balance
                                      │
                                      ▼
                          [TOTAL COMPATIBILITY SCORE]
\`\`\`

Kundli matching evaluates biological, psychological, emotional, and spiritual dynamics before commitments are finalized. It helps couples identify natural areas of effortless alignment as well as friction points that require mutual patience and maturity.

> 💍 **Calculate Instantly**: Check your 36 Guna score and detailed Koota breakdown with our [Free Kundli Matching Tool](https://www.sanatantools.com/tools/kundli-matching).

---

## The Ashta Koota Framework: The 8 Pillars of 36 Guna Milan

The word *Ashta* means eight, and *Koota* means categories or dimensions. The system allocates 36 total points across 8 distinct physiological and behavioral parameters:

\`\`\`
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 ASHTA KOOTA WEIGHTAGE DISTRIBUTION                     │
  │                                                                        │
  │  Nadi (8 pts)        ████████████████ (22.2%)                          │
  │  Bhakoot (7 pts)     ██████████████ (19.4%)                            │
  │  Gana (6 pts)        ████████████ (16.7%)                              │
  │  Graha Maitri (5 pts)██████████ (13.9%)                                │
  │  Yoni (4 pts)        ████████ (11.1%)                                  │
  │  Tara (3 pts)        ██████ (8.3%)                                     │
  │  Vashya (2 pts)      ████ (5.6%)                                       │
  │  Varna (1 pt)        ██ (2.8%)                                         │
  └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

### 1. Varna Koota (1 Point) — Ego & Spiritual Compatibility
* **What It Measures**: Spiritual hierarchy, work tendencies, and subconscious ego alignment.
* **The 4 Varnas**: Brahmin (Water signs), Kshatriya (Fire signs), Vaishya (Earth signs), and Shudra (Air signs).
* **Scoring Rule**: Traditionally, when the groom's Varna is equal to or higher than the bride's, 1 full point is awarded; otherwise, 0 points.

---

### 2. Vashya Koota (2 Points) — Mutual Attraction & Power Dynamics
* **What It Measures**: Magnetic attraction, balance of influence, and mutual respect within the relationship.
* **The 5 Classifications**:
  1. *Chatushpada* (Quadruped / 4-legged animals: Aries, Taurus, 2nd half of Sagittarius, 1st half of Capricorn)
  2. *Dwipada / Manava* (Human: Gemini, Virgo, Libra, 1st half of Sagittarius, Aquarius)
  3. *Jalachara* (Water-dwellers: Cancer, Pisces, 2nd half of Capricorn)
  4. *Vanachara* (Wild predators: Leo)
  5. *Keeta* (Insects: Scorpio)
* **Scoring Rule**: Compatible pairs receive 2 points; neutral pairs receive 1 point; hostile pairs receive 0 points.

---

### 3. Tara Koota (3 Points) — Destiny, Health & Lunar Well-being
* **What It Measures**: Karmic destiny, mutual health vibrations, and psychological well-being.
* **Calculation**: Calculated by counting the distance from the bride's Janma Nakshatra to the groom's (and vice-versa), then dividing by 9.
* **The 9 Taras**: Janma (Danger), Sampat (Wealth), Vipat (Obstacles), Kshem (Well-being), Pratyak (Opposition), Sadhana (Success), Naidhana (Destruction), Mitra (Friend), Parama Mitra (Best Friend).
* **Scoring Rule**: If both counts fall into auspicious Taras, 3 full points are scored.

---

### 4. Yoni Koota (4 Points) — Physical & Biological Intimacy
* **What It Measures**: Sexual compatibility, instinctual nature, biological attraction, and animal archetypes assigned to each of the 27 Nakshatras.
* **The 14 Yoni Archetypes**:
  * Horse (*Ashwa*), Elephant (*Gaja*), Sheep (*Mesha*), Serpent (*Sarpa*), Dog (*Shwan*), Cat (*Marjara*), Rat (*Mushaka*), Cow (*Gau*), Buffalo (*Mahisha*), Tiger (*Vyaghra*), Deer (*Mriga*), Monkey (*Vanara*), Mongoose (*Nakula*), Lion (*Simha*).

\`\`\`
   ┌──────────────────────────────────────────────────────────────┐
   │                   NATURAL YONI ENMITIES                      │
   │                                                              │
   │   Horse ◄──► Buffalo             Cat ◄──► Rat                │
   │   Elephant ◄──► Lion             Dog ◄──► Deer               │
   │   Cow ◄──► Tiger                 Monkey ◄──► Sheep           │
   │   Serpent ◄──► Mongoose (Sworn Enmity - 0 Points)            │
   └──────────────────────────────────────────────────────────────┘
\`\`\`

* **Scoring Rule**: Same Yoni yields 4 points; friendly yields 3; neutral yields 2; non-hostile yields 1; sworn enemy pairs yield 0 points.

---

### 5. Graha Maitri Koota (5 Points) — Mental & Intellectual Harmony
* **What It Measures**: Psychological friendship, intellectual understanding, communication style, and worldview based on the planetary lords of the Moon signs (*Rashi Lords*).
* **Planetary Relationships**:
  * **Natural Friends**: Sun, Moon, Mars, Jupiter.
  * **Natural Friends**: Mercury, Venus, Saturn.
* **Scoring Rule**:
  * Both lords mutual friends: **5 Points**
  * One friend, one neutral: **4 Points**
  * Both neutral: **3 Points**
  * One friend, one enemy: **1 Point**
  * Both mutual enemies: **0 Points**

---

### 6. Gana Koota (6 Points) — Temperament & Behavioral Rhythm
* **What It Measures**: Fundamental personality archetypes and behavioral dispositions.
* **The 3 Ganas**:
  1. **Deva Gana (Divine)**: Gentle, patient, ethical, calm, philosophical.
  2. **Manushya Gana (Human)**: Ambitious, practical, emotional, hardworking.
  3. **Rakshasa Gana (Dominant/Dynamic)**: Strong-willed, highly intuitive, protective, assertive, independent.
* **Scoring Rule**:
  * Same Gana: **6 Points**
  * Deva + Manushya: **5–6 Points**
  * Deva + Rakshasa: **1 Point** (needs careful temperamental balance)
  * Manushya + Rakshasa: **0 Points** (*Gana Dosha*)

---

### 7. Bhakoot Koota (7 Points) — Emotional Resonance & Family Welfare
* **What It Measures**: Long-term emotional bond, financial prosperity, family happiness, and life longevity.
* **Calculation**: Analyzes the relative house placement of both Moon signs ($1/1, 1/7, 2/12, 3/11, 4/10, 5/9, 6/8$).
* **Bhakoot Dosha Combinations**:
  * **Shadashtaka ($6/8$ axis)**: Traditionally associated with disputes or health stressors.
  * **Dwirdwadasha ($2/12$ axis)**: Associated with financial imbalances or divergent priorities.
  * **Navapanchama ($5/9$ axis)**: Generally auspicious for philosophical alignment, though classical texts examine child-birth factors.
* **Cancellations (*Bhakoot Dosha Parihara*)**: If both Moon signs share the same planetary ruler (e.g., Aries and Scorpio ruled by Mars) or are mutual friends, the Dosha is largely neutralized.

---

### 8. Nadi Koota (8 Points) — Genetic, Physiological & Progeny Balance
* **What It Measures**: Biological energy, hereditary health, nervous system constitution (Ayurvedic Tridoshas), and genetic compatibility for healthy offspring.
* **The 3 Nadis**:
  1. **Aadi Nadi (Vata / Wind)**: Governing movement and nervous impulses.
  2. **Madhya Nadi (Pitta / Fire)**: Governing metabolic digestion and vitality.
  3. **Antya Nadi (Kapha / Water & Earth)**: Governing physical structure and fluids.

\`\`\`
                  BRIDE NADI vs. GROOM NADI
   ┌───────────────┬───────────────┬───────────────┐
   │   Aadi Nadi   │  Madhya Nadi  │  Antya Nadi   │
   ├───────────────┼───────────────┼───────────────┤
   │ Same = 0 pts  │ Diff = 8 pts  │ Diff = 8 pts  │
   │ (Nadi Dosha)  │ (Full Points) │ (Full Points) │
   └───────────────┴───────────────┴───────────────┘
\`\`\`

* **Scoring Rule**: If bride and groom belong to **different Nadis**, the full **8 points** are awarded. If they share the **same Nadi**, 0 points are given, forming **Nadi Dosha**.
* **Nadi Dosha Exceptions**: Nadi Dosha is cancelled if both partners share the same Nakshatra but have different Charans (quarters), or share the same Rashi with different Nakshatras.

---

## 36 Guna Milan Score Interpretation Matrix

| Total Guna Score | Classical Category | Practical Interpretation & Guidance |
| :--- | :--- | :--- |
| **0 to 17 Points** | *Asamarth* (Inauspicious) | Significant divergence in temperaments, communication, or physiological energy. Detailed manual chart analysis by an experienced astrologer is strongly recommended before proceeding. |
| **18 to 24 Points** | *Madhyam* (Acceptable / Average) | Solid foundational compatibility. The couple can enjoy a stable, fulfilling marriage with mutual understanding, patience, and realistic expectations. |
| **25 to 32 Points** | *Uttam* (Very Good / Auspicious) | Strong emotional, mental, and physical resonance. High degree of natural alignment in goals, family life, and lifestyle habits. |
| **33 to 36 Points** | *Sarvottam* (Exceptional / Rare) | Extraordinary cosmic synergy. Rare match where mind, values, and biological energies complement each other effortlessly. |

---

## Beyond 36 Gunas: 5 Critical Factors That Astrologers Must Check

Many people make the mistake of assuming that a high 36 Guna score alone guarantees marital success. In classical Jyotisha, Guna Milan accounts for **only about 50% of the total compatibility evaluation**. An authentic assessment must examine five additional chart components:

\`\`\`
                          COMPREHENSIVE HOROSCOPE MATCHING
         ┌───────────────────────────────┴───────────────────────────────┐
         ▼                                                               ▼
   36 Guna Milan                                            Comprehensive Natal Chart Audit
   (Ashta Koota - 50%)                                      (Planetary Positions - 50%)
                                                            ├─ 1. Mangal Dosha (Mars)
                                                            ├─ 2. 7th House & 7th Lord (D1)
                                                            ├─ 3. Navamsha Chart (D9)
                                                            ├─ 4. Venus & Jupiter Dignity
                                                            └─ 5. Vimshottari Dasha Overlap
\`\`\`

### 1. Mangal Dosha (Kuja Dosha) Analysis
Mars (*Mangal*) represents ambition, passion, and assertiveness. When placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon, or Venus, it creates **Mangal Dosha**.
* If both partners have Mangal Dosha in comparable intensity, the fiery energies balance each other out.
* Numerous classical exceptions (such as Mars in Capricorn, Leo, or conjunct Jupiter) mitigate the Dosha.
* *Check your chart placements with our [Dosha Analysis Engine](https://www.sanatantools.com/dosha).*

### 2. The 7th House and 7th Lord (*Kalatra Bhava*)
The 7th house in the birth chart (*D1*) represents marriage and long-term partnerships. Astrologers inspect:
* Is the 7th house influenced by natural benefics (Jupiter, Venus) or under heavy malefic afflictions (Rahu, Saturn)?
* Where is the 7th lord positioned, and is it exalted or debilitated?

### 3. The Navamsha Chart (D9 Divisional Chart)
While the D1 chart reveals the physical reality, the **D9 Navamsha chart** reveals the soul-level strength of planets after marriage. A weak planet in D1 that gains dignity in D9 (*Vargottama*) produces auspicious long-term outcomes.

### 4. Natural Significators of Marriage (*Karakas*)
* **For Men**: The placement, dignity, and aspects on **Venus (*Shukra*)** indicate the nature and health of the spouse.
* **For Women**: The placement and dignity of **Jupiter (*Guru*)** and **Mars (*Mangal*)** indicate husband and relationship harmony.

### 5. Vimshottari Dasha Synchronization
If both partners simultaneously enter difficult planetary periods (such as a harsh Rahu Mahadasha or adverse Dasha Sandhi), marital stress may peak at the same time. Balanced dashas ensure one partner remains grounded while the other traverses demanding life transitions.
* *Analyze your upcoming cycles with the [Vimshottari Dasha Engine](https://www.sanatantools.com/tools/dasha-calculator).*

---

## Step-by-Step: How to Perform Kundli Matching Online

\`\`\`
  ┌─────────────────────────────────────────────────────────────┐
  │                 KUNDLI MATCHING STEP-BY-STEP                │
  │                                                             │
  │  [Step 1] Enter Bride's exact DOB, Time & Birth City        │
  │                             │                               │
  │                             ▼                               │
  │  [Step 2] Enter Groom's exact DOB, Time & Birth City        │
  │                             │                               │
  │                             ▼                               │
  │  [Step 3] Calculate 8 Kootas & 36 Guna Score                │
  │                             │                               │
  │                             ▼                               │
  │  [Step 4] Review Mangal Dosha & Koota-level Recommendations │
  └─────────────────────────────────────────────────────────────┘
\`\`\`

1. Navigate to the **[SanatanTools Kundli Matching Tool](https://www.sanatantools.com/tools/kundli-matching)**.
2. Enter the **exact birth details** (Date, Time, and City) for both partners.
3. Review your **Ashta Koota breakdown table** showing individual scores for Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, and Nadi.
4. Check the **Mangal Dosha verification box** to confirm whether Kuja Dosha is present or neutralized.
5. Download or print your free, comprehensive PDF compatibility report.

---

## Common Misconceptions About Kundli Milan

1. **"A 36/36 Score Guarantees a Problem-Free Marriage"**:
   Even with a 36/36 score, mutual communication, shared ethical values, and conscious effort are required to sustain a healthy partnership.
2. **"Low Gunas Mean Immediate Breakup"**:
   Scores between 14 and 17 often have strong planetary mitigations in individual charts (such as powerful 7th houses, strong Jupiter aspects, or high love compatibility).
3. **"Nadi Dosha Always Leads to Calamity"**:
   More than 80% of Nadi Dosha instances have classical cancellation conditions (*Nadi Dosha Nivaran*), especially when Nakshatra quarters (*Padas*) differ.

---

## Frequently Asked Questions (FAQs)

### What is the minimum passing score in 36 Guna Milan?
The traditional threshold for an acceptable match is **18 out of 36 Gunas**. Matches scoring 18 to 24 are considered average, while scores of 25 and above are considered highly auspicious.

### Can Kundli Matching be done using names alone?
Name-based matching (*Naam Rashi Milan*) is an approximate fallback used when exact birth times are unknown. However, because names may not correspond to the actual astronomical birth Nakshatra, **date and time-based matching (*Janma Kundli Milan*) is far more accurate and reliable**.

### What happens if there is a Mangal Dosha mismatch?
If one partner has Mangal Dosha and the other does not, classical astrologers look for cancelling factors—such as Mars placed in its own sign, aspected by Jupiter, or neutral placements in the Navamsha (D9) chart.

---

## Complementary Astrology Tools on SanatanTools

* 💍 **[Kundli Matching & Gun Milan Tool](https://www.sanatantools.com/tools/kundli-matching)**: Complete 36 Guna and Mangal Dosha calculator.
* 📊 **[Free Janam Kundli Generator](https://www.sanatantools.com/kundli)**: Generate full D1, D9, and divisional birth charts.
* 🌟 **[Nakshatra Finder](https://www.sanatantools.com/tools/nakshatra-finder)**: Find your birth star, deity, and Yoni animal archetype.
* 🌌 **[Moon Sign (Rashi) Calculator](https://www.sanatantools.com/tools/rashi-calculator)**: Find your exact Vedic Moon sign and element.
* ⏳ **[Vimshottari Dasha Engine](https://www.sanatantools.com/tools/dasha-calculator)**: Analyze current and upcoming planetary life periods.
* 📅 **[Daily Vedic Panchang](https://www.sanatantools.com/panchang)**: Check daily Tithi, Nakshatra, and auspicious Muhurtas.
`,
  },
  {
    slug: "diwali-2026-date-lakshmi-puja-muhurat-guide",
    title: "Diwali 2026: Date, Lakshmi Puja Muhurat, 5-Day Festival Guide & Puja Vidhi",
    excerpt: "Diwali 2026 falls on Sunday, November 8. Get the exact Lakshmi Puja muhurat for your city, the full 5-day festival calendar, puja vidhi, samagri checklist, and the significance behind the festival of lights.",
    category: "FESTIVALS",
    tags: ["Diwali", "Lakshmi Puja", "Muhurat", "Dhanteras", "Bhai Dooj", "Puja Vidhi", "Festivals 2026"],
    featured_image: "/blog/diwali-2026.jpg",
    published_at: "2026-10-06T00:00:00.000Z",
    updated_at: "2026-10-06T00:00:00.000Z",
    lang: "en",
    seo: {
      meta_title: "Diwali 2026 Date, Lakshmi Puja Muhurat & 5-Day Guide | SanatanTools",
      meta_description: "Diwali 2026 is on Sunday, November 8. Find city-wise Lakshmi Puja muhurat timings, the 5-day Diwali calendar, puja vidhi, samagri list and FAQs.",
      canonical: "https://www.sanatantools.com/blog/diwali-2026-date-lakshmi-puja-muhurat-guide",
      og_type: "article",
    },
    content_md: `> **Quick Answer (Summary)**
> **Diwali 2026** — the main **Lakshmi Puja** — falls on **Sunday, November 8, 2026**, on the night of *Kartik Amavasya*. The most auspicious window for the puja is the **Pradosh Kaal** in the evening, roughly **6:00 PM to 8:30 PM** (exact timings shift 30–60 minutes by city — see the city-wise table below). The five-day festival runs from **Dhanteras (Nov 6)** to **Bhai Dooj (Nov 11)**.

## Diwali 2026: The Five-Day Festival Calendar

Diwali is not a single day — it is a five-day celebration, each day with its own deity, legend and ritual. Here are the dates for 2026 (as per *Drik Panchang*):

| Day | Festival | Date (2026) | Dedicated To |
|-----|----------|-------------|--------------|
| 1 | **Dhanteras** (Dhanatrayodashi) | Friday, Nov 6 | Dhanvantari, Lakshmi–Kubera; buying gold & utensils |
| 2 | **Naraka Chaturdashi** (Choti Diwali) | Saturday, Nov 7 | Krishna's victory over Narakasura |
| 3 | **Diwali — Lakshmi Puja** | Sunday, Nov 8 | Goddess Lakshmi & Lord Ganesha (Amavasya night) |
| 4 | **Govardhan Puja** | Tuesday, Nov 10 | Krishna lifting Govardhan Hill |
| 5 | **Bhai Dooj** | Wednesday, Nov 11 | The bond between brothers and sisters |

> **Regional note:** In South India, Naraka Chaturdashi (Nov 7) is treated as the *main* celebration day, while North India centres on Lakshmi Puja (Nov 8). In North India, Choti Diwali is often observed on the morning of Diwali itself. A small number of regional *panchangs* may shift Govardhan Puja / Bhai Dooj by a day — when in doubt, follow your local *panchang*.

## Lakshmi Puja Muhurat 2026 (City-Wise)

The scriptures prescribe performing Lakshmi Puja during **Pradosh Kaal** (the ~2.5 hours after sunset) on Amavasya night — ideally when the stable **Vrishabha (Taurus) Lagna** is rising, since a fixed (*sthira*) lagna is believed to keep Goddess Lakshmi steady in the home.

*Amavasya Tithi: begins ~11:27 AM on Nov 8, ends ~12:31 PM on Nov 9 (IST).*

| City | Lakshmi Puja Muhurat (Nov 8) |
|------|------------------------------|
| New Delhi | 5:54 PM – 7:50 PM |
| Mumbai | 6:27 PM – 8:27 PM |
| Kolkata | 5:20 PM – 7:18 PM |
| Chennai | 6:07 PM – 8:09 PM |
| Bengaluru | 6:17 PM – 8:20 PM |
| Hyderabad | 6:07 PM – 8:08 PM |
| Ahmedabad | 6:22 PM – 8:20 PM |
| Pune | 6:24 PM – 8:24 PM |
| Jaipur | 6:03 PM – 7:59 PM |

*Timings: Drik Panchang (Pradosh Kaal + Vrishabha Lagna overlap). Your exact window moves with latitude — use SanatanTools' [Muhurat Finder](/tools/muhurat-finder) for your city's precise timing.*

### Why Pradosh Kaal?

*Muhurat* is not superstition — it is applied astronomy. Pradosh Kaal begins at sunset, when the day's solar energy settles and the lunar (*Amavasya*) energy peaks. Performing the puja in this window, especially under the fixed Vrishabha Lagna, is the classical prescription found across *panchang* traditions. The *Mahanishita Kaal* (late-night) muhurat is a secondary option for those who miss the evening.

## Significance: Why We Celebrate Diwali

Diwali's light carries many stories, layered over millennia:

- **Rama's return to Ayodhya** — after 14 years of exile and the victory over Ravana, the people of Ayodhya lit rows (*avali*) of lamps (*dipa*) to welcome him. *Deepavali* literally means "a row of lights."
- **Samudra Manthan** — Goddess Lakshmi emerged from the churning of the cosmic ocean on this Amavasya, which is why she is the festival's presiding deity.
- **Krishna and Narakasura** — Naraka Chaturdashi commemorates Krishna (with Satyabhama) slaying the demon Narakasura, freeing 16,000 captives — the triumph of light over darkness in its most literal telling.
- **Mahavira's Nirvana** — Jains mark Diwali as the night Lord Mahavira attained *moksha*.
- **Bandi Chhor Divas** — Sikhs celebrate Guru Hargobind Ji's release from Gwalior Fort on this day.

## Lakshmi-Ganesha Puja Vidhi (Step by Step)

A complete traditional puja follows the *Shodashopachara* (sixteen offerings). Here is a practical home version:

1. **Clean and decorate** — clean the home, draw a *rangoli* at the entrance (lotus for Lakshmi, small footprints leading inward to invite her in).
2. **Set the altar** — place idols or images of Lakshmi, Ganesha and Saraswati on a raised platform draped in red cloth, facing east or north.
3. **Kalash sthapana** — fill a *kalash* with water, mango leaves and a coconut; it represents divine presence.
4. **Sankalp** — take a vow stating your name, *gotra* and purpose of the puja.
5. **Ganesha first** — every puja begins with Lord Ganesha, remover of obstacles: offer *durva*, red flowers and *modak*.
6. **Lakshmi pujan** — offer lotus or red flowers, *kumkum*, rice (*akshat*), sandalwood, incense and a ghee lamp. Place coins, jewellery or your account books before her and worship them as symbols of wealth.
7. **Naivedya & aarti** — offer sweets and fruits, then perform *aarti* with the whole family, ringing the bell.
8. **Light the diyas** — place lit diyas at the entrance, windows, *tulsi* plant and courtyard — an invitation for light and prosperity to enter.
9. **Prasad distribution** — share the offerings; elders bless the younger members.

## Puja Samagri Checklist

Idols/images of Lakshmi–Ganesha–Saraswati · red cloth · *kalash*, mango leaves, coconut · *Gangajal* · *panchamrit* (milk, curd, ghee, honey, sugar) · kumkum, turmeric, sandalwood paste · rice (*akshat*) · red lotus/flowers, garlands · *durva* grass · incense sticks, *dhoop*, camphor · ghee diyas and oil lamps · coins, jewellery, account books/ledger · sweets, fruits, *paan*, betel nuts · new broom (bought on Dhanteras) · bell and *aarti thali*.

## Dhanteras: The First Day

Dhanteras (Nov 6) honours **Dhanvantari**, the divine physician who emerged from the ocean with the pot of *amrita*. Tradition prescribes buying gold, silver or new utensils — and the humble broom — as an invitation to Lakshmi. Light a *Yama diya* (a lamp for Yama, lord of death) at the entrance in the evening for protection of the household.

## Govardhan Puja & Bhai Dooj

- **Govardhan Puja (Nov 10):** commemorates Krishna lifting Govardhan Hill to shelter Vrindavan from Indra's storm. Devotees build a small hill of cow dung or mud, decorate it, and offer *Annakut* — a mountain of food.
- **Bhai Dooj (Nov 11):** sisters apply *tilak* on their brothers' foreheads and pray for their long life; brothers give gifts and pledge protection. It mirrors the Yama–Yami legend of sibling devotion.

## Frequently Asked Questions

**What is the exact date of Diwali 2026?**
Sunday, November 8, 2026 — the night of Kartik Amavasya — is the main Lakshmi Puja date across most of India.

**What is the shubh muhurat for Lakshmi Puja 2026?**
The Pradosh Kaal window on Nov 8 evening, roughly 6:00–8:30 PM IST, overlapping Vrishabha Lagna. Exact timings vary by city (see table above).

**Why do some calendars show Diwali on November 7?**
South Indian tradition treats Naraka Chaturdashi (Nov 7) as the principal celebration rather than an error — both dates are correct within their traditions.

**Can I do Lakshmi Puja in the morning?**
The *shastra*-prescribed time is Pradosh Kaal after sunset. Morning *Choghadiya* muhurats (Shubha, Labha, Amrita) exist as a fallback, but the evening Amavasya window is ideal.

**What should I buy on Dhanteras?**
Gold, silver, new utensils — and traditionally a new broom, symbolising sweeping out poverty and inviting Lakshmi in.

---

*Planning the festival precisely? Check the [Daily Panchang](/panchang) for tithi and muhurat, or find your city's exact window with the [Muhurat Finder](/tools/muhurat-finder) on SanatanTools.*`,
  },
];
