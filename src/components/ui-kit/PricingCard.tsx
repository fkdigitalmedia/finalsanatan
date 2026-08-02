import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  cta,
  featured,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border p-7 shadow-card transition-all",
        featured
          ? "border-primary/50 bg-gradient-to-b from-primary-soft/60 to-card shadow-glow"
          : "border-border bg-card hover:border-primary/30",
      )}
    >
      {featured && (
        <Badge className="absolute -top-2.5 left-6 bg-gradient-brand text-primary-foreground border-0 shadow-glow">
          Most Popular
        </Badge>
      )}
      <div>
        <h3 className="font-display text-xl font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold tracking-tight">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        className={cn("mt-7", featured ? "shadow-glow" : "")}
        variant={featured ? "default" : "outline"}
      >
        {cta}
      </Button>
    </div>
  );
}
