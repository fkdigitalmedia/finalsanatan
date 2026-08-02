// ============================================================
// Global Tool Page Standard — Batch 5 (Final rollout)
// Panchang extras + Festivals extras + Puja extras + Collections
// + Daily/Counters + AI + Calculators extras + Baby Names (5)
// + Learning (12) — everything remaining after Batches 1–4.
// ============================================================
import type { FlagshipContentSpec } from "./flagship";

export const BATCH5_CONTENT: Record<string, FlagshipContentSpec> = {
  // ─── Panchang extras ────────────────────────────────────
  "panchang-by-date": {
    intro:
      "Look up the full drik panchang for any past or future date — tithi, nakshatra, yoga, karana, sunrise, sunset and muhurats, computed for your city.",
    howToUse: [
      "Pick any date from the calendar.",
      "Confirm your city — timings depend on it.",
      "Read the five angas and shubh muhurats.",
      "Share or bookmark the day.",
    ],
    benefits: [
      "Works for birthdays, wedding dates, sankalp lookups.",
      "Any date in the past or the next 100 years.",
      "Drik-precise for your exact latitude and longitude.",
      "No login, no ads in the way.",
    ],
    useCases: [
      "Confirming panchang for a birth date to compute nakshatra.",
      "Planning a griha pravesh or wedding well in advance.",
      "Cross-checking a printed panchang against drik values.",
      "Researching festival dates in history.",
    ],
    mistakes: [
      "Using a distant city — always set the actual place of the event.",
      "Ignoring the sunrise cutoff — the Hindu day starts at sunrise, not midnight.",
      "Confusing purnimanta and amanta month names.",
      "Forgetting DST/time-zone adjustments for old dates.",
    ],
    accuracy:
      "Astronomy-engine ephemerides with Lahiri ayanamsa. Matches modern drik panchangs within a small margin.",
    privacy: "Date and city stay on your device. Nothing is uploaded.",
    faqs: [
      { q: "How far back can I query?", a: "Reliably from 1800 CE onwards for drik computations." },
      {
        q: "How far into the future?",
        a: "Up to 100 years — ephemeris data is stable well beyond that.",
      },
      {
        q: "Why is the tithi different from my printed panchang?",
        a: "Some panchangs use a different ayanamsa (Raman, KP). We use Lahiri by default.",
      },
      {
        q: "Do I need to set exact GPS?",
        a: "City-level accuracy is enough for tithi/nakshatra; use exact coordinates for muhurat-critical events.",
      },
    ],
    relatedSlugs: ["todays-panchang", "rahu-kaal", "abhijit-muhurat", "moon-phase"],
  },
  "hora-chart": {
    intro:
      "The 24 planetary horas of the day and night — pick the right hora for wealth, health, travel, learning or new starts.",
    howToUse: [
      "Set your city so sunrise time is correct.",
      "See the day and night hora chart.",
      "Match your task to the ruling planet (Jupiter for learning, Venus for love, Mercury for business).",
      "Bookmark your recurring good horas.",
    ],
    benefits: [
      "Simple hourly muhurat you can use daily.",
      "Colour-coded by planet friendship.",
      "Works even when Choghadiya is busy.",
      "Traditional Kaal Hora system, not made-up.",
    ],
    useCases: [
      "Signing an agreement in Jupiter hora.",
      "Starting a journey in Mercury hora.",
      "Beginning a new sadhana in Moon hora on Monday.",
      "Avoiding Saturn/Mars horas for delicate tasks.",
    ],
    mistakes: [
      "Using clock hours — horas start at sunrise, not 12 AM.",
      "Ignoring the day lord (the first hora is always the day's own planet).",
      "Treating malefic horas as forbidden — they're just cautious windows.",
    ],
    formula: {
      title: "How horas are built",
      body: "The day (sunrise → sunset) is divided into 12 equal parts, and the night into 12 more. The first hora belongs to the day's lord (Sun on Sunday, Moon on Monday…) and the rest follow the Chaldean order: Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars.",
    },
    accuracy:
      "Sunrise/sunset via astronomy-engine; hora boundaries are unequal by design (they scale with day length).",
    privacy: "Location is stored on device only.",
    faqs: [
      {
        q: "Which hora is best overall?",
        a: "Jupiter (Guru) hora is universally auspicious for knowledge, wealth and dharma.",
      },
      {
        q: "Are night horas usable?",
        a: "Yes — night horas rule sleep, dreams, meditation and quiet work.",
      },
      {
        q: "Does hora replace Choghadiya?",
        a: "No, they complement each other. Choghadiya is broader; hora is hourly precision.",
      },
    ],
    relatedSlugs: ["choghadiya", "abhijit-muhurat", "rahu-kaal", "brahma-muhurat"],
  },
  "sunrise-sunset-atlas": {
    intro:
      "Real sunrise, sunset and twilight times for any city in the world — the foundation of every panchang timing.",
    howToUse: [
      "Search a city or use your current location.",
      "Read sunrise, sunset and day length.",
      "Optionally view civil/nautical/astronomical twilight.",
      "Save favourite cities for quick access.",
    ],
    benefits: [
      "Global — works for pilgrims and NRIs.",
      "Uses real ephemerides, not tables.",
      "Foundation for Rahu Kaal, muhurats and puja timings.",
      "Free forever.",
    ],
    useCases: [
      "Scheduling a Sandhya vandanam abroad.",
      "Planning a Brahma muhurat sadhana in a new city.",
      "Setting alarms for arghya (Sun offering).",
      "Cross-checking a printed panchang.",
    ],
    mistakes: [
      "Confusing civil twilight with actual sunrise.",
      "Ignoring time-zone changes when travelling.",
      "Using local clock time without DST awareness.",
    ],
    accuracy: "Astronomy-engine solar position; matches USNO/NOAA within seconds.",
    privacy: "Location is stored on device only.",
    faqs: [
      {
        q: "What is Sandhya?",
        a: "The joining time — the 24-minute window around sunrise/sunset ideal for gayatri and sandhya vandanam.",
      },
      {
        q: "Why does sunrise differ from Google?",
        a: "Google often shows civil twilight. Panchang uses actual upper-limb sunrise, which is a couple of minutes later.",
      },
      {
        q: "Does altitude matter?",
        a: "Marginally — a few seconds for hill stations. We correct for standard sea level.",
      },
    ],
    relatedSlugs: ["todays-sunrise", "todays-sunset", "brahma-muhurat", "rahu-kaal"],
  },
  "moon-phase": {
    intro:
      "Current moon phase, illumination percentage and phase angle for any date — with the matching tithi and pakshi.",
    howToUse: [
      "Pick a date (defaults to today).",
      "See the phase, tithi and paksha.",
      "Read the illumination % and next full/new moon.",
      "Bookmark upcoming purnima/amavasya dates.",
    ],
    benefits: [
      "Sync sadhana with the lunar cycle.",
      "Plan vrats around shukla/krishna paksha.",
      "Great for gardeners, fasters and meditators.",
      "Combines astronomy with Vedic tithi.",
    ],
    useCases: [
      "Planning ekadashi and purnima fasts.",
      "Timing chandra namaskar during full moon.",
      "Choosing a mala-japa retreat around new moon.",
      "Educational — teaching kids about tithis.",
    ],
    mistakes: [
      "Assuming full moon = purnima tithi at midnight — they align near sunrise/sunset instead.",
      "Ignoring paksha when reading a phase — waxing and waning look similar at half moon.",
    ],
    accuracy: "Astronomy-engine lunar model; illumination accurate to <0.1%.",
    privacy: "No data leaves your device.",
    faqs: [
      {
        q: "What's the difference between phase and tithi?",
        a: "Phase is continuous (0–360°). Tithi is a discrete 12° arc — one of 30 named lunar days.",
      },
      { q: "When is the next super moon?", a: "Shown at the top of the tool when applicable." },
    ],
    relatedSlugs: ["todays-tithi", "purnima-amavasya", "ekadashi-dates"],
  },
  "abhijit-muhurat": {
    intro:
      "Abhijit is the 8th of 15 day-muhurats — a 48-minute victory window centred on solar noon, revered as the most auspicious moment of the day.",
    howToUse: [
      "Set your city — Abhijit depends on your local noon.",
      "Read today's Abhijit window (usually 11:45 AM–12:30 PM).",
      "Use it for signings, launches, sankalp, or new starts.",
      "Skip on Wednesdays — Abhijit is considered inactive on Wednesday.",
    ],
    benefits: [
      "A ready-to-use auspicious window every day.",
      "Works even when Choghadiya is busy.",
      "Great for spontaneous decisions.",
      "48 minutes — long enough to actually complete a small ritual.",
    ],
    useCases: [
      "Signing a contract or property deed.",
      "Sankalp for a new sadhana.",
      "Applying for a job or filing paperwork.",
      "Starting a new business or product launch.",
    ],
    mistakes: [
      "Using Abhijit on Wednesday — traditionally it's not applicable that day.",
      "Ignoring Rahu Kaal overlap — if Abhijit falls in Rahu Kaal, prefer another window.",
      "Assuming Abhijit is always 12 PM sharp — it's centred on real solar noon, which drifts.",
    ],
    formula: {
      title: "How Abhijit is computed",
      body: "Take the interval from sunrise to sunset, divide into 15 equal parts. The 8th part is Abhijit — centred on solar noon (midway between sunrise and sunset).",
    },
    accuracy: "Solar noon via astronomy-engine; matches drik panchangs to the minute.",
    privacy: "City stored on your device only.",
    faqs: [
      {
        q: "Why is Wednesday excluded?",
        a: "Traditional muhurta shastra reserves Abhijit for other days; Wednesday's noon window is called 'Vidhwa' and is skipped.",
      },
      {
        q: "Does Abhijit override Rahu Kaal?",
        a: "If both overlap, most acharyas recommend rescheduling — combine with the Rahu Kaal tool to check.",
      },
    ],
    relatedSlugs: ["rahu-kaal", "choghadiya", "hora-chart", "brahma-muhurat"],
  },
  "brahma-muhurat": {
    intro:
      "The two muhurats before sunrise — the sattva-rich pre-dawn window when the mind is naturally still and sadhana bears the deepest fruit.",
    howToUse: [
      "Set your city so sunrise is accurate.",
      "Read tomorrow's Brahma muhurat start and end.",
      "Set an alarm the night before.",
      "Wake, bathe, and begin your sadhana.",
    ],
    benefits: [
      "Backed by centuries of yogic practice.",
      "Aligns with the body's cortisol peak — natural alertness.",
      "Reserved sattva guna in the atmosphere.",
      "Best window for jaap, meditation and study.",
    ],
    useCases: [
      "Daily meditation and pranayama.",
      "Sanskrit or shastra study.",
      "Mantra jaap — one mala in Brahma muhurat = ten by day, says tradition.",
      "Journaling and sankalp.",
    ],
    mistakes: [
      "Confusing Brahma muhurat with sunrise — it ends before sunrise.",
      "Skipping it because 'I'm not spiritual' — the neurological benefits apply to anyone.",
      "Eating heavy food the night before and losing the window to grogginess.",
    ],
    formula: {
      title: "How Brahma muhurat is computed",
      body: "Night (sunset → sunrise) is divided into 15 muhurats of 48 min each. The 14th and 15th muhurats (roughly 96 min to 48 min before sunrise) form Brahma muhurat. Some traditions cite only the 14th.",
    },
    accuracy: "Sunrise via astronomy-engine; matches drik values.",
    privacy: "Location stored on device only.",
    faqs: [
      {
        q: "How long is it exactly?",
        a: "48 minutes (single muhurat) or 96 minutes (two muhurats), depending on tradition. We show both bounds.",
      },
      {
        q: "Is it OK to sleep through it?",
        a: "Yes — Brahma muhurat is optional. But even a few weeks of using it usually convinces people.",
      },
    ],
    relatedSlugs: ["todays-sunrise", "abhijit-muhurat", "digital-jaap-counter", "hora-chart"],
  },
  choghadiya: {
    intro:
      "The eight Choghadiya periods of the day and night — a fast, traditional way to find a shubh muhurat for any task on the go.",
    howToUse: [
      "Confirm your city.",
      "Read today's day and night choghadiya table.",
      "Pick Amrit / Shubh / Labh / Chal for auspicious tasks.",
      "Avoid Kaal / Rog / Udveg for critical work.",
    ],
    benefits: [
      "Traditional Gujarati/Marwari muhurta system.",
      "Faster than casting a full muhurat chart.",
      "Works with any language of prayer.",
      "Loved by traders, travellers and homemakers.",
    ],
    useCases: [
      "Choosing a good time to leave for a journey (Chal).",
      "Business/finance in Labh choghadiya.",
      "Auspicious purchase in Amrit.",
      "Avoiding Kaal for signing anything critical.",
    ],
    mistakes: [
      "Ignoring the day lord — Sunday starts with Udveg (Sun), Monday with Amrit (Moon), and so on.",
      "Using clock hours — choghadiya periods are 1/8th of day/night length, so they stretch or shrink with the season.",
      "Blindly avoiding all inauspicious ones — they're windows for caution, not curses.",
    ],
    formula: {
      title: "How Choghadiya is built",
      body: "Day (sunrise→sunset) is split into 8 equal parts; night (sunset→sunrise) into 8 more. The sequence of names cycles: Udveg, Chal, Labh, Amrit, Kaal, Shubh, Rog. The starting name depends on the weekday.",
    },
    accuracy: "Sunrise/sunset from astronomy-engine; boundaries exact to the minute.",
    privacy: "City stored on device only.",
    faqs: [
      {
        q: "Which is the best choghadiya?",
        a: "Amrit is generally regarded as the most auspicious, followed by Shubh and Labh.",
      },
      {
        q: "Is Kaal choghadiya as bad as Rahu Kaal?",
        a: "Kaal is a caution window but generally less strict than Rahu Kaal. Together they define daily muhurta hygiene.",
      },
    ],
    relatedSlugs: ["rahu-kaal", "gulika-kaal", "hora-chart", "abhijit-muhurat"],
  },

  // ─── Festivals extras ───────────────────────────────────
  "festival-calendar-2026": {
    intro:
      "The complete 2026 Hindu festival calendar — every major vrat, jayanti, purnima, amavasya and regional festival, drik-computed for your city.",
    howToUse: [
      "Browse by month or filter by category.",
      "Tap any festival for date, vidhi and story.",
      "Add reminders to your calendar.",
      "Switch region (North / South / Bengali / Gujarati).",
    ],
    benefits: [
      "Drik-precise dates, not printed-panchang guesses.",
      "Regional overlays — Tamil, Bengali, Marathi, Gujarati.",
      "Includes minor vrats often missed.",
      "Free & printable.",
    ],
    useCases: [
      "Planning family gatherings and pujas for the year.",
      "Booking travel around Char Dham season.",
      "Coordinating a mandir committee's yearly calendar.",
      "NRI families keeping kids connected to festivals.",
    ],
    mistakes: [
      "Assuming dates are the same across India — many festivals shift by region.",
      "Confusing amanta and purnimanta months.",
      "Missing vrat sunrise-cutoff and starting fasts too late.",
    ],
    accuracy:
      "Astronomy-engine tithi/nakshatra + festival rules engine cross-checked with Kashi and Tirupati almanacs.",
    privacy: "No login required; reminders stay on your device.",
    faqs: [
      {
        q: "Can I download it as PDF?",
        a: "Yes — a printable PDF download will be added in a coming release.",
      },
      {
        q: "Why do some festivals appear twice?",
        a: "Regional variation — e.g. Ganesh Chaturthi and Vinayaka Chaturthi differ in observance rules.",
      },
    ],
    relatedSlugs: ["festival-countdown", "festival-finder", "vrat-calendar", "regional-festivals"],
  },
  "festival-finder": {
    intro:
      "Search any Hindu festival by name, deity or date — get the exact date, story, puja vidhi and regional variations in one place.",
    howToUse: [
      "Type a festival name or deity.",
      "Pick from the suggestions.",
      "Read date, story and vidhi.",
      "Save to your calendar.",
    ],
    benefits: [
      "Handles regional spelling variations.",
      "Includes lesser-known vrats.",
      "Fast — indexed for instant search.",
      "Cross-linked with related tools.",
    ],
    useCases: [
      "Quickly confirming an upcoming festival's date.",
      "Learning a new region's festival before travel.",
      "Teaching children the story behind a festival.",
      "Cross-referencing dates for a wedding calendar.",
    ],
    mistakes: [
      "Searching only in English — try the Hindi/Sanskrit name too.",
      "Ignoring the year — some festivals shift months across years.",
    ],
    accuracy: "Dates from the festival rules engine; text reviewed by acharyas quarterly.",
    privacy: "Searches are not logged.",
    faqs: [
      {
        q: "Are regional festivals included?",
        a: "Yes — Onam, Pongal, Vishu, Bihu, Chhath and more.",
      },
      {
        q: "What about Buddhist and Jain festivals?",
        a: "Only those celebrated within Sanatan Dharma tradition (e.g. Buddha Purnima).",
      },
    ],
    relatedSlugs: ["festival-calendar-2026", "festival-countdown", "festival-of-the-day"],
  },
  "ekadashi-dates": {
    intro:
      "All 24 (or 26 with adhika) ekadashis of the year — Utpanna, Mokshada, Nirjala and more — with tithi window, parana time and vrat vidhi.",
    howToUse: [
      "Set your city for accurate parana time.",
      "See upcoming ekadashi countdown.",
      "Read the story and vidhi for each.",
      "Set a reminder the day before.",
    ],
    benefits: [
      "Correct sunrise-based parana window for your city.",
      "All 24 names with meaning.",
      "Adhika-maas ekadashis flagged automatically.",
      "Story + vidhi for each.",
    ],
    useCases: [
      "Starting a monthly ekadashi vrat.",
      "Doing Nirjala ekadashi with correct parana.",
      "Planning Vaikuntha ekadashi darshan trips.",
      "Teaching family the meaning behind each ekadashi.",
    ],
    mistakes: [
      "Missing parana window — vrat is broken by eating outside it.",
      "Confusing smarta vs vaishnava ekadashi (different when tithi overlaps).",
      "Eating grains — most ekadashis prohibit them.",
    ],
    accuracy: "Tithi computation via astronomy-engine; parana per drik sunrise + tithi end.",
    privacy: "Location on-device only.",
    faqs: [
      {
        q: "Smarta or Vaishnava ekadashi?",
        a: "We show Vaishnava (recommended for householders) by default; smarta shown when different.",
      },
      {
        q: "Can I do Nirjala without water?",
        a: "Only if your health permits. Consult a doctor if you are pregnant, elderly or on medication.",
      },
    ],
    relatedSlugs: ["pradosh-vrat", "sankashti-chaturthi", "vrat-calendar", "purnima-amavasya"],
  },
  "purnima-amavasya": {
    intro:
      "Every full-moon and new-moon date of the year with the exact tithi start/end times, festival overlaps and ideal rituals for each.",
    howToUse: [
      "See the current month's purnima and amavasya.",
      "Tap a date for tithi window, festival overlap and vidhi.",
      "Add reminders to your calendar.",
      "Bookmark shraddha amavasyas for pitru rituals.",
    ],
    benefits: [
      "Correct tithi window for shraddha and satyanarayan puja.",
      "Highlights auspicious purnimas (Guru, Sharad, Vaikuntha).",
      "Clear vidhi for each observance.",
      "Multi-year lookup.",
    ],
    useCases: [
      "Booking a Satyanarayan katha on purnima.",
      "Doing shraddha on amavasya with correct tithi.",
      "Chandra namaskar on purnima.",
      "Pitru tarpan on Mahalaya amavasya.",
    ],
    mistakes: [
      "Using clock midnight as tithi boundary — Hindu tithi is sunrise-relative.",
      "Doing shraddha on wrong amavasya (Bhaadrapada vs regular).",
    ],
    accuracy: "Tithi accurate to the minute via astronomy-engine.",
    privacy: "No data uploaded.",
    faqs: [
      {
        q: "What if purnima and amavasya span two days?",
        a: "We show tithi start/end in your local time; use the day that contains sunrise-plus-tithi.",
      },
      {
        q: "Is Sharad Purnima the same as Kojagara?",
        a: "Yes — Sharad Purnima in the North is Kojagari Purnima in Bengal.",
      },
    ],
    relatedSlugs: ["ekadashi-dates", "moon-phase", "vrat-calendar"],
  },
  "regional-festivals": {
    intro:
      "Festival dates and rituals from every region of India — Tamil, Bengali, Marathi, Gujarati, Odia, Assamese, Kashmiri and more — one calendar, all traditions.",
    howToUse: [
      "Pick a region or state.",
      "Browse the region's festival calendar.",
      "Read the story and rituals.",
      "Add reminders.",
    ],
    benefits: [
      "One calendar for a pan-India family.",
      "Preserves regional festival names in native scripts.",
      "Covers harvest, new-year and deity-specific festivals.",
      "Great for NRIs teaching kids.",
    ],
    useCases: [
      "Planning Onam sadya, Pongal, Baisakhi, Bihu.",
      "Celebrating a spouse's regional festival.",
      "School projects on Indian culture.",
      "Community mandir event planning.",
    ],
    mistakes: [
      "Assuming all Indians celebrate the same festival on the same day.",
      "Missing Tamil month cutoffs (Chithirai vs Vaikasi).",
      "Confusing Bengali panjika with Drik panchang dates.",
    ],
    accuracy: "Regional almanacs cross-checked with drik computation.",
    privacy: "No login required.",
    faqs: [
      {
        q: "Are dates in native scripts?",
        a: "Names are shown in native scripts where possible; dates use your local time.",
      },
    ],
    relatedSlugs: ["festival-calendar-2026", "festival-finder", "vrat-calendar"],
  },
  "festival-of-the-day": {
    intro:
      "The festival, vrat or jayanti observed today — with a quick summary of its story, deity and how to observe it.",
    howToUse: [
      "Open the tool — today's observance is shown.",
      "Read the story and quick vidhi.",
      "Tap through to the full festival page.",
      "Share with family.",
    ],
    benefits: [
      "Never miss a festival, even minor ones.",
      "Family-friendly summaries.",
      "Links to full puja vidhi.",
      "Great for the homepage widget.",
    ],
    useCases: [
      "Daily WhatsApp forward for family groups.",
      "Morning ritual — read today's festival with tea.",
      "Teaching children something new every day.",
      "Puja planning at short notice.",
    ],
    mistakes: [
      "Assuming 'no festival today' means an idle day — many days have a minor vrat.",
      "Ignoring regional overlays.",
    ],
    accuracy: "Drik-computed observance dates.",
    privacy: "No data uploaded.",
    faqs: [
      {
        q: "Why nothing shown today?",
        a: "Some days have no major observance in the selected region. Try switching region.",
      },
    ],
    relatedSlugs: ["festival-countdown", "upcoming-festivals", "daily-quote"],
  },
  "upcoming-festivals": {
    intro:
      "A rolling 30-day window of every upcoming Hindu festival, vrat and jayanti — never be caught unprepared.",
    howToUse: [
      "See the next 30 days at a glance.",
      "Filter by category (vrat, jayanti, purnima).",
      "Tap a card for full details.",
      "Add reminders 1–3 days in advance.",
    ],
    benefits: [
      "Plan puja samagri shopping in advance.",
      "Coordinate family visits.",
      "Book travel for pilgrimages.",
      "Set fasting preparation reminders.",
    ],
    useCases: [
      "Monthly household planning.",
      "Mandir committee coordination.",
      "Vlog / blog content calendars.",
    ],
    mistakes: [
      "Only checking one day ahead — many vrats need day-before prep (like Karva Chauth material).",
      "Ignoring region — the same window varies.",
    ],
    accuracy: "Same festival rules engine as the full calendar.",
    privacy: "No data uploaded.",
    faqs: [
      {
        q: "Why 30 days?",
        a: "Long enough to plan, short enough to not overwhelm. Use the full calendar for longer horizons.",
      },
    ],
    relatedSlugs: ["festival-calendar-2026", "festival-countdown", "festival-of-the-day"],
  },

  // ─── Puja extras ────────────────────────────────────────
  "puja-vidhi-planner": {
    intro:
      "Step-by-step puja vidhi for any occasion — Satyanarayan, Ganesh, Lakshmi, Griha Pravesh, Navratri and more — with samagri, mantras and sankalp.",
    howToUse: [
      "Pick the puja from the list.",
      "Read the sequential vidhi.",
      "Check the samagri list.",
      "Recite the sankalp with your details.",
    ],
    benefits: [
      "Structured, no missed steps.",
      "Devanagari + transliteration.",
      "Copy sankalp with one tap.",
      "Cross-linked with samagri checklist.",
    ],
    useCases: [
      "First-timers doing a home puja without a pandit.",
      "NRIs missing traditional guidance.",
      "Refreshing memory before a big puja.",
      "Teaching youngsters the sequence.",
    ],
    mistakes: [
      "Skipping sankalp — the puja's purpose isn't declared.",
      "Forgetting achamana and pranayama before starting.",
      "Using wrong-direction seating (should face east or north).",
    ],
    accuracy: "Vidhis compiled from standard pujavidhi granthas; reviewed by practising acharyas.",
    privacy: "Nothing you enter is uploaded.",
    faqs: [
      {
        q: "Do I need a pandit?",
        a: "For lifecycle sanskaras yes; for regular home pujas, this vidhi is enough for most families.",
      },
      { q: "In which language?", a: "Sanskrit with transliteration; Hindi translation available." },
    ],
    relatedSlugs: [
      "samagri-checklist",
      "sankalp-generator",
      "havan-guide",
      "griha-pravesh-planner",
    ],
  },
  "aarti-thali-guide": {
    intro:
      "How to arrange, light and rotate the aarti thali — items, sequence, direction and the meaning of each element.",
    howToUse: [
      "See the standard thali layout.",
      "Check the item list (deep, kumkum, roli, akshat…).",
      "Follow the rotation direction (clockwise, from feet to head).",
      "Play the matching aarti audio.",
    ],
    benefits: [
      "Never forget an item.",
      "Correct rotation prevents dosha.",
      "Great for new families setting up a mandir.",
      "Includes deity-wise variations.",
    ],
    useCases: [
      "Daily home aarti.",
      "Festival aartis.",
      "Setting up a new home mandir.",
      "Teaching children.",
    ],
    mistakes: [
      "Rotating anti-clockwise (only done for specific rituals).",
      "Skipping the shankh naad before aarti.",
      "Using diya oil that has gone rancid.",
    ],
    accuracy: "Standard grihya sutra practice; deity-wise variations noted where applicable.",
    privacy: "No data uploaded.",
    faqs: [
      {
        q: "How many times to rotate?",
        a: "Traditionally: 3 times at feet, 2 at navel, 1 at face, 7 total — with variations.",
      },
    ],
    relatedSlugs: ["puja-vidhi-planner", "aarti-collection", "samagri-checklist"],
  },
  "prasad-recipes": {
    intro:
      "Authentic prasad recipes — panchamrit, sheera, sundal, modak, kheer and more — with quantity guidance for small and large gatherings.",
    howToUse: [
      "Pick the deity or occasion.",
      "Read the recipe with quantities.",
      "Scale up/down for the number of people.",
      "Note the offering vidhi at the end.",
    ],
    benefits: [
      "Traditional, tested recipes.",
      "No onion, no garlic.",
      "Scalable for small home or bhandara.",
      "Includes offering etiquette.",
    ],
    useCases: [
      "Ganesh Chaturthi modaks.",
      "Satyanarayan sheera.",
      "Krishna Janmashtami panjiri.",
      "Ekadashi phalahar.",
    ],
    mistakes: [
      "Tasting before offering — prasad is offered first.",
      "Using stainless steel bhog thali — silver/copper preferred.",
      "Making prasad in an unclean space.",
    ],
    accuracy:
      "Recipes verified against regional grandmothers' notebooks 🙂 and standard grihya practice.",
    privacy: "No data uploaded.",
    faqs: [
      {
        q: "Can I use eggs?",
        a: "No — prasad is strictly satvik: no eggs, onion, garlic, mushroom or alcohol.",
      },
    ],
    relatedSlugs: ["puja-vidhi-planner", "samagri-checklist", "aarti-thali-guide"],
  },
  "puja-checklist-generator": {
    intro:
      "Generate a printable puja checklist for any occasion — samagri, kitchen items, seating and cleanup — no more last-minute panic.",
    howToUse: [
      "Pick your puja type.",
      "Set number of people expected.",
      "Review the auto-generated list.",
      "Print or save as PDF.",
    ],
    benefits: [
      "Scales with number of attendees.",
      "Includes often-forgotten items (matchbox, spare wick, tissue).",
      "Split by shop, kitchen and mandir.",
      "Reusable — save your presets.",
    ],
    useCases: [
      "First puja in a new home.",
      "Big Diwali Lakshmi puja.",
      "Kids' upanayana or namkaran.",
      "Community havan planning.",
    ],
    mistakes: [
      "Buying samagri last-minute — some items (kumkum, mauli) run out on festival days.",
      "Ignoring cleanup items (bags for nirmalya).",
    ],
    accuracy: "Item lists compiled from standard vidhi + practical experience.",
    privacy: "Saved lists stay on your device.",
    faqs: [{ q: "Can I customise the list?", a: "Yes — add or remove items after generation." }],
    relatedSlugs: ["samagri-checklist", "puja-vidhi-planner", "sankalp-generator"],
  },

  // ─── Collections ────────────────────────────────────────
  "aarti-collection": {
    intro:
      "A growing library of aartis in Devanagari with transliteration, meaning and audio — from Om Jai Jagdish Hare to regional favourites.",
    howToUse: [
      "Search by deity or aarti name.",
      "Read in Devanagari, transliteration or English.",
      "Play audio while performing.",
      "Bookmark your daily aartis.",
    ],
    benefits: [
      "Verified, corrected texts.",
      "Audio at proper speed and swara.",
      "Deity-wise grouping.",
      "Free forever.",
    ],
    useCases: [
      "Morning and evening home aarti.",
      "Learning a new aarti before a festival.",
      "Teaching children with audio.",
      "Community mandir sing-along.",
    ],
    mistakes: [
      "Reading too fast to catch the meaning.",
      "Mispronouncing sanskrit words — use the transliteration and audio.",
      "Doing aarti without ghanti (bell).",
    ],
    accuracy: "Texts cross-verified with printed prayer books.",
    privacy: "Bookmarks stored on device.",
    faqs: [{ q: "Are audio downloads free?", a: "Yes — streaming and download are both free." }],
    relatedSlugs: ["chalisa-collection", "stotra-collection", "aarti-thali-guide"],
  },
  "chalisa-collection": {
    intro:
      "Every major chalisa — Hanuman, Durga, Shiv, Ganesh, Krishna, Saraswati and more — with Devanagari, meaning and audio.",
    howToUse: [
      "Pick a chalisa from the list.",
      "Read verse-by-verse with meaning.",
      "Play audio while chanting.",
      "Track your recitation count.",
    ],
    benefits: [
      "40-verse format perfect for daily paath.",
      "Meanings prevent mechanical recitation.",
      "Trusted texts.",
      "Free audio.",
    ],
    useCases: [
      "Daily paath (esp. Hanuman on Tuesdays/Saturdays).",
      "Mangalvar/Shanivar vrat.",
      "Learning new chalisas for family occasions.",
      "Group paath in mandirs.",
    ],
    mistakes: ["Skipping doha at the beginning and end.", "Racing through without meaning."],
    accuracy: "Sourced from Gita Press and standard editions.",
    privacy: "Bookmarks and counts stay on device.",
    faqs: [
      {
        q: "How many times a day?",
        a: "Once daily is the standard vrat; 7 or 11 times on special days.",
      },
    ],
    relatedSlugs: ["aarti-collection", "stotra-collection", "digital-jaap-counter"],
  },
  "stotra-collection": {
    intro:
      "A curated library of stotras — Vishnu Sahasranama, Lalita Sahasranama, Shiva Tandava, Ramaraksha, Adityahridaya and more — with meaning and audio.",
    howToUse: [
      "Browse by deity or occasion.",
      "Read Devanagari + IAST + English meaning.",
      "Play audio at chanting speed.",
      "Save your daily stotras.",
    ],
    benefits: [
      "Verified textual editions.",
      "Meaning translated by scholars.",
      "Audio at correct swara.",
      "Cross-referenced sources.",
    ],
    useCases: [
      "Daily Vishnu Sahasranama paath.",
      "Shiva Tandava on Mondays.",
      "Adityahridaya at sunrise on Sundays.",
      "Ramaraksha before travel.",
    ],
    mistakes: [
      "Chanting stotras with heavy meat/alcohol influence — traditionally advised against.",
      "Reciting Shiva Tandava too fast — pace and enunciation matter.",
    ],
    accuracy: "Texts from Gita Press, Chinmaya and Ramakrishna Math editions.",
    privacy: "Bookmarks on device only.",
    faqs: [
      {
        q: "Do I need initiation for Lalita Sahasranama?",
        a: "No, but a guru's guidance deepens the practice.",
      },
    ],
    relatedSlugs: ["aarti-collection", "chalisa-collection", "mantra-library"],
  },
  "temple-finder": {
    intro:
      "Find temples near you or in any city — with deity, timings, address, directions and darshan tips.",
    howToUse: [
      "Allow location or search a city.",
      "Filter by deity.",
      "Tap a temple for details, timings and route.",
      "Bookmark to plan a yatra.",
    ],
    benefits: [
      "Covers major temples across India.",
      "One-tap directions.",
      "Dress code and camera rules noted.",
      "Curated — not every roadside shrine.",
    ],
    useCases: [
      "Finding a Ganesh temple in a new city.",
      "Planning a yatra route.",
      "Sunday family darshan trip.",
      "Business trip 'while I'm here' visits.",
    ],
    mistakes: [
      "Turning up without dress code compliance.",
      "Ignoring festival-day extended queues.",
    ],
    accuracy: "Address and timings verified quarterly.",
    privacy: "Location used only for search — not stored on our servers.",
    faqs: [{ q: "Do you show ISKCON temples?", a: "Yes, alongside traditional temples." }],
    relatedSlugs: ["temple-directory", "nearby-temples", "darshan-timings"],
  },

  // ─── Daily / Counters ───────────────────────────────────
  "om-counter": {
    intro: "A calming digital Om counter — tap to count, one hand, one screen, no distractions.",
    howToUse: [
      "Tap the big Om button per chant.",
      "Watch the count and mala progress.",
      "Reset when done.",
      "Bookmark your daily target.",
    ],
    benefits: [
      "Zero distraction — full-screen counter.",
      "Haptic feedback on tap.",
      "No login, no ads.",
      "Works offline.",
    ],
    useCases: [
      "108 Om at Brahma muhurat.",
      "Om Namah Shivaya jaap.",
      "Om Namo Narayana japam.",
      "Kids learning to count malas.",
    ],
    mistakes: [
      "Focusing on the counter instead of the sound — let the count be peripheral.",
      "Rushing to finish — jaap benefits from steady pace.",
    ],
    accuracy: "Counter is exact.",
    privacy: "Counts are stored on your device only.",
    faqs: [{ q: "Can I set custom targets?", a: "Yes — set 108, 1008 or any custom number." }],
    relatedSlugs: ["digital-jaap-counter", "mala-counter", "mantra-timer", "brahma-muhurat"],
  },
  "mala-counter": {
    intro:
      "A pure mala counter — 108 beads per mala, tracks your total malas across a session, day and lifetime.",
    howToUse: [
      "Tap the bead per mantra.",
      "Auto-advance to next mala after 108.",
      "See day/lifetime totals.",
      "Reset when finished.",
    ],
    benefits: [
      "Multiple malas without recounting.",
      "Daily and lifetime totals.",
      "Haptic tick per bead.",
      "Offline.",
    ],
    useCases: [
      "Sadhana with multiple malas.",
      "Chaturmasya sankalp of N malas per day.",
      "Purascharan (fixed-count sadhana).",
    ],
    mistakes: [
      "Counting bhagini bead (meru) in the 108 — it's the marker, not counted.",
      "Reversing direction across the meru — reverse the mala instead.",
    ],
    accuracy: "Exact.",
    privacy: "Counts stored on device.",
    faqs: [
      {
        q: "Difference from Jaap Counter?",
        a: "Mala Counter shows bead-in-mala progress; Jaap Counter is a raw counter.",
      },
    ],
    relatedSlugs: ["digital-jaap-counter", "om-counter", "mantra-timer"],
  },
  "mantra-timer": {
    intro:
      "A gentle mantra jaap timer — set your sadhana duration, get a soft bell at each interval, and end without breaking focus.",
    howToUse: [
      "Set total duration (e.g. 15 minutes).",
      "Optional: set bell interval (every 5 minutes).",
      "Tap start and close your eyes.",
      "Bell rings at the end.",
    ],
    benefits: [
      "No jarring alarm — soft temple bell.",
      "Interval bells anchor the mind.",
      "Works with screen locked.",
      "Free of ads.",
    ],
    useCases: [
      "Timed daily meditation.",
      "Group jaap sessions.",
      "Kids' short jaap practice.",
      "Corporate wellness sessions.",
    ],
    mistakes: [
      "Setting the volume too high — soft bell is intentional.",
      "Watching the timer — close your eyes.",
    ],
    accuracy: "Timer accurate to the second.",
    privacy: "Nothing uploaded.",
    faqs: [
      {
        q: "Does it work in the background?",
        a: "Yes on desktop; iOS/Android may pause when tab is inactive — use the PWA install for background support.",
      },
    ],
    relatedSlugs: ["digital-jaap-counter", "mala-counter", "om-counter"],
  },
  "daily-quote": {
    intro:
      "One handpicked verse from the Gita, Upanishads or a saint every day — with translation and a one-line reflection.",
    howToUse: [
      "Open the tool — today's quote is shown.",
      "Read in Sanskrit + English.",
      "Tap the reflection prompt.",
      "Share on WhatsApp or bookmark.",
    ],
    benefits: [
      "Never repeats within a year.",
      "Balanced across texts and traditions.",
      "One-line reflections that actually land.",
      "Great share format.",
    ],
    useCases: [
      "Morning intention setting.",
      "WhatsApp status.",
      "Journaling prompt.",
      "Kids' school assembly.",
    ],
    mistakes: [
      "Reading only English — the Sanskrit sound has its own effect.",
      "Sharing without reading — read first, then share.",
    ],
    accuracy: "Sourced from Gita Press, Chinmaya Mission and Ramakrishna Math translations.",
    privacy: "No login needed.",
    faqs: [
      { q: "Can I get it by email?", a: "Yes — subscribe to the newsletter for the daily quote." },
    ],
    relatedSlugs: ["daily-shlok", "bhagavad-gita", "deity-of-the-day"],
  },
  "daily-shlok": {
    intro:
      "One deep shloka every day — with word-by-word meaning, translation and a short commentary.",
    howToUse: [
      "Open the tool — today's shloka appears.",
      "Read Sanskrit + word split + meaning.",
      "Read the short commentary.",
      "Save to your journal.",
    ],
    benefits: [
      "Word-by-word — real learning, not just quoting.",
      "Rotates across Gita, Upanishads, Ramayana, Mahabharata.",
      "Commentary from classical acharyas.",
      "Free.",
    ],
    useCases: [
      "Daily Sanskrit study.",
      "Family shloka time.",
      "Prep before a swadhyaya group.",
      "Kids memorising shlokas.",
    ],
    mistakes: ["Trying to memorise without meaning — meaning first, memory follows."],
    accuracy: "Word splits verified against Monier-Williams; translations from standard editions.",
    privacy: "No login needed.",
    faqs: [
      {
        q: "Different from Daily Quote?",
        a: "Daily Shlok goes deeper with word-by-word; Daily Quote is one-line inspiration.",
      },
    ],
    relatedSlugs: ["daily-quote", "ai-shlok-explainer", "bhagavad-gita"],
  },

  // ─── AI ─────────────────────────────────────────────────
  "ai-dharma-assistant": {
    intro:
      "Ask anything about Sanatan Dharma — scripture, ritual, philosophy, festivals, mantras — and get a thoughtful, source-cited answer in seconds.",
    howToUse: [
      "Type your question in any language.",
      "Read the answer with sources.",
      "Ask a follow-up to go deeper.",
      "Copy or share the answer.",
    ],
    benefits: [
      "Trained on verified Sanatan sources.",
      "Cites the shloka or shastra referenced.",
      "Multilingual — Hindi, English, Tamil and more.",
      "Avoids sectarian bias.",
    ],
    useCases: [
      "Explaining a ritual to a curious child.",
      "Clarifying a shloka's meaning.",
      "Finding a mantra for a specific intent.",
      "Comparing sampradaya views.",
    ],
    mistakes: [
      "Treating AI answers as pramana — always verify with a guru or shastra.",
      "Asking leading questions and taking the answer literally.",
    ],
    accuracy:
      "AI is a study aid, not authoritative shastra. Cross-check with a qualified guru for practice-changing decisions.",
    privacy: "Chats are not linked to your identity. Do not share personal secrets.",
    faqs: [
      { q: "Does it replace a guru?", a: "No. It helps you study; a guru gives you dharma." },
      {
        q: "Which model?",
        a: "Lovable AI Gateway — currently Gemini-class quality with Sanatan-tuned prompts.",
      },
    ],
    relatedSlugs: ["ai-gita-summary", "ai-shlok-explainer", "ai-mantra-meaning"],
  },
  "ai-gita-summary": {
    intro:
      "Get a clear, chapter-wise summary of any Bhagavad Gita adhyaya — with the shlokas, key themes and life takeaways.",
    howToUse: [
      "Pick a chapter (1–18).",
      "Read the AI-generated summary.",
      "Tap any shloka to open it in the shlok explainer.",
      "Share the summary.",
    ],
    benefits: [
      "18 chapters distilled to essential points.",
      "Preserves the Gita's original sequence.",
      "Highlights themes across chapters.",
      "Great for revision.",
    ],
    useCases: [
      "Prep before a Gita swadhyaya group.",
      "Kids' school project on the Gita.",
      "Quick refresher after finishing a chapter.",
      "Sharing on social media.",
    ],
    mistakes: [
      "Reading only the summary — read the Gita itself for depth.",
      "Skipping across chapters — the Gita builds sequentially.",
    ],
    accuracy: "AI cross-checked against Adi Shankara, Chinmaya and Ramakrishna commentaries.",
    privacy: "No account required.",
    faqs: [
      {
        q: "Whose commentary is it based on?",
        a: "A synthesis of major classical acharyas' interpretations.",
      },
    ],
    relatedSlugs: ["bhagavad-gita", "ai-shlok-explainer", "daily-shlok"],
  },
  "ai-shlok-explainer": {
    intro:
      "Paste any Sanskrit shloka — from Gita, Upanishads, Puranas or stotras — and get a word-by-word split, translation and commentary.",
    howToUse: [
      "Paste or type the shloka (Devanagari or IAST).",
      "Get word split, meaning and commentary.",
      "Ask a follow-up for deeper interpretation.",
      "Save to your notebook.",
    ],
    benefits: [
      "Handles almost any classical text.",
      "Word-by-word split — real understanding.",
      "Multiple commentary angles.",
      "Fast — under a few seconds.",
    ],
    useCases: [
      "Studying an unfamiliar stotra.",
      "Preparing a talk or class.",
      "Understanding your ishta-devata's mantra.",
      "Explaining a shloka to a friend.",
    ],
    mistakes: [
      "Feeding a mistyped shloka — check for missing vowels.",
      "Trusting AI blindly for advanced Vedantic verses — cross-check with acharya bhashya.",
    ],
    accuracy: "Strong for classical Sanskrit; verify rare tantra/agamic verses with a scholar.",
    privacy: "Shlokas you paste are not stored or shared.",
    faqs: [
      {
        q: "Does it explain Vedic mantras?",
        a: "Yes, though Vedic accents (svara) are handled to the extent AI can — a guru is preferred for chanting.",
      },
    ],
    relatedSlugs: ["ai-gita-summary", "sanskrit-dictionary", "daily-shlok"],
  },
  "ai-festival-guide": {
    intro:
      "Ask about any Hindu festival — get its story, significance, regional variations and how to observe it, in your language.",
    howToUse: [
      "Type the festival name or ask a question.",
      "Read the story, dates and vidhi.",
      "Ask a follow-up for regional details.",
      "Share with family.",
    ],
    benefits: [
      "Covers major and lesser-known festivals.",
      "Regional variations included.",
      "Story + vidhi in one place.",
      "Answers follow-ups naturally.",
    ],
    useCases: [
      "Teaching kids the story before a festival.",
      "Learning your spouse's regional festival.",
      "Prep for a mandir talk.",
      "Content ideas for creators.",
    ],
    mistakes: ["Not verifying date — always cross-check with the festival calendar tool."],
    accuracy: "AI, cross-checked with the drik-based festival calendar for dates.",
    privacy: "No account required.",
    faqs: [{ q: "Does it know regional festivals?", a: "Yes — Onam, Pongal, Bihu, Chhath, etc." }],
    relatedSlugs: ["festival-calendar-2026", "festival-finder", "ai-dharma-assistant"],
  },
  "ai-puja-planner": {
    intro:
      "Describe your occasion — housewarming, birthday, wedding anniversary, business launch — and get a customised puja plan with vidhi, samagri, mantras and muhurat suggestions.",
    howToUse: [
      "Describe the occasion in one line.",
      "Set date, city and family tradition.",
      "Get a full plan — vidhi, samagri, mantras.",
      "Save or print.",
    ],
    benefits: [
      "Tailored to your occasion.",
      "Mahurat-aware.",
      "Regional tradition-aware.",
      "Beginner-friendly language.",
    ],
    useCases: [
      "Griha pravesh in a new home.",
      "Business inauguration.",
      "First birthday of a child.",
      "Wedding anniversary sankalp.",
    ],
    mistakes: ["Skipping the muhurat check.", "Ordering samagri last-minute."],
    accuracy:
      "AI + drik muhurat computation. For lifecycle sanskaras, consult a pandit for finality.",
    privacy: "Occasion details are not stored beyond your session.",
    faqs: [
      {
        q: "Can it replace a pandit?",
        a: "For simple home pujas, yes. For major sanskaras, no — but you'll walk in prepared.",
      },
    ],
    relatedSlugs: ["puja-vidhi-planner", "samagri-checklist", "sankalp-generator"],
  },
  "ai-mantra-meaning": {
    intro:
      "Get the meaning, benefit, procedure and cautions of any Sanatan mantra — beej, deity, or verse — with word-by-word breakdown.",
    howToUse: [
      "Type or paste the mantra.",
      "Read meaning, benefit and vidhi.",
      "Ask for jaap count and best time.",
      "Save to your sadhana notes.",
    ],
    benefits: [
      "Word-by-word meaning.",
      "Deity, benefit and count.",
      "Cautions for restricted mantras noted.",
      "Instant.",
    ],
    useCases: [
      "Understanding your ishta mantra.",
      "Choosing a mantra for a specific goal.",
      "Preparing for a mantra deeksha.",
      "Teaching mantras to children.",
    ],
    mistakes: [
      "Beginning mantras with strict rules (some tantric) without a guru.",
      "Reading meaning but ignoring pronunciation.",
    ],
    accuracy: "AI-based — verify beej and tantric mantras with a qualified guru.",
    privacy: "Mantras you paste are not stored.",
    faqs: [
      {
        q: "Does it handle beej mantras?",
        a: "Yes, with cautions where deeksha is traditionally required.",
      },
    ],
    relatedSlugs: ["mantra-library", "beej-mantras", "mantra-recommender"],
  },
  "ai-sanskrit-helper": {
    intro:
      "A conversational Sanskrit tutor — translate, conjugate, explain sandhi, or drill vocabulary at your level.",
    howToUse: [
      "Ask a question in English or Sanskrit.",
      "Get an answer with examples.",
      "Ask for a quiz on the topic.",
      "Save your progress.",
    ],
    benefits: [
      "Learn at your pace.",
      "Answers grammar and vocab.",
      "Great for exam prep (CBSE/UGC Sanskrit).",
      "Playful — offers drills and quizzes.",
    ],
    useCases: [
      "Learning declensions.",
      "Understanding sandhi rules.",
      "Translating a paragraph.",
      "Prep for a Sanskrit test.",
    ],
    mistakes: [
      "Skipping drills — Sanskrit needs repetition.",
      "Learning grammar without reading real texts.",
    ],
    accuracy: "Strong for classical grammar; verify rare exceptions with a Sanskrit scholar.",
    privacy: "Conversations not stored beyond session.",
    faqs: [
      {
        q: "Can it teach beginners?",
        a: "Yes — pick your level (beginner, intermediate, advanced).",
      },
    ],
    relatedSlugs: ["sanskrit-dictionary", "transliteration", "verb-conjugator", "sandhi-splitter"],
  },
  "mantra-recommender": {
    intro:
      "Describe your intent — health, wealth, focus, protection, marriage — and AI suggests three traditional mantras with meaning, benefit and daily jaap count.",
    howToUse: [
      "Describe your intent in one line.",
      "Get three mantras with meaning.",
      "Pick one and note the count.",
      "Open the jaap counter to begin.",
    ],
    benefits: [
      "Curated from classical sources.",
      "Three options — not one — so you can choose the one that resonates.",
      "Practical jaap counts (108, 1008, purascharan).",
      "No shady tantric shortcuts.",
    ],
    useCases: [
      "Choosing a personal mantra.",
      "Finding a family protection mantra.",
      "Health-focused sadhana.",
      "Focus / study mantras for students.",
    ],
    mistakes: [
      "Starting tantric mantras without deeksha.",
      "Jumping between mantras — commit to one for at least 40 days.",
    ],
    accuracy: "AI + a curated corpus of classical mantras.",
    privacy: "Intent descriptions not stored.",
    faqs: [
      {
        q: "How long till results?",
        a: "Traditional purascharan is 40 days, 108 malas per day. Choose the count that fits your life.",
      },
    ],
    relatedSlugs: ["mantra-library", "beej-mantras", "digital-jaap-counter", "ai-mantra-meaning"],
  },
  "baby-name-ai": {
    intro:
      "Get AI-crafted Sanskrit baby names based on nakshatra, birth syllable, meaning and gender — with pronunciation and etymology.",
    howToUse: [
      "Enter birth date/time (or nakshatra directly).",
      "Pick gender and syllable preferences.",
      "Get 20+ names with meanings.",
      "Bookmark favourites.",
    ],
    benefits: [
      "Nakshatra-syllable aware.",
      "Meaning-first — no random-sounding names.",
      "Multi-cultural (Vedic, Puranic, modern classical).",
      "Fresh — not the same top-10 lists.",
    ],
    useCases: [
      "Naming a newborn.",
      "Preparing for a namkaran.",
      "Pen names / artist names.",
      "Renaming a business with a Vedic touch.",
    ],
    mistakes: [
      "Picking a name without checking the meaning.",
      "Ignoring nakshatra syllable in traditional families.",
    ],
    accuracy: "AI + curated Sanskrit lexicon. Verify rare names with an acharya.",
    privacy: "Birth details used only to compute nakshatra — not stored on our servers.",
    faqs: [
      {
        q: "Devanagari included?",
        a: "Yes — every name is shown in Devanagari, IAST and English.",
      },
    ],
    relatedSlugs: ["names-by-nakshatra", "names-by-meaning", "names-by-deity", "ai-name-suggester"],
  },
  "ai-name-suggester": {
    intro:
      "AI Sanskrit name suggester — describe the feel you want (strong, gentle, spiritual, modern) and get curated names with meanings.",
    howToUse: [
      "Describe the vibe or meaning.",
      "Pick gender.",
      "Get suggestions with meaning and origin.",
      "Save your shortlist.",
    ],
    benefits: [
      "Vibe-first — describe in plain words.",
      "Meaning + etymology.",
      "Nakshatra-optional.",
      "Multiple traditions covered.",
    ],
    useCases: [
      "Shortlisting names before namkaran.",
      "Naming a pet or a new business.",
      "Choosing a spiritual name.",
    ],
    mistakes: [
      "Skipping pronunciation — try saying the name aloud.",
      "Ignoring initials that create awkward acronyms.",
    ],
    accuracy: "AI + curated lexicon.",
    privacy: "Descriptions not stored beyond session.",
    faqs: [
      {
        q: "Difference from Baby Name AI?",
        a: "This is vibe-first; Baby Name AI is birth-detail-first.",
      },
    ],
    relatedSlugs: ["baby-name-ai", "names-by-nakshatra", "names-by-meaning"],
  },

  // ─── Calculators extras ─────────────────────────────────
  "rashi-calculator": {
    intro:
      "Find your Vedic moon sign (rashi) instantly from your birth date, time and place — the foundation of Vedic astrology.",
    howToUse: [
      "Enter birth date, time and city.",
      "See your rashi with the moon's exact position.",
      "Read the rashi's characteristics.",
      "Continue to nakshatra or full kundli.",
    ],
    benefits: [
      "Uses drik ephemeris — accurate to the arcminute.",
      "Lahiri ayanamsa (standard).",
      "Includes navamsa rashi.",
      "Free.",
    ],
    useCases: [
      "Confirming your rashi before starting a vrat.",
      "Matchmaking prep.",
      "Choosing a rashi-appropriate mantra or gemstone.",
    ],
    mistakes: [
      "Confusing rashi (moon sign) with your western sun sign.",
      "Using a rough birth time — even 15 minutes off can shift ascendant.",
    ],
    formula: {
      title: "How rashi is computed",
      body: "Compute the moon's tropical longitude at your birth moment; subtract Lahiri ayanamsa; divide by 30° — the resulting 1–12 index maps to Mesha through Meena.",
    },
    accuracy: "Astronomy-engine + Lahiri ayanamsa. Matches classical Vedic software.",
    privacy: "Birth details used only to compute — not stored on our servers.",
    faqs: [
      {
        q: "What if I don't know exact birth time?",
        a: "Use noon; rashi rarely shifts within a day, but nakshatra can.",
      },
    ],
    relatedSlugs: ["nakshatra-finder", "kundli-generator", "rashi-guide"],
  },
  "nakshatra-finder": {
    intro:
      "Find your janma nakshatra and pada from birth details — the star under which your moon was travelling at your first breath.",
    howToUse: [
      "Enter birth date, time and city.",
      "See nakshatra, pada and ruling deity.",
      "Read the nakshatra's traits.",
      "Explore its mantra and dasha.",
    ],
    benefits: [
      "Drik-precise.",
      "Includes pada (1–4) — often missed.",
      "Shows nakshatra deity and mantra.",
      "Free.",
    ],
    useCases: [
      "Confirming nakshatra before a vrat.",
      "Nakshatra-based baby naming.",
      "Choosing appropriate charity items.",
      "Vimshottari dasha computation.",
    ],
    mistakes: [
      "Rounding birth time — nakshatra can change every ~13 hours (pada every ~3 hours).",
      "Confusing western zodiac with nakshatra.",
    ],
    formula: {
      title: "Nakshatra formula",
      body: "Moon's sidereal longitude divided by 13°20′ gives 1–27; further divided into quarters of 3°20′ each gives the pada 1–4.",
    },
    accuracy: "Astronomy-engine + Lahiri ayanamsa.",
    privacy: "Birth details processed on device / not stored on our servers.",
    faqs: [
      {
        q: "Which nakshatra suits my pada for naming?",
        a: "The Nakshatra Guide tool lists the syllables for each pada.",
      },
    ],
    relatedSlugs: ["rashi-calculator", "nakshatra-guide", "names-by-nakshatra", "dasha-calculator"],
  },
  "dasha-calculator": {
    intro:
      "Your Vimshottari mahadasha timeline — starting from your janma nakshatra — with balance-at-birth and antar-dasha breakdown.",
    howToUse: [
      "Enter birth date, time and city.",
      "See your dasha sequence with dates.",
      "Tap a mahadasha for antar-dasha.",
      "Print or save the timeline.",
    ],
    benefits: [
      "Full 120-year cycle.",
      "Correct balance at birth from nakshatra remainder.",
      "Antar-dasha down to pratyantar level.",
      "Free — no gimmicky paywalls.",
    ],
    useCases: [
      "Understanding a difficult period.",
      "Timing major life decisions.",
      "Prep before consulting an astrologer.",
      "Cross-checking software output.",
    ],
    mistakes: [
      "Ignoring balance-at-birth — the first mahadasha is almost never a full period.",
      "Interpreting dasha without the full chart context.",
    ],
    formula: {
      title: "Vimshottari basics",
      body: "Each of the 9 planets rules a fixed number of years (Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 = 120). The starting lord is determined by your janma nakshatra; the balance uses the fraction of the nakshatra remaining at birth.",
    },
    accuracy: "Astronomy-engine + Lahiri ayanamsa. Matches Parashari standard.",
    privacy: "Birth details used only to compute — not stored on our servers.",
    faqs: [
      { q: "What about Yogini dasha?", a: "Yogini and Ashtottari dashas are on the roadmap." },
    ],
    relatedSlugs: ["kundli-generator", "nakshatra-finder", "rashi-calculator"],
  },

  // ─── Baby Names (5) ─────────────────────────────────────
  "names-by-nakshatra": {
    intro:
      "Traditional Sanskrit baby names organised by nakshatra and pada — with the correct starting syllable, meaning and Devanagari script.",
    howToUse: [
      "Pick the nakshatra (or compute it).",
      "Choose pada (1–4).",
      "See names with the correct syllable.",
      "Bookmark favourites.",
    ],
    benefits: [
      "Syllable-precise — pada matters.",
      "Meaning-first — no gibberish names.",
      "Male, female and neutral options.",
      "Devanagari + IAST + pronunciation.",
    ],
    useCases: [
      "Namkaran sanskara.",
      "Traditional families following syllable rules.",
      "Naming twins with matching padas.",
    ],
    mistakes: [
      "Using nakshatra without pada — the syllable changes every 3°20′.",
      "Choosing a name only for how it sounds.",
    ],
    accuracy: "Syllable table per Muhurta Chintamani; names sourced from Sanskrit lexicons.",
    privacy: "Bookmarks stored on device.",
    faqs: [
      {
        q: "Are non-Sanskrit names included?",
        a: "Only Sanskrit-derived names are listed here; use Baby Name AI for broader options.",
      },
    ],
    relatedSlugs: ["names-by-rashi", "names-by-deity", "baby-name-ai", "nakshatra-finder"],
  },
  "names-by-rashi": {
    intro:
      "Baby names starting with rashi-appropriate syllables — the alternative to nakshatra-pada naming in some traditions.",
    howToUse: [
      "Pick the rashi (moon sign).",
      "See names with the rashi's syllables.",
      "Filter by gender.",
      "Bookmark favourites.",
    ],
    benefits: ["Rashi-syllable aware.", "Meaning included.", "Devanagari + IAST.", "Multi-gender."],
    useCases: [
      "Families that name by rashi rather than nakshatra.",
      "Simpler alternative to pada-based naming.",
    ],
    mistakes: ["Assuming rashi rules replace nakshatra everywhere — regional traditions differ."],
    accuracy: "Rashi-syllable table per traditional muhurta texts.",
    privacy: "Bookmarks on device.",
    faqs: [
      {
        q: "Rashi or nakshatra — which is correct?",
        a: "Traditionally nakshatra-pada is stricter; rashi is a common simplification.",
      },
    ],
    relatedSlugs: ["names-by-nakshatra", "rashi-calculator", "baby-name-ai"],
  },
  "names-by-deity": {
    intro:
      "Names inspired by deities — Vishnu, Shiva, Devi, Ganesha, Krishna, Rama, Hanuman, Saraswati — with meaning and story reference.",
    howToUse: [
      "Pick a deity.",
      "Browse names with meaning.",
      "Filter by gender.",
      "Bookmark favourites.",
    ],
    benefits: [
      "Direct connection to a beloved deity.",
      "Meanings + Purana references.",
      "Male, female and neutral.",
      "Includes lesser-known avatara names.",
    ],
    useCases: [
      "Ishta-devata inspired naming.",
      "Multiple children with a common deity theme.",
      "Choosing a name after a particular kripa experience.",
    ],
    mistakes: [
      "Choosing a name whose meaning is heavier than the child (e.g. Shiva's terrible-form names).",
    ],
    accuracy: "Names cross-verified with Purana references.",
    privacy: "Bookmarks on device.",
    faqs: [
      {
        q: "Can I mix deities?",
        a: "Yes — combining names is common (e.g. Radhakrishna, Sitaram).",
      },
    ],
    relatedSlugs: ["names-by-nakshatra", "names-by-meaning", "deity-encyclopedia"],
  },
  "names-by-meaning": {
    intro:
      "Search Sanskrit baby names by the meaning you want — courage, joy, wisdom, moonlight, blessing — with etymology and Devanagari script.",
    howToUse: [
      "Type a meaning or vibe.",
      "Get names matching the theme.",
      "Read etymology and gender.",
      "Bookmark favourites.",
    ],
    benefits: [
      "Meaning-first search.",
      "Fresh names, not the tired top-100.",
      "Etymology and root explained.",
      "Devanagari + IAST.",
    ],
    useCases: [
      "Meaning-driven naming.",
      "Renaming a business or art project.",
      "Choosing a spiritual name.",
    ],
    mistakes: [
      "Falling for a beautiful sound without checking meaning.",
      "Ignoring pronunciation difficulty in your country.",
    ],
    accuracy: "Names verified against Monier-Williams and standard lexicons.",
    privacy: "Searches not stored.",
    faqs: [
      {
        q: "Can I combine meanings?",
        a: "Yes — try queries like 'moon and wisdom' or 'lotus and courage'.",
      },
    ],
    relatedSlugs: ["names-by-deity", "names-by-nakshatra", "baby-name-ai"],
  },
  "twin-names": {
    intro:
      "Beautifully paired Sanskrit names for twins — matching by meaning, sound, deity or nakshatra pada — with etymology and pronunciation.",
    howToUse: [
      "Pick the pairing style (meaning, sound, deity).",
      "Set genders (b-b, g-g, b-g).",
      "Browse pairs with matching meaning.",
      "Bookmark favourite pairs.",
    ],
    benefits: [
      "Curated pairs, not random.",
      "Multiple pairing logics.",
      "Meaning-first.",
      "Devanagari + IAST + pronunciation.",
    ],
    useCases: [
      "Naming newborn twins.",
      "Naming two connected businesses.",
      "Sibling names when the older child already has a Sanskrit name.",
    ],
    mistakes: [
      "Picking a pair that rhymes but has clashing meanings.",
      "Overlooking initial-letter overlap that gets confusing later.",
    ],
    accuracy: "Pair curation reviewed against Sanskrit lexicon.",
    privacy: "Bookmarks on device.",
    faqs: [
      {
        q: "Can I match my older child's name?",
        a: "Yes — enter it in the input and get a matching name for the newborn.",
      },
    ],
    relatedSlugs: ["names-by-nakshatra", "names-by-meaning", "baby-name-ai"],
  },

  // ─── Learning (12) ──────────────────────────────────────
  "bhagavad-gita": {
    intro:
      "The complete Bhagavad Gita — all 18 chapters, 700 shlokas — in Devanagari with word-by-word meaning, translation and classical commentary.",
    howToUse: [
      "Pick a chapter.",
      "Read shloka-by-shloka.",
      "Tap any word for meaning.",
      "Read commentary from major acharyas.",
    ],
    benefits: [
      "Full text — not extracts.",
      "Word-by-word real understanding.",
      "Multiple commentaries (Shankara, Ramanuja, Chinmaya).",
      "Free — no paywall.",
    ],
    useCases: [
      "Daily Gita paath.",
      "Swadhyaya group prep.",
      "School / university study.",
      "Personal spiritual growth.",
    ],
    mistakes: [
      "Skipping Chapter 1 as 'just war setup' — it establishes the whole context.",
      "Reading only translation — the shloka's Sanskrit sound carries the teaching.",
    ],
    accuracy: "Text from Gita Press critical edition; commentaries from published editions.",
    privacy: "Reading progress saved on device.",
    faqs: [
      {
        q: "Which chapter should I start with?",
        a: "Chapter 2 (Sankhya Yoga) is often recommended first for its overview.",
      },
      { q: "Audio?", a: "Chapter-wise audio is on the roadmap." },
    ],
    relatedSlugs: ["ai-gita-summary", "daily-shlok", "upanishads-guide", "yoga-sutras"],
  },
  "upanishads-guide": {
    intro:
      "A guided tour of the Principal Upanishads — Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Aitareya, Taittiriya, Chandogya, Brihadaranyaka — with mantras, meaning and Advaita interpretation.",
    howToUse: [
      "Pick an Upanishad from the list.",
      "Read the introduction and structure.",
      "Study mantra-by-mantra with meaning.",
      "Read the classical bhashya summary.",
    ],
    benefits: [
      "All 10 principal Upanishads.",
      "Structured — introduction, mantras, commentary.",
      "Sourced from Adi Shankara bhashya.",
      "Free.",
    ],
    useCases: [
      "Daily Upanishad study.",
      "Prep for Vedanta classes.",
      "Personal jnana marg sadhana.",
    ],
    mistakes: [
      "Beginning with Brihadaranyaka — too dense; start with Isha or Kena.",
      "Reading without a guru for advanced sections.",
    ],
    accuracy:
      "Texts and translations from standard editions (Gita Press, Chinmaya, Ramakrishna Math).",
    privacy: "Progress saved on device.",
    faqs: [
      {
        q: "Which Upanishad should I start with?",
        a: "Isha (only 18 mantras) or Kena for beginners.",
      },
    ],
    relatedSlugs: ["bhagavad-gita", "vedas-introduction", "yoga-sutras"],
  },
  "vedas-introduction": {
    intro:
      "A structured introduction to the four Vedas — Rig, Yajur, Sama, Atharva — their shakhas, mantras, brahmanas, aranyakas and upanishads, and how to approach Vedic study.",
    howToUse: [
      "Read the overview of the four Vedas.",
      "Explore each Veda's structure.",
      "Sample famous mantras with translation.",
      "Follow the guided reading path.",
    ],
    benefits: [
      "Structured overview, not overwhelming.",
      "Famous mantras with meaning.",
      "Explains shakha / brahmana / aranyaka.",
      "Free.",
    ],
    useCases: [
      "First-time Vedic study.",
      "Prep for Sanskrit / religious studies exams.",
      "Understanding your family's shakha lineage.",
      "General cultural literacy.",
    ],
    mistakes: [
      "Jumping straight into Vedic mantra chanting without a guru.",
      "Confusing Vedanta (Upanishads) with the Samhita portion.",
    ],
    accuracy: "Structural information from standard Vedic studies literature.",
    privacy: "No login required.",
    faqs: [
      {
        q: "Can I read the Vedas online?",
        a: "Portions are freely available; complete traditional study needs a guru and shakha lineage.",
      },
    ],
    relatedSlugs: ["upanishads-guide", "bhagavad-gita", "puranas-overview"],
  },
  "yoga-sutras": {
    intro:
      "All 196 Yoga Sutras of Patanjali — with word-by-word meaning, translation and commentary — the foundational text of classical yoga.",
    howToUse: [
      "Pick a Pada (Samadhi, Sadhana, Vibhuti, Kaivalya).",
      "Read sutra-by-sutra.",
      "Tap words for meaning.",
      "Follow the classical commentary.",
    ],
    benefits: ["All 196 sutras.", "Word-by-word.", "Vyasa Bhashya summary included.", "Free."],
    useCases: [
      "Yoga teacher training prep.",
      "Personal ashtanga sadhana.",
      "Meditation study.",
      "Sanskrit study through a compact text.",
    ],
    mistakes: [
      "Reading the Vibhuti Pada for siddhi shortcuts — Patanjali warns against attachment to siddhis.",
      "Skipping Samadhi Pada as too abstract.",
    ],
    accuracy: "Text per Vyasa Bhashya; translations from standard editions.",
    privacy: "Progress saved on device.",
    faqs: [
      {
        q: "Different from Hatha Yoga?",
        a: "Yes — Patanjali's Ashtanga is different from Hatha Yoga (which comes from later texts like Hatha Yoga Pradipika).",
      },
    ],
    relatedSlugs: ["upanishads-guide", "bhagavad-gita"],
  },
  "sanatan-timeline": {
    intro:
      "A visual, scholarly timeline of Sanatan Dharma — from Vedic period through the epics, Puranas, bhakti and modern renaissance movements.",
    howToUse: [
      "Scroll the timeline.",
      "Tap any era for detail.",
      "See parallel events across regions.",
      "Explore the acharya lineage tree.",
    ],
    benefits: [
      "Visual, not text-heavy.",
      "Scholarly dates with ranges.",
      "Parallel developments across regions.",
      "Includes acharyas (Shankara, Ramanuja, Madhwa, Chaitanya).",
    ],
    useCases: [
      "School / college projects.",
      "Understanding a text's context.",
      "Comparing bhakti and jnana movements.",
      "General cultural literacy.",
    ],
    mistakes: ["Treating dates as absolute — most classical dates have scholarly ranges."],
    accuracy: "Dates from mainstream Indology with alternate views noted.",
    privacy: "No login required.",
    faqs: [
      {
        q: "Do you show mythological chronology?",
        a: "Yes, with clear labeling as itihasa/purana chronology vs archaeological chronology.",
      },
    ],
    relatedSlugs: ["vedas-introduction", "puranas-overview", "deity-encyclopedia"],
  },
  "deity-encyclopedia": {
    intro:
      "An encyclopedia of Sanatan deities — Vishnu, Shiva, Devi, Ganesha, Hanuman, Surya, Skanda and more — with iconography, mantras, stories and sampradaya perspectives.",
    howToUse: [
      "Search or browse by pantheon.",
      "Read iconography, avatars and stories.",
      "Explore mantras and stotras.",
      "Cross-reference related deities.",
    ],
    benefits: [
      "Deep, not surface-level.",
      "Iconography explained (weapons, mudras, vehicles).",
      "Sampradaya-neutral.",
      "Cross-links to mantras and temples.",
    ],
    useCases: [
      "Learning about a new deity.",
      "Research for art, writing or teaching.",
      "Understanding your family's ishta-devata.",
      "Kids' curiosity questions.",
    ],
    mistakes: ["Reading only the story without symbolism — deities encode subtle meaning."],
    accuracy: "Entries cross-verified with Purana and Agama references.",
    privacy: "Bookmarks on device.",
    faqs: [{ q: "Regional deities?", a: "Yes — Ayyappa, Vitthal, Jagannath, Kartikeya and more." }],
    relatedSlugs: ["deity-of-the-day", "names-by-deity", "mantra-library", "temple-directory"],
  },
  "mahabharata-summary": {
    intro:
      "The Mahabharata — 18 parvas, 100,000 shlokas — distilled into a readable summary with all key stories, characters and philosophical themes.",
    howToUse: [
      "Pick a parva or read the full arc.",
      "See character trees for the Kuru family.",
      "Explore key sub-stories (Nala, Savitri, Yaksha Prashna).",
      "Follow the philosophical threads.",
    ],
    benefits: [
      "Complete arc — not just the war.",
      "Character maps.",
      "Key upakathas summarised.",
      "Philosophy woven in.",
    ],
    useCases: [
      "Overview before reading full translation.",
      "School / college coursework.",
      "Family discussions.",
      "Cultural literacy.",
    ],
    mistakes: [
      "Reducing Mahabharata to Krishna vs Duryodhana — the depth is in the dharma dilemmas.",
      "Skipping Shanti Parva — it holds the philosophical core.",
    ],
    accuracy: "Summary based on Vyasa's critical BORI edition and standard translations.",
    privacy: "Progress on device.",
    faqs: [
      { q: "Is Bhagavad Gita part of Mahabharata?", a: "Yes — Bhishma Parva, chapters 25–42." },
    ],
    relatedSlugs: ["ramayana-summary", "puranas-overview", "bhagavad-gita"],
  },
  "ramayana-summary": {
    intro:
      "Valmiki's Ramayana — all seven kandas — summarised with key events, characters, dharma teachings and regional retellings.",
    howToUse: [
      "Read kanda-by-kanda summary.",
      "Explore character profiles.",
      "Compare with Tulsi Ramayana and Kamba Ramayana.",
      "Follow the dharma themes.",
    ],
    benefits: [
      "Full seven-kanda coverage.",
      "Regional retellings compared.",
      "Character depth (not just Rama-Ravana).",
      "Dharma-focused analysis.",
    ],
    useCases: [
      "Overview before reading full translation.",
      "Preparing for Rama Navami / Diwali stories.",
      "School / college coursework.",
      "Explaining Ramayana to children.",
    ],
    mistakes: [
      "Skipping Uttara Kanda — its themes are central to understanding Rama's dharma.",
      "Ignoring Vibhishana, Sugreeva and Hanuman's roles.",
    ],
    accuracy:
      "Summary based on Valmiki critical edition; regional versions noted where they differ.",
    privacy: "Progress on device.",
    faqs: [
      {
        q: "Difference between Valmiki and Tulsi Ramayana?",
        a: "Valmiki is the original Sanskrit epic; Tulsi's Ramcharitmanas is a devotional Awadhi retelling from the 16th century.",
      },
    ],
    relatedSlugs: ["mahabharata-summary", "puranas-overview", "deity-encyclopedia"],
  },
  "puranas-overview": {
    intro:
      "A guide to the 18 Mahapuranas and 18 Upapuranas — their deity focus, themes and how to approach reading them.",
    howToUse: [
      "Browse the list of Mahapuranas.",
      "Read each Purana's overview.",
      "See its deity focus (Vishnu / Shiva / Devi).",
      "Follow the guided reading path.",
    ],
    benefits: [
      "Clear grouping by deity focus.",
      "Themes and key stories.",
      "Reading path suggestions.",
      "Cross-links to related deities.",
    ],
    useCases: [
      "First-time Purana study.",
      "Choosing which Purana to read next.",
      "Understanding a deity through its Purana.",
      "Research.",
    ],
    mistakes: [
      "Assuming Puranas are purely mythological — they include cosmology, geography, dharma, and lineages.",
      "Reading a Purana without knowing its bias (Vaishnava / Shaiva / Shakta).",
    ],
    accuracy: "Based on classical Purana lakshana texts.",
    privacy: "Progress on device.",
    faqs: [
      {
        q: "Which Purana to read first?",
        a: "Bhagavata Purana for Vaishnavas; Shiva Purana for Shaivas; Devi Bhagavatam for Shaktas.",
      },
    ],
    relatedSlugs: [
      "mahabharata-summary",
      "ramayana-summary",
      "deity-encyclopedia",
      "vedas-introduction",
    ],
  },
  "deity-of-the-day": {
    intro:
      "The deity associated with today — by weekday, tithi and festival — with a short story, mantra and how to honour them today.",
    howToUse: [
      "Open the tool — today's deity appears.",
      "Read the connection (weekday / tithi / festival).",
      "See mantra and quick vidhi.",
      "Add to your daily practice.",
    ],
    benefits: [
      "Rotates by weekday and festival.",
      "Tiny daily habit — 2 minutes.",
      "Mantra + vidhi.",
      "Great for family morning routine.",
    ],
    useCases: [
      "Daily morning glance.",
      "Family WhatsApp forward.",
      "Kids' daily learning.",
      "Choosing today's specific mantra.",
    ],
    mistakes: ["Reading only the deity's name — practise the mantra even once."],
    accuracy: "Weekday associations per Dharmashastra; tithi/festival per drik calendar.",
    privacy: "No login required.",
    faqs: [
      {
        q: "Ishta-devata override?",
        a: "Yes — set your ishta and see how they intersect with today's deity.",
      },
    ],
    relatedSlugs: ["daily-quote", "daily-shlok", "deity-encyclopedia", "festival-of-the-day"],
  },
  "nakshatra-guide": {
    intro:
      "A complete guide to all 27 nakshatras — deity, symbol, syllables, pada, dasha lord, personality traits and remedial mantra.",
    howToUse: [
      "Pick a nakshatra (or compute yours).",
      "Read deity, symbol and traits.",
      "See pada-wise syllables.",
      "Explore remedial mantras and daan.",
    ],
    benefits: [
      "All 27 nakshatras in one place.",
      "Pada-level detail.",
      "Remedial guidance.",
      "Great for astrology students.",
    ],
    useCases: [
      "Understanding your janma nakshatra.",
      "Choosing a baby's name syllable.",
      "Selecting appropriate charity.",
      "Nakshatra-based sadhana.",
    ],
    mistakes: ["Reading personality traits literally — they are tendencies, not fate."],
    accuracy: "Based on classical Vedic astrology texts (BPHS, Muhurta Chintamani).",
    privacy: "No login required.",
    faqs: [
      {
        q: "Does nakshatra decide destiny?",
        a: "It indicates tendencies. Karma, effort and grace shape outcomes.",
      },
    ],
    relatedSlugs: ["nakshatra-finder", "names-by-nakshatra", "dasha-calculator", "rashi-guide"],
  },
  "rashi-guide": {
    intro:
      "A complete guide to the 12 rashis — element, ruling planet, symbol, traits, compatible rashis and appropriate mantras and remedies.",
    howToUse: [
      "Pick a rashi (or compute yours).",
      "Read element, planet and traits.",
      "See compatibility and remedies.",
      "Explore related tools.",
    ],
    benefits: [
      "All 12 rashis.",
      "Element and planet mapped.",
      "Practical remedies and mantras.",
      "Cross-linked with dasha and gemstones.",
    ],
    useCases: [
      "Learning about your moon sign.",
      "Matchmaking prep.",
      "Selecting gemstones or mantras.",
      "General astrology literacy.",
    ],
    mistakes: [
      "Confusing Vedic rashi (moon sign) with western sun sign.",
      "Overweighting compatibility — a full kundli match is far richer.",
    ],
    accuracy: "Based on classical Vedic astrology (Parashari).",
    privacy: "No login required.",
    faqs: [
      {
        q: "What's the difference between rashi and lagna?",
        a: "Rashi is where your moon is; lagna is the rising sign at your birth. Different but both important.",
      },
    ],
    relatedSlugs: [
      "rashi-calculator",
      "nakshatra-guide",
      "gemstone-recommender",
      "kundli-generator",
    ],
  },
};
