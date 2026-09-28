import React from "react";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type SkeletonShape = "line" | "circle" | "rect" | "card";

interface SkeletonProps {
  /** Hình dạng của skeleton */
  shape?: SkeletonShape;
  /** Chiều rộng (px hoặc Tailwind class, vd: "w-32" hoặc "100%") */
  width?: string;
  /** Chiều cao (px hoặc Tailwind class, vd: "h-4") */
  height?: string;
  /** Class tùy chỉnh bổ sung */
  className?: string;
}

// ─── Skeleton Primitive ───────────────────────────────────────────────────────

/**
 * Skeleton shimmer với tông màu giấy dó (rice-paper / warm-ivory).
 * Dùng class `.skeleton` từ index.css — tự động dark-mode aware.
 *
 * @example
 * // Dòng text
 * <Skeleton shape="line" className="w-48 h-4" />
 *
 * // Avatar tròn
 * <Skeleton shape="circle" className="w-12 h-12" />
 *
 * // Card rectangle
 * <Skeleton shape="card" className="w-full h-48" />
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  shape = "line",
  width,
  height,
  className,
}) => {
  const shapeClasses: Record<SkeletonShape, string> = {
    line: "rounded-pill h-4",
    circle: "rounded-full aspect-square",
    rect: "rounded-inner",
    card: "rounded-card",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "skeleton",
        shapeClasses[shape],
        width,
        height,
        className
      )}
    />
  );
};

// ─── Composite Skeletons ──────────────────────────────────────────────────────

/** Skeleton cho ArticleCard trong Discovery page */
export const ArticleCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("rounded-card overflow-hidden border border-line bg-surface", className)}>
    {/* Thumbnail */}
    <Skeleton shape="rect" className="w-full h-44" />
    <div className="p-4 space-y-3">
      {/* Badge row */}
      <div className="flex gap-2">
        <Skeleton shape="line" className="w-12 h-5" />
        <Skeleton shape="line" className="w-16 h-5" />
      </div>
      {/* Title */}
      <Skeleton shape="line" className="w-full h-5" />
      <Skeleton shape="line" className="w-3/4 h-5" />
      {/* Meta */}
      <div className="flex gap-3 pt-1">
        <Skeleton shape="line" className="w-16 h-3.5" />
        <Skeleton shape="line" className="w-20 h-3.5" />
      </div>
    </div>
  </div>
);

/** Skeleton cho Community Post card */
export const PostCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("rounded-card border border-line bg-surface p-5 space-y-4", className)}>
    {/* Author row */}
    <div className="flex items-center gap-3">
      <Skeleton shape="circle" className="w-10 h-10" />
      <div className="flex-1 space-y-1.5">
        <Skeleton shape="line" className="w-28 h-4" />
        <Skeleton shape="line" className="w-20 h-3" />
      </div>
    </div>
    {/* Content lines */}
    <div className="space-y-2">
      <Skeleton shape="line" className="w-full h-4" />
      <Skeleton shape="line" className="w-full h-4" />
      <Skeleton shape="line" className="w-2/3 h-4" />
    </div>
    {/* Image placeholder */}
    <Skeleton shape="rect" className="w-full h-36" />
    {/* Reaction row */}
    <div className="flex gap-4 pt-1">
      <Skeleton shape="line" className="w-12 h-3.5" />
      <Skeleton shape="line" className="w-16 h-3.5" />
    </div>
  </div>
);

/** Skeleton cho flashcard */
export const FlashcardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("rounded-card border border-line bg-surface p-8 flex flex-col items-center gap-6", className)}>
    <Skeleton shape="line" className="w-24 h-5" />
    <Skeleton shape="rect" className="w-full h-32" />
    <div className="flex gap-4 w-full">
      <Skeleton shape="rect" className="flex-1 h-10" />
      <Skeleton shape="rect" className="flex-1 h-10" />
      <Skeleton shape="rect" className="flex-1 h-10" />
    </div>
  </div>
);

Skeleton.displayName = "Skeleton";
