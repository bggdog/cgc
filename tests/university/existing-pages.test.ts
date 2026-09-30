import { createHash } from "crypto";
import { describe, expect, it } from "vitest";
import { assembleAboutHtml } from "@/content/assemble-about-html";
import { assembleContactHtml } from "@/content/assemble-contact-html";
import { assembleHomeHtml } from "@/content/assemble-home-html";
import { assembleServiceHtml } from "@/content/assemble-service-html";
import { assembleZeroTurnoverHtml } from "@/content/assemble-zero-turnover-html";
import { getAllServiceSlugs, getServiceBySlug } from "@/content/services";

// ---------------------------------------------------------------------------
// This test pins the single binding promise of the Live Abundantly University
// branch: every pre-existing marketing page must keep producing EXACTLY the
// HTML it produced before the branch, apart from the one added "University"
// nav item.
//
// It is an identity check, not a smoke test. For each page we assemble the
// current output, strip the two intended insertions, and compare a sha256 of
// what is left against a committed digest. Those digests were generated from
// the merge base (commit e0b81eb) — i.e. from the real pre-branch output, not
// from whatever this branch happens to produce today — so the comparison
// genuinely answers "is this still the old page?".
//
// WHEN THIS TEST FAILS, it means an existing page's output changed. Two cases:
//
//   1. A REGRESSION. Something you edited (a content file, an assembler, the
//      shared header, a CSS or JS file that gets inlined) leaked into a page
//      that was supposed to be untouched. Fix the code — do not touch the
//      digest.
//
//   2. A DELIBERATE, APPROVED page change. Then, and only then, regenerate the
//      digest for that page:
//
//        node -e 'process.env.TZ="UTC"' # not needed; output is deterministic
//        npx vitest run tests/university/existing-pages.test.ts
//
//      and read the "actual" digest out of the failure message below, replace
//      the entry in EXPECTED_SHA256, and say in the commit message what
//      changed and why. Bumping a digest without that note defeats the test.
//
// Note on scope: the digest covers the whole assembled document, including the
// inlined stylesheets and scripts. That is intentional — those are part of the
// bytes the live site serves. It does mean unrelated-looking edits (e.g. a
// tweak to content/header/header-styles.css) will fail here. That is the point:
// on this branch, such an edit is a regression until someone approves it.
// ---------------------------------------------------------------------------

/**
 * The "University" <li> inserted into the shared HTML header
 * (`content/assemble-header.ts`) and into the static home-page body
 * (`content/colabs-home-body.html`). Both use the same markup shape at
 * different indentation, so the leading newline + indentation is consumed too.
 */
const NAV_LI =
  /\n[ \t]*<li>\s*<div class="Menu_Top___JOpe">\s*<a class="[^"]*" href="\/university"[\s\S]*?<\/li>/g;

/**
 * The "University" entry added to `menuItems.nodes` in
 * `content/colabs-next-data.json`. The home page's exported React app hydrates
 * and re-renders its nav from this JSON, so the link had to be added here too.
 */
const NAV_JSON =
  /,\{"label":"University","url":"\/university",[^[\]{}]*"connectedNode":null,"childItems":\{"nodes":\[\]\}\}/g;

type Normalized = { html: string; liRemoved: number; jsonRemoved: number };

