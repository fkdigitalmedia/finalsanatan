// ============================================================
// Kundli / ayanamsa module
// ------------------------------------------------------------
// Thin wrapper over the shared astronomical core so future
// ayanamsa systems (Raman, KP, Fagan-Bradley) can be added
// without touching the rest of the engine.
// ============================================================
import { ayanamsaLahiri } from "@/lib/astro/core";

export type AyanamsaSystem = "lahiri";

export function ayanamsa(d: Date, system: AyanamsaSystem = "lahiri"): number {
  switch (system) {
    case "lahiri":
    default:
      return ayanamsaLahiri(d);
  }
}
