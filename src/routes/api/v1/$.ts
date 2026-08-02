// Universal API Layer entry — /api/v1/*
// All routing, validation, auth, rate limiting, caching and error
// handling live in src/api. This file is a transport shim only.
import { createFileRoute } from "@tanstack/react-router";
import { handleApiRequest, preflight } from "@/api";

const handler = async ({ request, params }: { request: Request; params: { _splat?: string } }) =>
  handleApiRequest(request, `v1/${params._splat ?? ""}`);

export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: handler,
      POST: handler,
      PUT: handler,
      PATCH: handler,
      DELETE: handler,
    },
  },
});
