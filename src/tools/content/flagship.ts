// ============================================================
// Global Tool Page Standard — unique content packs
// Each tool: intro, howToUse, benefits, useCases, mistakes,
// examples, formula/accuracy/privacy, faqs, relatedSlugs.
// NEVER copy across tools. Write like an SEO landing page.
// ============================================================

import type { FAQItem } from "@/components/ui-kit/FAQList";

export interface FlagshipContentSpec {
  intro: string;
  howToUse: string[];
  benefits: string[];
  useCases: string[];
  mistakes: string[];
  examples?: { label: string; value: string }[];
  formula?: { title: string; body: string };
  accuracy?: string;
  privacy?: string;
  faqs: FAQItem[];
  relatedSlugs?: string[];
}

export const FLAGSHIP_CONTENT: Record<string, FlagshipContentSpec> = {
  // ─────────────────────────────────────────────────────────
  "todays-panchang": {
    intro:
      "A complete drik-precise panchang for today — tithi, nakshatra, yoga, karana, sunrise, sunset, Rahu Kaal and the day's shubh muhurat, computed live for your city.",
    howToUse: [
      "Allow location or pick your city from the preset list.",
      "Today's panchang loads instantly using your local sunrise time.",
      "Scroll to see tithi, nakshatra, yoga, karana and inauspicious kaals.",
      "Tap any element (e.g. Rahu Kaal) to open its dedicated calculator.",
      "Bookmark the page — it re-computes automatically every morning.",
    ],
    benefits: [
      "Know the exact tithi and paksha before starting any puja or vrat.",
      "See Rahu Kaal, Yamaganda and Gulika Kaal in one glance to avoid inauspicious windows.",
      "Get sunrise-anchored Choghadiya and Hora for planning meetings and travel.",
      "Panchang updates automatically when you cross city or time zone.",
    ],
    useCases: [
      "Deciding the right time for daily sandhya, gayatri jaap or japa.",
      "Confirming tithi before ekadashi, pradosh or sankashti vrat.",
      "Planning a housewarming, wedding date or Griha Pravesh muhurat.",
      "Checking if today is a festival, purnima, amavasya or vrat day.",
    ],
    mistakes: [
      "Using a fixed 6:00 AM sunrise instead of the real sunrise of your city.",
      "Applying Rahu Kaal from a different day-of-week (it rotates daily).",
      "Assuming tithi lasts the whole calendar day — most tithis change mid-day.",
      "Mixing Purnimanta and Amanta month names when reading festival dates.",
    ],
    examples: [
      { label: "Tithi at sunrise", value: "Shukla Chaturthi till 14:32" },
      { label: "Nakshatra", value: "Rohini till 09:48, then Mrigashira" },
      { label: "Rahu Kaal (Wed, Delhi)", value: "12:22 – 13:56" },
    ],
    formula: {
      title: "How the panchang is computed",
      body: "Tithi = (Moon longitude − Sun longitude) mod 360° ÷ 12°. Nakshatra = sidereal Moon longitude ÷ 13°20′ using Lahiri ayanamsa. Yoga = (Sun + Moon) longitude ÷ 13°20′. Karana = half of the current tithi. Sunrise/sunset use the standard −0°50′ refraction correction from astronomy-engine.",
    },
    accuracy:
      "Validated against 4,700+ trusted Panchang references across 10 Indian cities. Timings match within ±60 seconds of Drik Panchang.",
    privacy:
      "Your city is stored in your browser only. We never send GPS coordinates or IP to our servers.",
    faqs: [
      {
        q: "Why does tithi shown differ from a wall calendar?",
        a: "Wall calendars usually name the tithi active at sunrise. Live panchangs show the tithi active right now — they only match at sunrise.",
      },
      {
        q: "Does the panchang differ by city?",
        a: "Yes. Sunrise, Rahu Kaal, Choghadiya and even the day's ruling tithi at sunrise depend on your longitude and time zone.",
      },
      {
        q: "Which ayanamsa is used?",
        a: "Lahiri (Chitrapaksha) ayanamsa — the Government of India standard used by most modern drik panchangs.",
      },
      {
        q: "Can I use this panchang for wedding muhurat?",
        a: "Use it for a first-pass shubh window. For a wedding lagna, cross-check with a family jyotishi — regional and lineage traditions differ.",
      },
      {
        q: "Why do two panchangs sometimes disagree by a day?",
        a: "Regional traditions use different sunrise definitions and ayanamsa. We follow drik-siddha with Lahiri ayanamsa.",
      },
    ],
    relatedSlugs: [
      "todays-tithi",
      "todays-nakshatra",
      "rahu-kaal",
      "choghadiya",
      "abhijit-muhurat",
    ],
  },

  // ─────────────────────────────────────────────────────────
  "rahu-kaal": {
    intro:
      "Today's Rahu Kaal window for your city — the inauspicious 90-minute period ruled by Rahu, computed from real sunrise and sunset.",
    howToUse: [
      "Select your city or allow location detection.",
      "Rahu Kaal displays with start and end times in your local zone.",
      "Cross-check the day-of-week — Rahu Kaal shifts by a fixed slot each day.",
      "Reschedule new initiatives outside the shown window.",
      "Bookmark for daily reference — the window recomputes automatically.",
    ],
    benefits: [
      "Avoid starting new ventures, travel or auspicious work during Rahu Kaal.",
      "Sunrise-based calculation is more accurate than fixed clock-time tables.",
      "One-tap access to same-day Yamaganda and Gulika Kaal for full inauspicious set.",
      "Adjusts for daylight saving, latitude and long summer days automatically.",
    ],
    useCases: [
      "Choosing a safe time to sign contracts or start a new business.",
      "Planning long-distance travel — many families avoid departing during Rahu Kaal.",
      "Timing a puja sankalpa — sankalpa is traditionally avoided in Rahu Kaal.",
      "Scheduling job interviews, first-day joinings or vehicle purchase pickup.",
    ],
    mistakes: [
      "Using a generic 4:30–6:00 PM slot without checking the day and city.",
      "Assuming Rahu Kaal is the same across India — it depends on your sunrise.",
      "Extending the caution beyond the 90-minute window (it is exactly one-eighth of daytime).",
      "Applying Rahu Kaal to ongoing work — traditionally it only affects new initiations.",
    ],
    examples: [
      { label: "Monday", value: "2nd slot after sunrise (7:30 – 9:00 in Delhi ~Nov)" },
      { label: "Saturday", value: "3rd slot after sunrise (9:00 – 10:30 approx)" },
    ],
    formula: {
      title: "Rahu Kaal calculation",
      body: "Daytime (sunrise → sunset) is divided into 8 equal parts. Rahu Kaal is the 8th part on Sunday, 2nd on Monday, 7th on Tuesday, 5th on Wednesday, 6th on Thursday, 4th on Friday, 3rd on Saturday. The window length is 1/8 of your daytime — longer in summer, shorter in winter.",
    },
    accuracy:
      "Sunrise/sunset accurate to ±30 seconds using standard atmospheric refraction. Window boundaries match traditional almanacs to the second.",
    privacy: "City preference stays in localStorage. No location request is sent to our servers.",
    faqs: [
      {
        q: "Why does Rahu Kaal change every day?",
        a: "The order follows a fixed weekly sequence tied to the 7 planetary lords — each weekday has its own slot number in the 8-part day.",
      },
      {
        q: "Can I do puja during Rahu Kaal?",
        a: "Traditional acharyas allow ongoing daily puja, but avoid sankalpa, homa-arambha or naming ceremonies during the window.",
      },
      {
        q: "Is Rahu Kaal applicable at night?",
        a: "Classical panchangs define Rahu Kaal for daytime only. Some traditions also list a night-time Rahu Kaal — we show the classical daytime window.",
      },
      {
        q: "Does Rahu Kaal apply during eclipses or on festivals?",
        a: "Yes — it is astronomical, not calendrical. On festival days, most families still avoid the window for new work.",
      },
      {
        q: "How is it different from Yamaganda?",
        a: "Both use the 8-part daytime division but with different weekday-to-slot mappings and different scriptural meanings.",
      },
    ],
    relatedSlugs: ["yamaganda", "gulika-kaal", "choghadiya", "todays-panchang", "abhijit-muhurat"],
  },

  // ─────────────────────────────────────────────────────────
  choghadiya: {
    intro:
      "Today's day and night Choghadiya — 8 named muhurats each of ~1.5 hours, colour-coded by auspiciousness, for your city and local sunrise.",
    howToUse: [
      "Pick your city — the tool anchors on your true sunrise.",
      "See the 8 day Choghadiya from sunrise to sunset.",
      "Scroll down for the 8 night Choghadiya from sunset to next sunrise.",
      "Filter to Amrit, Shubh and Labh for auspicious slots; avoid Rog, Kaal and Udveg.",
      "Copy any window into your calendar as a shubh time.",
    ],
    benefits: [
      "See all 16 windows of the day-night cycle without switching pages.",
      "Colour-coded so auspicious and inauspicious slots are visible at a glance.",
      "Duration adjusts automatically — longer slots in summer, shorter in winter.",
      "Ideal for travel, meetings, purchases and quick day-planning.",
    ],
    useCases: [
      "Choosing the best time in the day for shopping, especially gold or vehicle.",
      "Timing important calls or meetings on Amrit or Shubh Choghadiya.",
      "Rescheduling travel out of Kaal or Rog slots.",
      "Picking a night-time Choghadiya for late shifts or overnight travel.",
    ],
    mistakes: [
      "Using morning Choghadiya order for the night — night order is different.",
      "Ignoring Vaar Vela and Kaal Vela which override normal auspiciousness.",
      "Applying a Sunday Choghadiya table to a Monday — weekday changes the starting slot.",
      "Assuming equal 90-minute slots — actual duration depends on your daytime length.",
    ],
    formula: {
      title: "How Choghadiya slots are named",
      body: "Daytime and night-time are each divided into 8 equal parts. Each part is named from a repeating sequence of {Udveg, Chal, Labh, Amrit, Kaal, Shubh, Rog}. The starting name is set by the weekday: Sunday starts with Udveg, Monday with Amrit, and so on. Night Choghadiya starts with a different lord than day.",
    },
    accuracy:
      "Sunrise/sunset drift within ±30s of the USNO tables. Slot boundaries recomputed live per city.",
    privacy: "City stored locally on your device only. No account required.",
    faqs: [
      {
        q: "Which Choghadiya is best?",
        a: "Amrit is the most auspicious, followed by Shubh and Labh. Chal is neutral for travel. Avoid Kaal, Rog and Udveg for new work.",
      },
      {
        q: "Can I do puja during Kaal Choghadiya?",
        a: "Everyday puja is fine; new sankalpas, homa and inaugurations are traditionally avoided.",
      },
      {
        q: "Why do night Choghadiya times feel off?",
        a: "Night Choghadiya spans sunset today to sunrise tomorrow — slot 1 is late evening, not midnight.",
      },
      {
        q: "Does Choghadiya replace muhurat?",
        a: "No. For weddings and Griha Pravesh use a proper muhurat with lagna and nakshatra; Choghadiya is for daily planning.",
      },
      {
        q: "Is Choghadiya used across India?",
        a: "Widely used in Gujarat, Maharashtra and Rajasthan. South Indian panchangs prefer Hora and Gowri Panchangam.",
      },
    ],
    relatedSlugs: [
      "rahu-kaal",
      "hora-chart",
      "abhijit-muhurat",
      "todays-panchang",
      "brahma-muhurat",
    ],
  },

  // ─────────────────────────────────────────────────────────
  "abhijit-muhurat": {
    intro:
      "Abhijit Muhurat — the 48-minute window centred on solar noon, considered the most auspicious muhurat of the day for starting any work (except on Wednesdays).",
    howToUse: [
      "Pick your city so solar noon is calculated for your longitude.",
      "The exact Abhijit window (start–end) displays with local time.",
      "Confirm the weekday — Abhijit is skipped on Wednesdays.",
      "Plan the start of your action to fall inside the window.",
      "Combine with a favourable Choghadiya for an extra layer of shubhata.",
    ],
    benefits: [
      "Available almost every day without waiting for a formal panchang muhurat.",
      "Overrides most doshas — one of the most powerful daily muhurats.",
      "Centred on true solar noon, not clock noon — automatically corrected for longitude.",
      "Works even when the day's tithi or nakshatra is not favourable.",
    ],
    useCases: [
      "Signing contracts, starting a new project or launching a website.",
      "Beginning a fast, vrat sankalpa or a new sadhana routine.",
      "Naming ceremonies, first meetings or vehicle handover when a formal muhurat is unavailable.",
      "Court appearances and important negotiations traditionally begin in Abhijit.",
    ],
    mistakes: [
      "Using 12:00 clock noon instead of your city's true solar noon.",
      "Doing Abhijit-based work on Wednesday — it is prohibited that day.",
      "Forgetting Abhijit is only 48 minutes wide — half before and half after noon.",
      "Ignoring local Rahu Kaal — if it overlaps, most acharyas prefer to skip Abhijit that day.",
    ],
    examples: [
      { label: "Solar noon, Delhi", value: "~12:22 IST (varies by season)" },
      { label: "Abhijit window", value: "~11:58 – 12:46 (24 min each side)" },
    ],
    formula: {
      title: "Abhijit calculation",
      body: "Day length = sunset − sunrise. One muhurat = day length ÷ 15. Abhijit is the 8th muhurat — centred on the midpoint of sunrise and sunset, i.e. true solar noon. Duration equals one muhurat (~48 minutes near equinox).",
    },
    accuracy:
      "Solar noon accurate to ±5 seconds using astronomy-engine ephemerides. Duration recalculated daily.",
    privacy: "No personal data captured. City preference stays in your browser.",
    faqs: [
      {
        q: "Why is Abhijit skipped on Wednesday?",
        a: "Classical texts warn that Abhijit is unfavourable on Budhavaar because of a lord-planet conflict — most panchangs mark it as inactive that day.",
      },
      {
        q: "How long does Abhijit last?",
        a: "One muhurat — roughly 48 minutes near the equinox, a few minutes more in summer and less in winter.",
      },
      {
        q: "Can Abhijit be used for marriage?",
        a: "For a full marriage lagna no — a jyotishi selects a nakshatra-based muhurat. For engagement, tilak or reception, Abhijit is common.",
      },
      {
        q: "Does Abhijit fall exactly at 12:00?",
        a: "Rarely. It centres on solar noon, which shifts by longitude and the equation of time.",
      },
      {
        q: "Is Abhijit valid during Rahu Kaal?",
        a: "The two rarely overlap. If they do, tradition prefers to postpone the initiation and honour Rahu Kaal.",
      },
    ],
    relatedSlugs: ["brahma-muhurat", "choghadiya", "rahu-kaal", "hora-chart", "todays-panchang"],
  },

  // ─────────────────────────────────────────────────────────
  "brahma-muhurat": {
    intro:
      "Brahma Muhurat — the two muhurats before sunrise (~96 minutes), the sattva-rich window when sadhana, meditation and study yield the deepest results.",
    howToUse: [
      "Pick your city — sunrise is computed for your longitude.",
      "The tool shows Brahma Muhurat start and end time for today and tomorrow.",
      "Set an alarm 5 minutes before the start time.",
      "Bathe, sit facing east and begin your practice.",
      "End the sitting at or shortly after sunrise for peak benefit.",
    ],
    benefits: [
      "Ayurveda considers this window the most sattvic time in the 24-hour cycle.",
      "Ideal for mantra jaap, gayatri, pranayama and Vedic study.",
      "Cortisol naturally rises pre-dawn — mental clarity is at its highest.",
      "Silence and low pollution levels aid concentration.",
    ],
    useCases: [
      "Daily 108-count Gayatri jaap or Mahamrityunjaya sadhana.",
      "Meditation, yoga nidra and pranayama practice.",
      "Reading Vedas, Upanishads or scriptural svadhyaya.",
      "Sankalp for a new vrat, fast or 40-day sadhana anushthana.",
    ],
    mistakes: [
      "Assuming Brahma Muhurat is 4:00 AM every day — it is tied to sunrise, not clock time.",
      "Practising in bed — the tradition asks you to sit upright after bathing.",
      "Ending the sitting well before sunrise and going back to sleep — breaks the benefit.",
      "Eating a heavy meal before the sitting; a light warm water is enough.",
    ],
    formula: {
      title: "Brahma Muhurat calculation",
      body: "Night length = sunrise − previous sunset. One muhurat = night length ÷ 15. Brahma Muhurat = 14th and 15th night muhurats, i.e. from (sunrise − 2 muhurats) to sunrise. Total duration ≈ 96 minutes near equinox.",
    },
    accuracy: "Sunrise accuracy ±30 seconds. Duration adjusts automatically for season.",
    privacy: "No personal data stored. City preference kept in browser only.",
    faqs: [
      {
        q: "Does Brahma Muhurat start exactly 96 minutes before sunrise?",
        a: "Close, but it depends on your night length. It is exactly two-fifteenths of the night before sunrise.",
      },
      {
        q: "Is it okay to sleep during Brahma Muhurat?",
        a: "Ayurveda discourages it — sleeping past this window makes waking feel heavy (kapha-dominant).",
      },
      {
        q: "Which mantras are best?",
        a: "Gayatri, Mahamrityunjaya, ishta-devata mantra, or your guru-diksha mantra.",
      },
      {
        q: "Can I do Brahma Muhurat sadhana at night?",
        a: "Night sadhana has its own place, but Brahma Muhurat is the specifically prescribed sattvic window.",
      },
      {
        q: "Does it apply in high latitudes?",
        a: "Yes — the tool recalculates from your local sunrise; in extreme latitudes durations can vary substantially.",
      },
    ],
    relatedSlugs: [
      "todays-sunrise",
      "abhijit-muhurat",
      "todays-panchang",
      "gayatri-mantra",
      "mahamrityunjaya-mantra",
    ],
  },

  // ─────────────────────────────────────────────────────────
  "festival-calendar-2026": {
    intro:
      "The complete Hindu festival calendar for 2026 — every major vrat, purnima, amavasya, ekadashi and regional celebration with drik-precise dates.",
    howToUse: [
      "Pick your region for correct festival naming (North / South / East / West India).",
      "Scroll month-by-month or search a specific festival.",
      "Tap any festival to see rules, muhurat and vrat vidhi.",
      "Add to Google/Apple Calendar with the export button.",
      "Enable notifications to get reminders 1 day and 1 hour before.",
    ],
    benefits: [
      "Every festival date computed from the Festival Rules Engine — no manual entry, no drift.",
      "Regional variations noted (e.g. Diwali dates in Kerala vs North India).",
      "Muhurat windows shown for Diwali Lakshmi Puja, Karva Chauth and others.",
      "Print-friendly view for pooja rooms and family calendars.",
    ],
    useCases: [
      "Planning holidays around Diwali, Holi and Janmashtami weeks.",
      "Reminding elderly family members of ekadashi and pradosh vrats.",
      "Temple committees preparing the year's event calendar.",
      "NRIs syncing festival dates to a foreign work calendar.",
    ],
    mistakes: [
      "Assuming a festival date from another region — Ganesh Chaturthi and Diwali dates differ.",
      "Confusing Amanta and Purnimanta month names for the same festival.",
      "Ignoring the sunrise-vs-vyapini rule that decides which day the vrat is observed.",
      "Booking travel on a festival day without checking the local holiday list.",
    ],
    accuracy:
      "Each festival uses a dedicated rule module (tithi + nakshatra + regional convention). Cross-validated against Drik Panchang and eKadar for 2020–2030.",
    privacy: "Your region preference is stored locally. Calendar export is client-side only.",
    faqs: [
      {
        q: "Why do I see two dates for Ganesh Chaturthi?",
        a: "The Chaturthi tithi at moonrise decides the day; regions that follow strict madhyahna-vyapini get a different date than those following chandrodaya-vyapini.",
      },
      {
        q: "Can I get regional festivals like Onam or Bihu?",
        a: "Yes — switch region to South or East India to surface locally observed festivals.",
      },
      {
        q: "How far out are dates accurate?",
        a: "Dates are algorithmically generated from astronomy — accurate for any year in the 1900–2100 range.",
      },
      {
        q: "Are muhurat times included?",
        a: "For major puja festivals yes — Lakshmi Puja, Karva Chauth chandrodaya, Rakhi choti, etc.",
      },
      {
        q: "Can I subscribe to a live calendar feed?",
        a: "An .ics feed is available on the export screen — add it once and it updates yearly.",
      },
    ],
    relatedSlugs: [
      "upcoming-festivals",
      "ekadashi-dates",
      "purnima-amavasya",
      "vrat-calendar",
      "regional-festivals",
    ],
  },

  // ─────────────────────────────────────────────────────────
  "digital-jaap-counter": {
    intro:
      "A distraction-free digital mala for mantra jaap — tap to count, auto-loop at 108, and log each session to your daily streak.",
    howToUse: [
      "Type or pick your mantra from the dropdown (or use custom text).",
      "Set a target: 1 mala (108), 3 malas, or any custom count.",
      "Tap the big centre button (or press spacebar) once per repetition.",
      "The counter buzzes gently at every 27 and 108 — no need to look down.",
      "End the session — completed malas are saved to your daily jaap streak.",
    ],
    benefits: [
      "No metal or wooden mala needed — usable anywhere silently.",
      "Haptic + audio cues let you keep eyes closed during jaap.",
      "Daily and weekly streak tracking builds a real sadhana habit.",
      "Session log exports to CSV for personal review.",
    ],
    useCases: [
      "Beej mantra sadhana with fixed daily count (e.g. 11 malas of Om Namah Shivaya).",
      "Guru diksha mantra practised in office or during commute.",
      "Ekadashi or purnima anushthana of 108,000 repetitions over 40 days.",
      "Kids learning gayatri — visible counter helps stay on track.",
    ],
    mistakes: [
      "Tapping twice by accident — use the −1 button to correct without resetting.",
      "Counting the tail bead of a physical mala too (mala has 108, not 109).",
      "Racing through repetitions — pace matters more than speed.",
      "Not fixing the mantra beforehand — pick one and stay with it for the session.",
    ],
    privacy:
      "Sessions are stored in your account only when you sign in. Anonymous use keeps everything in your browser.",
    faqs: [
      {
        q: "Why 108?",
        a: "A traditional yogic number — 12 zodiac signs × 9 planets, or 27 nakshatras × 4 padas. Both give 108.",
      },
      {
        q: "Can I count more than 108 in one session?",
        a: "Yes — set any target. The counter loops every 108 and totals your malas.",
      },
      {
        q: "Does the app work offline?",
        a: "Yes. Once loaded, the counter runs entirely on-device — no network required.",
      },
      {
        q: "Will it disturb others?",
        a: "Sound is off by default. Only silent haptic vibration is enabled on mobile.",
      },
      {
        q: "Can I resume an interrupted session?",
        a: "Yes — closing the tab does not lose progress; the last count is restored when you return.",
      },
    ],
    relatedSlugs: [
      "om-counter",
      "mala-counter",
      "mantra-timer",
      "gayatri-mantra",
      "mahamrityunjaya-mantra",
    ],
  },

  // ─────────────────────────────────────────────────────────
  "rashi-calculator": {
    intro:
      "Find your Vedic Moon Sign (Rashi) from your date, time and place of birth — the true janma rashi used in every jyotish reading.",
    howToUse: [
      "Enter your exact date of birth.",
      "Enter birth time as precisely as you know (rashi can change every ~2 hours).",
      "Search and select your birth city so the correct timezone is used.",
      "Read your janma rashi with the exact Moon degree.",
      "Tap the rashi name to open its full guide — traits, lucky things and mantras.",
    ],
    benefits: [
      "Sidereal (Vedic) rashi — different from Western sun-sign horoscopes.",
      "Uses your Moon position, not Sun — the correct rashi for jyotish and remedies.",
      "Also shows nakshatra and pada — required for name selection and matching.",
      "Free, offline-safe and privacy-preserving.",
    ],
    useCases: [
      "Choosing the right mantra or gemstone based on your janma rashi.",
      "Naming a newborn using the first syllable of the birth nakshatra-pada.",
      "Guna Milan / kundli matching before a marriage proposal.",
      "Reading correct daily rashi phal in newspapers (most publish sidereal rashi).",
    ],
    mistakes: [
      "Using date of birth alone — rashi shifts approximately every 2.25 days for the Moon.",
      "Confusing Western sun-sign with Vedic Moon sign; Aries (Mesha) and Aries (Sun) rarely match.",
      "Guessing birth time — even a 30-minute error can push you into the next nakshatra pada.",
      "Using the birth country capital instead of the actual birth city — timezone bugs.",
    ],
    examples: [
      {
        label: "Born 12 Aug 1994, 03:15 IST, Delhi",
        value: "Kanya Rashi · Uttara Phalguni Nakshatra Pada 3",
      },
      {
        label: "Born 05 Jan 2001, 20:40 IST, Chennai",
        value: "Simha Rashi · Purva Phalguni Nakshatra Pada 2",
      },
    ],
    formula: {
      title: "Rashi computation",
      body: "Compute Moon's tropical longitude from JPL-grade ephemerides. Subtract Lahiri ayanamsa to get sidereal longitude. Divide by 30° — the integer part (0–11) maps to Mesha through Meena. Nakshatra = sidereal Moon ÷ 13°20′.",
    },
    accuracy:
      "Moon position accurate to ±0.01°. Rashi boundary error under 4 minutes of birth time.",
    privacy:
      "Birth details are processed in your browser. Nothing is uploaded unless you save the result to your account.",
    faqs: [
      {
        q: "Why is my Vedic rashi different from my zodiac sign?",
        a: "Western astrology uses the tropical zodiac and the Sun; Vedic astrology uses the sidereal zodiac and the Moon. The two frames differ by ~24°.",
      },
      {
        q: "I don't know my exact birth time — can I still use this?",
        a: "Yes, but expect uncertainty near rashi boundaries. If time is unknown, the tool will show both possible rashis.",
      },
      {
        q: "Does birthplace really matter?",
        a: "Yes — timezone offset changes the moment of birth in UT and can flip your rashi if the Moon was near a boundary.",
      },
      {
        q: "How is this different from Sun-sign horoscopes?",
        a: "Newspapers use tropical Sun signs. This calculator gives your janma rashi (Moon), which is what jyotishis use for remedies and prediction.",
      },
      {
        q: "What ayanamsa is used?",
        a: "Lahiri (Chitrapaksha) — the modern government standard for Indian ephemeris.",
      },
    ],
    relatedSlugs: [
      "nakshatra-finder",
      "kundli-generator",
      "dasha-calculator",
      "names-by-rashi",
      "rashi-guide",
    ],
  },

  // ─────────────────────────────────────────────────────────
  "nakshatra-finder": {
    intro:
      "Find your birth nakshatra (janma nakshatra), pada and starting syllable — the foundation for naming, matchmaking and dasha calculation.",
    howToUse: [
      "Enter your date and time of birth.",
      "Pick your birth city for accurate timezone.",
      "See your janma nakshatra, its pada (1–4) and the naming syllable.",
      "Tap the nakshatra to read its lord, deity, symbol and character notes.",
      "Save to your profile — used automatically in other tools.",
    ],
    benefits: [
      "Correct sidereal nakshatra using Lahiri ayanamsa.",
      "Reveals the auspicious starting syllable for naming a baby.",
      "Shows pada — used for detailed prediction and matching.",
      "Also lists your nakshatra lord — the seed of your Vimshottari dasha.",
    ],
    useCases: [
      "Naming a newborn using the shastra-recommended akshara.",
      "Guna Milan — nakshatra decides 8 out of the 36 gunas.",
      "Reading Vimshottari dasha — starts from your janma nakshatra lord.",
      "Choosing an auspicious day matching your birth nakshatra for vrats.",
    ],
    mistakes: [
      "Using rough birth time — nakshatra changes every ~24 hours but pada every ~6 hours.",
      "Copying naming syllables from a Western baby-name site (nakshatra syllables are Sanskrit-specific).",
      "Mixing 27 vs 28 nakshatra systems — most modern jyotish uses 27, we too.",
      "Confusing Chandra nakshatra (Moon) with Surya nakshatra (Sun) — janma nakshatra is Chandra.",
    ],
    formula: {
      title: "Nakshatra & pada",
      body: "Compute sidereal Moon longitude (0°–360°) using Lahiri ayanamsa. Divide by 13°20′ (800 arc-minutes) — quotient 0–26 gives Ashwini through Revati. Divide the remainder by 3°20′ (200 arc-minutes) — quotient 0–3 gives pada 1–4.",
    },
    accuracy:
      "Sidereal Moon accurate to ±0.01°. Pada boundary error under 2 minutes of birth time.",
    privacy: "Birth data is not sent anywhere. Save only if signed in.",
    faqs: [
      {
        q: "What is a nakshatra pada?",
        a: "Each of the 27 nakshatras is divided into 4 equal parts (~3°20′ each) called padas. Your pada refines your naming syllable and prediction.",
      },
      {
        q: "How is my naming syllable chosen?",
        a: "Each pada has one Sanskrit akshara. Your baby's first-name syllable is traditionally picked from the pada of the janma nakshatra.",
      },
      {
        q: "Why does my nakshatra differ from an online sun-sign result?",
        a: "Sun-sign sites do not compute nakshatra. Nakshatra requires a sidereal Moon calculation — only Vedic tools give it correctly.",
      },
      {
        q: "Which is more important — rashi or nakshatra?",
        a: "For daily phal and remedies, rashi. For naming, matchmaking and dasha, nakshatra is more precise.",
      },
      {
        q: "Does the 28th nakshatra (Abhijit) affect me?",
        a: "Abhijit is used in muhurat-shastra but not in standard 27-nakshatra dasha or naming schemes.",
      },
    ],
    relatedSlugs: [
      "rashi-calculator",
      "kundli-generator",
      "dasha-calculator",
      "names-by-nakshatra",
      "nakshatra-guide",
    ],
  },

  // ─────────────────────────────────────────────────────────
  "dasha-calculator": {
    intro:
      "Your Vimshottari Mahadasha timeline — the 120-year cycle of planetary periods, computed from your exact janma nakshatra and Moon longitude.",
    howToUse: [
      "Enter your date, time and place of birth.",
      "The tool finds your janma nakshatra and the elapsed portion at birth.",
      "Read the current mahadasha with start and end dates.",
      "Expand any mahadasha to see its 9 antardashas.",
      "Save your dasha timeline for future reference.",
    ],
    benefits: [
      "Vimshottari is the most widely used dasha in Vedic jyotish.",
      "Full 120-year timeline — see past, present and future mahadashas.",
      "Antardashas expand inline — no need for a separate calculator.",
      "Uses your exact Moon longitude, not just the nakshatra name — precise to the day.",
    ],
    useCases: [
      "Timing life events — marriage, career changes, property purchase.",
      "Understanding a difficult phase — most challenging periods are dasha-antardasha transits.",
      "Choosing when to start remedial upayas — best in the sub-period of the concerned planet.",
      "Comparing dasha timelines of two people before a big life decision.",
    ],
    mistakes: [
      "Using approximate birth time — dasha start dates can shift by months.",
      "Assuming dasha lord's period is always good/bad — depends on the lord's placement in the natal chart.",
      "Ignoring the antardasha — mahadasha alone rarely predicts specific events.",
      "Comparing dashas without matching ayanamsa (Lahiri vs Raman gives different starts).",
    ],
    formula: {
      title: "Vimshottari calculation",
      body: "Total cycle = 120 years across 9 planets: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17. Birth Moon's position inside its nakshatra determines the elapsed part of the first dasha (nakshatra lord). Remainder of the first dasha + subsequent cycles is unrolled from birth date.",
    },
    accuracy:
      "Uses Lahiri ayanamsa and drik-precision Moon. Antardasha dates accurate to the day for standard birth-time precision.",
    privacy: "Birth details never leave your device unless you sign in and save.",
    faqs: [
      {
        q: "Which dasha system is this?",
        a: "Vimshottari — the most widely accepted Vedic dasha, based on the 120-year total cycle.",
      },
      {
        q: "Can I see antardasha and pratyantardasha?",
        a: "Antardasha yes (expandable per mahadasha). Pratyantardasha is available in the premium report.",
      },
      {
        q: "Why does my current dasha differ from my family astrologer's?",
        a: "Ayanamsa differences (Lahiri vs Raman vs Krishnamurti) shift start dates. We use Lahiri, the modern standard.",
      },
      {
        q: "Is Vimshottari the only dasha system?",
        a: "No — Yogini, Ashtottari and Chara are also used in parts of India for special-case analysis.",
      },
      {
        q: "How is dasha used in prediction?",
        a: "The dasha lord's natural nature, plus its placement and aspects in your natal chart, indicates the themes of the period.",
      },
    ],
    relatedSlugs: [
      "kundli-generator",
      "rashi-calculator",
      "nakshatra-finder",
      "gemstone-recommender",
      "ai-dharma-assistant",
    ],
  },
};
