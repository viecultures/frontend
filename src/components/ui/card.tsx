import React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hoverEffect = true, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-500/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm p-5 transition-all duration-300",
        hoverEffect && "hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 hover:border-amber-500/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
