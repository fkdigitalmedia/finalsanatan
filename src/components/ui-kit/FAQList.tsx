import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  q: string;
  a: string;
}

export function FAQList({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-secondary/40 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-medium">{item.q}</span>
              <span className="grid place-items-center size-7 rounded-full border border-border shrink-0">
                {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
