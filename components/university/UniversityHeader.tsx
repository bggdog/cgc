"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  INSTAGRAM_ICON_PATH,
  LINKEDIN_ICON_PATH,
} from "@/content/social-icons";
import { INSTAGRAM_URL, LINKEDIN_URL } from "@/content/site-links";
import { SERVICE_NAV_ITEMS } from "@/content/site-nav";

type UniversityHeaderProps = {
  currentPath: string;
  /** Account controls. Phase 3 passes Clerk's buttons here. */
  authSlot?: ReactNode;
};

const SOCIALS = [
  { label: "LinkedIn", href: LINKEDIN_URL, path: LINKEDIN_ICON_PATH },
  { label: "Instagram", href: INSTAGRAM_URL, path: INSTAGRAM_ICON_PATH },
];

function CornerSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">
      <path d="m100,0H0v100C0,44.77,44.77,0,100,0Z" fill="#F9F8F6" />
    </svg>
  );
}

function SocialItem({ social }: { social: (typeof SOCIALS)[number] }) {
  return (
    <li className="social">
      <a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.label}
      >
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <title>{social.label}</title>
          <path d={social.path} />
        </svg>
      </a>
    </li>
  );
}

/**
 * React port of the site header used across the university. Markup and class
 * names mirror `content/assemble-header.ts` so the shared stylesheet at
 * `content/header/header-styles.css` applies unchanged.
 */
export function UniversityHeader({ currentPath, authSlot }: UniversityHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    function updateScrollChrome() {
      rafRef.current = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      const nextScrolled = window.scrollY > 8;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }
    }

    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(updateScrollChrome);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollChrome();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("cg-menu-open", menuOpen);
    return () => document.documentElement.classList.remove("cg-menu-open");
  }, [menuOpen]);

  function isActive(href: string): boolean {
    if (href === "/university") return currentPath.startsWith("/university");
    return currentPath === href;
  }

  function navLink(href: string, label: string) {
    const cls = isActive(href) ? "active" : "";
    return (
      <Link className={cls} href={href}>
        <span className={cls || "  "}>{label}</span>
      </Link>
    );
  }

  /** Close the mobile menu after a tap on any nav link. */
  function handleNavClick() {
    if (window.matchMedia("(max-width: 1024px)").matches) setMenuOpen(false);
  }

  const servicesActive = currentPath.startsWith("/services/") ? "active" : "";

  return (
    <header
      className={`Header_Header__RCJxb${scrolled ? " Header_HasScrolled__zlgoA" : ""}`}
    >
      <div
        className={`ProgressBar_Progress__pez_8${scrolled ? " ProgressBar_Visible__1Oewf" : ""}`}
      >
        <div className="ProgressBar_BarBg__IBGkG" />
        <div className="ProgressBar_Bar__lPLis" ref={progressBarRef} />
      </div>

      <div
        className={`container Header_Cont__oIO12${menuOpen ? " Header_MenuOpen__IS_k9" : ""}`}
      >
        <div className="Header_Logo__PrV_s">
          <CornerSvg />
          <Link
            className={currentPath === "/" ? "active" : ""}
            href="/"
            aria-label="Carrie Grace — home"
          >
            <span className={currentPath === "/" ? "active" : "  "}>
              {/* Hidden by the stylesheet; the span carries the logo as a background. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cg-logo" src="/cg-typeface.png" alt="" />
            </span>
          </Link>
          <CornerSvg />
        </div>

        <button
          type="button"
          className="Header_MenuButton__3xFfC"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav
          className={`Menu_Menu___Nwdq${menuOpen ? " Menu_Open__12jRk" : ""}`}
          data-lenis-prevent="true"
          onClick={handleNavClick}
        >
          <ul>
            <li>
              <div className="Menu_Top___JOpe">{navLink("/", "Home")}</div>
            </li>

            <li>
              <div className="Menu_Top___JOpe">
                <Link className={servicesActive} href="/#services">
                  <span className={servicesActive || "  "}>Services</span>
                </Link>
                <button
                  className="Menu_Chevron__vHOgg"
                  aria-label="Toggle Submenu"
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSubmenuOpen((open) => !open);
                  }}
                >
                  <svg
                    width="20"
                    height="30"
                    viewBox="0 0 20 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ rotate: submenuOpen ? "90deg" : "-90deg" }}
                  >
                    <path
                      d="M19.4481 3.525L7.99812 15L19.4481 26.475L15.9231 30L0.92312 15L15.9231 1.59918e-06L19.4481 3.525Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>

              <ul className="Menu_Submenu___nIdT">
                {SERVICE_NAV_ITEMS.map((service) => (
                  <li key={service.href}>{navLink(service.href, service.label)}</li>
                ))}
              </ul>

              <div
                className={`SmoothOpen_SmoothOpen__1J7VQ${submenuOpen ? " SmoothOpen_isOpen__eFutI" : ""}`}
              >
                <div>
                  <ul className="Menu_MobileSubmenu__u1our">
                    {SERVICE_NAV_ITEMS.map((service) => (
                      <li key={service.href}>{navLink(service.href, service.label)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            <li>
              <div className="Menu_Top___JOpe">
                {navLink("/zero-turnover", "Zero Turnover")}
              </div>
            </li>
            <li>
              <div className="Menu_Top___JOpe">{navLink("/about", "About")}</div>
            </li>
            <li>
              <div className="Menu_Top___JOpe">
                {navLink("/university", "University")}
              </div>
            </li>
            <li>
              <div className="Menu_Top___JOpe">{navLink("/contact", "Contact")}</div>
            </li>

            {authSlot ? <li className="Menu_Auth__lau">{authSlot}</li> : null}

            {SOCIALS.map((social) => (
              <SocialItem key={social.label} social={social} />
            ))}
          </ul>
        </nav>

        <div className="Header_SocialsMobile__0QYKc">
          <ul className="Socials_Socials__hiU_j">
            {SOCIALS.map((social) => (
              <SocialItem key={social.label} social={social} />
            ))}
          </ul>
          <CornerSvg />
        </div>
      </div>
    </header>
  );
}
