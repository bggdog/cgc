import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { assembleHeader } from "@/content/assemble-header";

describe("shared subpage header", () => {
  it("links to the university", () => {
    const { markup } = assembleHeader("/about");
    expect(markup).toContain('href="/university"');
    expect(markup).toContain("University");
  });

  it("marks the university item active on university pages", () => {
    const { markup } = assembleHeader("/university");
    expect(markup).toContain('<a class="active" href="/university"');
  });

  it("keeps the existing navigation intact", () => {
    const { markup } = assembleHeader("/about");
    for (const href of ["/", "/#services", "/zero-turnover", "/about", "/contact"]) {
      expect(markup).toContain(`href="${href}"`);
    }
  });
});

describe("home page header", () => {
  it("links to the university", () => {
    const html = readFileSync(
      path.join(process.cwd(), "content", "colabs-home-body.html"),
      "utf8"
    );
    expect(html).toContain('href="/university"');
  });
});
