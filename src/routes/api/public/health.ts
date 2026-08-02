// Liveness probe — /api/public/health
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const { liveness, healthResponse } = await import("@/lib/health/checks.server");
        return healthResponse(liveness());
      },
    },
  },
});
