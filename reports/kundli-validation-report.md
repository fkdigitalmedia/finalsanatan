# Kundli Engine — Validation Report

- Generated: 2026-07-15T15:58:22.828Z
- Cases: 6
- Checks: 11
- Pass: 11
- Fail: 0
- Accuracy: **100.00%**

| #   | Case                            | Field         | Expected   | Got        | Status | Source                             |
| --- | ------------------------------- | ------------- | ---------- | ---------- | ------ | ---------------------------------- |
| 1   | narendra-modi                   | lagna         | Vrishchika | Vrishchika | PASS   | ProKerala Vedic Kundli             |
| 2   | narendra-modi                   | moonSign      | Vrishchika | Vrishchika | PASS   | ProKerala Vedic Kundli             |
| 3   | narendra-modi                   | sunSign       | Kanya      | Kanya      | PASS   | ProKerala Vedic Kundli             |
| 4   | narendra-modi                   | moonNakshatra | Anuradha   | Anuradha   | PASS   | ProKerala Vedic Kundli             |
| 5   | sachin-tendulkar                | lagna         | Kanya      | Kanya      | PASS   | AstroSage                          |
| 6   | sachin-tendulkar                | sunSign       | Mesha      | Mesha      | PASS   | AstroSage                          |
| 7   | mahatma-gandhi                  | sunSign       | Kanya      | Kanya      | PASS   | Drik Panchang (widely-cited chart) |
| 8   | a-p-j-abdul-kalam               | sunSign       | Kanya      | Kanya      | PASS   | Drik Panchang                      |
| 9   | swami-vivekananda               | sunSign       | Dhanu      | Dhanu      | PASS   | AstroSeek Vedic                    |
| 10  | reference-2000-01-01-noon-delhi | moonSign      | Tula       | Tula       | PASS   | JPL Horizons + Lahiri ayanamsa     |
| 11  | reference-2000-01-01-noon-delhi | sunSign       | Dhanu      | Dhanu      | PASS   | JPL Horizons + Lahiri ayanamsa     |

> Soft mismatches (±1 rashi at rashi/nakshatra boundaries within 1°) are
> reported as FAIL here so they surface in review; adjust reference times
> from source almanacs before treating them as engine defects.
