/**
 * useCategoryLabel — translation helper for the CATEGORIES registry.
 * Falls back to the English label from src/config/categories.ts when a
 * translation is missing so the UI never shows a raw key.
 */
import { useTranslation } from "@/i18n/I18nProvider";

export function useCategoryLabel() {
  const { t } = useTranslation();
  return (slug: string, field: "title" | "short", fallback: string) => {
    const key = `categories.${slug}.${field}`;
    const value = t(key);
    return value === key ? fallback : value;
  };
}
