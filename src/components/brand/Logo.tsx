import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { mark: 24, text: "text-base" },
  md: { mark: 32, text: "text-xl" },
  lg: { mark: 44, text: "text-2xl" },
};

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="st-brand" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.82 0.16 75)" />
          <stop offset="55%" stopColor="oklch(0.70 0.18 50)" />
          <stop offset="100%" stopColor="oklch(0.42 0.13 25)" />
        </linearGradient>
      </defs>
      {/* Lotus / sun petals */}
      <g fill="url(#st-brand)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <ellipse
            key={r}
            cx="24"
            cy="10"
            rx="3.2"
            ry="9"
            transform={`rotate(${r} 24 24)`}
            opacity="0.9"
          />
        ))}
      </g>
      {/* Inner bindu */}
      <circle cx="24" cy="24" r="5.5" fill="oklch(0.99 0.005 80)" />
      <circle cx="24" cy="24" r="2.8" fill="url(#st-brand)" />
    </svg>
  );
}

export function Logo({ variant = "full", size = "md", className, ...rest }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...rest}>
      <LogoMark size={s.mark} />
      {variant === "full" && (
        <span className={cn("font-display font-semibold tracking-tight leading-none", s.text)}>
          Sanatan<span className="text-gradient-brand">Tools</span>
        </span>
      )}
    </div>
  );
}
