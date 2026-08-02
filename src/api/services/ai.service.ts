// ============================================================
// Service — AI interpretation & PDF reports
// ------------------------------------------------------------
// AI never calculates. It only narrates engine JSON supplied by
// the caller-side services in this same layer.
// ============================================================

import { interpret } from "@/lib/ai";
import type { InterpretationInput } from "@/lib/ai/types";
import type { GenerateOptions, RenderResult } from "@/lib/pdf/types";

export function interpretReport(input: InterpretationInput) {
  return interpret(input);
}

/** PDF generation runs through the universal PDF engine. */
export async function generatePdf(options: GenerateOptions): Promise<RenderResult> {
  const { generatePdf: run } = await import("@/lib/pdf/engine");
  return run(options);
}
