import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/")({
  beforeLoad: () => {
    throw redirect({
      to: "/blog",
      statusCode: 301,
    });
  },
});
