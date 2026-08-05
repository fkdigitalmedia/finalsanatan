# Kundli Engine Architecture & Specification

## Overview
The **Kundli Engine** (`src/lib/kundli/`) is the central astrological calculation system responsible for generating birth charts, planetary positions (grahas), house positions (bhavas), ayanamsa calculations, planetary strength (Shadbala / Ashtakvarga), Yogas, Doshas (Kaal Sarp, Manglik, Pitra, Sadhesati), and lifecycle predictions.

## File Structure & Responsibilities

- **`src/lib/kundli/engine.ts`**: Core calculation logic integrating ephemeris/astronomical algorithms, planetary degrees, ascendant calculation, and house cusps.
- **`src/lib/kundli/ayanamsa/`**: Sidereal ayanamsa calculations (Lahiri, Raman, Krishnamurti, Chitrapaksha).
- **`src/lib/kundli/charts/`**: Divisual Chart calculations (D1 Lagna, D9 Navamsha, D10 Dasamsha, D12 Dwadasamsha, D60 Shashtiamsha, North Indian / South Indian format mapping).
- **`src/lib/kundli/doshas.ts`**: Detection of planetary afflictions and doshas (Manglik Dosha, Kaal Sarp Dosha, Pitra Dosha, Kemdrum Yoga, etc.).
- **`src/lib/kundli/yogas.ts`**: Classical Yoga recognition (Raja Yogas, Dhana Yogas, Vipreet Raja Yogas, Gajakesari, Budhaditya, etc.).
- **`src/lib/kundli/strength/`**: Planetary and house strength evaluation (Shadbala, Ashtakvarga, Bhava Bala).
- **`src/lib/kundli/matching.ts`**: Ashtakoot Guna Milan (36-point matching system for compatibility analysis).
- **`src/lib/kundli/varshphal.ts`**: Annual chart calculations (Tajika system, Muntha, Varsha Lagna, Sahams, Mudda Dasha).
- **`src/lib/kundli/life-score-engine.ts`**: Composite multi-dimensional life score calculation based on house strengths and planetary alignments.
- **`src/lib/kundli/explainable-astrology-engine.ts`**: Natural language translation and reasoning layer for user-facing predictions.

## Primary Interfaces & Data Contracts

```typescript
export interface KundliCalculationInput {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm (24-hour format)
  latitude: number;
  longitude: number;
  timezone: string;    // e.g. "Asia/Kolkata"
  ayanamsa?: 'lahiri' | 'raman' | 'kp';
}

export interface KundliEngineOutput {
  ascendant: PlanetaryPosition;
  planets: PlanetaryPosition[];
  houses: HouseCusp[];
  divisionalCharts: Record<string, DivisionalChart>;
  doshas: DoshaAnalysisResult;
  yogas: YogaAnalysisResult[];
  dashaPeriod: VimshottariDashaResult;
}
```

## Maintenance & Refactoring Guidelines
1. All astronomical calculations must maintain precision to at least 4 decimal places of arc-degrees.
2. Any modifications to planetary calculations must pass tests in `src/lib/__tests__/kundli.test.ts`.
3. When updating or extending features in `src/lib/kundli/`, update this document accordingly.
