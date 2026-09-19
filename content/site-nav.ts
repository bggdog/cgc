/**
 * Site navigation data shared by the two headers:
 *
 *   - `content/assemble-header.ts`            (HTML string, existing pages)
 *   - `components/university/UniversityHeader.tsx` (React, university pages)
 *
 * Labels here are RAW and unescaped. Escape at the call site: the HTML
 * assembler runs them through `escapeHtml`, JSX escapes automatically.
 *
 * This module is deliberately pure — no `fs`, no Node-only imports — so a
 * client component can import it. (`assemble-header.ts` reads files at module
 * scope, which is why the React header cannot import the list from there; that
 * justified not importing from that file, not keeping a third copy of the
 * data.)
 *
 * Nav labels are not the same strings as the service pages' own titles or
 * breadcrumbs (e.g. this nav says "Team Development & Care" while the page
 * title says "Team Development & Retreats"), so they live here rather than
 * being derived from `content/services`. The hrefs, though, must stay in step
 * with the real service slugs — `tests/university/site-nav.test.ts` enforces
 * that.
 */

export type NavItem = {
  /** Raw, unescaped label. Escape it when emitting HTML. */
  label: string;
  href: string;
};

/** The Services submenu, in display order, for both headers. */
export const SERVICE_NAV_ITEMS: readonly NavItem[] = [
  { label: "Executive Consulting", href: "/services/executive-consulting" },
  { label: "Team Development & Care", href: "/services/team-development-care" },
  {
    label: "Organizational Structure & Setup",
    href: "/services/organizational-structure-setup",
  },
];
