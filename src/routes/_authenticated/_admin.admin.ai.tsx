import { createFileRoute } from "@tanstack/react-router";
import { CrudTable, type CrudConfig } from "@/components/admin/CrudTable";

const config: CrudConfig = {
  table: "ai_prompts",
  keyColumn: "id",
  title: "AI Prompts",
  description: "System prompts and model configuration for every AI tool.",
  searchColumn: "name",
  fields: [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "dharma-assistant" },
    { name: "description", label: "Description", type: "text" },
    { name: "system_prompt", label: "System prompt", type: "textarea", hideInTable: true },
    {
      name: "model",
      label: "Model",
      type: "select",
      options: [
        "google/gemini-2.5-flash",
        "google/gemini-2.5-flash-lite",
        "google/gemini-2.5-pro",
        "google/gemini-3.5-flash",
        "google/gemini-3.1-pro-preview",
        "openai/gpt-5.4-mini",
        "openai/gpt-5.5",
      ],
    },
    { name: "temperature", label: "Temperature", type: "number" },
    { name: "max_tokens", label: "Max tokens", type: "number" },
    { name: "enabled", label: "Enabled", type: "boolean" },
  ],
};

export const Route = createFileRoute("/_authenticated/_admin/admin/ai")({
  component: () => <CrudTable config={config} />,
  head: () => ({ meta: [{ title: "Admin — AI Prompts" }, { name: "robots", content: "noindex" }] }),
});
