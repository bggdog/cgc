"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Classes for the revealed element; `in` is appended once visible. */
  className?: string;
  as?: "section" | "div";
  threshold?: number;
  /**
   * Above-the-fold content. Starts revealed so the visitor never sees a blank
   * hero while IntersectionObserver catches up (or fails on tall sections).
   */
  eager?: boolean;
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

/** True when any pixel of the element intersects the viewport. */
function isInViewport(node: HTMLElement): boolean {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
}

/**
 * Adds the `in` class when the element scrolls into view, which is what the
 * university stylesheet keys every entrance animation off. Content is shown
 * immediately when `eager`, when the visitor prefers reduced motion, when
 * already on screen at mount, or when IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  className = "",
  as = "section",
  threshold = 0.05,
  eager = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [intersected, setIntersected] = useState(eager);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (intersected || prefersReducedMotion || eager) return;

    const node = ref.current;
    if (!node) return;

    // Tall sections can fail a high threshold while still filling the screen.
    // Arm immediately if anything is already visible.
    if (isInViewport(node)) {
      const id = window.setTimeout(() => setIntersected(true), 0);
      return () => window.clearTimeout(id);
    }

    if (typeof IntersectionObserver === "undefined") {
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
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);

    // Safety net: if IO never fires (iframe / odd viewport), don't leave a blank page.
    const fallback = window.setTimeout(() => {
      if (isInViewport(node)) setIntersected(true);
    }, 400);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [intersected, prefersReducedMotion, threshold, eager]);

  const Tag = as as ElementType;
  const shown = intersected || prefersReducedMotion || eager;
  const classes = [className, shown ? "in" : ""].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
