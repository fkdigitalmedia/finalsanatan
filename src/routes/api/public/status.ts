// Full dependency status — /api/public/status
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/status")({
  server: {
    handlers: {
      GET: async () => {
        const { fullStatus, healthResponse } = await import("@/lib/health/checks.server");
        return healthResponse(await fullStatus());
      },
    },
  },
});
