import React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "level-1" | "level-2" | "level-3" | "cefr-a2" | "cefr-b1" | "cefr-b2" | "cefr-c1" | "gold" | "bamboo" | "lacquer" | "outline";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "gold", children, ...props }) => {
  const base = "inline-flex items-center px-2.5 py-1 rounded-md text-xs leading-normal font-medium";

  const variants = {
    "level-1": "bg-success-soft text-success",
    "level-2": "bg-info-soft text-info",
    "level-3": "bg-warning-soft text-warning",
    "cefr-a2": "bg-success-soft text-success",
    "cefr-b1": "bg-info-soft text-info",
    "cefr-b2": "bg-warning-soft text-warning",
    "cefr-c1": "bg-accent-soft text-accent-ink",
    gold: "bg-accent-soft text-accent-ink",
    bamboo: "bg-success-soft text-success",
    lacquer: "bg-danger-soft text-danger",
    outline: "border border-line text-ink-soft"
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
