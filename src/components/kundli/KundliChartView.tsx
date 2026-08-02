// ============================================================
// Kundli Chart View — unified renderer + toolbar
// ------------------------------------------------------------
// Wraps the three chart renderers, exposes a style switcher,
// download-as-SVG / PNG / print helpers. Print & PDF ready:
// on print we force `color: black; background: white`.
// ============================================================

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { NorthIndianChart } from "./NorthIndianChart";
import { SouthIndianChart } from "./SouthIndianChart";
import { EastIndianChart } from "./EastIndianChart";
import type { KundliChart } from "@/lib/kundli/types";
import type { ChartTheme } from "./chart-utils";
import { Download, Printer, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "@/i18n/I18nProvider";

export type ChartStyle = "north" | "south" | "east";

interface Props {
  chart: KundliChart;
  style?: ChartStyle;
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  theme?: ChartTheme;
  className?: string;
  filename?: string; // used for downloads
}

export function KundliChartView({
  chart,
  style: initialStyle = "north",
  title,
  subtitle,
  showControls = true,
  theme,
  className,
  filename = "kundli-chart",
}: Props) {
  const { t } = useTranslation();
  const [style, setStyle] = useState<ChartStyle>(initialStyle);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const downloadSVG = useCallback(() => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    // Inline currentColor by resolving computed color once.
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const computedColor = getComputedStyle(svg).color || "#111";
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("style", `color: ${computedColor}; background: white`);
    const src = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${src}`], {
      type: "image/svg+xml;charset=utf-8",
    });
    triggerDownload(blob, `${filename}-${style}.svg`);
  }, [filename, style]);

  const downloadPNG = useCallback(async () => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const computedColor = getComputedStyle(svg).color || "#111";
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("style", `color: ${computedColor}; background: white`);
    const src = new XMLSerializer().serializeToString(clone);
    const svgUrl = URL.createObjectURL(new Blob([src], { type: "image/svg+xml" }));

    try {
      const img = new Image();
      img.decoding = "async";
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("SVG load failed"));
        img.src = svgUrl;
      });
      const scale = 3; // high-resolution
      const canvas = document.createElement("canvas");
      canvas.width = 400 * scale;
      canvas.height = 400 * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) triggerDownload(blob, `${filename}-${style}.png`);
      }, "image/png");
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }, [filename, style]);

  const printChart = useCallback(() => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;
    const src = new XMLSerializer().serializeToString(svg);
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${
      title ?? t("kundli.chart.default_title")
    }</title><style>
      html,body{margin:0;padding:24px;background:#fff;color:#111;font-family:ui-sans-serif,system-ui,sans-serif}
      h1{font-size:18px;margin:0 0 4px}
      p{margin:0 0 16px;color:#555;font-size:12px}
      svg{max-width:100%;height:auto;color:#111;background:#fff}
      @media print{@page{margin:12mm}}
    </style></head><body>
      ${title ? `<h1>${escapeHTML(title)}</h1>` : ""}
      ${subtitle ? `<p>${escapeHTML(subtitle)}</p>` : ""}
      ${src}
      <script>window.onload=()=>{setTimeout(()=>window.print(),150)}</script>
    </body></html>`);
    win.document.close();
  }, [title, subtitle]);

  return (
    <div className={className}>
      {showControls && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="inline-flex rounded-md border border-border bg-background">
            {(["north", "south", "east"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  style === s
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
                aria-pressed={style === s}
              >
                {s === "north"
                  ? t("kundli.chart.style_north")
                  : s === "south"
                    ? t("kundli.chart.style_south")
                    : t("kundli.chart.style_east")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSVG}
              aria-label={t("kundli.chart.download_svg")}
            >
              <Download className="mr-1 h-3.5 w-3.5" /> SVG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPNG}
              aria-label={t("kundli.chart.download_png")}
            >
              <ImageIcon className="mr-1 h-3.5 w-3.5" /> PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={printChart}
              aria-label={t("kundli.chart.print_pdf")}
            >
              <Printer className="mr-1 h-3.5 w-3.5" /> {t("kundli.chart.print_pdf")}
            </Button>
          </div>
        </div>
      )}

      <div
        ref={wrapperRef}
        className="mx-auto w-full max-w-[520px] rounded-lg border border-border bg-card p-3 text-foreground shadow-sm print:border-0 print:bg-white print:text-black print:shadow-none"
      >
        {style === "north" && <NorthIndianChart chart={chart} title={title} theme={theme} />}
        {style === "south" && (
          <SouthIndianChart
            chart={chart}
            title={title}
            centerLabel={title ?? t("kundli.chart.rashi")}
            centerSubLabel={subtitle}
            theme={theme}
          />
        )}
        {style === "east" && (
          <EastIndianChart
            chart={chart}
            title={title}
            centerLabel={title ?? t("kundli.chart.rashi")}
            centerSubLabel={subtitle}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function escapeHTML(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}
