import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Component = "h2",
  className,
  ...rest
}: SectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center mx-auto max-w-2xl",
        className,
      )}
      {...rest}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          {eyebrow}
        </span>
      )}
      <Component className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</Component>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl">{description}</p>
      )}
    </div>
  );
}
