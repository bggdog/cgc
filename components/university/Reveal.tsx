"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Classes for the revealed element; `in` is appended once visible. */
  className?: string;
  as?: "section" | "div";
  threshold?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Subscribes to the visitor's reduced-motion preference via
 * `useSyncExternalStore` rather than `useState` + `useEffect`, so the read
 * of this external (browser) value never calls `setState` synchronously
 * inside an effect body.
 */
function subscribeToReducedMotion(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** The server can't know the visitor's motion preference; assume "no". */
function getReducedMotionServerSnapshot(): boolean {
  return false;
}

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
  const [intersected, setIntersected] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (intersected || prefersReducedMotion) return;

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer support: reveal on the next tick rather than calling
      // setState synchronously in the effect body.
      const id = window.setTimeout(() => setIntersected(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIntersected(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [intersected, prefersReducedMotion, threshold]);

  const Tag = as as ElementType;
  const shown = intersected || prefersReducedMotion;
  const classes = [className, shown ? "in" : ""].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
