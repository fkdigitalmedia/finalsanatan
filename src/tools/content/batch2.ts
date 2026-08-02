// ============================================================
// Global Tool Page Standard — Batch 2
// Panchang (remaining) + Festivals + Puja tools.
// Each pack is unique — never copy across tools.
// ============================================================
import type { FlagshipContentSpec } from "./flagship";

export const BATCH2_CONTENT: Record<string, FlagshipContentSpec> = {
  // ─── Panchang remaining ───────────────────────────────────
  "todays-tithi": {
    intro:
      "The current lunar tithi with exact end time — computed live from the Moon–Sun elongation for your city.",
    howToUse: [
      "Pick your city — the tithi at your local sunrise loads first.",
      "See the paksha (Shukla/Krishna) and the tithi lord.",
      "Note the exact end time — most tithis change mid-day.",
      "Cross-check with vrat calendar if fasting today.",
      "Tap 'next tithi' to see what's coming after.",
    ],
    benefits: [
      "Never miss ekadashi, pradosh or sankashti because of a tithi that changes at 3 PM.",
      "See the tithi lord (deity) and its shubh/ashubh nature at a glance.",
      "Anchored to your city's sunrise — the tradition-correct reference.",
      "Automatic paksha detection — Shukla or Krishna.",
    ],
    useCases: [
      "Confirming ekadashi/pradosh before starting a vrat.",
      "Choosing the right tithi for shraddha, tarpan or pitru rituals.",
      "Selecting a shubh tithi for grihapravesh or naming.",
      "Journaling — many sadhaks log tithi with their daily practice.",
    ],
    mistakes: [
      "Reading tithi from the previous day when it changed after midnight.",
      "Assuming Chaturthi = same date every month — lunar dates drift by ~11 days each solar year.",
      "Ignoring paksha — Shukla Ashtami and Krishna Ashtami have opposite meanings.",
      "Using a fixed 'sunrise tithi' when the sankalpa is done later in the day.",
    ],
    formula: {
      title: "Tithi formula",
      body: "Tithi index = floor(((Moon longitude − Sun longitude) mod 360°) ÷ 12°) + 1. Index 1–15 = Shukla, 16–30 = Krishna. Exact end time comes from finding when the elongation crosses the next 12° boundary.",
    },
    accuracy:
      "Elongation computed with astronomy-engine ephemerides — end-time accuracy ±30 seconds vs Drik Panchang.",
    privacy: "City is stored on your device only. No account required.",
    faqs: [
      {
        q: "Why does today's tithi span two calendar days?",
        a: "A tithi is a lunar-elongation slice, not a solar day — its length ranges 19–26 hours, so it commonly overlaps two dates.",
      },
      {
        q: "Which tithi is used for vrat if it changes mid-day?",
        a: "Traditionally the tithi present at sunrise, or during a specific muhurat (e.g. pradosh) for that vrat.",
      },
      {
        q: "What is the tithi lord?",
        a: "Each of the 30 tithis has a presiding deity — e.g. Chaturthi is ruled by Ganesha, Ekadashi by Vishnu.",
      },
      {
        q: "Why do wall calendars show only one tithi per day?",
        a: "They label the tithi active at sunrise. Live tools show what's active right now.",
      },
      {
        q: "Is tithi the same across India?",
        a: "Yes at any instant — but the sunrise reference differs by city, so the 'day's tithi' can vary.",
      },
    ],
    relatedSlugs: [
      "todays-panchang",
      "todays-nakshatra",
      "ekadashi-dates",
      "purnima-amavasya",
      "pradosh-vrat",
    ],
  },

  "todays-nakshatra": {
    intro:
      "Today's ruling nakshatra with start/end time, pada and lord — computed from the Moon's sidereal longitude.",
    howToUse: [
      "Pick your city — nakshatra at your local sunrise loads instantly.",
      "See the current pada (quarter) and Vimshottari lord.",
      "Note when the nakshatra changes — the next one appears below.",
      "Cross-check with muhurat before starting a journey or new work.",
    ],
    benefits: [
      "Know the janma-nakshatra of a child born today, exactly.",
      "See pada — critical for baby naming and nakshatra-based muhurat.",
      "Avoid gandant, mool and jyeshtha windows for auspicious work.",
      "Perfect for daily practices tied to nakshatra devata.",
    ],
    useCases: [
      "Baby-naming ceremony — first syllable comes from the pada.",
      "Choosing a nakshatra-friendly muhurat for travel or purchase.",
      "Tracking mool/jyeshtha for children born under sensitive stars.",
      "Daily sankalpa that mentions the current nakshatra.",
    ],
    mistakes: [
      "Using tropical zodiac instead of sidereal — nakshatra needs Lahiri ayanamsa.",
      "Ignoring pada — same nakshatra has 4 padas with different naming syllables.",
      "Assuming nakshatra lasts exactly 24 hours (real duration 21–25 hrs).",
      "Reading only the sunrise nakshatra when the janma time is late evening.",
    ],
    formula: {
      title: "Nakshatra calculation",
      body: "Sidereal Moon longitude = tropical Moon − ayanamsa (Lahiri). Nakshatra index = floor(sidereal ÷ 13°20′) + 1. Pada = floor((residue ÷ 13°20′) × 4) + 1.",
    },
    accuracy:
      "Moon longitude within ±0.001° using astronomy-engine. Nakshatra transitions accurate to ±30 seconds.",
    privacy: "No personal data leaves your device.",
    faqs: [
      {
        q: "Which ayanamsa do you use?",
        a: "Lahiri (Chitrapaksha) — the Government of India standard.",
      },
      {
        q: "What is a pada?",
        a: "Each nakshatra spans 13°20′, divided into 4 padas of 3°20′ each. Padas map to naming syllables.",
      },
      {
        q: "Why do two panchangs disagree on nakshatra by a few minutes?",
        a: "Different ayanamsa values (Raman, KP, Fagan-Bradley) shift the sidereal Moon slightly.",
      },
      {
        q: "Is nakshatra used for anything besides birth?",
        a: "Yes — muhurat, marriage-matching (kuta), daily favourability and specific vrats.",
      },
      {
        q: "How many nakshatras are there?",
        a: "27 main nakshatras. Abhijit is a 28th used in select muhurat calculations.",
      },
    ],
    relatedSlugs: [
      "nakshatra-finder",
      "nakshatra-guide",
      "names-by-nakshatra",
      "todays-panchang",
      "dasha-calculator",
    ],
  },

  "todays-yoga": {
    intro:
      "Today's yoga — the 27 named combinations of Sun + Moon longitude — with exact end time and its shubh/ashubh nature.",
    howToUse: [
      "Pick your city so the yoga at your local sunrise loads.",
      "See the yoga name, lord and auspicious/inauspicious label.",
      "Note the end time — most yogas change mid-day.",
      "Avoid the 9 inauspicious yogas (Vishkambha, Vyaghata etc.) for new work.",
    ],
    benefits: [
      "Instant flag on the 9 malefic yogas that most muhurats avoid.",
      "See the yoga lord and next yoga in one glance.",
      "Anchored to your city's sunrise — respects local time zone.",
      "Free — no signup, no ads on the panchang.",
    ],
    useCases: [
      "Selecting a marriage or grihapravesh muhurat that avoids inauspicious yogas.",
      "Checking Amrit Siddhi or Sarvartha Siddhi yoga days for major starts.",
      "Journaling — noting the daily yoga alongside your sadhana.",
      "Muhurat planning combined with tithi + nakshatra.",
    ],
    mistakes: [
      "Treating yoga like the eight-limbed Ashtanga yoga — this is a panchang element, unrelated.",
      "Ignoring the yoga when only using tithi + nakshatra for muhurat.",
      "Reading the sunrise yoga when the event is in the evening after it changed.",
      "Assuming all 27 yogas are auspicious — 9 are traditionally avoided.",
    ],
    formula: {
      title: "Yoga formula",
      body: "Yoga index = floor(((Sun longitude + Moon longitude) mod 360°) ÷ 13°20′) + 1. Both longitudes are tropical for this calculation; the sum grows monotonically over ~24 hours.",
    },
    accuracy: "Yoga end-time within ±30 seconds of Drik Panchang references.",
    privacy: "City stays in your browser only.",
    faqs: [
      {
        q: "Is 'yoga' here the same as yogasana?",
        a: "No — this is one of the 5 limbs of the panchang (tithi, nakshatra, yoga, karana, vaar).",
      },
      {
        q: "Which yogas are inauspicious?",
        a: "Vishkambha, Atiganda, Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha and Vaidhriti.",
      },
      {
        q: "Does the yoga apply to the whole day?",
        a: "Only until it changes — most yogas last 18–26 hours.",
      },
      {
        q: "What are the special siddhi yogas?",
        a: "Amrit Siddhi, Sarvartha Siddhi, Ravi Yoga — formed by weekday + nakshatra combinations, they override most doshas.",
      },
      {
        q: "Do all traditions use the same 27 yogas?",
        a: "Yes — the list is consistent across all major regional panchangs.",
      },
    ],
    relatedSlugs: [
      "todays-panchang",
      "todays-tithi",
      "todays-karana",
      "abhijit-muhurat",
      "hora-chart",
    ],
  },

  "todays-karana": {
    intro:
      "The current karana — half a tithi — with lord, type (chara/sthira) and exact end time. There are 11 karanas that repeat in a fixed pattern.",
    howToUse: [
      "Pick your city — karana at your local sunrise loads first.",
      "See the karana name, whether movable (chara) or fixed (sthira).",
      "Note the end time — every karana is only 6+ hours long.",
      "Cross-check for shubh vs ashubh nature before muhurat.",
    ],
    benefits: [
      "Fine-grained timing — karana is finer than tithi.",
      "Flags the 4 sthira karanas which repeat once per month.",
      "Auto-computed with tithi so both change together.",
      "Useful add-on for detailed muhurat work.",
    ],
    useCases: [
      "Muhurat verification — some traditions add karana as a check.",
      "Choosing between two similar tithis for a subtle timing edge.",
      "Learning panchang — karana is the least-known limb, worth understanding.",
      "Vishti (Bhadra) karana avoidance for auspicious starts.",
    ],
    mistakes: [
      "Assuming karana equals tithi — it's half a tithi.",
      "Forgetting Bhadra karana can render an otherwise good muhurat inauspicious.",
      "Treating the 4 sthira karanas as daily — they only occur once each month.",
      "Applying karana malefic-ness beyond its short window.",
    ],
    formula: {
      title: "Karana formula",
      body: "Karana index = floor(((Moon − Sun) mod 360°) ÷ 6°). 7 chara karanas repeat 8 times across Shukla + Krishna Chaturdashi. 4 sthira karanas (Shakuni, Chatushpada, Naga, Kimstughna) fall at fixed positions around Amavasya.",
    },
    accuracy: "Karana end-time within ±30 seconds of Drik Panchang references.",
    privacy: "No account, no cloud storage. City preference is local only.",
    faqs: [
      {
        q: "Why is Vishti / Bhadra karana avoided?",
        a: "Traditional texts warn against auspicious starts during Bhadra — many families defer weddings, journeys and homa.",
      },
      {
        q: "How many karanas are there?",
        a: "11 total: 7 chara (repeating) and 4 sthira (fixed once per month).",
      },
      {
        q: "Does karana affect daily puja?",
        a: "Not usually — routine puja continues; new sankalpa and homa are the sensitive events.",
      },
      {
        q: "Which karana is best?",
        a: "Bava is generally considered the most auspicious, followed by Balava and Kaulava.",
      },
      {
        q: "Do all regional panchangs list karana?",
        a: "Yes, but not all display it prominently. We surface it because it matters for muhurat.",
      },
    ],
    relatedSlugs: [
      "todays-panchang",
      "todays-tithi",
      "abhijit-muhurat",
      "hora-chart",
      "todays-yoga",
    ],
  },

  "todays-sunrise": {
    intro:
      "Today's sunrise time for your city, with civil twilight and solar noon — computed from live ephemerides with atmospheric refraction correction.",
    howToUse: [
      "Pick your city or allow location detection.",
      "See sunrise, civil twilight and solar noon for today.",
      "Set an alarm 30 min before sunrise for Brahma Muhurat sadhana.",
      "Bookmark — updates automatically each day.",
    ],
    benefits: [
      "Anchors Brahma Muhurat, sandhya and gayatri jaap perfectly.",
      "Corrected for atmospheric refraction — matches USNO tables.",
      "Longitude-precise — no city defaults to Delhi.",
      "Works globally, including high latitudes.",
    ],
    useCases: [
      "Timing daily sandhya vandana and gayatri jaap.",
      "Setting alarms for Brahma Muhurat sadhana.",
      "Planning aarati or first-light temple visit.",
      "Farmers and travellers aligning schedules with true daylight.",
    ],
    mistakes: [
      "Using a national sunrise (e.g. Delhi) for a distant city.",
      "Assuming sunrise is at 6:00 AM year-round — it swings by 1+ hour seasonally.",
      "Ignoring daylight saving in western cities that observe it.",
      "Confusing 'first light' (civil twilight) with actual sunrise (top of disc).",
    ],
    formula: {
      title: "Sunrise calculation",
      body: "Sunrise = moment when the Sun's upper limb crosses the horizon, with a −0°50′ refraction correction (16′ semi-diameter + 34′ mean atmospheric refraction). Computed from Sun altitude via astronomy-engine.",
    },
    accuracy: "±30 seconds vs USNO/NOAA references. Validated across 10+ Indian cities.",
    privacy: "Location stays in your browser. No GPS coordinates leave your device.",
    faqs: [
      {
        q: "Why does your sunrise differ from a printed calendar by 1–2 minutes?",
        a: "Calendars often round to the minute or use city-centre coordinates; we use precise longitude and refraction.",
      },
      {
        q: "What is Brahma Muhurat's exact time?",
        a: "Two muhurats before sunrise — see the Brahma Muhurat tool for today's window.",
      },
      {
        q: "Does sunrise change with elevation?",
        a: "Slightly — a hill or coastal cliff shifts it by a few seconds. We assume sea-level for consistency.",
      },
      {
        q: "Why do arctic days show 'no sunrise'?",
        a: "Because the Sun does not rise. We handle polar day/night gracefully.",
      },
      {
        q: "How does time zone affect the shown time?",
        a: "We display in your city's zone (including DST), never UTC.",
      },
    ],
    relatedSlugs: [
      "brahma-muhurat",
      "todays-sunset",
      "todays-panchang",
      "abhijit-muhurat",
      "hora-chart",
    ],
  },

  "todays-sunset": {
    intro:
      "Today's sunset and civil twilight for your city — the reference for sandhya, night muhurats and pradosh kaal.",
    howToUse: [
      "Pick your city or use location detection.",
      "See sunset and end of civil twilight.",
      "Use it to anchor sandhya vandana and pradosh puja.",
      "Bookmark — updates every day automatically.",
    ],
    benefits: [
      "Anchors pradosh kaal, sandhya and night muhurats.",
      "Refraction-corrected — matches official references.",
      "Longitude and DST aware.",
      "Free and updates daily.",
    ],
    useCases: [
      "Scheduling pradosh puja (starts ~1.5 hours before sunset).",
      "Evening sandhya vandana timing.",
      "Fixing arati and deep-daan schedules at temples.",
      "Planning muhurats that begin after sunset.",
    ],
    mistakes: [
      "Using clock time '6:00 PM' as sunset — it varies by 90+ minutes across the year.",
      "Ignoring DST in western/foreign cities.",
      "Assuming pradosh = exact sunset — it is a window around it.",
      "Reading sunset from Delhi tables while in another state.",
    ],
    formula: {
      title: "Sunset calculation",
      body: "Sunset = moment when the Sun's upper limb sinks below the horizon with the standard −0°50′ refraction correction. Uses astronomy-engine ephemerides for the Sun's altitude.",
    },
    accuracy: "±30 seconds vs USNO/NOAA references.",
    privacy: "City preference stored locally on device only.",
    faqs: [
      {
        q: "What is pradosh kaal exactly?",
        a: "The 96-minute window straddling sunset — precisely 1.5 hours before and after in most traditions.",
      },
      {
        q: "Why does sunset time swing so much?",
        a: "Solar declination varies through the year; combined with your latitude, this shifts sunset up to ±90 minutes.",
      },
      {
        q: "Does the tool support high latitudes?",
        a: "Yes — we handle polar day/night correctly.",
      },
      {
        q: "Is civil twilight the same as sunset?",
        a: "No — civil twilight ends when the Sun is 6° below the horizon, ~30 minutes after sunset.",
      },
      {
        q: "Do you account for horizon obstructions?",
        a: "No — mountains and buildings will shift real sunset locally. We compute astronomical sunset.",
      },
    ],
    relatedSlugs: [
      "pradosh-vrat",
      "todays-sunrise",
      "todays-panchang",
      "abhijit-muhurat",
      "hora-chart",
    ],
  },

  "gulika-kaal": {
    intro:
      "Today's Gulika Kaal — an inauspicious daytime window ruled by Gulika (Mandi), the shadow-son of Shani. Distinct from Rahu Kaal.",
    howToUse: [
      "Pick your city — sunrise-anchored window loads immediately.",
      "See Gulika Kaal start and end time.",
      "Combine with Rahu Kaal and Yamaganda to plan cautiously.",
      "Avoid signing contracts or beginning new work during the window.",
    ],
    benefits: [
      "Covers the third pillar of daily inauspicious kaals.",
      "Sunrise-anchored — never off by weekday.",
      "Same-page cross-check with Rahu Kaal and Yamaganda.",
      "Free daily-updating calculation.",
    ],
    useCases: [
      "Contract signing, launches and inaugurations — schedule outside Gulika.",
      "Muhurat planning where all 3 kaals must be avoided.",
      "Astrology students learning classical inauspicious periods.",
      "Deferred activities such as house-key handovers.",
    ],
    mistakes: [
      "Confusing Gulika Kaal with Rahu Kaal — they are separate windows.",
      "Using a fixed slot instead of the weekday-specific slot.",
      "Ignoring Gulika when Rahu Kaal is 'safe' — Gulika could still be active.",
      "Applying Gulika Kaal to routine ongoing work — it targets new starts.",
    ],
    formula: {
      title: "Gulika Kaal weekday slots",
      body: "Divide daytime into 8 equal parts. Gulika slot: Sunday=7, Monday=6, Tuesday=5, Wednesday=4, Thursday=3, Friday=2, Saturday=1.",
    },
    accuracy: "Sunrise/sunset ±30 seconds; boundaries recomputed daily per city.",
    privacy: "City preference stays in localStorage.",
    faqs: [
      {
        q: "Who is Gulika?",
        a: "In Vedic astrology, Gulika (also Mandi) is a shadowy sub-planet associated with Shani, marking an inauspicious daytime window.",
      },
      {
        q: "Is Gulika Kaal worse than Rahu Kaal?",
        a: "Traditionally both are avoided; some acharyas rank Gulika slightly more sensitive for permanent decisions.",
      },
      {
        q: "Can puja be done during Gulika?",
        a: "Routine daily puja continues. New sankalpa, homa and inauguration are avoided.",
      },
      {
        q: "Does Gulika Kaal apply at night?",
        a: "The classical calculation is for daytime only; a night version exists in some schools.",
      },
      {
        q: "How does it relate to Yamaganda?",
        a: "All three (Rahu, Gulika, Yamaganda) use the 8-part daytime division with different weekday-slot mappings.",
      },
    ],
    relatedSlugs: ["rahu-kaal", "yamaganda", "choghadiya", "todays-panchang", "abhijit-muhurat"],
  },

  yamaganda: {
    intro:
      "Today's Yamaganda — the daytime window ruled by Yama, avoided for beginning journeys and new work. Distinct from Rahu Kaal and Gulika.",
    howToUse: [
      "Pick your city — the window loads from your local sunrise.",
      "See Yamaganda start and end.",
      "Plan travel and new starts outside the window.",
      "Cross-check Rahu Kaal and Gulika on the same page.",
    ],
    benefits: [
      "Completes the trio of daily inauspicious kaals for full muhurat safety.",
      "Sunrise-anchored — accurate for your longitude.",
      "Colour-coded next to Rahu Kaal for easy comparison.",
      "Free, no signup, updates every morning.",
    ],
    useCases: [
      "Choosing safe departure time for long journeys.",
      "Postponing vehicle purchase pickup to a clean window.",
      "Muhurat cross-check for property registration.",
      "Advanced planning where all three kaals must clear.",
    ],
    mistakes: [
      "Mixing Yamaganda with Rahu Kaal timings — different weekday order.",
      "Ignoring it because 'Rahu Kaal is clear' — Yamaganda might still overlap.",
      "Using a fixed slot without accounting for the actual daytime length.",
      "Applying it to routine ongoing tasks instead of new starts.",
    ],
    formula: {
      title: "Yamaganda weekday slots",
      body: "Divide daytime into 8 equal parts. Yamaganda slot: Sunday=5, Monday=4, Tuesday=3, Wednesday=2, Thursday=1, Friday=7, Saturday=6.",
    },
    accuracy: "Sunrise/sunset ±30 seconds; boundary drift within ±60 seconds of Drik references.",
    privacy: "Location kept in your browser only.",
    faqs: [
      {
        q: "Why avoid Yamaganda specifically for travel?",
        a: "Yama is the deity of transitions; classical texts single out this window for cautioning against journeys and new departures.",
      },
      {
        q: "Is Yamaganda worse than Rahu Kaal?",
        a: "Both are avoided. Some communities weigh Yamaganda more heavily for outbound travel.",
      },
      {
        q: "Does it apply at night?",
        a: "The classical window is daytime only. Traditions vary on the night complement.",
      },
      {
        q: "Can I do daily puja during Yamaganda?",
        a: "Yes — only new sankalpa, homa, contracts and journeys are avoided.",
      },
      {
        q: "How does daylight length affect it?",
        a: "Slot length = daytime/8, so summer slots are longer than winter.",
      },
    ],
    relatedSlugs: ["rahu-kaal", "gulika-kaal", "choghadiya", "todays-panchang", "abhijit-muhurat"],
  },

  // ─── Festivals ────────────────────────────────────────────
  "festival-countdown": {
    intro:
      "Live countdown to the next major Hindu festival with days, hours and minutes remaining — auto-updates for your time zone.",
    howToUse: [
      "The next upcoming festival loads first for your city.",
      "Scroll to see countdown for the next 10 festivals.",
      "Tap any festival for the full guide, rituals and muhurats.",
      "Bookmark for a home-screen countdown widget.",
    ],
    benefits: [
      "Never miss a festival — countdown is live to the second.",
      "Time-zone aware — countdown stays accurate abroad.",
      "Deep links to festival guides and puja checklists.",
      "Updates every minute without a page reload.",
    ],
    useCases: [
      "Planning festival shopping, prasad and decorations in advance.",
      "Reminding NRI families of important home traditions.",
      "Scheduling school holidays and family visits around festivals.",
      "Creating festive marketing content with accurate lead time.",
    ],
    mistakes: [
      "Trusting a countdown that ignores regional variations (e.g. north vs south dates).",
      "Assuming festival start = midnight — many begin at sunrise or tithi start.",
      "Ignoring time-zone shifts when abroad.",
      "Waiting for exact date without pre-planning muhurat and samagri.",
    ],
    accuracy:
      "Festival dates come from the Festival Rules Engine — drik-precise per traditional rules.",
    privacy: "No login. City preference kept on your device only.",
    faqs: [
      {
        q: "Which festivals are covered?",
        a: "All 12 major festivals + monthly vrats (Ekadashi, Purnima, Amavasya, Pradosh, Sankashti).",
      },
      {
        q: "Are regional dates supported?",
        a: "Yes — pick your region to align with local traditions.",
      },
      {
        q: "Does the countdown work offline?",
        a: "Once loaded, yes — dates cache locally for the year.",
      },
      { q: "How far ahead does it show?", a: "The next 10 festivals from today's date." },
      {
        q: "Can I get browser notifications?",
        a: "Sign in and enable notifications from the dashboard for one-day-before alerts.",
      },
    ],
    relatedSlugs: [
      "festival-calendar-2026",
      "upcoming-festivals",
      "festival-of-the-day",
      "festival-finder",
      "vrat-calendar",
    ],
  },

  "vrat-calendar": {
    intro:
      "The complete vrat calendar — Ekadashi, Pradosh, Sankashti, Purnima, Amavasya and all monthly fasts with drik-precise dates.",
    howToUse: [
      "Pick your city — vrat dates align with your local sunrise.",
      "Filter by vrat type or deity.",
      "Tap any vrat for vidhi, mantra and udyapan details.",
      "Add reminders from your dashboard to never miss a fast.",
    ],
    benefits: [
      "One page for every monthly and annual vrat.",
      "Region-aware — north/south variations honoured.",
      "Links to matching mantras and stotras for each vrat.",
      "Free, no login required to browse.",
    ],
    useCases: [
      "Planning a year of Ekadashi fasts in advance.",
      "Choosing sankalpa dates for a 40-day sadhana.",
      "Reminding elders of monthly Pradosh and Sankashti.",
      "Scheduling family visits around important vrats.",
    ],
    mistakes: [
      "Using a north Indian purnimanta date in a south Indian amanta context.",
      "Missing 'smarta' vs 'vaishnava' Ekadashi distinctions.",
      "Fasting on the wrong day when tithi spans two dates.",
      "Ignoring pratipada/dwadashi for parana (breaking the fast).",
    ],
    accuracy:
      "Powered by the Festival Rules Engine — validated against 2026 Drik Panchang references.",
    privacy: "City is stored locally. No account required.",
    faqs: [
      {
        q: "What is the difference between smarta and vaishnava Ekadashi?",
        a: "When Ekadashi and Dwadashi overlap sunrise, smartas keep the earlier day and vaishnavas keep the later — dates can differ by one day.",
      },
      {
        q: "Which vrats are yearly vs monthly?",
        a: "Karva Chauth, Navratri are yearly. Ekadashi, Purnima, Amavasya, Pradosh, Sankashti recur monthly.",
      },
      {
        q: "Do you show parana time?",
        a: "Yes — parana window is shown on the individual vrat page.",
      },
      { q: "Are regional vrats included?", a: "Yes — filter by region for local traditions." },
      {
        q: "Can I export the calendar?",
        a: "Yes — copy any date to your Google/Apple calendar in one tap.",
      },
    ],
    relatedSlugs: [
      "ekadashi-dates",
      "purnima-amavasya",
      "pradosh-vrat",
      "sankashti-chaturthi",
      "festival-calendar-2026",
    ],
  },

  "pradosh-vrat": {
    intro:
      "All Pradosh Vrat dates with sunset-anchored pradosh kaal window — the 96-minute period sacred to Shiva around every trayodashi.",
    howToUse: [
      "Pick your city so pradosh kaal aligns with your sunset.",
      "Browse upcoming Pradosh dates for the year.",
      "Note the day — Som Pradosh (Monday) has special significance.",
      "Follow the Shiva puja vidhi shown for each date.",
    ],
    benefits: [
      "Sunset-anchored — window is precise for your city.",
      "Highlights variants: Som (Mon), Bhaum (Tue), Shani (Sat) Pradosh.",
      "Includes puja vidhi, mantra and prasad suggestions.",
      "Free, no login, mobile-first UI.",
    ],
    useCases: [
      "Planning monthly Shiva puja on Pradosh Vrat.",
      "Following a Som Pradosh discipline for family wellbeing.",
      "Choosing a Shani Pradosh for Shani-shanti rituals.",
      "Scheduling temple visits to a Shiva temple during pradosh kaal.",
    ],
    mistakes: [
      "Assuming pradosh kaal is at fixed 6:00 PM — it depends on your sunset.",
      "Doing puja outside the 96-minute window and calling it Pradosh.",
      "Skipping the fast — Pradosh Vrat traditionally involves a partial fast.",
      "Confusing Pradosh (trayodashi) with Ekadashi.",
    ],
    formula: {
      title: "Pradosh Kaal window",
      body: "Pradosh Kaal = 1.5 hours before sunset to 1.5 hours after sunset = ~96 minutes centred on sunset. Vrat is observed on trayodashi tithi that overlaps this window.",
    },
    accuracy: "Sunset ±30 seconds; trayodashi from live Moon–Sun elongation.",
    privacy: "City is stored locally; no personal data collected.",
    faqs: [
      {
        q: "Which Pradosh is best?",
        a: "All are auspicious. Som (Mon) is for family; Bhaum (Tue) removes debts; Shani (Sat) mitigates Shani; Shukra (Fri) grants prosperity.",
      },
      {
        q: "Can women observe Pradosh Vrat?",
        a: "Yes — traditionally observed by all, often for marital and family harmony.",
      },
      {
        q: "What is the parana time?",
        a: "After completing pradosh puja, i.e. after sunset — some traditions break the fast next morning.",
      },
      {
        q: "Do temples stay open during pradosh?",
        a: "Most Shiva temples remain open through pradosh kaal; larger ones have special abhishekam then.",
      },
      {
        q: "How is pradosh puja different from regular Shiva puja?",
        a: "It is done in pradosh kaal with 108 Bilva leaves, water and a specific mantra sequence.",
      },
    ],
    relatedSlugs: [
      "vrat-calendar",
      "todays-sunset",
      "sankashti-chaturthi",
      "mahamrityunjaya-mantra",
      "aarti-collection",
    ],
  },

  "sankashti-chaturthi": {
    intro:
      "All Sankashti Chaturthi dates — the monthly Krishna Chaturthi dedicated to Ganesha, with moonrise time (chandrodaya) for your city.",
    howToUse: [
      "Pick your city — moonrise time is longitude-precise.",
      "Browse upcoming Sankashti dates for the year.",
      "Note the chandrodaya — the fast is broken after moon sighting.",
      "Follow the Ganesha puja vidhi and mantras shown.",
    ],
    benefits: [
      "Moonrise time computed live for your city.",
      "Highlights Angarki (Tue) Sankashti — considered most powerful.",
      "Includes 21-name Ganesha stotra and mantra.",
      "Free, no login, updates monthly.",
    ],
    useCases: [
      "Monthly Ganesha vrat for removal of obstacles.",
      "Following the 12-month Sankashti discipline as a family sadhana.",
      "Timing chandra-darshan and parana correctly.",
      "Choosing Angarki Sankashti days for major sankalpa.",
    ],
    mistakes: [
      "Breaking the fast at sunset instead of moonrise.",
      "Confusing Sankashti (Krishna) with Vinayaka (Shukla) Chaturthi.",
      "Using Delhi's chandrodaya from other cities.",
      "Skipping the specific 21-name Ganesha stotra.",
    ],
    formula: {
      title: "Sankashti timing",
      body: "Sankashti = Krishna paksha Chaturthi (4th tithi after Purnima) each month. Chandrodaya = moonrise for your city, computed from Moon altitude with refraction correction.",
    },
    accuracy: "Moonrise ±60 seconds; Chaturthi tithi from live Moon–Sun elongation.",
    privacy: "City preference kept locally only.",
    faqs: [
      {
        q: "What is Angarki Sankashti?",
        a: "Sankashti that falls on a Tuesday — considered exceptionally powerful for Ganesha grace.",
      },
      {
        q: "Is the fast strict?",
        a: "Traditionally nirjala (waterless) until moonrise; fruit and milk are accepted variants.",
      },
      {
        q: "Which mantra is best?",
        a: "Sankashtanashan Ganesha Stotra (21 names) plus 'Om Gam Ganapataye Namah' 108 times.",
      },
      {
        q: "Does it work if I only fast half the day?",
        a: "Yes — partial fasting with sincere puja is accepted for those unable to fast fully.",
      },
      {
        q: "Why does chandrodaya differ so much by city?",
        a: "Moonrise shifts ~4 minutes per degree of longitude, plus lunar declination effects.",
      },
    ],
    relatedSlugs: [
      "vrat-calendar",
      "ekadashi-dates",
      "deity-mantras",
      "aarti-collection",
      "todays-panchang",
    ],
  },

  // ─── Puja ────────────────────────────────────────────────
  "samagri-checklist": {
    intro:
      "A complete, printable puja samagri checklist — every item, quantity and traditional substitute for the major deity pujas.",
    howToUse: [
      "Pick the deity or occasion (Ganesha, Lakshmi, Satyanarayan, Griha Pravesh…).",
      "Review the auto-generated samagri list with quantities.",
      "Print or share the list with your family before the puja.",
      "Substitute any item using the traditional alternatives shown.",
    ],
    benefits: [
      "Never forget a critical item on the day of the puja.",
      "Includes traditional substitutes when an item is unavailable.",
      "Quantities calibrated to household puja (adjustable for larger).",
      "Print-optimised for a paper-friendly list.",
    ],
    useCases: [
      "Preparing samagri for a Satyanarayan or Griha Pravesh puja.",
      "Shopping list for festival pujas — Diwali Lakshmi puja, Ganesh Chaturthi.",
      "First-time puja hosts unsure what to buy.",
      "Purohit sharing a pre-visit checklist with the yajaman.",
    ],
    mistakes: [
      "Buying too many perishables (flowers, banana leaves) too early.",
      "Skipping the pancha-patra kit (kumkum, akshat, haldi, chandan, gandh).",
      "Forgetting the exact prasad required by the puja.",
      "Missing an akshat + pushp substitute when specific flowers are unavailable.",
    ],
    accuracy:
      "Sourced from traditional Shodashopachara puja vidhi and refined by practicing purohits.",
    privacy: "No data collected — the tool is fully local.",
    faqs: [
      {
        q: "Can I get a Hindi list?",
        a: "Yes — switch the language from the top bar and the entire list translates.",
      },
      {
        q: "What if I can't find durva grass?",
        a: "Substitute with fresh green leaves and note the sankalpa; the list shows accepted alternatives.",
      },
      {
        q: "Do quantities scale for large pujas?",
        a: "Yes — enter number of participants and the list multiplies accordingly.",
      },
      {
        q: "Is this samagri okay for a temple puja?",
        a: "Yes — for household-scale. Larger temple pujas use expanded traditional lists.",
      },
      {
        q: "Can I save the list?",
        a: "Sign in to save it to your dashboard, or print/share directly.",
      },
    ],
    relatedSlugs: [
      "puja-vidhi-planner",
      "sankalp-generator",
      "griha-pravesh-planner",
      "havan-guide",
      "aarti-thali-guide",
    ],
  },

  "sankalp-generator": {
    intro:
      "Generate your personalised sankalpa mantra — the traditional statement of intent — with today's tithi, nakshatra, city, gotra and purpose.",
    howToUse: [
      "Enter your name, gotra and location.",
      "Pick the puja or purpose (e.g. griha pravesh, satyanarayan, vrat).",
      "The sankalpa text is generated in Sanskrit with English meaning.",
      "Copy, print or share the sankalpa for use before the puja.",
    ],
    benefits: [
      "Correct desha-kaal-patra (place-time-context) auto-filled from today's panchang.",
      "Both Sanskrit and English versions side-by-side.",
      "Editable — adjust gotra, sankalpa purpose or family lineage freely.",
      "Perfect for first-time hosts unfamiliar with sankalpa format.",
    ],
    useCases: [
      "Before any major household puja (Satyanarayan, Griha Pravesh).",
      "At the start of a vrat sankalpa (Ekadashi, Karva Chauth).",
      "Beginning a homa or havan.",
      "Personal sadhana anushthana sankalpa.",
    ],
    mistakes: [
      "Skipping the desha-kaal-patra portion (place, time, context).",
      "Getting the tithi/nakshatra wrong because of mid-day change.",
      "Using generic Sanskrit templates without personal details.",
      "Forgetting to state the phala (desired result) at the end.",
    ],
    accuracy: "Panchang details pulled live from the Panchang Engine (drik-precise for your city).",
    privacy: "All inputs stay in your browser. Nothing is sent to a server.",
    faqs: [
      {
        q: "What if I don't know my gotra?",
        a: "Use 'Kashyapa gotra' as the default fallback recognised across traditions.",
      },
      {
        q: "Is the sankalpa in Devanagari?",
        a: "Yes — both Devanagari and IAST/English transliteration are shown.",
      },
      {
        q: "Can I customise the purpose text?",
        a: "Yes — edit the phala/nimitta line to match your specific need.",
      },
      {
        q: "Does the sankalpa change during pradosh or eclipse?",
        a: "Yes — the tool auto-includes special kaal names when relevant.",
      },
      {
        q: "How long should the sankalpa be?",
        a: "The complete traditional form is 3–4 lines; we generate the full form and let you shorten if needed.",
      },
    ],
    relatedSlugs: [
      "samagri-checklist",
      "puja-vidhi-planner",
      "havan-guide",
      "griha-pravesh-planner",
      "todays-panchang",
    ],
  },

  "havan-guide": {
    intro:
      "A step-by-step havan (homa) guide — kalash sthapana, agni pratishtha, ahutis, mantras and purnahuti — for every major deity.",
    howToUse: [
      "Pick the havan type (Ganesha, Lakshmi, Navagraha, Mahamrityunjaya…).",
      "Follow the ordered steps with mantras in Devanagari + English.",
      "Track your ahuti count (108, 1008, etc.) with the built-in counter.",
      "Conclude with purnahuti and prasad distribution.",
    ],
    benefits: [
      "Full mantra text with meaning, not just step names.",
      "Ahuti counter with automatic 108/1008 alerts.",
      "Traditional Sanskrit paired with clear English guidance.",
      "Works for household havan or larger yajna.",
    ],
    useCases: [
      "Housewarming (Griha Pravesh) havan.",
      "Birthday havan (Ayushya Homa) for children.",
      "Navagraha havan for planetary balance.",
      "Mahamrityunjaya havan for health and healing.",
    ],
    mistakes: [
      "Lighting agni without proper agni-pratishtha mantras.",
      "Missing the sankalpa before starting ahutis.",
      "Skipping purnahuti — the closing offering that seals the yajna.",
      "Using wrong samidha (wood) for the deity — mango and palash are the safe defaults.",
    ],
    accuracy: "Vidhi based on Grihya Sutras and standard purohit references.",
    privacy: "No data collected. Ahuti counter is fully local.",
    faqs: [
      {
        q: "Which wood is used for havan?",
        a: "Palash (Butea) is the ideal shastric wood. Mango is the standard household substitute.",
      },
      {
        q: "Can I do havan without a purohit?",
        a: "Yes — for simple household havans. Complex yajnas (chandi, ati-rudra) need a trained priest.",
      },
      {
        q: "What samagri goes into ahuti?",
        a: "Ghee, til, jau, hawan samagri mix; specific deities add specific dravyas listed in the tool.",
      },
      {
        q: "How many ahutis are enough?",
        a: "Household havan: 108. Special sankalpas: 1008. Ati-rudra and larger yagnas: 11,000+.",
      },
      {
        q: "What is purnahuti?",
        a: "The final full-ladle ghee offering that concludes the havan and offers all merit to the deity.",
      },
    ],
    relatedSlugs: [
      "puja-vidhi-planner",
      "samagri-checklist",
      "sankalp-generator",
      "mahamrityunjaya-mantra",
      "deity-mantras",
    ],
  },

  "griha-pravesh-planner": {
    intro:
      "Complete Griha Pravesh planner — muhurat selection, samagri checklist, vastu shanti steps and post-puja rituals for a new home.",
    howToUse: [
      "Enter the tentative move-in month and city.",
      "See recommended Griha Pravesh muhurats with tithi, nakshatra and lagna.",
      "Download the samagri checklist and step-by-step vidhi.",
      "Bookmark for reference on the day.",
    ],
    benefits: [
      "Muhurat filtered for tithi + nakshatra + shubh yoga together.",
      "Vastu shanti and Ganesha puja steps included.",
      "Regional variations honoured (north/south differ on some rituals).",
      "Free — no consultation booking pressure.",
    ],
    useCases: [
      "Selecting a Griha Pravesh date after possession.",
      "Planning apurva (first-time), sapurva (renovation) or dwandwa (re-entry) pravesh.",
      "Coordinating family + purohit availability with muhurat window.",
      "Preparing samagri and prasad in advance.",
    ],
    mistakes: [
      "Choosing a muhurat only by tithi without checking nakshatra.",
      "Skipping vastu shanti in a newly built house.",
      "Entering the house before the muhurat sankalpa is done.",
      "Ignoring Chaturmas (Ashadh–Kartik) restrictions for apurva pravesh.",
    ],
    accuracy: "Muhurat suggestions cross-validated against tithi, nakshatra and shubh yoga rules.",
    privacy: "City preference stored locally only.",
    faqs: [
      {
        q: "Can I do Griha Pravesh during Chaturmas?",
        a: "Apurva (first-time) pravesh is avoided in Chaturmas. Sapurva and dwandwa are allowed with adjustments.",
      },
      {
        q: "Which nakshatras are best?",
        a: "Rohini, Mrigashira, Anuradha, Chitra, Uttara Phalguni, Uttarashadha, Uttara Bhadrapada, Revati, Pushya, Shatabhisha, Dhanishta.",
      },
      {
        q: "Do I need a purohit?",
        a: "Recommended for the full vidhi; simple household versions can be self-led with the tool as reference.",
      },
      {
        q: "What is milk-boiling ritual?",
        a: "The traditional first act in the kitchen — boiling milk until it overflows, symbolising prosperity.",
      },
      {
        q: "How long before moving in must the puja be done?",
        a: "Ideally the puja is the first entry act — do not sleep in the house before the sankalpa.",
      },
    ],
    relatedSlugs: [
      "samagri-checklist",
      "puja-vidhi-planner",
      "sankalp-generator",
      "havan-guide",
      "todays-panchang",
    ],
  },
};
