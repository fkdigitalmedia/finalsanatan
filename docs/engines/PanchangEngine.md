# Panchang Engine Architecture & Specification

## Overview
The **Panchang Engine** (`src/lib/panchang.ts`, `src/lib/panchang-month.ts`, `src/lib/festivals/`) calculates daily Hindu calendar elements (the 5 limbs or "Pancha-Anga") based on solar and lunar positions, geographic location, and time.

## Core Elements (Panchang Limbs)

1. **Tithi** (Lunar Day): Calculation based on relative longitudinal difference between Sun and Moon ($\Delta \theta = \text{Moon} - \text{Sun}$). Each $12^\circ$ shift marks one Tithi (30 Tithis per lunar month).
2. **Vara** (Weekday): Calculated based on sunrise time at the specified latitude/longitude.
3. **Nakshatra** (Lunar Mansion): Determined by Moon's absolute sidereal longitude ($360^\circ / 27 = 13^\circ 20'$ per Nakshatra).
4. **Yoga** (Luni-Solar combination): Sum of Sun and Moon's sidereal longitudes ($\text{Sun} + \text{Moon} \pmod{360^\circ}$ divided into 27 equal divisions).
5. **Karana** (Half Tithi): 60 Karanas in a lunar month ($6^\circ$ segments of Sun-Moon longitude difference).

## Key Files & Modules

- **`src/lib/panchang.ts`**: Daily Panchang calculations, Muhurta determination (Abhijit, Rahu Kalam, Yamagandam, Gulika Kalam, Choghadiya, Hora).
- **`src/lib/panchang-month.ts`**: Monthly Panchang grid generation, Amavasyant / Purnimant lunar month handling.
- **`src/lib/festivals-data.ts`**: Calendar events and festival calculation algorithms (Diwali, Holi, Shivratri, Ekadashi, Navratri, Pradosh).
- **`src/lib/festivals.functions.ts`**: Server-side functions serving Panchang and festival API endpoints.

## Maintenance Guidelines
- Ensure sunrise/sunset calculations incorporate atmospheric refraction and geographic elevation corrections.
- Update this document whenever new Muhurta algorithms or festival rule engines are introduced.
