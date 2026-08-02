import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";

/** Shared "Rashi not found" body used by every horoscope $sign route. */
export function NotFoundRashi({ to }: { to: string }) {
  const { t } = useTranslation();
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-serif text-3xl">{t("horoscope.notFound.title")}</h1>
      <Button asChild className="mt-6">
        <Link to={to as unknown as "/"}>{t("horoscope.notFound.cta")}</Link>
      </Button>
    </div>
  );
}
