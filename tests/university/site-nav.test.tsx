import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UniversityHeader } from "@/components/university/UniversityHeader";
import { assembleHeader } from "@/content/assemble-header";
import { escapeHtml } from "@/content/escape-html";
import { getAllServiceSlugs } from "@/content/services";
import { SERVICE_NAV_ITEMS } from "@/content/site-nav";

// The services submenu used to be hardcoded in three places: the real service
// registry, the HTML header (escaped) and the React header (unescaped). These
// tests keep the one remaining source of truth, `content/site-nav.ts`, honest
// on both sides of the render split.

describe("SERVICE_NAV_ITEMS", () => {
  it("points at service pages that actually exist, in registry order", () => {
    const slugs = SERVICE_NAV_ITEMS.map((item) =>
      item.href.replace("/services/", "")
    );
    expect(slugs).toEqual(getAllServiceSlugs());
  });

  it("stores labels raw, not pre-escaped", () => {
    // If a label ever arrived here already escaped, the HTML header would
    // double-escape it ("&amp;amp;") and the React header would render the
    // entity text literally.
    for (const item of SERVICE_NAV_ITEMS) {
      expect(item.label).not.toContain("&amp;");
      expect(item.label).not.toContain("&lt;");
    }
  });
});

describe("both headers render the shared services nav", () => {
  it("the HTML header escapes the labels", () => {
    const { markup } = assembleHeader("/about");

    for (const item of SERVICE_NAV_ITEMS) {
      expect(markup).toContain(`href="${item.href}"`);
      expect(markup).toContain(`>${escapeHtml(item.label)}</span>`);
    }

    // The live site has always emitted "&amp;" here; keep it that way.
    expect(markup).toContain("Team Development &amp; Care");
  });

  it("the React header renders the same labels and hrefs", () => {
    const { container } = render(<UniversityHeader currentPath="/university" />);
    const submenu = container.querySelector(".Menu_Submenu___nIdT");
    expect(submenu).not.toBeNull();

    for (const item of SERVICE_NAV_ITEMS) {
      expect(
        within(submenu as HTMLElement).getByRole("link", { name: item.label })
      ).toHaveAttribute("href", item.href);
    }
  });

  it("gives social links properly-cased accessible names", () => {
    render(<UniversityHeader currentPath="/university" />);
    // The aria-label wins over the nested <svg><title>, so both must read the
    // same way to a screen reader.
    expect(screen.getAllByRole("link", { name: "LinkedIn" }).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByRole("link", { name: "Instagram" }).length
    ).toBeGreaterThan(0);
  });
});
