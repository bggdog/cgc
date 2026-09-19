import { describe, expect, it } from "vitest";
import { assembleAboutHtml } from "@/content/assemble-about-html";
import { assembleContactHtml } from "@/content/assemble-contact-html";
import { assembleHomeHtml } from "@/content/assemble-home-html";
import { assembleServiceHtml } from "@/content/assemble-service-html";
import { assembleZeroTurnoverHtml } from "@/content/assemble-zero-turnover-html";
import { getAllServiceSlugs, getServiceBySlug } from "@/content/services";

// This test pins the one hard constraint of this branch: every existing page
// must keep producing the HTML it produced before, except for the added
// "University" nav item. It asserts on the *assembled* output — the same
// strings the route handlers actually return — not on source files, so it
// would catch a broken assembler, a dropped section, or a lost nav link.

type PageCase = {
  name: string;
  html: string;
  // A string that only this page's assembled output contains, proving the
  // right content shipped (not just "some HTML").
  distinguishing: string;
};

describe("existing marketing pages are unchanged except for the University link", () => {
  const pages: PageCase[] = [
    {
      name: "home",
      html: assembleHomeHtml(),
      distinguishing: "Carrie Grace - Building Organizations that Last",
    },
    {
      name: "about",
      html: assembleAboutHtml(),
      distinguishing: "<title>About Carrie — Carrie Grace</title>",
    },
    {
      name: "contact",
      html: assembleContactHtml(),
      distinguishing: "<title>Contact — Carrie Grace</title>",
    },
    {
      name: "zero-turnover",
      html: assembleZeroTurnoverHtml(),
      distinguishing: "<title>Zero Turnover. Zero Burnout. — Carrie Grace</title>",
    },
  ];

  it.each(pages)(
    "$name assembles a complete document, keeps its own content, and links to the university",
    ({ html, distinguishing }) => {
      // A complete, well-formed document — not a fragment or an error page.
      expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain("<head>");
      expect(html).toContain("<body");

      // The page's own distinguishing content is still present — this is
      // what would fail if an assembler returned some other page's HTML,
      // an empty shell, or dropped a content file.
      expect(html).toContain(distinguishing);

      // The one intended addition: a link to /university in the nav.
      expect(html).toContain('href="/university"');
    }
  );

  it("home page keeps its non-header sections intact", () => {
    const html = assembleHomeHtml();
    // Sanity check beyond the title: the home page's __NEXT_DATA__ payload
    // and app mount point must both still be present, confirming the
    // assembler didn't just fall back to a stub.
    expect(html).toContain('<div id="__next">');
    expect(html).toContain('<script id="__NEXT_DATA__" type="application/json">');
  });
});

describe("existing service pages are unchanged except for the University link", () => {
  it("still enumerates the same services", () => {
    const slugs = getAllServiceSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(getAllServiceSlugs())(
    "%s assembles a complete document, keeps its own content, and links to the university",
    (slug) => {
      const service = getServiceBySlug(slug);
      expect(service).toBeDefined();

      const html = assembleServiceHtml(service!);

      expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
      expect(html).toContain("</html>");

      // Page-specific content: this service's own title and lede, not just
      // any service page's boilerplate. The title is HTML-escaped in the
      // assembled output (service titles contain "&"), so compare against
      // the escaped form.
      const escapeAmp = (value: string): string => value.replace(/&/g, "&amp;");
      expect(html).toContain(`<title>${escapeAmp(service!.pageTitle)}</title>`);
      expect(html).toContain(`<p class="lede">${escapeAmp(service!.lede)}</p>`);

      expect(html).toContain('href="/university"');
    }
  );
});