/** Strips the branch's intended nav additions and reports how many it found. */
function normalize(html: string): Normalized {
  const liRemoved = html.match(NAV_LI)?.length ?? 0;
  const jsonRemoved = html.match(NAV_JSON)?.length ?? 0;
  return {
    html: html.replace(NAV_LI, "").replace(NAV_JSON, ""),
    liRemoved,
    jsonRemoved,
  };
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

/**
 * sha256 of each page's assembled output at merge base e0b81eb.
 * See the header comment before changing any of these.
 */
const EXPECTED_SHA256: Record<string, string> = {
  home: "2ceeb010c0792b32e0099eb50efd5475819bee9a7f669d794cf05e519ba52560",
  about: "b71195c766614df0ca67816530d54ed284f23e2f618bc9e02c54e664744ef41c",
  contact: "a6165766b570c93780b31ffd39a52fe04dec1e041969d961a098007d15b9b94b",
  "zero-turnover":
    "488d63c30620f91b26049a6ee8393d8e5a055dcf93e9b2933d4b8c2f7819ad7e",
  "services/executive-consulting":
    "f39911458ec03f82835754ce548440f70997a87ecd8aa65bb136de7995b0da49",
  "services/team-development-care":
    "58f0937578a55fce07f13f2dd66f09122a0a956da0388f89139955cd95d4033c",
  "services/organizational-structure-setup":
    "a773cbc24895f9411b55510dbfa9c5f81a0cd8ff3693a0a654a023856949382c",
};

/**
 * Asserts a page still hashes to its pre-branch digest once the intended nav
 * additions are removed, with a failure message that says what to do next.
 */
function expectUnchanged(
  name: string,
  html: string,
  expectedNavLis: number,
  expectedNavJson: number
): void {
  const { html: stripped, liRemoved, jsonRemoved } = normalize(html);

  // If normalization found nothing to strip, the nav link is missing and the
  // hash comparison below would be meaningless (it would pass!). Catch that
  // first, with its own message.
  expect(
    liRemoved,
    `${name}: expected ${expectedNavLis} "University" nav <li> in the assembled ` +
      `output but found ${liRemoved}. Either the nav link was lost, or its ` +
      `markup changed and NAV_LI in this file no longer matches it.`
  ).toBe(expectedNavLis);
  expect(
    jsonRemoved,
    `${name}: expected ${expectedNavJson} "University" entry in the ` +
      `__NEXT_DATA__ menu payload but found ${jsonRemoved}. The home page's ` +
      `nav is re-rendered from that JSON after hydration, so losing it means ` +
      `the link disappears in a real browser.`
  ).toBe(expectedNavJson);

  const actual = sha256(stripped);
  const expected = EXPECTED_SHA256[name];

  expect(
    actual,
    `${name}: assembled output no longer matches the pre-branch page.\n` +
      `  expected sha256 (merge base e0b81eb): ${expected}\n` +
      `  actual   sha256 (this working tree):  ${actual}\n` +
      `This branch promises every existing page ships byte-identical HTML ` +
      `apart from the added "University" nav item. Either you changed ` +
      `something you did not mean to — fix the code — or the change is ` +
      `deliberate and approved, in which case update EXPECTED_SHA256["${name}"] ` +
      `to the actual digest above and explain the change in your commit message.`
  ).toBe(expected);
}

describe("existing marketing pages ship byte-identical HTML", () => {
  it("home", () => {
    // Two insertions on the home page: the static <li> in colabs-home-body.html
    // (served on first paint) and the JSON menu entry (used after hydration).
    expectUnchanged("home", assembleHomeHtml(), 1, 1);
  });

  it("about", () => {
    expectUnchanged("about", assembleAboutHtml(), 1, 0);
  });

  it("contact", () => {
    expectUnchanged("contact", assembleContactHtml(), 1, 0);
  });

  it("zero-turnover", () => {
    expectUnchanged("zero-turnover", assembleZeroTurnoverHtml(), 1, 0);
  });
});

describe("existing service pages ship byte-identical HTML", () => {
  it("still enumerates exactly the three known services", () => {
    // The digest table below is keyed by slug, so a new or renamed service
    // would silently skip its own check without this guard.
    expect(getAllServiceSlugs()).toEqual([
      "executive-consulting",
      "team-development-care",
      "organizational-structure-setup",
    ]);
  });

  it.each(getAllServiceSlugs())("%s", (slug) => {
    const service = getServiceBySlug(slug);
    expect(service).toBeDefined();
    expectUnchanged(`services/${slug}`, assembleServiceHtml(service!), 1, 0);
  });
});
