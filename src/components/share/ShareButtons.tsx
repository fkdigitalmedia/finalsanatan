import { useEffect, useRef, useState } from "react";
import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics/track";

interface Props {
  title: string;
  /** Absolute or relative URL. Falls back to the current location. */
  url?: string;
  className?: string;
}

/** Share row: native share, WhatsApp, X, Facebook, copy link and QR code. */
export function ShareButtons({ title, url, className }: Props) {
  const [href, setHref] = useState(url ?? "");
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHref(url ? new URL(url, window.location.origin).toString() : window.location.href);
  }, [url]);

  const enc = encodeURIComponent(href);
  const encTitle = encodeURIComponent(title);

  const share = async () => {
    track("share_click", { meta: { title } });
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: href });
        return;
      } catch {
        /* user cancelled */
      }
    }
    void copy();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const showQr = async () => {
    const QRCode = (await import("qrcode")).default;
    setQr(await QRCode.toDataURL(href, { width: 220, margin: 1 }));
    track("share_qr", { meta: { title } });
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={share}>
          <Share2 className="size-4" /> Share
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a
            href={`https://wa.me/?text=${encTitle}%20${enc}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            WhatsApp
          </a>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a
            href={`https://twitter.com/intent/tweet?text=${encTitle}&url=${enc}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            X
          </a>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            Facebook
          </a>
        </Button>
        <Button size="sm" variant="outline" onClick={copy} aria-label="Copy link">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button size="sm" variant="outline" onClick={showQr} aria-label="Show QR code">
          <QrCode className="size-4" /> QR
        </Button>
      </div>
      {qr && (
        <div className="mt-3 inline-flex flex-col items-center rounded-2xl border border-border bg-card p-3 shadow-card">
          <img
            src={qr}
            alt={`QR code linking to ${title}`}
            width={160}
            height={160}
            loading="lazy"
          />
          <p className="mt-2 text-[11px] text-muted-foreground">Scan to open on mobile</p>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
