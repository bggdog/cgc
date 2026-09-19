"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Classes for the revealed element; `in` is appended once visible. */
  className?: string;
  as?: "section" | "div";
  threshold?: number;
};

/**
 * Adds the `in` class when the element scrolls into view, which is what the
 * university stylesheet keys every entrance animation off. Content is shown
 * immediately when the visitor prefers reduced motion, or when
 * IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  className = "",
  as = "section",
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;

    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown, threshold]);

  const Tag = as as ElementType;
  const classes = [className, shown ? "in" : ""].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
