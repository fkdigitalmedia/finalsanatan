import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Server-only helper that wires the AI SDK to the Lovable AI Gateway.
 * NEVER import this file from client code — it reads LOVABLE_API_KEY.
 */
export function createGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

/** Default chat model for SanatanTools AI features. */
export const DEFAULT_MODEL = "google/gemini-3.5-flash";
