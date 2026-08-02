import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Download, ExternalLink, Copy, Check } from "lucide-react";

type Props = {
  slug: string;
  name: string;
  description?: string | null;
  nextDateIso?: string | null;
  durationDays?: number | null;
};

function fmt(iso: string) {
  return iso.replace(/-/g, "");
}
function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function AddToCalendar({ slug, name, description, nextDateIso, durationDays }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const icsUrl = `/api/public/festivals/${slug}.ics`;
  const subscribeUrl =
    typeof window !== "undefined" ? `${window.location.origin}${icsUrl}` : icsUrl;

  const dur = Math.max(1, durationDays ?? 1);
  const start = nextDateIso;
  const end = start ? addDays(start, dur) : null;

  const gcal =
    start && end
      ? `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          name,
        )}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(
          (description ?? "") + `\n\nMore: ${subscribeUrl.replace(".ics", "")}`,
        )}`
      : null;

  const outlook =
    start && end
      ? `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(
          name,
        )}&startdt=${start}&enddt=${end}&allday=true&body=${encodeURIComponent(description ?? "")}`
      : null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(subscribeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-primary/40 text-primary hover:bg-primary/10"
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarPlus className="size-4 mr-2" />
        Add to Calendar
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-border bg-popover p-2 shadow-elegant"
          onMouseLeave={() => setOpen(false)}
        >
          {gcal && (
            <a
              href={gcal}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <ExternalLink className="size-4 text-primary" />
              Google Calendar
            </a>
          )}
          {outlook && (
            <a
              href={outlook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <ExternalLink className="size-4 text-primary" />
              Outlook / Live
            </a>
          )}
          <a
            href={icsUrl}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
          >
            <Download className="size-4 text-primary" />
            Apple / .ics download (all years)
          </a>
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
          >
            {copied ? (
              <Check className="size-4 text-green-600" />
            ) : (
              <Copy className="size-4 text-primary" />
            )}
            {copied ? "Copied!" : "Copy subscription URL"}
          </button>
          <p className="mt-1 px-3 pb-1 text-[11px] text-muted-foreground">
            Subscribe once — new dates appear automatically each year.
          </p>
        </div>
      )}
    </div>
  );
}
