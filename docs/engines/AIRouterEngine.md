# AI Router & Gateway Engine Architecture & Specification

## Overview
The **AI Router Engine** (`src/lib/ai-router.server.ts`, `src/lib/ai-gateway.server.ts`, `src/lib/ai-modes.ts`, `src/lib/ai-providers.functions.ts`) is responsible for managing multi-LLM provider routing (Gemini, OpenAI, Anthropic, DeepSeek, Groq, Ollama), fallbacks, model tiering, streaming responses, cost monitoring, prompt context assembly, and domain-specific AI assistance (Astrology AI, Festival AI, Vastu AI, etc.).

## Key Responsibilities

1. **Provider Load Balancing & Fallback**: Routes requests dynamically based on available API keys, latency, cost parameters, and rate-limits. Fallback chain executes automatically on model timeouts or error statuses (429/500).
2. **Context & Persona Conditioning**: Formats user requests with system prompts derived from astrological context (e.g. user Kundli chart data, Panchang context, current transit).
3. **Stream Management**: Supports Server-Sent Events (SSE) streaming for real-time response generation in UI components.
4. **Token & Cost Tracking**: Logs model token usage (input/output) into analytics tables.

## Key Files & Modules

- **`src/lib/ai-router.server.ts`**: Core server-side routing logic and model orchestration.
- **`src/lib/ai-gateway.server.ts`**: Universal gateway wrapper for external model APIs.
- **`src/lib/ai-modes.ts`**: System prompt declarations, prompt presets, and agent mode configurations.
- **`src/lib/ai-providers.functions.ts`**: Database/admin controls for managing active provider API keys and model options.

## Maintenance Guidelines
- Ensure all provider configurations support standardized streaming standard wrappers.
- Update this document when adding new LLM providers or routing policies.
