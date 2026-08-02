// ============================================================
// AI Interpretation Engine — Provider layer
// ------------------------------------------------------------
// The engine never talks to OpenAI/Gemini/Claude/OpenRouter/
// DeepSeek/Groq directly. It talks to an adapter. The default
// adapter delegates to the existing AI Router, which resolves
// the provider chain from the ai_providers / ai_feature_mappings
// tables — so admins enable, disable, reorder or add providers
// with zero code changes.
// ============================================================

import type { AiProviderAdapter } from "./types";

/**
 * Provider families the router already speaks. Listed for the admin UI
 * and for documentation; the runtime list always comes from the database.
 */
export const KNOWN_PROVIDER_TYPES = [
  "lovable",
  "openai",
  "gemini",
  "anthropic",
  "openrouter",
  "deepseek",
  "groq",
  "mistral",
  "cohere",
  "custom",
] as const;

export type KnownProviderType = (typeof KNOWN_PROVIDER_TYPES)[number];

/**
 * Default adapter — server only. Imported lazily so this module stays
 * safe to import from tests and from client-safe *.functions.ts files.
 */
export const routerAdapter: AiProviderAdapter = {
  id: "ai-router",
  async complete(request) {
    const { callAi } = await import("@/lib/ai-router.server");
    const result = await callAi({
      feature: request.featureKey,
      system: request.system,
      prompt: request.prompt,
      maxTokens: request.maxTokens,
      overrideModel: request.model,
      userId: request.userId ?? null,
    });
    return {
      text: result.text,
      provider: result.provider,
      model: result.model,
      latencyMs: result.latencyMs,
    };
  },
};

let activeAdapter: AiProviderAdapter = routerAdapter;
const fallbacks: AiProviderAdapter[] = [];

/** Swap the primary adapter (tests, offline mode, a future gateway). */
export function setProviderAdapter(adapter: AiProviderAdapter): void {
  activeAdapter = adapter;
}

export function getProviderAdapter(): AiProviderAdapter {
  return activeAdapter;
}

/** Adapter-level fallbacks. Provider-level failover lives in the router. */
export function setFallbackAdapters(adapters: AiProviderAdapter[]): void {
  fallbacks.splice(0, fallbacks.length, ...adapters);
}

export function resetProviderAdapters(): void {
  activeAdapter = routerAdapter;
  fallbacks.length = 0;
}

/** Run the request through the primary adapter, then each fallback. */
export async function completeWithFallback(
  request: Parameters<AiProviderAdapter["complete"]>[0],
): Promise<{ text: string; provider: string; model: string; adapter: string }> {
  const chain = [activeAdapter, ...fallbacks];
  let lastError: unknown = null;

  for (const adapter of chain) {
    try {
      const result = await adapter.complete(request);
      if (!result || typeof result.text !== "string" || !result.text.trim()) {
        throw new Error(`Adapter "${adapter.id}" returned an empty response.`);
      }
      return { ...result, adapter: adapter.id };
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `All AI adapters failed for ${request.featureKey}: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}
