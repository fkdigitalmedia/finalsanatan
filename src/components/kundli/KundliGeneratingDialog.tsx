import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/I18nProvider";

const MANTRA_LINES = [
  "ॐ गं गणपतये नमः",
  "ॐ सूर्याय नमः",
  "ॐ चंद्राय नमः",
  "ॐ बृहस्पतये नमः",
  "ॐ नवग्रहाय नमः",
];

export function KundliGeneratingDialog({ open }: { open: boolean }) {
  const { t } = useTranslation();
  const MANTRAS = MANTRA_LINES.map((line, i) => ({
    line,
    sub: t(`kundli.dialog.mantras.${i}`),
  }));
  const STEPS = [0, 1, 2, 3, 4, 5].map((i) => t(`kundli.dialog.steps.${i}`));
  const [idx, setIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!open) {
      setIdx(0);
      setStepIdx(0);
      return;
    }
    const a = setInterval(() => setIdx((i) => (i + 1) % MANTRAS.length), 2400);
    const b = setInterval(() => setStepIdx((i) => (i + 1) % STEPS.length), 1400);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [open]);

  const m = MANTRAS[idx];

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md border-0 p-0 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-rose-950/40 [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{t("kundli.dialog.title_sr")}</DialogTitle>

        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-rose-300/30 blur-3xl animate-pulse [animation-delay:600ms]" />
        </div>

        <div className="relative px-8 py-10 text-center">
          {/* Rotating Om + halo */}
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-orange-400/30 animate-[spin_6s_linear_infinite_reverse]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-serif text-amber-600 dark:text-amber-300 drop-shadow-[0_0_18px_rgba(251,146,60,0.55)] animate-pulse">
                ॐ
              </span>
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 animate-pulse" />
            <Sparkles className="absolute -bottom-1 -left-1 h-4 w-4 text-rose-400 animate-pulse [animation-delay:400ms]" />
          </div>

          <h2 className="text-2xl md:text-[26px] font-semibold tracking-tight text-foreground">
            {t("kundli.dialog.heading")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("kundli.dialog.subheading")}</p>

          {/* Mantra */}
          <div
            key={idx}
            className="mt-7 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white/70 dark:bg-black/20 backdrop-blur px-5 py-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="text-lg font-serif text-amber-700 dark:text-amber-200">{m.line}</div>
            <div className="mt-1 text-xs text-muted-foreground">{m.sub}</div>
          </div>

          {/* Step ticker */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600" />
            </span>
            <span key={stepIdx} className="animate-in fade-in duration-300">
              {STEPS[stepIdx]}
            </span>
          </div>

          {/* Indeterminate bar */}
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900/40">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 animate-[shimmer_1.6s_ease-in-out_infinite]" />
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("kundli.dialog.footer_words")}
          </p>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(360%); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
