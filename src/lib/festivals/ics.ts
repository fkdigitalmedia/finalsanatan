/**
 * Minimal RFC 5545 ICS builder for festivals.
 * All-day events use DATE value type (YYYYMMDD). No RRULE — we emit
 * one VEVENT per cached occurrence so multi-year exports are explicit.
 */

export type FestivalIcsInput = {
  slug: string;
  name: string;
  description?: string | null;
  category?: string | null;
  duration_days?: number | null;
  siteOrigin: string;
  occurrences: { isoDate: string; label?: string }[];
};

function fold(line: string): string {
  // RFC 5545 line folding at 75 octets.
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let i = 0;
  while (i < line.length) {
    parts.push((i === 0 ? "" : " ") + line.slice(i, i + 74));
    i += 74;
  }
  return parts.join("\r\n");
}

function esc(v: string): string {
  return v
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toDate(iso: string): string {
  return iso.replace(/-/g, "");
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function dtstamp(): string {
  return new Date().toISOString().replace(/[-:]|\.\d{3}/g, "");
}

export function buildFestivalIcs(input: FestivalIcsInput): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SanatanTools//Festivals//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(input.name)}`,
  ];
  const stamp = dtstamp();
  const duration = Math.max(1, input.duration_days ?? 1);
  for (const occ of input.occurrences) {
    const url = `${input.siteOrigin.replace(/\/$/, "")}/festivals/${input.slug}`;
    const summary = occ.label ? `${input.name} — ${occ.label}` : input.name;
    const desc = [input.description ?? "", `More: ${url}`].filter(Boolean).join("\n\n");
    lines.push(
      "BEGIN:VEVENT",
      fold(`UID:${input.slug}-${occ.isoDate}@sanatantools`),
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${toDate(occ.isoDate)}`,
      `DTEND;VALUE=DATE:${toDate(addDays(occ.isoDate, duration))}`,
      fold(`SUMMARY:${esc(summary)}`),
      fold(`DESCRIPTION:${esc(desc)}`),
      fold(`URL:${url}`),
      input.category ? fold(`CATEGORIES:${esc(input.category)}`) : "",
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}

export function buildMultiFestivalIcs(
  siteOrigin: string,
  festivals: FestivalIcsInput[],
  calendarName = "SanatanTools Festivals",
): string {
  const stamp = dtstamp();
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SanatanTools//Festivals//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(calendarName)}`,
  ];
  for (const f of festivals) {
    const duration = Math.max(1, f.duration_days ?? 1);
    for (const occ of f.occurrences) {
      const url = `${siteOrigin.replace(/\/$/, "")}/festivals/${f.slug}`;
      const summary = occ.label ? `${f.name} — ${occ.label}` : f.name;
      const desc = [f.description ?? "", `More: ${url}`].filter(Boolean).join("\n\n");
      lines.push(
        "BEGIN:VEVENT",
        fold(`UID:${f.slug}-${occ.isoDate}@sanatantools`),
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${toDate(occ.isoDate)}`,
        `DTEND;VALUE=DATE:${toDate(addDays(occ.isoDate, duration))}`,
        fold(`SUMMARY:${esc(summary)}`),
        fold(`DESCRIPTION:${esc(desc)}`),
        fold(`URL:${url}`),
        f.category ? fold(`CATEGORIES:${esc(f.category)}`) : "",
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
      );
    }
  }
  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}
