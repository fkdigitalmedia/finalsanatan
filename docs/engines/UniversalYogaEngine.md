# Universal Vedic Yoga Calculation & Scanner Engine Documentation

## 1. Overview
The **Universal Vedic Yoga Calculation & Scanner Engine** (`src/components/tools/yogas/universal-yoga-engine.ts`) delivers automated scanning, mathematical verification, strength quantification, and classical Shastriya evaluation for all major Vedic Yogas on `/yoga` and individual `/yoga/$slug` pages.

---

## 2. Supported Yoga Systems (१४ प्रमुख योग)

### 2.1 Pancha Mahapurusha Yogas (पञ्च महापुरुष योग)
1. **Ruchaka Yoga (रुचक योग)**: Mars in Kendra in Aries, Scorpio, or Capricorn.
2. **Bhadra Yoga (भद्र योग)**: Mercury in Kendra in Gemini or Virgo.
3. **Hamsa Yoga (हंस योग)**: Jupiter in Kendra in Cancer, Sagittarius, or Pisces.
4. **Malavya Yoga (मालव्य योग)**: Venus in Kendra in Taurus, Libra, or Pisces.
5. **Shasha Yoga (शश योग)**: Saturn in Kendra in Libra, Capricorn, or Aquarius.

### 2.2 Planetary Conjunction & Mutual Aspect Yogas
6. **Gaja Kesari Yoga (गजकेसरी योग)**: Jupiter in 1st, 4th, 7th, 10th from Moon.
7. **Budhaditya Yoga (बुधादित्य योग)**: Sun + Mercury conjunction with combustion check.
8. **Chandra Mangal / Mahalakshmi Yoga (चन्द्र-मंगल योग)**: Moon + Mars conjunction or 7th mutual aspect.
9. **Amala Yoga (अमला योग)**: Pure benefics (Jupiter, Venus, Mercury) in 10th house from Lagna or Moon.

### 2.3 Regal & Wealth Yogas
10. **Raja Yoga (केन्द्र-त्रिकोण राजयोग)**: Kendra lords ($1, 4, 7, 10$) associated with Trikona lords ($1, 5, 9$).
11. **Dhana Yoga (महालक्ष्मी धन योग)**: 2nd, 5th, 9th, and 11th house lords interlinked.
12. **Viparita Raja Yoga (विपरीत राज योग)**: 6th, 8th, and 12th lords placed strictly in 6th, 8th, 12th houses (Harsha, Sarala, Vimala).
13. **Neecha Bhanga Raja Yoga (नीचभंग राज योग)**: 4-fold cancellation rules transforming planetary weakness into monumental rise.
14. **Panch Mahapurusha Master (पञ्च महापुरुष मास्टर)**: Complete composite evaluation across all 5 non-luminary planets.

---

## 3. Architecture & Integration
- **Master Scanner on `/yoga` (`MasterYogaScannerView`)**: Scans all 14+ Yogas in a single pass with overall Yoga Score, category filters, and direct links.
- **Dynamic Calculator Widget on `/yoga/$slug` (`YogaCalculatorWidget`)**: Renders a specialized interactive calculator and Vedic remedy breakdown for each individual yoga page.
- **Astronomical Precision**: Uses Swiss sidereal calculations via `generateKundli` and Lahiri Ayanamsa.
