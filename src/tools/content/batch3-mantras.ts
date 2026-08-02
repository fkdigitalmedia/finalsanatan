// ============================================================
// Global Tool Page Standard — Batch 3: Mantras (6 tools)
// ============================================================
import type { FlagshipContentSpec } from "./flagship";

export const BATCH3_MANTRAS: Record<string, FlagshipContentSpec> = {
  "mantra-library": {
    intro:
      "A curated library of authentic Sanskrit mantras — Vedic, Puranic and Tantric — with Devanagari text, IAST transliteration, meaning, benefit and recommended jaap count.",
    howToUse: [
      "Search by deity, purpose or Sanskrit word.",
      "Tap any mantra to open its full page with meaning and audio pronunciation guide.",
      "Copy the Devanagari or IAST text in one tap.",
      "Bookmark favourites to your dashboard for daily jaap.",
    ],
    benefits: [
      "Every mantra is sourced from a named shastra — no anonymous internet text.",
      "Devanagari + IAST + English meaning side-by-side.",
      "Recommended jaap counts (108, 1008, 125000) with vidhi notes.",
      "Filter by beej, stotra, kavach, ashtakam and sahasranam.",
    ],
    useCases: [
      "Building a personal daily jaap routine.",
      "Choosing the right mantra for a specific sankalpa (health, wealth, protection).",
      "Sanskrit students studying grammar via authentic verses.",
      "Purohits sharing a clean reference with their yajamans.",
    ],
    mistakes: [
      "Reading a mantra without knowing its rishi, chhanda and devata.",
      "Skipping viniyoga (statement of purpose) before serious anushthana.",
      "Chanting from a corrupted transliteration — swara errors shift the meaning.",
      "Ignoring the recommended count and stopping mid-sadhana.",
    ],
    accuracy:
      "Every mantra cross-checked against Rigveda Samhita, standard purana editions and lineage-published stotra collections.",
    privacy: "Bookmarks stay on your device unless you sign in to sync.",
    faqs: [
      {
        q: "Are the mantras verified from source?",
        a: "Yes — each mantra page cites the shastra (Rigveda mandala, purana chapter, tantra) it comes from.",
      },
      {
        q: "Do I need initiation for these mantras?",
        a: "Most public mantras (Gayatri, Mahamrityunjaya, Vishnu Sahasranama) can be chanted freely. Diksha mantras require guru initiation.",
      },
      {
        q: "Can I chant mantras in English transliteration?",
        a: "Yes for learning, but Devanagari with correct swara is the traditional standard.",
      },
      {
        q: "Which mantra should I start with?",
        a: "Gayatri or your ishta-devata beej mantra. The library has a 'Beginner set' preset.",
      },
      {
        q: "Is audio available?",
        a: "Text-only for now; audio pronunciation guides are on the roadmap.",
      },
    ],
    relatedSlugs: [
      "beej-mantras",
      "deity-mantras",
      "mantra-of-the-day",
      "gayatri-mantra",
      "mahamrityunjaya-mantra",
    ],
  },

  "beej-mantras": {
    intro:
      "The complete set of Tantric beej (seed) mantras — Om, Hreem, Shreem, Kleem, Krom, Aim, Dum, Gam and more — with deity, chakra and jaap purpose.",
    howToUse: [
      "Browse by deity or chakra to find the right beej.",
      "Read the meaning, deity and traditional purpose for each seed.",
      "Note the recommended jaap count and mala type.",
      "Combine two beejas (e.g. Hreem + Shreem) only if your guru has instructed.",
    ],
    benefits: [
      "Compact, high-vibration mantras — perfect for busy schedules.",
      "Each beej mapped to its deity, chakra and dominant intent.",
      "Includes viniyoga notes: when to chant, count, mala colour.",
      "Free reference — no ads on mantra pages.",
    ],
    useCases: [
      "Meditation practice — sustained repetition of a single beej.",
      "Puja — beej is the invocation seed for a longer stotra.",
      "Chakra sadhana — matching bija to chakra (Lam, Vam, Ram, Yam, Ham, Om).",
      "Kavach and yantra practice, where beej is written or worn.",
    ],
    mistakes: [
      "Combining beejas at random — traditional combinations are precise.",
      "Chanting powerful Tantric beejas without diksha (e.g. Krom, Kroum).",
      "Ignoring pronunciation of anusvara (ṁ) and visarga (ḥ).",
      "Using a rudraksha mala for Lakshmi beej — kamalgatta mala is prescribed.",
    ],
    formula: {
      title: "How beej mantras work",
      body: "A beej is a single-syllable phoneme (often ending in nasal ṁ) that condenses a deity's entire vibrational form. Repetition activates the corresponding shakti through resonance in the nadis and chakras.",
    },
    accuracy:
      "Beej-devata mappings verified against Mantra Mahodadhi, Shakta Pramoda and standard Tantra references.",
    privacy: "No personal data stored.",
    faqs: [
      {
        q: "Which beej is safest for beginners?",
        a: "Om — the pranava beej. Then Shreem for prosperity and Gam for Ganesha.",
      },
      {
        q: "Can I chant beej mantras aloud?",
        a: "Yes — vaikhari (spoken), upamshu (whispered) and manasika (mental) are all valid, with mental being the highest.",
      },
      {
        q: "How many rounds daily?",
        a: "Start with 1 mala (108). Serious anushthana works to 3, 11 or 108 malas.",
      },
      {
        q: "Do I need a specific direction?",
        a: "East for most deities; north for wisdom (Saraswati); south only for specific rituals.",
      },
      {
        q: "Are Krom, Kroum, Hleem safe without guru?",
        a: "No — these Tantric beejas require diksha; misuse can destabilise the sadhak.",
      },
    ],
    relatedSlugs: [
      "mantra-library",
      "deity-mantras",
      "gayatri-mantra",
      "mahamrityunjaya-mantra",
      "mantra-of-the-day",
    ],
  },

  "deity-mantras": {
    intro:
      "Deity-wise mantra collection — Ganesha, Shiva, Vishnu, Devi, Hanuman, Krishna, Rama, Lakshmi, Saraswati, Kali and more — with primary, gayatri and dhyana mantras for each.",
    howToUse: [
      "Pick your ishta devata from the deity list.",
      "See the primary mantra, deity-gayatri, dhyana shloka and one stotra.",
      "Read the meaning and traditional benefit for each.",
      "Copy or bookmark to a daily practice list.",
    ],
    benefits: [
      "One page per deity — primary, gayatri, dhyana and stotra together.",
      "Consistent format: Devanagari + IAST + meaning + jaap count.",
      "Includes lesser-known deity gayatris (Ganesha, Hanuman, Durga).",
      "Free — no login to read.",
    ],
    useCases: [
      "Daily ishta-devata jaap routine.",
      "Choosing the right mantra for a puja or vrat.",
      "Family sankalpa where each member chants their kul-devata mantra.",
      "Teaching children their first mantra by deity.",
    ],
    mistakes: [
      "Chanting the wrong gayatri version — many deities have multiple gayatris; we show the standard one.",
      "Mixing dhyana shloka with mool mantra — dhyana is for visualisation, mool for jaap.",
      "Using aggressive deity mantras (Kali, Bhairav) without guidance.",
      "Skipping the deity-specific mudra or offering.",
    ],
    accuracy:
      "Mantras cross-checked with Puranic sources (Ganesha Purana, Shiva Purana, Bhagavata) and standard published stotra ratnamalas.",
    privacy: "Fully client-side; nothing logged.",
    faqs: [
      {
        q: "What if I don't know my ishta-devata?",
        a: "Start with Ganesha — the universal beginning deity. Ishta clarity often follows regular practice.",
      },
      {
        q: "Is deity gayatri different from Vedic Gayatri?",
        a: "Yes — each deity has its own gayatri (24 syllables, tri-pada), separate from the Savitri Gayatri.",
      },
      {
        q: "Can I chant multiple deity mantras daily?",
        a: "Yes — many sadhaks chant a Ganesha, ishta and gurumantra sequence.",
      },
      {
        q: "Which mala for which deity?",
        a: "Rudraksha for Shiva/Hanuman, Tulsi for Vishnu/Krishna/Rama, Kamalgatta for Lakshmi, Sphatik for Saraswati/Devi.",
      },
      {
        q: "Are Kali/Bhairav mantras included?",
        a: "Public mantras are shown with a caution note recommending guru guidance.",
      },
    ],
    relatedSlugs: [
      "mantra-library",
      "beej-mantras",
      "gayatri-mantra",
      "mahamrityunjaya-mantra",
      "aarti-collection",
    ],
  },

  "mantra-of-the-day": {
    intro:
      "A hand-picked mantra for today — chosen using the day's tithi, nakshatra and weekday devata, with meaning, jaap count and benefit.",
    howToUse: [
      "Open the page — today's mantra loads with meaning and count.",
      "Read the 'why today' section — it explains the panchang trigger.",
      "Chant with the built-in jaap counter (108 by default).",
      "Come back tomorrow — the mantra rotates automatically.",
    ],
    benefits: [
      "Daily variety — never fatigue from the same mantra.",
      "Aligned with panchang — each day's ruling energy is honoured.",
      "Built-in counter — no separate app needed.",
      "Bookmarkable — perfect home-screen shortcut.",
    ],
    useCases: [
      "Building a 40-day discipline of 'whatever today gives me'.",
      "Introducing children to mantras with a new one daily.",
      "Sadhaks in between formal anushthana keeping the flame alive.",
      "WhatsApp-family shares — the mantra with meaning fits one message.",
    ],
    mistakes: [
      "Skipping the meaning — chanting without understanding weakens sankalpa.",
      "Rotating faster than daily — dilutes the day's energy.",
      "Ignoring the pronunciation guide for unfamiliar mantras.",
      "Treating it as entertainment — jaap deserves stillness.",
    ],
    formula: {
      title: "How today's mantra is chosen",
      body: "Weekday sets the deity (Sun/Mon/Tue/Wed/Thu/Fri/Sat = Surya/Chandra/Mangal/Budh/Guru/Shukra/Shani). Tithi and nakshatra refine the specific mantra — e.g. Chaturthi favours Ganesha, Ashwini nakshatra favours Ashwini Kumar shloka.",
    },
    accuracy:
      "Panchang inputs from the drik-precise engine; mantra database curated from named shastra sources.",
    privacy: "Jaap count kept in your browser only.",
    faqs: [
      {
        q: "Why did the mantra change mid-day?",
        a: "Tithi/nakshatra can change mid-day. If the panchang shifts, the mantra can shift too.",
      },
      {
        q: "Can I pin a favourite instead?",
        a: "Yes — bookmark any past mantra to your dashboard.",
      },
      {
        q: "How long should I chant?",
        a: "One mala (108) is the daily minimum. 3 or 11 malas for deeper practice.",
      },
      {
        q: "Is the counter accurate?",
        a: "Yes — it's a manual tap counter that saves progress even if the tab closes.",
      },
      {
        q: "Does the mantra repeat across years?",
        a: "Rotations are panchang-driven, so combinations repeat but rarely identically.",
      },
    ],
    relatedSlugs: [
      "mantra-library",
      "digital-jaap-counter",
      "gayatri-mantra",
      "mahamrityunjaya-mantra",
      "deity-mantras",
    ],
  },

  "gayatri-mantra": {
    intro:
      "The Gayatri Mantra — Rigveda 3.62.10 — with Devanagari, IAST, word-by-word meaning, viniyoga, sandhya-time guide and 108-count jaap counter.",
    howToUse: [
      "Read the mantra with word-by-word meaning first.",
      "Learn the correct swara (udatta, anudatta, svarita) using the pronunciation notes.",
      "Chant during sandhya (sunrise, noon or sunset) using the built-in counter.",
      "Bookmark for daily practice.",
    ],
    benefits: [
      "Complete Vedic text with correct chhanda (Gayatri, 24 syllables).",
      "Word-by-word meaning — no vague poetic translation.",
      "Sandhya time auto-shown for your city (from panchang).",
      "Integrated jaap counter (108 default).",
    ],
    useCases: [
      "Daily tri-sandhya (sunrise, noon, sunset) practice.",
      "Upanayana / brahmopadesha follow-up sadhana.",
      "Family recitation before children begin studies.",
      "108,000 anushthana over 40 days.",
    ],
    mistakes: [
      "Skipping the pranava (Om) and vyahritis (Bhur Bhuvah Svah) — they are integral, not optional.",
      "Chanting outside sandhya without a valid reason (permitted only for anushthana).",
      "Reading pluta swara flat — 'ta-t' has a specific tone.",
      "Mixing Vedic Gayatri with deity gayatris (Ganapati Gayatri etc.) — different mantras.",
    ],
    formula: {
      title: "Mantra structure",
      body: "Om (pranava) + Bhur Bhuvah Svah (3 vyahritis) + Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat (24-syllable Gayatri chhanda) + Om (closing). Rishi: Vishvamitra. Devata: Savita. Chhanda: Gayatri.",
    },
    accuracy:
      "Text verified against Rigveda Samhita 3.62.10 (Shakala shakha) with standard swara marks.",
    privacy: "Jaap counter is fully local; nothing is uploaded.",
    faqs: [
      {
        q: "Can women chant Gayatri?",
        a: "Yes — all major modern acharyas (Arya Samaj, Chinmaya, RKM, Sri Aurobindo) affirm this. Some traditional lineages still restrict; follow your guru.",
      },
      {
        q: "Is diksha required?",
        a: "For upanayana-eligible students, diksha is traditional. For open sadhana, most acharyas welcome sincere chanting.",
      },
      {
        q: "Which mala should I use?",
        a: "Sphatik (crystal) or tulsi. Rudraksha is also accepted.",
      },
      {
        q: "Best time to chant?",
        a: "The 3 sandhyas — sunrise, noon, sunset. Brahma Muhurat is highest merit.",
      },
      {
        q: "How is Gayatri different from Savitri?",
        a: "Gayatri is the chhanda (meter); Savitri is the devata. In common usage, 'Gayatri Mantra' means this Savitri hymn set in the Gayatri chhanda.",
      },
    ],
    relatedSlugs: [
      "mahamrityunjaya-mantra",
      "digital-jaap-counter",
      "mantra-library",
      "brahma-muhurat",
      "todays-sunrise",
    ],
  },

  "mahamrityunjaya-mantra": {
    intro:
      "The Mahamrityunjaya Mantra — Rigveda 7.59.12 — Shiva's Tryambakam hymn for healing and moksha, with Devanagari, IAST, word-by-word meaning, viniyoga and jaap counter.",
    howToUse: [
      "Read the mantra with word-by-word meaning to internalise the invocation.",
      "Learn the correct pronunciation of 'Sugandhim Pushtivardhanam' and 'Urvarukamiva'.",
      "Chant with the 108-count counter; anushthana works to 125,000 count.",
      "Bookmark for daily healing sadhana.",
    ],
    benefits: [
      "Rigvedic mantra — the highest healing mantra in the Vedic corpus.",
      "Word-by-word meaning explains bandhanan-mrityor-mukshiya precisely.",
      "Includes viniyoga: rishi, chhanda, devata and phala.",
      "Integrated counter with milestone alerts (108, 1008, 10008).",
    ],
    useCases: [
      "Daily 108-count for family health.",
      "Anushthana of 1.25 lakh count during illness or surgery recovery.",
      "Havan (Mrityunjaya Homa) with 1008 ahutis.",
      "Group parayana during a health crisis in the family.",
    ],
    mistakes: [
      "Chanting only 'Om Tryambakam' without completing the full mantra.",
      "Misreading 'Urvarukamiva Bandhanan' — key metaphor of a ripe cucumber releasing from its stem.",
      "Skipping the phala sankalpa (moksha, not just longevity).",
      "Using rudraksha with damaged mukhi — inspect the mala first.",
    ],
    formula: {
      title: "Mantra structure",
      body: "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam / Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat. Rishi: Vasishtha. Devata: Rudra. Chhanda: Anushtubh (32 syllables). Phala: freedom from mrityu (physical + spiritual bondage), not just longevity.",
    },
    accuracy:
      "Text verified against Rigveda Samhita 7.59.12 and Yajurveda parallels (Vajasaneyi Samhita 3.60).",
    privacy: "Jaap counter is fully local.",
    faqs: [
      {
        q: "Can anyone chant Mahamrityunjaya?",
        a: "Yes — it is an open Vedic mantra, though many take diksha from a guru for deeper anushthana.",
      },
      {
        q: "Is it only for illness?",
        a: "No — 'mrityu' means all bondage. It is a moksha mantra; healing is a byproduct.",
      },
      {
        q: "How many counts for a formal anushthana?",
        a: "1.25 lakh (125,000) is the classical purascharana count, often over 40 days.",
      },
      {
        q: "Best time to chant?",
        a: "Brahma Muhurat, Pradosh Kaal or during a Shiva vrat day (Somvar, Trayodashi, Shivaratri).",
      },
      { q: "Which mala is prescribed?", a: "Rudraksha — traditionally a 5-mukhi rudraksha mala." },
    ],
    relatedSlugs: [
      "gayatri-mantra",
      "digital-jaap-counter",
      "pradosh-vrat",
      "brahma-muhurat",
      "mantra-library",
    ],
  },
};
