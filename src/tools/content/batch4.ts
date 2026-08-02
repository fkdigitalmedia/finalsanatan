// ============================================================
// Global Tool Page Standard — Batch 4
// Temples (6) + Calculators remaining (5) + Sanskrit (7)
// ============================================================
import type { FlagshipContentSpec } from "./flagship";

export const BATCH4_CONTENT: Record<string, FlagshipContentSpec> = {
  // ─── Temples (6) ─────────────────────────────────────────
  "temple-directory": {
    intro:
      "A searchable directory of major Hindu temples across India — with deity, location, timings, dress code and pilgrimage tips for each.",
    howToUse: [
      "Search by temple name, deity, city or state.",
      "Filter by deity — Shiva, Vishnu, Devi, Ganesha, Hanuman, Surya.",
      "Open a temple page for timings, entry rules and how to reach.",
      "Bookmark temples to plan a future yatra.",
    ],
    benefits: [
      "Curated — only shastra-recognised and historically significant temples.",
      "Includes dress code, camera rules and darshan queue tips.",
      "How-to-reach with nearest airport, railway and road route.",
      "Deity-wise browsing for pilgrimage planning.",
    ],
    useCases: [
      "Planning a family yatra to 12 Jyotirlingas or 4 Dhams.",
      "Researching a temple before an unexpected work trip.",
      "Choosing the right temple for a specific deity's darshan.",
      "Compiling a bucket-list of ancient shrines.",
    ],
    mistakes: [
      "Assuming all Shiva temples have Sanctum-sanctorum access — many restrict non-Hindus or require dress code.",
      "Skipping local dress rules (mundu for males, saree for females at some south temples).",
      "Ignoring seasonal closures (Kedarnath, Yamunotri close for winter).",
      "Turning up on a special abhishekam day without a booking.",
    ],
    accuracy:
      "Timings and rules cross-referenced with official temple boards and pilgrim resources; verified quarterly.",
    privacy: "Bookmarks stay on-device unless you sign in to sync.",
    faqs: [
      {
        q: "How often is data updated?",
        a: "Quarterly for timings; ad-hoc for festival day updates and closures.",
      },
      {
        q: "Are non-Hindus allowed?",
        a: "Varies — we mark restrictions on each temple page (e.g. Jagannath Puri sanctum, Guruvayur, Padmanabhaswamy).",
      },
      {
        q: "Do you list temples abroad?",
        a: "Currently India-only; global listings are on the roadmap.",
      },
      {
        q: "Can I contribute a temple?",
        a: "Yes — email us via the contact page; verified entries are added monthly.",
      },
      {
        q: "Do you show live queue times?",
        a: "Not yet — we show typical wait patterns; live TTD/Vaishno Devi queues are planned.",
      },
    ],
    relatedSlugs: [
      "darshan-timings",
      "char-dham-planner",
      "jyotirlinga-guide",
      "shakti-peeth-guide",
      "nearby-temples",
    ],
  },

  "darshan-timings": {
    intro:
      "Darshan and aarti timings for major temples — morning open, madhyanha bhog, evening aarti, shayan bhog and special abhishekam windows.",
    howToUse: [
      "Search the temple by name or city.",
      "See today's darshan windows and next aarti countdown.",
      "Note special day changes (Ekadashi, Purnima, festivals).",
      "Bookmark for repeat visits.",
    ],
    benefits: [
      "One-glance daily aarti schedule for major temples.",
      "Countdown to the next aarti/bhog.",
      "Highlights festival-day shifts in timing.",
      "Free and updated regularly.",
    ],
    useCases: [
      "Planning a temple visit around aarti time.",
      "Coordinating group darshan for elderly family members.",
      "Choosing a bhog time for offering.",
      "Timing a visit to avoid the mid-day break.",
    ],
    mistakes: [
      "Reaching during the daily mangala break (many temples close 12–4 PM).",
      "Missing the special abhishekam window on Somvar or Pradosh.",
      "Ignoring festival timing changes.",
      "Wearing footwear beyond the outer prakara.",
    ],
    accuracy: "Timings sourced from temple boards and cross-checked with pilgrim reports.",
    privacy: "No data collected; bookmarks stored locally.",
    faqs: [
      {
        q: "Do timings change on festivals?",
        a: "Yes — Shivaratri, Janmashtami, Navratri and temple-founding days shift schedules significantly.",
      },
      {
        q: "Is prasad included in the aarti time?",
        a: "Prasad distribution usually starts 15–30 minutes after the aarti ends.",
      },
      {
        q: "Can I do sponsored puja?",
        a: "Yes at most large temples — sponsored slots have their own timing shown separately.",
      },
      {
        q: "What about VIP darshan?",
        a: "Marked separately where available (TTD, Shirdi, Vaishno Devi).",
      },
      {
        q: "Are night darshans available?",
        a: "A few temples (Kashi Vishwanath, Somnath) have late-night sessions listed.",
      },
    ],
    relatedSlugs: [
      "temple-directory",
      "nearby-temples",
      "char-dham-planner",
      "jyotirlinga-guide",
      "aarti-collection",
    ],
  },

  "char-dham-planner": {
    intro:
      "A step-by-step planner for Char Dham Yatra — Yamunotri, Gangotri, Kedarnath and Badrinath — with route, best months, altitude notes and booking tips.",
    howToUse: [
      "Pick your start city and preferred month.",
      "See the optimal 10–12 day itinerary with daily stops.",
      "Note altitude, weather and physical prep tips.",
      "Follow the booking checklist for helicopter, hotels and biometric registration.",
    ],
    benefits: [
      "Full 10–12 day itinerary sorted by traditional yatra order.",
      "Altitude and weather warnings to plan acclimatisation.",
      "Registration and helicopter booking links.",
      "Vegetarian food and dharamshala shortlist per stop.",
    ],
    useCases: [
      "First-time Char Dham yatri planning a family trip.",
      "Elderly-friendly itinerary with helicopter options.",
      "Do-Dham (Kedarnath + Badrinath) short version.",
      "Chota Char Dham vs Bada Char Dham decision.",
    ],
    mistakes: [
      "Attempting Char Dham without biometric registration (mandatory since 2022).",
      "Ignoring high-altitude acclimatisation — Kedarnath is at 3,583 m.",
      "Travelling in July–August peak monsoon (landslide risk).",
      "Booking helicopter without weather buffer days.",
    ],
    accuracy:
      "Route, altitudes and booking rules aligned with Uttarakhand Tourism 2025–26 guidelines.",
    privacy: "Itinerary saved to your device only.",
    faqs: [
      {
        q: "When do Char Dham temples open and close?",
        a: "Late April/early May (Akshaya Tritiya area) to Diwali/Bhai Dooj. Winter is closed.",
      },
      {
        q: "Is registration mandatory?",
        a: "Yes — biometric registration is compulsory for all yatris since 2022.",
      },
      {
        q: "Can elderly do Char Dham?",
        a: "Yes with helicopter — ground trek to Kedarnath is 16 km one-way.",
      },
      {
        q: "How much cash to carry?",
        a: "Digital payments work in main hubs; carry ₹10–15k cash for remote stretches.",
      },
      {
        q: "Is Chota vs Bada Char Dham different?",
        a: "Chota = the Uttarakhand 4. Bada = Puri, Rameshwaram, Dwarka, Badrinath (all-India).",
      },
    ],
    relatedSlugs: [
      "temple-directory",
      "jyotirlinga-guide",
      "shakti-peeth-guide",
      "darshan-timings",
      "nearby-temples",
    ],
  },

  "jyotirlinga-guide": {
    intro:
      "Complete guide to all 12 Jyotirlingas — Somnath to Ghrishneshwar — with the shastric verse, location, sthala purana, darshan tips and pilgrimage order.",
    howToUse: [
      "Read the 12-name shloka to memorise the pilgrimage order.",
      "Tap any Jyotirlinga for its sthala purana, timings and how to reach.",
      "Filter by state to cluster visits.",
      "Save a checklist to track which you've completed.",
    ],
    benefits: [
      "Full 12-verse Dwadasha Jyotirlinga stotra.",
      "Sthala purana for each — why it is a swayambhu jyotir-form.",
      "Darshan tips per shrine (timings, dress, sanctum access).",
      "State-wise clustering for practical yatra planning.",
    ],
    useCases: [
      "Planning a lifetime Dwadasha Jyotirlinga darshan.",
      "Splitting the 12 across multiple trips by region.",
      "Learning the sthala puranas for study or teaching.",
      "Choosing a single Jyotirlinga for an anushthana visit.",
    ],
    mistakes: [
      "Confusing Kashi Vishwanath, Vishveshwar and other Shiva shrines that are not Jyotirlinga.",
      "Missing Ghrishneshwar near Ellora — often skipped by first-timers.",
      "Attempting Kedarnath in winter (closed).",
      "Wearing leather or synthetics into some south sanctums.",
    ],
    accuracy:
      "Order and verse verified from Shiva Purana (Koti Rudra Samhita) and standard stotra ratnamalas.",
    privacy: "Checklist stored on your device only.",
    faqs: [
      {
        q: "Which is the first Jyotirlinga?",
        a: "Somnath (Gujarat) is listed first in the traditional Dwadasha Jyotirlinga stotra.",
      },
      {
        q: "Are all 12 swayambhu?",
        a: "Traditionally yes — each is a self-manifested (swayambhu) jyotir-form of Shiva.",
      },
      {
        q: "How long to cover all 12?",
        a: "Practically 25–35 days if done in one long yatra; most families split across 3–4 trips.",
      },
      {
        q: "Is photography allowed?",
        a: "Rarely inside the garbha-griha; outer prakara usually allowed. Marked per shrine.",
      },
      {
        q: "What is the phala of full darshan?",
        a: "Shiva Purana states liberation from major karmic bondage; the yatra itself is the tapasya.",
      },
    ],
    relatedSlugs: [
      "temple-directory",
      "shakti-peeth-guide",
      "char-dham-planner",
      "darshan-timings",
      "deity-mantras",
    ],
  },

  "shakti-peeth-guide": {
    intro:
      "The 51 Shakti Peethas — sites where the parts of Sati Devi fell — with location, deity form (Shakti), Bhairava, angam that fell and pilgrimage notes.",
    howToUse: [
      "Browse the 51 peethas by state or country.",
      "Tap any peetha for angam (fallen part), Shakti name, Bhairava name and sthala purana.",
      "Filter Ashta-Dasha (18 major) or Chatushpeetha (4 primary) subsets.",
      "Bookmark peethas to plan multi-state yatras.",
    ],
    benefits: [
      "Full list of 51 (including sites in Pakistan, Bangladesh, Nepal, Sri Lanka).",
      "Shakti + Bhairava paired for each — the traditional dyad.",
      "Includes subsets: Ashta-Dasha (18), Chatushpeetha (4), Sapta-Peetha (7).",
      "Filter by accessible/inaccessible for practical planning.",
    ],
    useCases: [
      "Devi upasaks planning a Shakti Peetha yatra.",
      "Learning the sthala purana and Devi manifestation at each site.",
      "Selecting one Shakti Peetha for anushthana.",
      "Academic study of Devi Bhagavata and Kalika Purana geography.",
    ],
    mistakes: [
      "Assuming all 51 are open for travel — some are in restricted regions.",
      "Confusing Shakti Peetha with Devi temples in general.",
      "Missing the Bhairava darshan — the peetha is incomplete without it.",
      "Ignoring the specific stotra (Shakti Peetha Stotra) recitation on-site.",
    ],
    accuracy:
      "List reconciled from Devi Bhagavata Purana, Kalika Purana and standard tantra references.",
    privacy: "No personal data collected.",
    faqs: [
      {
        q: "Are there 51 or 108 Shakti Peethas?",
        a: "Traditional count is 51 (Devi Bhagavata). Some tantric texts count 108 including sub-peethas.",
      },
      {
        q: "Which are in India today?",
        a: "Around 42 are within present-day India; others are in Bangladesh, Pakistan, Nepal, Sri Lanka and Tibet.",
      },
      {
        q: "What are the 4 Adi Shakti Peethas?",
        a: "Bimala (Puri), Tara Tarini (Odisha), Kamakhya (Assam), Dakshina Kalika (Kolkata).",
      },
      {
        q: "Do I need diksha to visit?",
        a: "For darshan, no. For deeper tantric anushthana on-site, yes.",
      },
      {
        q: "Which is the most powerful?",
        a: "Kamakhya is considered the seat of maha-shakti; devotees answer per lineage.",
      },
    ],
    relatedSlugs: [
      "temple-directory",
      "jyotirlinga-guide",
      "char-dham-planner",
      "deity-mantras",
      "beej-mantras",
    ],
  },

  "nearby-temples": {
    intro:
      "Find major Hindu temples near you — filter by deity, distance and darshan timings; anchored on your city or live location.",
    howToUse: [
      "Allow location or pick your city.",
      "Filter by deity and radius (5, 25, 100 km).",
      "Open a temple for timings, entry rules and directions.",
      "Bookmark favourites for a personal shrine list.",
    ],
    benefits: [
      "Radius search around your exact location.",
      "Deity filter — quickly find a Ganesha or Devi temple.",
      "Directions with one tap to your map app.",
      "Works for major Indian cities and expanding.",
    ],
    useCases: [
      "New-in-city discovery of local temples.",
      "Weekly darshan planning within your locality.",
      "Ekadashi/pradosh visit to a nearby Vishnu/Shiva temple.",
      "Travel — finding a shrine during a work trip.",
    ],
    mistakes: [
      "Trusting distance without checking traffic time.",
      "Assuming timings match Delhi/Mumbai standards elsewhere.",
      "Ignoring dress code at south Indian temples.",
      "Missing local kul-devata shrines not yet indexed.",
    ],
    accuracy: "Location and timings verified quarterly; new listings added monthly.",
    privacy: "Location used in-browser only; never sent to our servers or logged.",
    faqs: [
      { q: "Do you show live queue times?", a: "Not yet — typical wait ranges are shown." },
      {
        q: "Are small local shrines included?",
        a: "Major ones are indexed; smaller kul-devata mandirs are being crowd-sourced.",
      },
      {
        q: "Is location tracking safe?",
        a: "Yes — GPS is read locally only; nothing leaves your device.",
      },
      {
        q: "What if my city has few results?",
        a: "Widen the radius; global coverage is expanding.",
      },
      { q: "Can I get directions?", a: "Yes — one tap opens Google/Apple Maps." },
    ],
    relatedSlugs: [
      "temple-directory",
      "darshan-timings",
      "jyotirlinga-guide",
      "shakti-peeth-guide",
      "aarti-collection",
    ],
  },

  // ─── Calculators remaining (5) ────────────────────────────
  "kundli-generator": {
    intro:
      "A quick Vedic janma kundli snapshot — rashi, nakshatra, tithi, yoga and naming syllables. For the full flagship Kundli with charts, planets and AI interpretation, use /kundli.",
    howToUse: [
      "Enter birth date, time and city.",
      "See rashi, nakshatra, pada, tithi and yoga instantly.",
      "Get the naming syllable set based on nakshatra pada.",
      "Open the full Kundli page for D1/D9 charts and interpretation.",
    ],
    benefits: [
      "Instant snapshot without a lengthy form.",
      "Naming syllables — perfect for a newborn cheremony.",
      "Drik-precise using Lahiri ayanamsa.",
      "Free, no signup, mobile-first UI.",
    ],
    useCases: [
      "Newborn naming ceremony syllable lookup.",
      "Quick rashi/nakshatra check before a matchmaking meeting.",
      "First-pass tithi/yoga verification for a birth event.",
      "Learning basics before generating the full kundli.",
    ],
    mistakes: [
      "Guessing the birth time to the nearest hour — ascendant needs minute-precision.",
      "Using the current city instead of birth city.",
      "Skipping to interpretation without checking the source data.",
      "Confusing rashi (Moon sign) with sun sign.",
    ],
    formula: {
      title: "Snapshot calculation",
      body: "Moon and Sun sidereal longitudes computed with astronomy-engine + Lahiri ayanamsa. Rashi = floor(sidereal / 30°). Nakshatra = floor(sidereal / 13°20′). Naming syllables come from the pada.",
    },
    accuracy: "Sidereal positions within ±0.001°; validated across 100+ birth samples.",
    privacy: "Birth data stays in your browser; nothing is uploaded.",
    faqs: [
      {
        q: "Is this the full Kundli?",
        a: "No — this is the quick snapshot. The full flagship Kundli (D1, D9, planets, dashas, AI interpretation) lives at /kundli.",
      },
      { q: "Which ayanamsa is used?", a: "Lahiri (Chitrapaksha) — India's standard." },
      {
        q: "How precise must the birth time be?",
        a: "For rashi/nakshatra ±5 minutes is fine; for ascendant/lagna ±1 minute matters.",
      },
      {
        q: "Can I use this for a wedding matchmaking?",
        a: "For a first-pass yes; the full Kundli page has ashtakoot matching.",
      },
      {
        q: "Is my birth data saved?",
        a: "Only if you sign in and save it to your dashboard — otherwise nothing is stored.",
      },
    ],
    relatedSlugs: [
      "rashi-calculator",
      "nakshatra-finder",
      "dasha-calculator",
      "names-by-nakshatra",
      "gemstone-recommender",
    ],
  },

  "gemstone-recommender": {
    intro:
      "Get your prescribed gemstone based on Vedic astrology — matched from your janma-lagna, moon sign and Vimshottari dasha lord.",
    howToUse: [
      "Enter birth date, time and city (kundli is generated automatically).",
      "See the primary gemstone, an alternative and stones to avoid.",
      "Read the wearing vidhi — finger, day, metal and mantra.",
      "Consult a jyotishi before purchasing high-value stones.",
    ],
    benefits: [
      "Lagna + dasha-lord based recommendation, not just sun-sign generic.",
      "Includes wearing vidhi, mantra and abhishekam steps.",
      "Flags contraindicated stones (badhaka, marana-karaka).",
      "Cost-conscious alternatives (uparatna) for each ratna.",
    ],
    useCases: [
      "First-time gemstone selection before a major purchase.",
      "Second opinion when jyotishis differ.",
      "Understanding which stone NOT to wear.",
      "Choosing an alternative uparatna instead of pricey ratna.",
    ],
    mistakes: [
      "Wearing a gemstone without verifying dasha-suitability.",
      "Combining conflicting stones (e.g. Blue Sapphire + Ruby).",
      "Skipping the abhishekam and dhaaran mantra ritual.",
      "Buying without lab certification (BIS/GIA).",
    ],
    formula: {
      title: "Recommendation logic",
      body: "Primary stone = gem of the lagna lord (if benefic) or lagnesh + current mahadasha lord. Excluded stones = gems of malefics for that lagna (e.g. Blue Sapphire is excluded for Mesha lagna).",
    },
    accuracy:
      "Rules based on Brihat Parashara Hora Shastra and Phaladeepika; validated against jyotishi consultation notes.",
    privacy: "Birth data is used only in your browser; nothing is uploaded.",
    faqs: [
      {
        q: "Should I trial the stone first?",
        a: "Yes — 3–5 day trial is traditional. Discontinue if you notice adverse signs.",
      },
      {
        q: "Which finger for which gem?",
        a: "Ruby: ring finger, Pearl: little, Coral: ring, Emerald: little, Yellow Sapphire: index, Diamond: middle, Blue Sapphire: middle, Hessonite: middle, Cat's Eye: middle.",
      },
      {
        q: "Metal for the ring?",
        a: "Ruby/Yellow Sapphire: gold. Pearl: silver. Others vary — shown per stone.",
      },
      {
        q: "Can I wear multiple gems?",
        a: "Yes if they belong to compatible planets; conflicting pairs are shown as warnings.",
      },
      {
        q: "Is Neelam (Blue Sapphire) safe?",
        a: "Only after a strict 3-day trial. Extremely reactive stone — never wear without dasha-based indication.",
      },
    ],
    relatedSlugs: [
      "kundli-generator",
      "dasha-calculator",
      "rashi-calculator",
      "nakshatra-finder",
      "birthstone-finder",
    ],
  },

  numerology: {
    intro:
      "Get your Vedic numerology profile — mulank (birth number), bhagyank (destiny number) and personal year — with meaning, favourable days and colours.",
    howToUse: [
      "Enter your date of birth.",
      "See mulank (1–9), bhagyank and current personal year.",
      "Read the meaning, ruling planet, lucky days and colours.",
      "Compare with kundli for a fuller picture.",
    ],
    benefits: [
      "Mulank + bhagyank + personal year in one page.",
      "Ruling planet mapped for each number.",
      "Lucky days, colours, gems and career hints.",
      "Free, instant, no signup.",
    ],
    useCases: [
      "Personal year planning (favourable months).",
      "Choosing a colour/day for an important event.",
      "Career compatibility check against life path number.",
      "Complementing astrology with numerology.",
    ],
    mistakes: [
      "Using only bhagyank while ignoring mulank.",
      "Treating personal year as fatalistic — it's a tendency, not a decree.",
      "Confusing Vedic numerology (1–9 + planetary map) with Pythagorean.",
      "Ignoring name numerology which modifies the profile.",
    ],
    formula: {
      title: "Numerology formulas",
      body: "Mulank = reduce birth date to single digit (e.g. 27 → 2+7 = 9). Bhagyank = reduce full DOB (dd+mm+yyyy) to single digit. Personal Year = reduce (birth day + birth month + current year).",
    },
    accuracy:
      "Follows Vedic (Cheiro-style Indian) numerology; results verified against classical tables.",
    privacy: "DOB used only in your browser; not stored.",
    faqs: [
      {
        q: "Which is more important — mulank or bhagyank?",
        a: "Mulank shows personality; bhagyank shows destiny. Both matter; classical view weights bhagyank slightly higher for life outcomes.",
      },
      {
        q: "What ruling planet does each number have?",
        a: "1: Sun, 2: Moon, 3: Jupiter, 4: Rahu, 5: Mercury, 6: Venus, 7: Ketu, 8: Saturn, 9: Mars.",
      },
      {
        q: "How is personal year used?",
        a: "Personal year 1 = new beginnings; 5 = change/travel; 9 = closure. Plan initiatives accordingly.",
      },
      {
        q: "Should I change my name?",
        a: "Only after careful jyotish + numerology consultation; ad-hoc changes rarely help.",
      },
      {
        q: "Is 4 or 8 unlucky?",
        a: "No number is 'unlucky'. 4 (Rahu) and 8 (Saturn) demand more effort but yield deep results.",
      },
    ],
    relatedSlugs: [
      "name-numerology",
      "kundli-generator",
      "rashi-calculator",
      "gemstone-recommender",
      "birthstone-finder",
    ],
  },

  "name-numerology": {
    intro:
      "Calculate your name number using Chaldean/Vedic values — see the ruling planet, vibration and how it interacts with your mulank and bhagyank.",
    howToUse: [
      "Enter your full name (as commonly written).",
      "See the total name number and its ruling planet.",
      "Compare against your mulank and bhagyank for compatibility.",
      "Test variants (initials, married name) to find the strongest vibration.",
    ],
    benefits: [
      "Chaldean numerology values (traditional Indian standard).",
      "Compatibility check against mulank + bhagyank.",
      "Test multiple spellings side-by-side.",
      "Free — try unlimited variants.",
    ],
    useCases: [
      "Newborn naming — testing shortlisted names for vibration.",
      "Brand/business name selection.",
      "Checking a stage name or pen name.",
      "Understanding why a certain name 'feels' powerful.",
    ],
    mistakes: [
      "Using Pythagorean values instead of Chaldean (Vedic tradition uses Chaldean).",
      "Changing a name for numerology alone without kundli consultation.",
      "Ignoring the compound number (e.g. 13, 14, 16) which has its own meaning.",
      "Trusting one spelling variant without testing others.",
    ],
    formula: {
      title: "Chaldean letter values",
      body: "A/I/J/Q/Y=1, B/K/R=2, C/G/L/S=3, D/M/T=4, E/H/N/X=5, U/V/W=6, O/Z=7, F/P=8. (No letter = 9 in Chaldean.) Sum all letters, then reduce to single digit while retaining the compound total.",
    },
    accuracy: "Chaldean tables cross-referenced with Cheiro and Indian numerology standards.",
    privacy: "Name data stays in your browser only.",
    faqs: [
      {
        q: "Chaldean or Pythagorean?",
        a: "Indian tradition uses Chaldean — it aligns better with Vedic planetary mapping.",
      },
      {
        q: "Do compound numbers matter?",
        a: "Yes — 13 (change), 14 (movement), 16 (warning), 22 (mastery) carry distinct meanings before reduction.",
      },
      {
        q: "Which name to enter?",
        a: "The name you're most commonly called. That's the vibration in daily use.",
      },
      {
        q: "Should married women test the new name?",
        a: "Yes — the post-marriage name creates a new vibration; compare both.",
      },
      {
        q: "Is name change effective?",
        a: "Only if the new spelling is used consistently in signature and daily identity for months.",
      },
    ],
    relatedSlugs: [
      "numerology",
      "kundli-generator",
      "names-by-nakshatra",
      "names-by-meaning",
      "baby-name-ai",
    ],
  },

  "birthstone-finder": {
    intro:
      "Find your Vedic birthstone based on rashi (moon sign) and nakshatra — with meaning, wearing day, metal and traditional benefit.",
    howToUse: [
      "Enter birth date, time and city (rashi + nakshatra auto-computed).",
      "See the rashi-based birthstone and nakshatra-based stone.",
      "Read wearing vidhi — finger, metal, day and mantra.",
      "Cross-check with jyotish gemstone recommender for lagna suitability.",
    ],
    benefits: [
      "Both rashi and nakshatra birthstones shown.",
      "Wearing day, metal, finger and mantra included.",
      "Uparatna (affordable alternative) for each stone.",
      "Free — no signup.",
    ],
    useCases: [
      "Birthday gift selection for a family member.",
      "First-time gemstone selection for spiritual practice.",
      "Comparing western zodiac birthstones with Vedic ones.",
      "Choosing a stone for jaap mala.",
    ],
    mistakes: [
      "Wearing a rashi stone that conflicts with your lagna-lord (check gemstone recommender).",
      "Assuming western birthstones (garnet/amethyst) apply — they don't in Vedic.",
      "Skipping the abhishekam and mantra dhaaran ritual.",
      "Buying without lab certification.",
    ],
    formula: {
      title: "Birthstone mapping",
      body: "Rashi → stone: Mesha=Coral, Vrishabha=Diamond, Mithuna=Emerald, Karka=Pearl, Simha=Ruby, Kanya=Emerald, Tula=Diamond, Vrischika=Coral, Dhanu=Yellow Sapphire, Makar=Blue Sapphire, Kumbha=Blue Sapphire, Meena=Yellow Sapphire. Nakshatra stone = gem of the nakshatra lord.",
    },
    accuracy: "Mappings verified from Brihat Samhita and standard ratna-shastra references.",
    privacy: "Birth data used only in your browser.",
    faqs: [
      {
        q: "Rashi stone or nakshatra stone — which to wear?",
        a: "Nakshatra stone is subtler and safer; rashi stone is more visible. Many wear both if compatible.",
      },
      {
        q: "Are western birthstones valid?",
        a: "They're a modern jewellery tradition — not part of Vedic astrology.",
      },
      {
        q: "What if my stone is Blue Sapphire?",
        a: "Reactive stone — do a strict 3-day trial. See the gemstone recommender for lagna-based clearance.",
      },
      {
        q: "Can children wear gemstones?",
        a: "Traditionally after upanayana or age 12; smaller uparatnas are gentler.",
      },
      {
        q: "Do synthetic stones work?",
        a: "No — only natural, certified stones carry the traditional vibration.",
      },
    ],
    relatedSlugs: [
      "gemstone-recommender",
      "kundli-generator",
      "rashi-calculator",
      "nakshatra-finder",
      "numerology",
    ],
  },

  // ─── Sanskrit (7) ────────────────────────────────────────
  "sanskrit-dictionary": {
    intro:
      "Search Sanskrit words in Devanagari, IAST or English — get meaning, grammar (linga, vibhakti), root (dhatu) and example usage from shastra.",
    howToUse: [
      "Type in Devanagari, IAST or English (e.g. 'dharma').",
      "See the primary meaning, gender/case if noun, and root if verb.",
      "Tap example usage to see the word in a shastra citation.",
      "Bookmark words for a personal vocabulary list.",
    ],
    benefits: [
      "Devanagari + IAST + English input.",
      "Grammar info (linga, dhatu, gana).",
      "Example citations from Bhagavad Gita, Upanishads and standard texts.",
      "Free, ad-light, mobile-first.",
    ],
    useCases: [
      "Reading Bhagavad Gita with word-by-word lookup.",
      "Sanskrit students building vocabulary.",
      "Purohits verifying a mantra term.",
      "Writers researching the exact Sanskrit root of a concept.",
    ],
    mistakes: [
      "Trusting a single English gloss — most Sanskrit words have layered meanings.",
      "Ignoring the linga (gender) — it changes declension.",
      "Missing sandhi — 'dharmartha' = dharma + artha.",
      "Assuming Hindi meaning = Sanskrit meaning (many false friends).",
    ],
    accuracy:
      "Definitions and roots aligned with Monier-Williams, Apte and standard shabdakosha references.",
    privacy: "Search history stays on your device.",
    faqs: [
      {
        q: "Which dictionaries is this based on?",
        a: "Primary: Monier-Williams and Apte. Cross-checked with Amara-kosha for classical usage.",
      },
      {
        q: "Does it handle sandhi?",
        a: "Basic sandhi splitting is available — see the dedicated Sandhi Splitter for complex cases.",
      },
      {
        q: "Are compound words (samasa) handled?",
        a: "Yes — common compounds are indexed; the Shloka Analyzer breaks down complex samasas.",
      },
      { q: "Is there audio pronunciation?", a: "Not yet — planned for a future release." },
      {
        q: "Can I contribute a word?",
        a: "Yes — the report button on each entry lets you suggest additions or corrections.",
      },
    ],
    relatedSlugs: [
      "transliteration",
      "sandhi-splitter",
      "shloka-analyzer",
      "devanagari-typing",
      "verb-conjugator",
    ],
  },

  transliteration: {
    intro:
      "Instant transliteration between Devanagari, IAST, ITRANS, Harvard-Kyoto and Roman phonetic — perfect for typing shlokas without a Devanagari keyboard.",
    howToUse: [
      "Type in any supported scheme (e.g. 'om namah shivaya').",
      "See instant Devanagari and other transliterations side-by-side.",
      "Copy the output in one tap.",
      "Toggle strict IAST mode for academic use.",
    ],
    benefits: [
      "5 schemes supported (Devanagari, IAST, ITRANS, HK, Roman).",
      "Real-time — no submit button.",
      "Handles anusvara, visarga, chandrabindu.",
      "Copy to clipboard in any target scheme.",
    ],
    useCases: [
      "Typing mantras for a puja printout.",
      "Preparing IAST papers for academic submission.",
      "Converting old ITRANS files to Devanagari or IAST.",
      "Sharing shlokas over WhatsApp in readable Roman phonetic.",
    ],
    mistakes: [
      "Confusing 'sh' (श) with 'S' (ष) in ITRANS — case matters.",
      "Missing anusvara notation — 'ham' vs 'haṁ' change meaning.",
      "Using ITRANS 'ch' vs 'C' — different consonants.",
      "Trusting phonetic-only Roman for shastric quoting — always use IAST for citations.",
    ],
    formula: {
      title: "Transliteration standards",
      body: "IAST = International Alphabet of Sanskrit Transliteration (academic standard, diacritics). ITRANS = ASCII-safe scheme (all-caps for retroflex). Harvard-Kyoto = another ASCII scheme. Roman-phonetic = casual English approximation.",
    },
    accuracy:
      "Round-trip conversion (Devanagari → IAST → Devanagari) preserves 100% of shastric input.",
    privacy: "All conversion is client-side; nothing is sent to a server.",
    faqs: [
      {
        q: "Which scheme should I use?",
        a: "IAST for academic writing, Devanagari for tradition, ITRANS for legacy ASCII, Roman phonetic for casual sharing.",
      },
      {
        q: "Does it handle Vedic accents?",
        a: "Basic udatta/anudatta yes; complex Vedic notation partial.",
      },
      {
        q: "Is the transliteration reversible?",
        a: "Devanagari ↔ IAST is fully lossless. Roman phonetic → Devanagari is best-effort.",
      },
      { q: "Can I type in Hindi input method?", a: "Yes — paste Devanagari from any source." },
      {
        q: "What about Tamil/Bengali scripts?",
        a: "Sanskrit is targeted here; Indic script conversion is on the roadmap.",
      },
    ],
    relatedSlugs: [
      "devanagari-typing",
      "sanskrit-dictionary",
      "sandhi-splitter",
      "shloka-analyzer",
      "verb-conjugator",
    ],
  },

  "sandhi-splitter": {
    intro:
      "Split Sanskrit compound-sound words back into their components — from 'tatra' + 'iva' = 'tatraiva', reveal the original terms.",
    howToUse: [
      "Type the sandhi-joined word in Devanagari or IAST.",
      "See the possible splits with the sandhi rule applied.",
      "Confirm the split against context in your shloka.",
      "Copy any component for dictionary lookup.",
    ],
    benefits: [
      "Handles vowel, consonant and visarga sandhi.",
      "Shows the specific sandhi rule (e.g. savarna-dirgha, guna, vriddhi).",
      "Multiple candidate splits when ambiguous.",
      "Free — no login.",
    ],
    useCases: [
      "Parsing a Bhagavad Gita line word-by-word.",
      "Sanskrit students learning sandhi rules with examples.",
      "Purohits decoding a mantra with heavy compounding.",
      "Preparing a shloka commentary.",
    ],
    mistakes: [
      "Assuming one split is unique — many sandhis have multiple valid decompositions.",
      "Ignoring the rule label — knowing the rule helps predict others.",
      "Splitting without meaning check — grammatically valid ≠ contextually right.",
      "Applying vowel sandhi rules to consonants and vice versa.",
    ],
    formula: {
      title: "Sandhi types handled",
      body: "Ach (vowel) sandhi: savarna-dirgha, guna, vriddhi, yan, ayadi. Hal (consonant) sandhi: jashtva, chartva, anusvara. Visarga sandhi: satva, utva, ru-adesha. Special: prakriti-bhava exceptions.",
    },
    accuracy: "Rules based on Panini's Ashtadhyayi and standard Laghu Kaumudi tables.",
    privacy: "Input stays in your browser only.",
    faqs: [
      {
        q: "Why do I see multiple splits?",
        a: "Sandhi is often ambiguous in decomposition — context in the shloka decides the correct one.",
      },
      {
        q: "Does it handle Vedic sandhi?",
        a: "Basic Vedic sandhi yes; some special Vedic ru-adesha edge cases partial.",
      },
      {
        q: "Can it split samasa (compounds)?",
        a: "Sandhi (sound-level) yes. Samasa (compound-level) requires the Shloka Analyzer.",
      },
      {
        q: "Which rule notation is used?",
        a: "Panini sutra numbers where applicable, plus common Laghu Kaumudi names.",
      },
      {
        q: "Is IAST or Devanagari better?",
        a: "Both work. Devanagari is unambiguous; IAST is faster to type on English keyboards.",
      },
    ],
    relatedSlugs: [
      "sanskrit-dictionary",
      "shloka-analyzer",
      "transliteration",
      "verb-conjugator",
      "devanagari-typing",
    ],
  },

  "shloka-analyzer": {
    intro:
      "Paste a Sanskrit shloka — get word-by-word split, sandhi decomposition, samasa breakdown, meter (chhanda) detection and English meaning.",
    howToUse: [
      "Paste a shloka in Devanagari or IAST.",
      "See word-by-word split with grammar info.",
      "Read the sandhi and samasa breakdown.",
      "Note the meter (Anushtubh, Trishtubh, Gayatri…) and English meaning.",
    ],
    benefits: [
      "Full word-by-word grammar analysis.",
      "Sandhi + samasa combined breakdown.",
      "Meter detection (chhanda) with syllable pattern.",
      "English meaning aligned to each pada.",
    ],
    useCases: [
      "Studying Bhagavad Gita, Upanishads or a stotra deeply.",
      "Sanskrit students preparing exam translations.",
      "Teachers building class handouts.",
      "Writers verifying an unfamiliar shloka's meaning.",
    ],
    mistakes: [
      "Trusting the auto-translation blindly — commentary always beats auto-gloss.",
      "Missing the meter — meter changes emphasise which words carry weight.",
      "Ignoring alternative samasa parses.",
      "Skipping the pratipadika (dictionary form) when the shloka uses declined forms.",
    ],
    formula: {
      title: "Meter (chhanda) detection",
      body: "Each pada is scanned for laghu (short: 1 matra) and guru (long: 2 matra) syllables. Total matras/syllables match against classical chhanda templates: Anushtubh (8×4), Trishtubh (11×4), Gayatri (6×4 or 8×3).",
    },
    accuracy:
      "Meter detection accurate for classical chhandas; anushtubh vs vipulaas identified separately.",
    privacy: "Input stays in your browser only.",
    faqs: [
      {
        q: "How reliable is the English meaning?",
        a: "Good first pass. For deep study, cross-check with a lineage commentary (Shankara, Ramanuja, Madhva).",
      },
      {
        q: "Which meters are detected?",
        a: "All major Vedic and classical chhandas: Anushtubh, Trishtubh, Jagati, Gayatri, Ushnik, Brihati, Pankti, Aryaa, Shardulavikridita.",
      },
      { q: "Does it handle mixed meters?", a: "Yes — each pada is analysed independently." },
      {
        q: "Can I get the anvaya (prose order)?",
        a: "Yes — 'show anvaya' toggle reorders declined words into prose Sanskrit.",
      },
      {
        q: "Vedic vs classical Sanskrit?",
        a: "Both handled; Vedic accent marks preserved when input includes them.",
      },
    ],
    relatedSlugs: [
      "sanskrit-dictionary",
      "sandhi-splitter",
      "transliteration",
      "verb-conjugator",
      "bhagavad-gita",
    ],
  },

  "devanagari-typing": {
    intro:
      "Type Devanagari directly from your English keyboard — smart phonetic input with instant conversion and full support for anusvara, visarga and conjuncts.",
    howToUse: [
      "Start typing in Roman phonetic (e.g. 'namaste').",
      "See Devanagari appear in real time.",
      "Use capitals for retroflex (T, D, N, S).",
      "Copy the Devanagari output in one tap.",
    ],
    benefits: [
      "No install — works in your browser.",
      "Real-time conversion — no submit needed.",
      "Anusvara (M), visarga (H), chandrabindu (~) supported.",
      "Copy or download plain-text Devanagari.",
    ],
    useCases: [
      "Composing mantras for a puja printout.",
      "Writing WhatsApp/Facebook posts in Devanagari.",
      "Preparing shloka slides without a Devanagari keyboard.",
      "Students typing Sanskrit homework.",
    ],
    mistakes: [
      "Ignoring case — 'ta' vs 'Ta' produce different characters.",
      "Missing halant — 'namaste' should end with silent 'e' properly.",
      "Confusing 'ri' (ऋ) with 'ri' (रि) — use 'R' for the vowel.",
      "Forgetting anusvara notation ('M' at end of syllable).",
    ],
    formula: {
      title: "Input mapping (subset)",
      body: "Lowercase = default; capitals = retroflex or long vowels. a/A=अ/आ, i/I=इ/ई, u/U=उ/ऊ, R=ऋ, e=ए, ai=ऐ, o=ओ, au=औ. Consonants: k, kh, g, gh, ~N, ch, chh, j, jh, ~n, T, Th, D, Dh, N, t, th, d, dh, n, p, ph, b, bh, m, y, r, l, v, sh, S, s, h.",
    },
    accuracy:
      "Follows ITRANS + Harvard-Kyoto conventions; verified against IAST for shastric text.",
    privacy: "All typing is client-side; nothing sent to any server.",
    faqs: [
      {
        q: "Which scheme is used?",
        a: "A blend of ITRANS (default) with IAST-friendly extensions. Toggle to strict ITRANS or HK from settings.",
      },
      { q: "Can I paste text?", a: "Yes — paste Roman input; the tool converts on paste." },
      { q: "Does it support Vedic accents?", a: "Basic udatta/anudatta marks yes." },
      {
        q: "How to type conjuncts?",
        a: "Just type consonants together — 'ksh' = क्ष, 'jn' = ज्ञ automatically.",
      },
      {
        q: "Can I switch back to Roman?",
        a: "Yes — the transliteration tool reverses Devanagari back to IAST/ITRANS.",
      },
    ],
    relatedSlugs: [
      "transliteration",
      "sanskrit-dictionary",
      "sandhi-splitter",
      "shloka-analyzer",
      "verb-conjugator",
    ],
  },

  "verb-conjugator": {
    intro:
      "Conjugate any Sanskrit verb across lakara (tenses/moods), person and number — parasmaipada and atmanepada — with the exact Panini rule applied.",
    howToUse: [
      "Enter the dhatu (verb root) in Devanagari or IAST (e.g. 'bhū').",
      "Pick the lakara (Lat, Lit, Lut, Lrit, Lot, Lang, Vidhi, Ashir, Lrng).",
      "See the full 9-form table (3 persons × 3 numbers).",
      "Toggle parasmaipada / atmanepada / ubhayapada.",
    ],
    benefits: [
      "All 10 major lakaras supported.",
      "Parasmaipada + atmanepada shown when applicable.",
      "Panini sutra reference for each transformation.",
      "Search 2000+ common dhatus by gana.",
    ],
    useCases: [
      "Sanskrit students preparing verb tables for exams.",
      "Understanding shloka verb forms encountered while reading.",
      "Teachers building conjugation drills.",
      "Writers checking a specific tense form.",
    ],
    mistakes: [
      "Confusing gana (verb class) — same root can conjugate differently in different ganas.",
      "Mixing parasmaipada and atmanepada endings.",
      "Ignoring the sanadi (causative, desiderative) prefix layers.",
      "Assuming irregular verbs follow rules — as, i, hu, ad are unique.",
    ],
    formula: {
      title: "Conjugation logic",
      body: "Given dhatu + gana + lakara, apply vikarana (class marker), then sarvadhatuka/ardhadhatuka endings for parasmaipada/atmanepada, then final sandhi. Panini rules 3.4.77–3.4.115 govern endings.",
    },
    accuracy: "Verified against Ashtadhyayi and Laghu Kaumudi verb tables for the top 500 dhatus.",
    privacy: "No login; all conjugation is browser-side.",
    faqs: [
      {
        q: "What are the 10 lakaras?",
        a: "Lat (present), Lit (perfect), Lut (periphrastic future), Lrit (simple future), Lot (imperative), Lang (imperfect), Vidhi Lin (optative), Ashir Lin (benedictive), Lung (aorist), Lrng (conditional).",
      },
      {
        q: "How many verb classes (ganas)?",
        a: "10 — bhvadi, adadi, juhotyadi, divadi, svadi, tudadi, rudhadi, tanadi, kryadi, curadi.",
      },
      {
        q: "What if my dhatu is not listed?",
        a: "Enter it manually with gana; a fallback conjugation runs. Report missing dhatus for permanent inclusion.",
      },
      {
        q: "Are causative (nijant) forms supported?",
        a: "Yes — toggle 'nijant' to see -ay- forms.",
      },
      {
        q: "How reliable are irregular forms?",
        a: "Top 100 irregular verbs (as, bhu, i, ad, han, gam, sthaa) are hand-verified against Panini.",
      },
    ],
    relatedSlugs: [
      "sanskrit-dictionary",
      "sandhi-splitter",
      "shloka-analyzer",
      "transliteration",
      "devanagari-typing",
    ],
  },

  "sanskrit-word-of-day": {
    intro:
      "A new Sanskrit word every day — with Devanagari, IAST, meaning, root, example verse and grammar notes. Build vocabulary one word at a time.",
    howToUse: [
      "Open the page — today's word loads with meaning and example.",
      "Read the etymology (dhatu, prefix, suffix).",
      "Study the example verse from a shastra.",
      "Come back tomorrow — the word rotates automatically.",
    ],
    benefits: [
      "Daily new word — build a 365-word vocabulary in a year.",
      "Etymology + example verse for context.",
      "Bookmark words to a personal review list.",
      "Free, no login, no ads on the word page.",
    ],
    useCases: [
      "Sanskrit self-study — daily habit.",
      "WhatsApp family sharing — one word a day.",
      "Teachers sourcing daily class starters.",
      "Writers expanding shastric vocabulary.",
    ],
    mistakes: [
      "Skipping the etymology — root knowledge multiplies vocabulary.",
      "Not writing the word — handwriting Devanagari cements memory.",
      "Learning meaning without pronunciation.",
      "Rotating faster than daily — depth beats speed.",
    ],
    accuracy: "Words + citations verified against Monier-Williams, Apte and shastric sources.",
    privacy: "Bookmarks kept locally on your device.",
    faqs: [
      {
        q: "How are words chosen?",
        a: "A curated 365-day sequence progressing from beginner to advanced, with festival-relevant words on major days.",
      },
      {
        q: "Can I get past words?",
        a: "Yes — bookmark or scroll the archive from the page footer.",
      },
      { q: "Is there audio?", a: "Text-only for now; audio pronunciation planned." },
      {
        q: "Does the word repeat yearly?",
        a: "The sequence rotates yearly with fresh examples so revision is built-in.",
      },
      { q: "Can I suggest a word?", a: "Yes — use the report/suggest button on the page." },
    ],
    relatedSlugs: [
      "sanskrit-dictionary",
      "transliteration",
      "shloka-analyzer",
      "verb-conjugator",
      "devanagari-typing",
    ],
  },
};
