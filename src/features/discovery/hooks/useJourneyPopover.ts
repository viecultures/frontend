import { useEffect, useRef, useState } from "react";
import type { JourneySeries } from "../data/learningJourney";

export interface JourneyPopoverState {
  series: JourneySeries;
  x: number;
  y: number;
  pinned?: boolean;
}

function calculateElementPopoverPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const popoverWidth = 360;
  const popoverHeight = 320;
  const margin = 16;
  const offset = 12;

  let x: number;
  if (rect.right + offset + popoverWidth <= window.innerWidth - margin) {
    x = rect.right + offset;
  } else if (rect.left - offset - popoverWidth >= margin) {
    x = rect.left - offset - popoverWidth;
  } else {
    x = Math.max(margin, Math.min(window.innerWidth - popoverWidth - margin, rect.left));
  }

  let y = Math.max(85, rect.top);
  if (y + popoverHeight > window.innerHeight - margin) {
    y = Math.max(85, window.innerHeight - popoverHeight - margin);
  }
  return { x, y };
}

export function useJourneyPopover() {
  const [popover, setPopover] = useState<JourneyPopoverState | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const closePopover = (restoreFocus = false) => {
    setPopover(null);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  };

  const togglePopover = (series: JourneySeries, element: HTMLElement) => {
    if (popover?.series.id === series.id) {
      closePopover(false);
      return;
    }
    triggerRef.current = element;
    const { x, y } = calculateElementPopoverPosition(element);
    setPopover({ series, x, y, pinned: true });
  };

  useEffect(() => {
    if (!popover) return;

    document
      .querySelector<HTMLButtonElement>(".journey-hover-chapter-link")
      ?.focus({ preventScroll: true });

    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (popoverRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest(".journey-series-tile")) return;
      closePopover(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closePopover(true);
    }

    function checkCardVisibilityAndReposition() {
      const trigger = triggerRef.current;
      if (!trigger || !document.body.contains(trigger)) {
        closePopover(false);
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const navbarHeight = 80;
      const visibleTop = Math.max(rect.top, navbarHeight);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      if (visibleBottom - visibleTop < 60) {
        closePopover(false);
        return;
      }

      const { x, y } = calculateElementPopoverPosition(trigger);
      setPopover((current) => (current ? { ...current, x, y } : null));
    }

    const trigger = triggerRef.current;
    let observer: IntersectionObserver | null = null;
    if (trigger && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) closePopover(false);
          }
        },
        { rootMargin: "-80px 0px 0px 0px", threshold: 0.1 },
      );
      observer.observe(trigger);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", checkCardVisibilityAndReposition, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", checkCardVisibilityAndReposition);

    return () => {
      observer?.disconnect();
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", checkCardVisibilityAndReposition, { capture: true });
      window.removeEventListener("resize", checkCardVisibilityAndReposition);
    };
  }, [popover?.series.id]);

  return {
    popover,
    setPopover,
    popoverRef,
    togglePopover,
    closePopover,
  };
}
