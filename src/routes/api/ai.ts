import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AI_MODES, isAiMode } from "@/lib/ai-modes";

const BodySchema = z.object({
  mode: z.string().min(1),
  input: z.record(z.string(), z.string()).default({}),
});

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = BodySchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request shape" }, { status: 400 });
        }

        const { mode, input } = parsed.data;
        if (!isAiMode(mode)) {
          return Response.json({ error: `Unknown AI mode: ${mode}` }, { status: 400 });
        }

        const cfg = AI_MODES[mode];
        const prompt = cfg.buildPrompt(input);
        if (!prompt.trim()) {
          return Response.json({ error: "Please provide input." }, { status: 400 });
        }

        try {
          const { callAi } = await import("@/lib/ai-router.server");
          const result = await callAi({
            feature: `tool:${mode}`,
            system: cfg.system,
            prompt,
          });
          return Response.json({
            text: result.text,
            provider: result.provider,
            model: result.model,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "AI request failed";
          const status = /rate limit|429/i.test(message)
            ? 429
            : /402|credit|payment/i.test(message)
              ? 402
              : /no enabled ai providers/i.test(message)
                ? 503
                : 500;
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
