"use client";

import Link from "next/link";
import { useRef } from "react";
import type { MouseEvent } from "react";
import { clampPull } from "@/lib/university/magnetic";

type MagneticCtaProps = {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
};

const arrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 12h15m0 0-6-6m6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Pill CTA with the brand gold ring that leans toward a fine-pointer cursor. */
export function MagneticCta({ href, label, variant = "primary" }: MagneticCtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function isMagnetic(): boolean {
    return (
      window.matchMedia("(pointer:fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>): void {
    const node = ref.current;
    if (!node || !isMagnetic()) return;

    const rect = node.getBoundingClientRect();
    const x = clampPull(event.clientX - (rect.left + rect.width / 2));
    const y = clampPull(event.clientY - (rect.top + rect.height / 2));

    node.style.transform = `translate(${x}px, ${y}px)`;
  }

  function handleMouseLeave(): void {
    const node = ref.current;
    if (!node || !isMagnetic()) return;

    node.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
    node.style.transform = "translate(0px, 0px)";
    window.setTimeout(() => {
      node.style.transition = "";
    }, 600);
  }

  const classes = ["cta", variant === "ghost" ? "ghost" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      ref={ref}
      href={href}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      <span className="ring">{arrowIcon}</span>
    </Link>
  );
}
