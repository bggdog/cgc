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
  it("links to the university in the static source markup", () => {
    const html = readFileSync(
      path.join(process.cwd(), "content", "colabs-home-body.html"),
      "utf8"
    );
    expect(html).toContain('href="/university"');
  });

  // The home page hydrates and re-renders its header from this JSON payload
  // (props.pageProps.contextData.menus.nodes[1]), discarding the static
  // markup above. A Node-side test cannot execute React hydration, so this
  // only proves the menu *data* a browser would hydrate from contains the
  // University item — it cannot prove the browser actually renders it.
  // That still requires a real browser check (see task-4 fix report).
  it("includes the university item in the hydration menu data, between About and Contact", () => {
    const json = readFileSync(
      path.join(process.cwd(), "content", "colabs-next-data.json"),
      "utf8"
    );
    const data = JSON.parse(json) as {
      props: {
        pageProps: {
          contextData: {
            menus: {
              nodes: {
                menuItems: {
                  nodes: { label: string; url: string; databaseId: number }[];
                };
              }[];
            };
          };
        };
      };
    };

    const items = data.props.pageProps.contextData.menus.nodes[1].menuItems.nodes;
    const labels = items.map((item) => item.label);

    expect(labels).toContain("University");

    const university = items.find((item) => item.label === "University");
    expect(university?.url).toBe("/university");

    const aboutIndex = labels.indexOf("About");
    const universityIndex = labels.indexOf("University");
    const contactIndex = labels.indexOf("Contact");
    expect(universityIndex).toBeGreaterThan(aboutIndex);
    expect(universityIndex).toBeLessThan(contactIndex);

    // databaseId must be unique among all items in this menu.
    const ids = items.map((item) => item.databaseId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
