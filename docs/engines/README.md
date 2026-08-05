# Sanatan Dharma Suite - Engine Systems Index

This folder contains detailed technical specification and design documentation for all calculation, generation, and processing engines in the Sanatan Dharma Suite.

## Engine Catalog

| Engine System | Path / Module | Documentation | Status |
| :--- | :--- | :--- | :--- |
| **Kundli Engine** | `src/lib/kundli/` | [KundliEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/KundliEngine.md) | Active |
| **Panchang Engine** | `src/lib/panchang.ts`, `src/lib/panchang-month.ts` | [PanchangEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/PanchangEngine.md) | Active |
| **Gochar & Transit Engine** | `src/lib/gochar/`, `src/lib/transit/` | [GocharEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/GocharEngine.md) | Active |
| **Vimshottari Dasha Engine** | `src/lib/dasha/` | [DashaEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/DashaEngine.md) | Active |
| **AI Router & Gateway Engine** | `src/lib/ai-router.server.ts`, `src/lib/ai/` | [AIRouterEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/AIRouterEngine.md) | Active |
| **PDF Generation Engine** | `src/lib/pdf/`, `src/lib/kundli/pdf.ts` | [PDFEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/PDFEngine.md) | Active |
| **Numerology Engine** | `src/lib/numerology/` | [NumerologyEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/NumerologyEngine.md) | Active |
| **Vastu Engine** | `src/lib/vastu/` | [VastuEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/VastuEngine.md) | Active |
| **Marriage Analysis Engine** | `src/lib/marriage-analysis/` | [MarriageAnalysisEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/MarriageAnalysisEngine.md) | Active |
| **Health Analysis Engine** | `src/lib/health-analysis/` | [HealthAnalysisEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/HealthAnalysisEngine.md) | Active |
| **Foreign Settlement Engine** | `src/lib/foreign-settlement/` | [ForeignSettlementEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/ForeignSettlementEngine.md) | Active |
| **Career Analysis Engine** | `src/lib/career-analysis/` | [CareerAnalysisEngine.md](file:///g:/Sanatan%20Tools%20new/Sanatan%20Dharma%20Suite%20%281%29/docs/engines/CareerAnalysisEngine.md) | Active |





## Documentation Guidelines
Whenever an engine system is created, refactored, or expanded:
1. Update or create the corresponding `.md` file in `docs/engines/`.
2. Document the input parameters, calculation algorithms, formulas, output schema, and public API interfaces.
3. Ensure cross-references are linked using file URIs.
