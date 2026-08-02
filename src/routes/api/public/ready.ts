// Readiness probe — /api/public/ready
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/ready")({
  server: {
    handlers: {
      GET: async () => {
        const { readiness, healthResponse } = await import("@/lib/health/checks.server");
        return healthResponse(await readiness());
      },
    },
  },
});
