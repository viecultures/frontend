import React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hoverEffect = false, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface-raised text-ink-soft p-6",
        hoverEffect && "transition-colors duration-200 hover:border-ink-faint/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
