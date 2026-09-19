# Live Abundantly University — Foundation & Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the React foundation for Live Abundantly University (brand tokens, animation primitives, header) and ship the public `/university` landing page, matching the existing site's look, typography and motion exactly.

**Architecture:** A route group `app/(university)/` holds a React shell that imports the site's existing header stylesheet and reproduces its markup in JSX, so the university is visually identical to the current pages. Brand tokens and component styles live in two plain CSS files scoped under `.lau-shell` / `.lau`. The vanilla scroll-reveal, word-reveal and magnetic-button behaviors from `content/services/service-script.js` become small, tested React components. Course data is read through one async function so Phase 4 can swap static data for Postgres without touching any page.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19.2.4, TypeScript (strict), plain CSS, `next/font/google`, Vitest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-09-19-live-abundantly-university-design.md` (Phases 1–2).

## Global Constraints

- **Read the bundled docs first.** Per `AGENTS.md`: this is Next.js 16 and differs from training data. Before writing framework code, read the relevant file under `node_modules/next/dist/docs/`. Next 16 uses `proxy.ts`, not `middleware.ts`.
- **Do not modify existing page output.** `app/route.ts`, `app/about/route.ts`, `app/contact/route.ts`, `app/zero-turnover/route.ts`, `app/services/[slug]/route.ts` and the `content/assemble-*.ts` files keep producing byte-identical HTML, except for the single nav link added in Task 4.
- **Brand tokens are fixed.** `--white #ffffff`, `--paper #fdfcf9`, `--ink #1e2420`, `--body #626b66`, `--green #1d4a3a`, `--green-2 #163c2f`, `--gold #d3aa6e`, `--gold-bg #f5ead7`, `--sage #eef2ee`, `--rose #dfb1a8`, `--r 34px`, `--notch 24px`, `--ease cubic-bezier(.22,1,.36,1)`. Copy verbatim; do not invent new colors.
- **Typography:** Poppins (400/500/600/700) for body and headings; Pinyon Script (400) for accents only.
- **Motion:** every animation must be disabled under `prefers-reduced-motion: reduce`, and all revealed content must be visible in that mode.
- **No new runtime dependencies** in Phases 1–2 beyond what is listed in Task 1. Auth, database and payment packages arrive in later phases.
- **TypeScript strict mode** is on. No `any`. No `@ts-ignore`.
- **Naming:** the product is "Live Abundantly University". Code prefix is `lau`. CSS scope is `.lau-shell` (shell) and `.lau` (page content).
- **Commit after every task.** End commit messages with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `vitest.config.ts` | Test runner config: jsdom, `@/` alias, React plugin |
| `vitest.setup.ts` | Registers jest-dom matchers and installs the DOM mocks |
| `tests/helpers/dom-mocks.ts` | `IntersectionObserver` and `matchMedia` mocks, plus their test controls |
| `lib/university/heading.ts` | Pure: parse a headline string into words with script/break flags |
| `lib/university/magnetic.ts` | Pure: clamp magnetic-button pull distance |
| `lib/university/fonts.ts` | `next/font/google` config for Poppins and Pinyon Script |
| `lib/university/course-types.ts` | `CourseSummary` type — the contract Phase 4's database must satisfy |
| `lib/university/course-data.ts` | Static launch course records (replaced by DB in Phase 4) |
| `lib/university/courses.ts` | `getPublishedCourses()`, `formatPrice()` — the data seam |
| `content/social-icons.ts` | LinkedIn/Instagram SVG path data, shared by the HTML and React headers |
| `content/university/university.css` | Brand tokens, typography, reveal/CTA/frame/panel primitives |
| `content/university/landing.css` | Landing-page-only sections: course grid, quiz teaser, pricing |
| `components/university/WordReveal.tsx` | Renders a headline as staggered per-word reveal spans |
| `components/university/Reveal.tsx` | Client: adds `in` class when scrolled into view |
| `components/university/MagneticCta.tsx` | Client: magnetic pill CTA with gold ring |
| `components/university/NotchFrame.tsx` | Notched, rounded image frame with caption tag |
| `components/university/UniversityHeader.tsx` | Client: React port of the site header + University nav item |
| `components/university/landing/Hero.tsx` | Landing hero section |
| `components/university/landing/Pathway.tsx` | "How it works" numbered steps |
| `components/university/landing/CourseGrid.tsx` | Course catalog cards |
| `components/university/landing/QuizTeaser.tsx` | Free-quiz funnel section |
| `components/university/landing/PricingTeaser.tsx` | Per-course vs membership cards |
| `components/university/landing/ClosingCta.tsx` | Green closing panel |
| `app/(university)/layout.tsx` | University shell: fonts, CSS, header |
| `app/(university)/university/page.tsx` | The landing page; fetches data, composes sections |
| `tests/university/*.test.ts(x)` | Unit and component tests |

**Modified:**

| File | Change |
|---|---|
| `package.json` | Add dev dependencies and `test` scripts |
| `content/assemble-header.ts` | Add University nav item; import social paths from `content/social-icons.ts` |
| `content/colabs-home-body.html` | Add the matching University nav item to the home page's own header |

---

### Task 1: Test harness and pure helpers

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `tests/helpers/dom-mocks.ts`
- Create: `lib/university/heading.ts`, `lib/university/magnetic.ts`
- Create: `tests/university/heading.test.ts`, `tests/university/magnetic.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing (first task).
- Produces:
  - `splitHeadingWords(source: string): HeadingWord[]` from `@/lib/university/heading`
  - `type HeadingWord = { text: string; script: boolean; breakAfter: boolean }`
  - `headingPlainText(source: string): string` from `@/lib/university/heading`
  - `clampPull(distance: number, strength?: number, max?: number): number` from `@/lib/university/magnetic`
  - `MAGNETIC_MAX_PX = 10`, `MAGNETIC_STRENGTH = 0.18`
  - npm scripts `test` and `test:watch`

**Headline syntax** (used by every heading from here on): words separated by spaces; a word wrapped in asterisks (`*abundant*`) renders in Pinyon Script; a bare `|` token forces a line break after the previous word.

- [ ] **Step 1: Install test dependencies**

```bash
npm install --save-dev vitest@^3 @vitejs/plugin-react@^5 jsdom@^26 @testing-library/react@^16 @testing-library/dom@^10 @testing-library/jest-dom@^6
```

- [ ] **Step 2: Add test scripts to `package.json`**

Add to the `"scripts"` object, after `"lint": "eslint"`:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 4: Create `tests/helpers/dom-mocks.ts`**

jsdom implements neither `IntersectionObserver` nor a useful `matchMedia`, and both are needed by the animation components in Tasks 2 and 3. `MockIntersectionObserver.instances` lets a test fire the callback by hand. `setMediaQuery` lets a test turn reduced motion on.

These live in their own module rather than in `vitest.setup.ts`, because the setup file is loaded by the runner *and* would be imported by tests, which risks two module instances with two separate `matchedQueries` sets.

```ts
import { vi } from "vitest";

export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly elements = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.elements.add(element);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
  }

  disconnect(): void {
    this.elements.clear();
  }

  /** Test helper: fire the observer callback for every observed element. */
  trigger(isIntersecting = true): void {
    const entries = [...this.elements].map(
      (target) => ({ target, isIntersecting }) as IntersectionObserverEntry
    );
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

const matchedQueries = new Set<string>();

/** Test helper: make `window.matchMedia(query).matches` return true. */
export function setMediaQuery(query: string, matches: boolean): void {
  if (matches) matchedQueries.add(query);
  else matchedQueries.delete(query);
}

/** Installs both mocks as globals. Called once from `vitest.setup.ts`. */
export function installDomMocks(): void {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matchedQueries.has(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/** Clears mock state between tests. */
export function resetDomMocks(): void {
  MockIntersectionObserver.instances.length = 0;
  matchedQueries.clear();
}
```

- [ ] **Step 5: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { installDomMocks, resetDomMocks } from "./tests/helpers/dom-mocks";

installDomMocks();

afterEach(() => {
  cleanup();
  resetDomMocks();
});
```

Tests that need the controls import them directly from `@/tests/helpers/dom-mocks`.

- [ ] **Step 6: Write the failing tests**

Create `tests/university/heading.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { headingPlainText, splitHeadingWords } from "@/lib/university/heading";

describe("splitHeadingWords", () => {
  it("returns one entry per word", () => {
    expect(splitHeadingWords("Grow into the life")).toEqual([
      { text: "Grow", script: false, breakAfter: false },
      { text: "into", script: false, breakAfter: false },
      { text: "the", script: false, breakAfter: false },
      { text: "life", script: false, breakAfter: false },
    ]);
  });

  it("marks asterisk-wrapped words as script and strips the asterisks", () => {
    const words = splitHeadingWords("the *abundant* life");
    expect(words[1]).toEqual({ text: "abundant", script: true, breakAfter: false });
  });

  it("treats a bare pipe as a line break on the previous word", () => {
    const words = splitHeadingWords("Grow into | the life");
    expect(words).toHaveLength(4);
    expect(words[1]).toEqual({ text: "into", script: false, breakAfter: true });
  });

  it("ignores a leading pipe that has no previous word", () => {
    expect(splitHeadingWords("| Grow")).toEqual([
      { text: "Grow", script: false, breakAfter: false },
    ]);
  });

  it("collapses runs of whitespace", () => {
    expect(splitHeadingWords("  Grow \n  into  ")).toHaveLength(2);
  });

  it("returns an empty array for empty input", () => {
    expect(splitHeadingWords("")).toEqual([]);
    expect(splitHeadingWords("   ")).toEqual([]);
  });

  it("does not treat a lone asterisk as a script marker", () => {
    expect(splitHeadingWords("*")).toEqual([
      { text: "*", script: false, breakAfter: false },
    ]);
  });
});

describe("headingPlainText", () => {
  it("strips markers so the string can be an aria-label", () => {
    expect(headingPlainText("Grow into the *abundant* | life")).toBe(
      "Grow into the abundant life"
    );
  });
});
```

Create `tests/university/magnetic.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { MAGNETIC_MAX_PX, clampPull } from "@/lib/university/magnetic";

describe("clampPull", () => {
  it("scales small distances by the strength factor", () => {
    expect(clampPull(10)).toBeCloseTo(1.8);
  });

  it("clamps large positive distances to the maximum", () => {
    expect(clampPull(5000)).toBe(MAGNETIC_MAX_PX);
  });

  it("clamps large negative distances to the negative maximum", () => {
    expect(clampPull(-5000)).toBe(-MAGNETIC_MAX_PX);
  });

  it("returns zero at the centre", () => {
    expect(clampPull(0)).toBe(0);
  });
});
```

- [ ] **Step 7: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/university/heading"` and the same for `magnetic`.

- [ ] **Step 8: Write `lib/university/heading.ts`**

```ts
export type HeadingWord = {
  text: string;
  /** Render in Pinyon Script (the brand accent face). */
  script: boolean;
  /** Force a line break after this word. */
  breakAfter: boolean;
};

const BREAK_TOKEN = "|";

/**
 * Parses a headline into per-word reveal units.
 *
 * Syntax: `*word*` renders in the script face; a bare `|` breaks the line
 * after the preceding word.
 */
export function splitHeadingWords(source: string): HeadingWord[] {
  const tokens = source.trim().split(/\s+/).filter(Boolean);
  const words: HeadingWord[] = [];

  for (const token of tokens) {
    if (token === BREAK_TOKEN) {
      const previous = words[words.length - 1];
      if (previous) previous.breakAfter = true;
      continue;
    }

    const script =
      token.length > 2 && token.startsWith("*") && token.endsWith("*");

    words.push({
      text: script ? token.slice(1, -1) : token,
      script,
      breakAfter: false,
    });
  }

  return words;
}

/** The headline with all markers removed — use as an `aria-label`. */
export function headingPlainText(source: string): string {
  return splitHeadingWords(source)
    .map((word) => word.text)
    .join(" ");
}
```

- [ ] **Step 9: Write `lib/university/magnetic.ts`**

```ts
/** Maximum pixels a magnetic control may travel from rest. */
export const MAGNETIC_MAX_PX = 10;

/** Fraction of cursor distance applied as pull. */
export const MAGNETIC_STRENGTH = 0.18;

/** Converts cursor distance from an element's centre into a clamped offset. */
export function clampPull(
  distance: number,
  strength: number = MAGNETIC_STRENGTH,
  max: number = MAGNETIC_MAX_PX
): number {
  const pull = distance * strength;
  return Math.max(-max, Math.min(max, pull));
}
```

- [ ] **Step 10: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — both test files green, no failures.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts tests lib/university
git commit -m "Add Vitest harness and university heading/magnetic helpers.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Brand stylesheet, fonts, and the reveal primitives

**Files:**
- Create: `lib/university/fonts.ts`
- Create: `content/university/university.css`
- Create: `components/university/WordReveal.tsx`, `components/university/Reveal.tsx`
- Create: `tests/university/word-reveal.test.tsx`, `tests/university/reveal.test.tsx`

**Interfaces:**
- Consumes: `splitHeadingWords`, `headingPlainText` from `@/lib/university/heading`; `MockIntersectionObserver`, `setMediaQuery` from `@/tests/helpers/dom-mocks`.
- Produces:
  - `poppins`, `pinyonScript` (next/font objects exposing `.variable`) from `@/lib/university/fonts`
  - `<WordReveal text="..." />` from `@/components/university/WordReveal`
  - `<Reveal as="section" className="hero">…</Reveal>` from `@/components/university/Reveal`
  - CSS classes consumed by every later task: `.lau-shell`, `.lau`, `.wrap`, `.eyebrow`, `.chips`, `.cta`, `.ring`, `.frame`, `.notch`, `.tag`, `.band`, `.panel`, `.cols`, `.list`, `.item`, `.n`, `.sub`, `.close`, `.whisper`, `.also`, `.script`, `.w`, and the `in` state class.

- [ ] **Step 1: Write the failing tests**

Create `tests/university/word-reveal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WordReveal } from "@/components/university/WordReveal";

describe("WordReveal", () => {
  it("wraps every word in a reveal span", () => {
    const { container } = render(<WordReveal text="Grow into the life" />);
    expect(container.querySelectorAll("span.w")).toHaveLength(4);
  });

  it("gives each word an increasing --i index for the stagger", () => {
    const { container } = render(<WordReveal text="one two three" />);
    const words = [...container.querySelectorAll<HTMLElement>("span.w")];
    expect(words.map((w) => w.style.getPropertyValue("--i"))).toEqual([
      "0",
      "1",
      "2",
    ]);
  });

  it("renders script words in the accent face", () => {
    const { container } = render(<WordReveal text="the *abundant* life" />);
    const script = container.querySelector("span.script");
    expect(script).toHaveTextContent("abundant");
  });

  it("emits a line break where the headline asks for one", () => {
    const { container } = render(<WordReveal text="Grow into | the life" />);
    expect(container.querySelectorAll("br")).toHaveLength(1);
  });

  it("renders the readable text for assistive technology", () => {
    render(
      <h1 aria-label="Grow into the abundant life">
        <WordReveal text="Grow into the *abundant* life" />
      </h1>
    );
    expect(
      screen.getByRole("heading", { name: "Grow into the abundant life" })
    ).toBeInTheDocument();
  });
});
```

Create `tests/university/reveal.test.tsx`:

```tsx
import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/university/Reveal";
import { MockIntersectionObserver, setMediaQuery } from "@/tests/helpers/dom-mocks";

describe("Reveal", () => {
  it("starts hidden, without the in class", () => {
    const { container } = render(
      <Reveal className="hero">
        <p>content</p>
      </Reveal>
    );
    expect(container.querySelector("section")).not.toHaveClass("in");
  });

  it("adds the in class once the section intersects", () => {
    const { container } = render(
      <Reveal className="hero">
        <p>content</p>
      </Reveal>
    );

    act(() => {
      MockIntersectionObserver.instances[0].trigger(true);
    });

    expect(container.querySelector("section")).toHaveClass("hero", "in");
  });

  it("stays hidden while the section is out of view", () => {
    const { container } = render(
      <Reveal className="hero">
        <p>content</p>
      </Reveal>
    );

    act(() => {
      MockIntersectionObserver.instances[0].trigger(false);
    });

    expect(container.querySelector("section")).not.toHaveClass("in");
  });

  it("shows immediately when the visitor prefers reduced motion", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);

    const { container } = render(
      <Reveal className="hero">
        <p>content</p>
      </Reveal>
    );

    expect(container.querySelector("section")).toHaveClass("in");
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("renders a div when asked, for panel elements", () => {
    const { container } = render(
      <Reveal as="div" className="panel">
        <p>content</p>
      </Reveal>
    );
    expect(container.querySelector("div.panel")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `@/components/university/WordReveal` and `@/components/university/Reveal`.

- [ ] **Step 3: Write `lib/university/fonts.ts`**

Read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` first. Poppins is not a variable font, so explicit weights are required; Pinyon Script ships only weight 400.

```ts
import { Pinyon_Script, Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});
```

- [ ] **Step 4: Write `content/university/university.css`**

Adapted from `content/services/service-styles.css`, scoped to `.lau-shell` / `.lau`. Two deliberate differences from the original: the word-reveal stagger is driven by a `--i` custom property instead of hardcoded `nth-of-type` rules so it works for any word count, and font families resolve through the `next/font` CSS variables.

```css
/* ==================================================
   Live Abundantly University — brand foundation
   Tokens and primitives shared by every LAU page.
================================================== */

.lau-shell{
  --white:   #ffffff;
  --paper:   #fdfcf9;
  --ink:     #1e2420;
  --body:    #626b66;
  --green:   #1d4a3a;
  --green-2: #163c2f;
  --gold:    #d3aa6e;
  --gold-bg: #f5ead7;
  --sage:    #eef2ee;
  --rose:    #dfb1a8;
  --r:       34px;
  --notch:   24px;
  --ease:    cubic-bezier(.22,1,.36,1);

  /* Offset for the fixed site header (mirrors body.cg-has-header). */
  padding-top:80px;
  background:var(--white);
}
@media (max-width:1024px){
  .lau-shell{ padding-top:60px; }
}

/* The header stylesheet asks for "Poppins" by name; next/font self-hosts it
   under a generated name, so point the header at the font variable. */
.lau-shell .Header_Header__RCJxb,
.lau-shell .Header_Header__RCJxb *{
  font-family:var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif;
}

.lau *, .lau *::before, .lau *::after{ box-sizing:border-box; margin:0; padding:0; }

.lau{
  background:var(--white);
  font-family:var(--font-poppins), -apple-system, sans-serif;
  color:var(--body);
}
.lau .wrap{ max-width:1360px; margin:0 auto; }

/* ============ shared bits ============ */
.lau .eyebrow{
  display:inline-flex; align-items:center; gap:10px;
  font-size:12.5px; font-weight:600; letter-spacing:.22em;
  text-transform:uppercase; color:var(--green);
  border:1.5px solid rgba(29,74,58,.22);
  border-radius:999px;
  padding:10px 22px;
}
.lau .eyebrow::before{ content:""; width:8px; height:8px; border-radius:50%; background:var(--gold); }

.lau h1{
  font-weight:600;
  font-size:clamp(42px, 5.4vw, 80px);
  line-height:1.04;
  letter-spacing:-.025em;
  color:var(--ink);
  margin-bottom:26px;
}
.lau h2{
  font-weight:600;
  font-size:clamp(32px, 3.6vw, 52px);
  line-height:1.08;
  letter-spacing:-.02em;
  color:var(--ink);
  margin:26px 0 18px;
}
.lau .script{
  font-family:var(--font-pinyon), cursive;
  font-weight:400; font-size:1.32em;
  color:var(--green);
}

/* per-word headline reveal; --i is set per word by <WordReveal> */
.lau .w{
  display:inline-block; overflow:hidden;
  vertical-align:bottom;
  padding-bottom:.14em; margin-bottom:-.14em;
}
.lau .w > span{
  display:inline-block;
  transform:translateY(115%);
  transition:transform 1s var(--ease);
  transition-delay:calc(.12s + var(--i, 0) * 90ms);
}
.lau .in .w > span,
.lau.in .w > span{ transform:translateY(0); }

.lau .lede{
  font-size:clamp(16px, 1.3vw, 19px);
  line-height:1.75;
  max-width:48ch;
  opacity:0; transform:translateY(16px);
  transition:opacity .9s var(--ease) .4s, transform .9s var(--ease) .4s;
}
.lau .in .lede{ opacity:1; transform:none; }

.lau .sub{
  font-size:15px; line-height:1.75; max-width:36ch;
  opacity:0; transform:translateY(14px);
  transition:opacity .9s var(--ease) .3s, transform .9s var(--ease) .3s;
}
.lau .in .sub{ opacity:1; transform:none; }

.lau .chips{ display:flex; flex-wrap:wrap; gap:10px; margin:28px 0 38px; }
.lau .chips span{
  font-size:11.5px; font-weight:600;
  letter-spacing:.16em; text-transform:uppercase;
  color:var(--ink);
  background:var(--sage);
  border-radius:999px;
  padding:9px 18px;
  opacity:0; translate:0 14px;
  transition:opacity .7s var(--ease), translate .7s var(--ease);
  transition-delay:calc(.5s + var(--i, 0) * 90ms);
}
.lau .in .chips span{ opacity:1; translate:0 0; }

/* ============ CTA ============ */
.lau .cta{
  display:inline-flex; align-items:center; gap:16px;
  padding:10px 12px 10px 30px;
  border-radius:999px;
  background:var(--green); color:#fff;
  font-size:13.5px; font-weight:600;
  letter-spacing:.16em; text-transform:uppercase;
  text-decoration:none;
  opacity:0; translate:0 16px;
  transition:opacity .9s var(--ease) .7s, translate .9s var(--ease) .7s, background .4s ease;
  will-change:transform;
}
.lau .in .cta{ opacity:1; translate:0 0; }
.lau .cta .ring{
  width:46px; height:46px;
  display:grid; place-items:center;
  border-radius:50%;
  background:var(--gold); color:var(--green-2);
  transition:background .4s ease, transform .55s var(--ease);
}
.lau .cta svg{ width:17px; height:17px; transition:transform .55s var(--ease); }
.lau .cta:hover{ background:var(--ink); }
.lau .cta:hover .ring{ background:var(--rose); transform:scale(1.08); }
.lau .cta:hover svg{ transform:rotate(-45deg); }
.lau .cta:focus-visible{ outline:3px solid var(--gold); outline-offset:4px; }

.lau .cta.ghost{
  background:transparent;
  color:var(--ink);
  border:1.5px solid rgba(29,74,58,.25);
  padding:10px 30px;
}
.lau .cta.ghost:hover{ background:var(--sage); color:var(--green-2); }

.lau .cta-row{ display:flex; flex-wrap:wrap; gap:14px; align-items:center; }

/* ============ image frame ============ */
.lau .frame{
  position:relative;
  border-radius:var(--r);
  border-top-right-radius:110px;
  overflow:hidden;
  aspect-ratio: 4 / 4.6;
  opacity:0; transform:translateY(30px) scale(.98);
  transition:opacity 1s var(--ease) .3s, transform 1s var(--ease) .3s, border-top-right-radius .7s var(--ease);
}
.lau .in .frame{ opacity:1; transform:none; }
.lau .frame:hover{ border-top-right-radius:var(--r); }
.lau .frame img.real{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }

.lau .frame .notch{
  position:absolute; left:-1px; bottom:-1px;
  background:var(--white);
  border-top-right-radius:var(--notch);
  padding:10px 12px 0 0;
}
.lau .frame .notch::before,
.lau .frame .notch::after{
  content:""; position:absolute; width:var(--notch); height:var(--notch);
  background:radial-gradient(circle at top right, rgba(0,0,0,0) calc(var(--notch) - .5px), var(--white) var(--notch));
}
.lau .frame .notch::before{ right:calc(-1 * var(--notch)); bottom:0; }
.lau .frame .notch::after{ left:0; top:calc(-1 * var(--notch)); }
.lau .frame .tag{
  display:inline-flex; align-items:center; gap:8px;
  font-size:11px; font-weight:600;
  letter-spacing:.18em; text-transform:uppercase;
  color:var(--green);
  background:var(--paper);
  border-radius:999px;
  padding:10px 18px;
}
.lau .frame .tag::before{ content:""; width:6px; height:6px; border-radius:50%; background:var(--rose); }

/* ============ sage panel band ============ */
.lau .band{ padding: 0 clamp(10px, 1.6vw, 24px) clamp(28px, 3vw, 44px); }
.lau .panel{
  position:relative;
  background:var(--sage);
  border-radius:clamp(32px, 4vw, 56px);
  border-bottom-left-radius:clamp(70px, 9vw, 140px);
  padding: clamp(64px, 7vw, 110px) clamp(24px, 4.5vw, 72px);
  overflow:clip;
}
.lau .panel .cols{
  max-width:1220px; margin:0 auto;
  display:grid;
  grid-template-columns: minmax(0,1fr) minmax(0,1.3fr);
  gap:clamp(36px, 5vw, 90px);
  align-items:start;
}

.lau .list{ display:grid; gap:14px; }
.lau .item{
  display:flex; gap:20px; align-items:flex-start;
  background:var(--paper);
  border-radius:24px;
  padding:clamp(20px, 1.8vw, 28px) clamp(22px, 2vw, 32px);
  opacity:0; translate:0 22px;
  transition:opacity .8s var(--ease), translate .8s var(--ease), transform .5s var(--ease), box-shadow .5s ease;
  transition-delay:calc(var(--i, 0) * 100ms), calc(var(--i, 0) * 100ms), 0s, 0s;
}
.lau .in .item{ opacity:1; translate:0 0; }
.lau .item:hover{
  transform:translateX(6px);
  box-shadow:0 18px 34px -20px rgba(30,36,32,.18);
  transition-delay:0s;
}
.lau .item .n{
  flex:0 0 auto;
  width:44px; height:44px;
  display:grid; place-items:center;
  border-radius:50%;
  border:1.5px solid var(--gold);
  color:var(--gold);
  font-size:13px; font-weight:600;
  transition:background .45s var(--ease), color .45s var(--ease), transform .6s var(--ease);
}
.lau .item:hover .n{ background:var(--gold); color:var(--paper); transform:rotate(-8deg); }
.lau .item h3{
  font-size:16.5px; font-weight:600;
  letter-spacing:-.01em; color:var(--ink);
  margin-bottom:5px;
}
.lau .item p{ font-size:14px; line-height:1.65; }

/* ============ closing green panel ============ */
.lau .close{ padding: 0 clamp(10px, 1.6vw, 24px) clamp(28px, 3vw, 44px); }
.lau .close .panel{
  background:var(--green);
  border-bottom-left-radius:clamp(32px, 4vw, 56px);
  border-top-right-radius:clamp(70px, 9vw, 140px);
  text-align:center;
  color:rgba(255,255,255,.75);
}
.lau .close h2{ color:#fff; margin-top:0; max-width:none; }
.lau .close h2 .script{ color:var(--gold); }
.lau .close .sub{ margin:0 auto 36px; max-width:52ch; }
.lau .close .cta{ transition-delay:.45s, .45s, 0s; }
.lau .close .also{
  display:block; margin-top:26px;
  font-size:12.5px; font-weight:600;
  letter-spacing:.18em; text-transform:uppercase;
  color:rgba(255,255,255,.6);
  text-decoration:none;
  transition:color .35s ease;
}
.lau .close .also:hover{ color:var(--gold); }
.lau .close .whisper{
  position:absolute; right:3%; bottom:0;
  font-family:var(--font-pinyon), cursive;
  font-size:clamp(70px, 9vw, 140px);
  line-height:1;
  color:rgba(211,170,110,.12);
  pointer-events:none; user-select:none;
}

/* ============ responsive / motion ============ */
@media (max-width: 980px){
  .lau .frame{ aspect-ratio: 4 / 3; }
  .lau .panel .cols{ grid-template-columns:1fr; gap:34px; }
}
@media (prefers-reduced-motion: reduce){
  .lau *{ transition:none !important; animation:none !important; }
  .lau .eyebrow, .lau .lede, .lau .sub, .lau .chips span,
  .lau .cta, .lau .frame, .lau .item{
    opacity:1 !important; transform:none !important; translate:0 0 !important;
  }
  .lau .w > span{ transform:none !important; }
}
```

- [ ] **Step 5: Write `components/university/WordReveal.tsx`**

A server component — it renders markup only, and the motion is CSS driven by the ancestor's `in` class.

```tsx
import { Fragment } from "react";
import type { CSSProperties } from "react";
import { splitHeadingWords } from "@/lib/university/heading";

type WordRevealProps = {
  /** Headline source. `*word*` renders in script; `|` breaks the line. */
  text: string;
};

/**
 * Renders a headline as per-word reveal spans. Pair with an `aria-label`
 * built from `headingPlainText`, since the split markup is not readable.
 */
export function WordReveal({ text }: WordRevealProps) {
  const words = splitHeadingWords(text);

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word.text}-${index}`}>
          <span className="w" style={{ "--i": index } as CSSProperties}>
            <span>
              {word.script ? <span className="script">{word.text}</span> : word.text}
            </span>
          </span>
          {word.breakAfter ? <br /> : null}
          {!word.breakAfter && index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
```

- [ ] **Step 6: Write `components/university/Reveal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Classes for the revealed element; `in` is appended once visible. */
  className?: string;
  as?: "section" | "div";
  threshold?: number;
};

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
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;

    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown, threshold]);

  const Tag = as as ElementType;
  const classes = [className, shown ? "in" : ""].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every test file green, no failures.

- [ ] **Step 8: Commit**

```bash
git add lib/university/fonts.ts content/university components/university tests/university
git commit -m "Add university brand stylesheet, fonts, and reveal primitives.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Magnetic CTA and notched image frame

**Files:**
- Create: `components/university/MagneticCta.tsx`, `components/university/NotchFrame.tsx`
- Create: `tests/university/magnetic-cta.test.tsx`, `tests/university/notch-frame.test.tsx`

**Interfaces:**
- Consumes: `clampPull` from `@/lib/university/magnetic`; the `.cta`, `.ring`, `.frame`, `.notch`, `.tag` classes from Task 2.
- Produces:
  - `<MagneticCta href label variant? />` from `@/components/university/MagneticCta`, where `variant` is `"primary" | "ghost"` (default `"primary"`)
  - `<NotchFrame src alt tag? className? sizes? priority? />` from `@/components/university/NotchFrame`

- [ ] **Step 1: Write the failing tests**

Create `tests/university/magnetic-cta.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MagneticCta } from "@/components/university/MagneticCta";
import { setMediaQuery } from "@/tests/helpers/dom-mocks";

describe("MagneticCta", () => {
  it("renders a link with the label and the gold ring", () => {
    const { container } = render(
      <MagneticCta href="/university/courses" label="Explore the Courses" />
    );

    const link = screen.getByRole("link", { name: "Explore the Courses" });
    expect(link).toHaveAttribute("href", "/university/courses");
    expect(link).toHaveClass("cta");
    expect(container.querySelector(".ring")).toBeInTheDocument();
  });

  it("applies the ghost variant class when asked", () => {
    render(<MagneticCta href="/x" label="Secondary" variant="ghost" />);
    expect(screen.getByRole("link", { name: "Secondary" })).toHaveClass("ghost");
  });

  it("does not move on a coarse pointer", () => {
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });

    expect(link.style.transform).toBe("");
  });

  it("pulls toward the cursor on a fine pointer", () => {
    setMediaQuery("(pointer:fine)", true);
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });

    expect(link.style.transform).toMatch(/^translate\(/);
  });

  it("returns to rest when the cursor leaves", () => {
    setMediaQuery("(pointer:fine)", true);
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });
    fireEvent.mouseLeave(link);

    expect(link.style.transform).toBe("translate(0px, 0px)");
  });

  it("stays still when the visitor prefers reduced motion", () => {
    setMediaQuery("(pointer:fine)", true);
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });

    expect(link.style.transform).toBe("");
  });
});
```

Create `tests/university/notch-frame.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotchFrame } from "@/components/university/NotchFrame";

describe("NotchFrame", () => {
  it("renders the image with its alt text", () => {
    render(<NotchFrame src="/media/hero" alt="Carrie leading a session" />);
    expect(
      screen.getByRole("img", { name: "Carrie leading a session" })
    ).toBeInTheDocument();
  });

  it("renders the caption tag when one is given", () => {
    render(<NotchFrame src="/media/hero" alt="Hero" tag="The University" />);
    expect(screen.getByText("The University")).toHaveClass("tag");
  });

  it("omits the notch entirely when there is no tag", () => {
    const { container } = render(<NotchFrame src="/media/hero" alt="Hero" />);
    expect(container.querySelector(".notch")).toBeNull();
  });

  it("merges extra classes onto the frame", () => {
    const { container } = render(
      <NotchFrame src="/media/hero" alt="Hero" className="tall" />
    );
    expect(container.querySelector(".frame")).toHaveClass("tall");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `@/components/university/MagneticCta` and `@/components/university/NotchFrame`.

- [ ] **Step 3: Write `components/university/MagneticCta.tsx`**

```tsx
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
```

- [ ] **Step 4: Write `components/university/NotchFrame.tsx`**

`next/image` with `fill` matches the existing `.real` rule (absolutely positioned, `object-fit:cover`) and avoids the `no-img-element` lint rule. Images are served by the existing `app/media/[key]/route.ts` handler, so no `next.config.ts` change is needed for same-origin paths.

```tsx
import Image from "next/image";

type NotchFrameProps = {
  src: string;
  alt: string;
  /** Caption shown in the notched chip. Omit for an uncaptioned frame. */
  tag?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Rounded, notched image frame — the site's signature media treatment. */
export function NotchFrame({
  src,
  alt,
  tag,
  className = "",
  sizes = "(max-width: 980px) 100vw, 50vw",
  priority = false,
}: NotchFrameProps) {
  const classes = ["frame", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <Image
        className="real"
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
      />
      {tag ? (
        <span className="notch">
          <span className="tag">{tag}</span>
        </span>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every test file green, no failures.

- [ ] **Step 6: Commit**

```bash
git add components/university tests/university
git commit -m "Add magnetic CTA and notched image frame components.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: University header and the site-wide nav link

**Files:**
- Create: `content/social-icons.ts`
- Create: `components/university/UniversityHeader.tsx`
- Modify: `content/assemble-header.ts` (social path constants → import; add University nav item)
- Modify: `content/colabs-home-body.html:136` (add University nav item before Contact)
- Create: `tests/university/university-header.test.tsx`, `tests/university/site-header.test.ts`

**Interfaces:**
- Consumes: `LINKEDIN_URL`, `INSTAGRAM_URL` from `@/content/site-links`.
- Produces:
  - `LINKEDIN_ICON_PATH`, `INSTAGRAM_ICON_PATH` from `@/content/social-icons`
  - `<UniversityHeader currentPath authSlot? />` from `@/components/university/UniversityHeader`

**Why reuse the existing stylesheet:** the header's CSS in `content/header/header-styles.css` is 12 KB of hashed class names. Rather than reimplementing it, the React header reproduces the same markup and class names and the layout imports that same file, which guarantees pixel parity with the rest of the site. The vanilla behaviors in `content/header/header-script.js` (menu toggle, submenu, scroll progress, Escape to close) become React state.

The `authSlot` prop is intentionally unused in this phase — Phase 3 passes Clerk's buttons into it. Nothing here links to `/sign-in`, which does not exist yet.

- [ ] **Step 1: Write the failing tests**

Create `tests/university/university-header.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UniversityHeader } from "@/components/university/UniversityHeader";

describe("UniversityHeader", () => {
  it("links to the main site sections and the university", () => {
    render(<UniversityHeader currentPath="/university" />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole("link", { name: "University" })).toHaveAttribute(
      "href",
      "/university"
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("marks the current page as active", () => {
    render(<UniversityHeader currentPath="/university" />);
    expect(screen.getByRole("link", { name: "University" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveClass("active");
  });

  it("treats university sub-pages as active too", () => {
    render(<UniversityHeader currentPath="/university/quizzes" />);
    expect(screen.getByRole("link", { name: "University" })).toHaveClass("active");
  });

  it("gives the logo link an accessible name", () => {
    render(<UniversityHeader currentPath="/university" />);
    expect(
      screen.getByRole("link", { name: "Carrie Grace — home" })
    ).toBeInTheDocument();
  });

  it("toggles the mobile menu open and closed", () => {
    const { container } = render(<UniversityHeader currentPath="/university" />);
    const button = screen.getByRole("button", { name: "Menu" });

    fireEvent.click(button);
    expect(container.querySelector("nav")).toHaveClass("Menu_Open__12jRk");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(container.querySelector("nav")).not.toHaveClass("Menu_Open__12jRk");
  });

  it("closes the menu on Escape", () => {
    const { container } = render(<UniversityHeader currentPath="/university" />);

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(container.querySelector("nav")).not.toHaveClass("Menu_Open__12jRk");
  });

  it("toggles the services submenu", () => {
    const { container } = render(<UniversityHeader currentPath="/university" />);
    const chevron = screen.getByRole("button", { name: "Toggle Submenu" });

    fireEvent.click(chevron);

    expect(
      container.querySelector(".SmoothOpen_SmoothOpen__1J7VQ")
    ).toHaveClass("SmoothOpen_isOpen__eFutI");
  });

  it("renders the auth slot when one is supplied", () => {
    render(
      <UniversityHeader
        currentPath="/university"
        authSlot={<span data-testid="auth">account</span>}
      />
    );
    expect(screen.getByTestId("auth")).toBeInTheDocument();
  });

  it("renders no auth slot by default", () => {
    render(<UniversityHeader currentPath="/university" />);
    expect(screen.queryByTestId("auth")).toBeNull();
  });
});
```

Create `tests/university/site-header.test.ts` — this guards the two existing headers so the university link cannot silently disappear:

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `@/components/university/UniversityHeader`, and the `site-header` tests fail on the missing `/university` link.

- [ ] **Step 3: Create `content/social-icons.ts`**

Move the two path strings out of `content/assemble-header.ts` so both headers share one source. `assemble-header.ts` imports `fs`, so a client component must not import from it.

```ts
/** Simple Icons path data, shared by the HTML and React site headers. */
export const LINKEDIN_ICON_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export const INSTAGRAM_ICON_PATH =
  "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z";
```

- [ ] **Step 4: Update `content/assemble-header.ts`**

Replace the two module-level `linkedInPath` / `instagramPath` constants with an import, then add the University nav item.

Add to the imports at the top of the file:

```ts
import { INSTAGRAM_ICON_PATH, LINKEDIN_ICON_PATH } from "./social-icons";
```

Delete the `const linkedInPath = "M20.447 …";` and `const instagramPath = "M12 0C8.74 …";` declarations, and replace the two call sites at the bottom of the file:

```ts
        ${socialIcon("linkedin", LINKEDIN_ICON_PATH)}
        ${socialIcon("instagram", INSTAGRAM_ICON_PATH)}
```

(There are two such pairs — one inside `.Menu_Menu___Nwdq > ul`, one inside `.Header_SocialsMobile__0QYKc`. Update both.)

Add the active flag alongside the other `const …Active` lines:

```ts
  const universityActive = currentPath.startsWith("/university") ? "active" : "";
```

Then insert a new `<li>` in the markup template, immediately before the `Contact` list item:

```ts
        <li>
          <div class="Menu_Top___JOpe">
            <a class="${universityActive}" href="/university"
              ><span class="${universityActive || "  "}">University</span></a
            >
          </div>
        </li>
```

- [ ] **Step 5: Update `content/colabs-home-body.html`**

The home page carries its own copy of the header. Insert the matching `<li>` immediately before the `Contact` list item that begins at line 136, so the two headers stay in step:

```html
              <li>
                <div class="Menu_Top___JOpe">
                  <a class="" href="/university"
                    ><span class="  ">University</span></a
                  >
                </div>
              </li>
```

Note: the mobile menu's staggered transition delays cover `nth-child(1)` through `nth-child(10)`; this is the 8th item, so no CSS change is needed.

- [ ] **Step 6: Write `components/university/UniversityHeader.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  INSTAGRAM_ICON_PATH,
  LINKEDIN_ICON_PATH,
} from "@/content/social-icons";
import { INSTAGRAM_URL, LINKEDIN_URL } from "@/content/site-links";

type UniversityHeaderProps = {
  currentPath: string;
  /** Account controls. Phase 3 passes Clerk's buttons here. */
  authSlot?: ReactNode;
};

const SERVICES = [
  { label: "Executive Consulting", href: "/services/executive-consulting" },
  { label: "Team Development & Care", href: "/services/team-development-care" },
  {
    label: "Organizational Structure & Setup",
    href: "/services/organizational-structure-setup",
  },
];

const SOCIALS = [
  { label: "linkedin", title: "LinkedIn", href: LINKEDIN_URL, path: LINKEDIN_ICON_PATH },
  { label: "instagram", title: "Instagram", href: INSTAGRAM_URL, path: INSTAGRAM_ICON_PATH },
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
          <title>{social.title}</title>
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      setScrolled(window.scrollY > 8);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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
        <div className="ProgressBar_Bar__lPLis" style={{ width: `${progress}%` }} />
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
                {SERVICES.map((service) => (
                  <li key={service.href}>{navLink(service.href, service.label)}</li>
                ))}
              </ul>

              <div
                className={`SmoothOpen_SmoothOpen__1J7VQ${submenuOpen ? " SmoothOpen_isOpen__eFutI" : ""}`}
              >
                <div>
                  <ul className="Menu_MobileSubmenu__u1our">
                    {SERVICES.map((service) => (
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
```

**If `next/image` fails to render under Vitest** (Task 3's `NotchFrame` tests, Task 7's `CourseGrid` tests), add this block at the top of the affected test file, below its imports. `vi.mock` is hoisted by Vitest, so it must sit at the test file's top level — it cannot be wrapped in a helper function. It keeps the `role="img"` and `alt` assertions valid:

```tsx
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
    // `fill`, `sizes` and `priority` are Next-only props; they are dropped.
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
  }) => <img src={src} alt={alt} className={className} />,
}));
```

Try the real component first — only reach for the mock if it actually breaks.

Note: the logo `<img>` uses `alt=""` because the stylesheet hides it and the accessible name now comes from the link's `aria-label`. This is a small accessibility improvement over the HTML header, where the link has no accessible name at all. If ESLint objects to the raw `<img>`, add `{/* eslint-disable-next-line @next/next/no-img-element */}` above it — `next/image` is wrong here because the element is decorative and hidden.

- [ ] **Step 7: Add the auth slot style to `content/university/university.css`**

Append to the file, so the Phase 3 slot sits correctly in the nav:

```css
/* Account controls slot in the header nav (filled from Phase 3 onward). */
.lau-shell .Menu_Auth__lau{
  display:flex; align-items:center;
  padding-left:14px;
}
@media (max-width:1024px){
  .lau-shell .Menu_Auth__lau{ padding:14px 0; }
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every test file green, no failures.

- [ ] **Step 9: Verify the existing pages still build and serve**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 10: Commit**

```bash
git add content/social-icons.ts content/assemble-header.ts content/colabs-home-body.html content/university components/university tests/university
git commit -m "Add university header and site-wide University nav link.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: University route shell

**Files:**
- Create: `app/(university)/layout.tsx`
- Create: `app/(university)/university/page.tsx` (placeholder, replaced in Task 7)
- Create: `tests/university/layout.test.tsx`

**Interfaces:**
- Consumes: `poppins`, `pinyonScript`, `UniversityHeader`.
- Produces: the `/university` route, and `<UniversityShell currentPath>` wrapping every university page.

**Route group note:** read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md`. `app/(university)/university/page.tsx` resolves to `/university`; the parenthesised folder is stripped from the URL. This nests under the existing bare `app/layout.tsx`, and does not conflict with `app/route.ts`, which serves `/`.

**Why the layout is a client component:** `UniversityHeader` needs `usePathname()` to compute the active nav item. Keeping the shell thin and client-side means every page beneath it can still be an async server component.

- [ ] **Step 1: Write the failing test**

Create `tests/university/layout.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UniversityShell } from "@/app/(university)/shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/university",
}));

describe("UniversityShell", () => {
  it("renders the header and its children", () => {
    render(
      <UniversityShell>
        <p>page content</p>
      </UniversityShell>
    );

    expect(screen.getByRole("link", { name: "University" })).toBeInTheDocument();
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("scopes its children under the lau-shell class", () => {
    const { container } = render(
      <UniversityShell>
        <p>page content</p>
      </UniversityShell>
    );

    expect(container.querySelector(".lau-shell")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/app/(university)/shell`.

- [ ] **Step 3: Create `app/(university)/shell.tsx`**

The shell is split out from `layout.tsx` so it can be rendered in a test without Next's layout machinery.

```tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { UniversityHeader } from "@/components/university/UniversityHeader";
import { pinyonScript, poppins } from "@/lib/university/fonts";

export function UniversityShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/university";

  return (
    <div className={`lau-shell ${poppins.variable} ${pinyonScript.variable}`}>
      <UniversityHeader currentPath={pathname} />
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create `app/(university)/layout.tsx`**

CSS import order matters: the header stylesheet loads first so the university stylesheet's font override wins.

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UniversityShell } from "./shell";

import "@/content/header/header-styles.css";
import "@/content/university/university.css";

export const metadata: Metadata = {
  title: {
    default: "Live Abundantly University",
    template: "%s · Live Abundantly University",
  },
  description:
    "Self-paced courses, guided journals and honest self-assessments from Carrie Grace, for leaders who want to flourish without burning out.",
};

export default function UniversityLayout({ children }: { children: ReactNode }) {
  return <UniversityShell>{children}</UniversityShell>;
}
```

- [ ] **Step 5: Create the placeholder `app/(university)/university/page.tsx`**

Task 7 replaces this entirely. It exists so the route is reachable and the shell can be checked in a browser now.

```tsx
export default function UniversityLandingPage() {
  return (
    <main className="lau">
      <section className="hero in">
        <div className="wrap">
          <p className="eyebrow">Live Abundantly University</p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every test file green, no failures.

- [ ] **Step 7: Verify the route renders in a browser**

Run: `npm run dev`, then open `http://localhost:3000/university`.
Expected: the site header appears at the top with a "University" item marked active, the page sits below the fixed header rather than underneath it, and the eyebrow pill renders in Poppins with a gold dot. Also open `/` and `/about` and confirm the header there now shows "University" and is otherwise unchanged.

- [ ] **Step 8: Commit**

```bash
git add "app/(university)" tests/university
git commit -m "Add university route group, shell layout, and placeholder page.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Course data seam

**Files:**
- Create: `lib/university/course-types.ts`, `lib/university/course-data.ts`, `lib/university/courses.ts`
- Create: `tests/university/courses.test.ts`

**Interfaces:**
- Consumes: `siteImageSrc`, `SiteImageKey` from `@/content/site-images`.
- Produces:
  - `type CourseSummary` from `@/lib/university/course-types`
  - `getPublishedCourses(): Promise<CourseSummary[]>` from `@/lib/university/courses`
  - `getCourseBySlug(slug: string): Promise<CourseSummary | null>` from `@/lib/university/courses`
  - `formatPrice(priceCents: number): string` from `@/lib/university/courses`
  - `MEMBERSHIP` (`{ priceCents, interval, blurb }`) from `@/lib/university/course-data`

**Why this shape:** these functions are `async` even though they read a constant, so Phase 4 can replace the bodies with Postgres queries without changing a single caller. `CourseSummary` is the contract the database schema must satisfy.

**Prices are launch defaults, not final.** The spec records course names and prices as open items. The values below are defaults that render correctly today; they must be confirmed with the owner before Phase 8 wires Stripe, and from Phase 5 onward they are editable in the admin.

- [ ] **Step 1: Write the failing test**

Create `tests/university/courses.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  formatPrice,
  getCourseBySlug,
  getPublishedCourses,
} from "@/lib/university/courses";

describe("getPublishedCourses", () => {
  it("returns only published courses", async () => {
    const courses = await getPublishedCourses();
    expect(courses.length).toBeGreaterThan(0);
    expect(courses.every((course) => course.status === "published")).toBe(true);
  });

  it("returns them in ascending display order", async () => {
    const courses = await getPublishedCourses();
    const orders = courses.map((course) => course.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("gives every course the fields a card needs", async () => {
    const courses = await getPublishedCourses();
    for (const course of courses) {
      expect(course.slug).toMatch(/^[a-z0-9-]+$/);
      expect(course.title.length).toBeGreaterThan(0);
      expect(course.summary.length).toBeGreaterThan(0);
      expect(course.coverSrc).toMatch(/^\/media\//);
      expect(course.coverAlt.length).toBeGreaterThan(0);
      expect(course.lessonCount).toBeGreaterThan(0);
      expect(course.estimatedMinutes).toBeGreaterThan(0);
      expect(course.priceCents).toBeGreaterThanOrEqual(0);
    }
  });

  it("uses unique slugs", async () => {
    const courses = await getPublishedCourses();
    const slugs = courses.map((course) => course.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getCourseBySlug", () => {
  it("finds a published course", async () => {
    const [first] = await getPublishedCourses();
    await expect(getCourseBySlug(first.slug)).resolves.toEqual(first);
  });

  it("returns null for an unknown slug", async () => {
    await expect(getCourseBySlug("no-such-course")).resolves.toBeNull();
  });
});

describe("formatPrice", () => {
  it("renders whole dollars without cents", () => {
    expect(formatPrice(14900)).toBe("$149");
  });

  it("renders cents when they are not zero", () => {
    expect(formatPrice(14950)).toBe("$149.50");
  });

  it("renders zero as Free", () => {
    expect(formatPrice(0)).toBe("Free");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/university/courses`.

- [ ] **Step 3: Create `lib/university/course-types.ts`**

```ts
/**
 * A course as the catalog and cards need it.
 *
 * This is the contract the Phase 4 database schema must satisfy; until then
 * it is served from `course-data.ts`.
 */
export type CourseSummary = {
  slug: string;
  title: string;
  /** One or two sentences for the catalog card. */
  summary: string;
  coverSrc: string;
  coverAlt: string;
  lessonCount: number;
  estimatedMinutes: number;
  /** One-time price in cents. Zero means the whole course is free. */
  priceCents: number;
  /** True when at least one lesson is readable before purchase. */
  hasFreePreview: boolean;
  status: "draft" | "published";
  /** Ascending display order in the catalog. */
  order: number;
};

export type MembershipPlan = {
  priceCents: number;
  interval: "month" | "year";
  blurb: string;
};
```

- [ ] **Step 4: Create `lib/university/course-data.ts`**

```ts
import { siteImageSrc } from "@/content/site-images";
import type { CourseSummary, MembershipPlan } from "./course-types";

/**
 * Launch catalog. Titles mirror Carrie's existing published resources.
 *
 * Prices are launch defaults pending the owner's confirmation; from Phase 5
 * they are editable in the admin, and Phase 4 moves this data to Postgres.
 */
export const LAUNCH_COURSES: CourseSummary[] = [
  {
    slug: "refresh",
    title: "Refresh",
    summary:
      "A personal growth and empowerment course for leaders who have been pouring out for years and need to be filled again.",
    coverSrc: siteImageSrc("resource-refresh"),
    coverAlt: "Refresh — Personal Growth & Empowerment",
    lessonCount: 12,
    estimatedMinutes: 240,
    priceCents: 14900,
    hasFreePreview: true,
    status: "published",
    order: 1,
  },
  {
    slug: "resilient",
    title: "Resilient",
    summary:
      "A compassionate response to trauma — how to recognise it, respond well, and build teams that recover together.",
    coverSrc: siteImageSrc("resource-resilient"),
    coverAlt: "Resilient — A Compassionate Response to Trauma",
    lessonCount: 14,
    estimatedMinutes: 300,
    priceCents: 14900,
    hasFreePreview: true,
    status: "published",
    order: 2,
  },
  {
    slug: "rest",
    title: "Rest",
    summary:
      "Survivor stabilization and safe house practice, drawn from years of frontline care work and hard-won experience.",
    coverSrc: siteImageSrc("resource-rest"),
    coverAlt: "Rest — Survivor Stabilization & Safe House Guide",
    lessonCount: 10,
    estimatedMinutes: 210,
    priceCents: 19900,
    hasFreePreview: true,
    status: "published",
    order: 3,
  },
  {
    slug: "reimagine",
    title: "Reimagine",
    summary:
      "A guided journal course for dreams and visions, to help you name what is next and take the first honest step toward it.",
    coverSrc: siteImageSrc("resource-reimagine"),
    coverAlt: "Reimagine — A Dreams & Visions Guided Journal",
    lessonCount: 8,
    estimatedMinutes: 150,
    priceCents: 9900,
    hasFreePreview: true,
    status: "published",
    order: 4,
  },
];

/** All-access membership. Price pending confirmation, as above. */
export const MEMBERSHIP: MembershipPlan = {
  priceCents: 2900,
  interval: "month",
  blurb: "Every course, every quiz, and each new release while you are a member.",
};
```

- [ ] **Step 5: Create `lib/university/courses.ts`**

```ts
import { LAUNCH_COURSES } from "./course-data";
import type { CourseSummary } from "./course-types";

/**
 * The catalog read seam. Phase 4 replaces these bodies with Postgres queries;
 * the signatures stay the same so no caller changes.
 */
export async function getPublishedCourses(): Promise<CourseSummary[]> {
  return LAUNCH_COURSES.filter((course) => course.status === "published").sort(
    (a, b) => a.order - b.order
  );
}

export async function getCourseBySlug(slug: string): Promise<CourseSummary | null> {
  const courses = await getPublishedCourses();
  return courses.find((course) => course.slug === slug) ?? null;
}

/** Renders a cent amount as brand-style price copy. */
export function formatPrice(priceCents: number): string {
  if (priceCents === 0) return "Free";

  const dollars = priceCents / 100;
  return priceCents % 100 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every test file green, no failures.

- [ ] **Step 7: Commit**

```bash
git add lib/university tests/university
git commit -m "Add university course data seam with launch catalog.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Landing page sections

**Files:**
- Create: `content/university/landing.css`
- Create: `components/university/landing/Hero.tsx`, `Pathway.tsx`, `CourseGrid.tsx`, `QuizTeaser.tsx`, `PricingTeaser.tsx`, `ClosingCta.tsx`
- Modify: `app/(university)/university/page.tsx` (replace the placeholder)
- Modify: `app/(university)/layout.tsx` (import `landing.css`)
- Create: `tests/university/course-grid.test.tsx`, `tests/university/landing-sections.test.tsx`

**Interfaces:**
- Consumes: `WordReveal`, `headingPlainText`, `Reveal`, `MagneticCta`, `NotchFrame`, `getPublishedCourses`, `formatPrice`, `MEMBERSHIP`.
- Produces: the finished `/university` landing page.

**Section order:** hero → pathway → course grid (`#courses`) → quiz teaser → pricing teaser → closing CTA. Following the service pages, there is no separate footer; the green closing panel ends the page, exactly as `assembleServiceHtml` does.

**Sections take data as props** so they can be tested directly. Only `page.tsx` fetches.

- [ ] **Step 1: Write the failing tests**

Create `tests/university/course-grid.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseGrid } from "@/components/university/landing/CourseGrid";
import type { CourseSummary } from "@/lib/university/course-types";

const courses: CourseSummary[] = [
  {
    slug: "refresh",
    title: "Refresh",
    summary: "Be filled again.",
    coverSrc: "/media/resource-refresh",
    coverAlt: "Refresh cover",
    lessonCount: 12,
    estimatedMinutes: 240,
    priceCents: 14900,
    hasFreePreview: true,
    status: "published",
    order: 1,
  },
  {
    slug: "rest",
    title: "Rest",
    summary: "Stabilize and recover.",
    coverSrc: "/media/resource-rest",
    coverAlt: "Rest cover",
    lessonCount: 10,
    estimatedMinutes: 210,
    priceCents: 0,
    hasFreePreview: false,
    status: "published",
    order: 2,
  },
];

describe("CourseGrid", () => {
  it("renders a card per course", () => {
    const { container } = render(<CourseGrid courses={courses} />);
    expect(container.querySelectorAll(".course-card")).toHaveLength(2);
  });

  it("links each card to its course page", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByRole("link", { name: /Refresh/ })).toHaveAttribute(
      "href",
      "/university/courses/refresh"
    );
  });

  it("shows the price, lesson count and duration", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByText("$149")).toBeInTheDocument();
    expect(screen.getByText("12 lessons")).toBeInTheDocument();
    expect(screen.getByText("4h 0m")).toBeInTheDocument();
  });

  it("shows Free for a zero-price course", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("flags courses that have a free preview", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByText("Free preview")).toBeInTheDocument();
  });

  it("renders an honest empty state when there are no courses", () => {
    render(<CourseGrid courses={[]} />);
    expect(screen.getByText(/New courses are on the way/)).toBeInTheDocument();
  });
});
```

Create `tests/university/landing-sections.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClosingCta } from "@/components/university/landing/ClosingCta";
import { Hero } from "@/components/university/landing/Hero";
import { Pathway } from "@/components/university/landing/Pathway";
import { PricingTeaser } from "@/components/university/landing/PricingTeaser";
import { QuizTeaser } from "@/components/university/landing/QuizTeaser";

describe("Hero", () => {
  it("renders one readable headline for assistive technology", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Grow into the abundant life you were made for",
      })
    ).toBeInTheDocument();
  });

  it("offers both the catalog and the free quiz", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Explore the Courses" })).toHaveAttribute(
      "href",
      "/university#courses"
    );
    expect(screen.getByRole("link", { name: "Take a Free Quiz" })).toHaveAttribute(
      "href",
      "/university/quizzes"
    );
  });
});

describe("Pathway", () => {
  it("renders three numbered steps", () => {
    const { container } = render(<Pathway />);
    expect(container.querySelectorAll(".item")).toHaveLength(3);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});

describe("QuizTeaser", () => {
  it("links to the quizzes and says they are free", () => {
    render(<QuizTeaser />);
    expect(
      screen.getByRole("link", { name: "Take a Free Quiz" })
    ).toHaveAttribute("href", "/university/quizzes");
    expect(screen.getByText("Free to Take")).toHaveClass("eyebrow");
  });

  it("names the dimensions the quiz scores", () => {
    render(<QuizTeaser />);
    expect(screen.getByText("Rest")).toBeInTheDocument();
    expect(screen.getByText("Resilience")).toBeInTheDocument();
  });
});

describe("PricingTeaser", () => {
  it("shows both the per-course and the membership options", () => {
    render(
      <PricingTeaser
        lowestCoursePriceLabel="$99"
        membershipPriceLabel="$29"
        membershipInterval="month"
      />
    );
    expect(screen.getByText("Single Course")).toBeInTheDocument();
    expect(screen.getByText("All-Access Membership")).toBeInTheDocument();
    expect(screen.getByText("From $99")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("/month")).toBeInTheDocument();
  });
});

describe("ClosingCta", () => {
  it("renders the closing heading and a route back to the site", () => {
    render(<ClosingCta />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Your next season starts here/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Back to Carrie Grace" })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — none of the `components/university/landing/*` modules resolve.

- [ ] **Step 3: Create `content/university/landing.css`**

```css
/* ==================================================
   Live Abundantly University — landing page sections
================================================== */

/* ============ hero ============ */
.lau .hero{
  padding: clamp(48px, 5vw, 80px) clamp(18px, 3.5vw, 52px) clamp(70px, 8vw, 110px);
}
.lau .hero-grid{
  display:grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(36px, 5vw, 90px);
  align-items:center;
}
.lau .hero .eyebrow{
  margin-bottom:30px;
  opacity:0; transform:translateY(14px);
  transition:opacity .8s var(--ease) .1s, transform .8s var(--ease) .1s;
}
.lau .hero.in .eyebrow{ opacity:1; transform:none; }

/* ============ course grid ============ */
.lau .courses{
  padding: clamp(50px, 6vw, 90px) clamp(18px, 3.5vw, 52px);
  scroll-margin-top:100px;
}
.lau .courses .head{
  display:flex; flex-wrap:wrap; gap:20px;
  align-items:flex-end; justify-content:space-between;
  margin-bottom:clamp(34px, 4vw, 56px);
}
.lau .courses .head .sub{ max-width:44ch; }

.lau .grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));
  gap:clamp(18px, 2vw, 28px);
}

.lau .course-card{
  display:flex; flex-direction:column;
  background:var(--paper);
  border:1px solid rgba(29,74,58,.10);
  border-radius:var(--r);
  border-top-right-radius:72px;
  overflow:hidden;
  text-decoration:none;
  opacity:0; translate:0 22px;
  transition:opacity .8s var(--ease), translate .8s var(--ease),
             transform .5s var(--ease), box-shadow .5s ease,
             border-top-right-radius .6s var(--ease);
  transition-delay:calc(var(--i, 0) * 100ms), calc(var(--i, 0) * 100ms), 0s, 0s, 0s;
}
.lau .in .course-card{ opacity:1; translate:0 0; }
.lau .course-card:hover{
  transform:translateY(-6px);
  box-shadow:0 26px 44px -26px rgba(30,36,32,.28);
  border-top-right-radius:var(--r);
  transition-delay:0s;
}
.lau .course-card:focus-visible{ outline:3px solid var(--gold); outline-offset:4px; }

.lau .course-card .cover{
  position:relative;
  aspect-ratio:3 / 2;
  background:var(--sage);
  overflow:hidden;
}
.lau .course-card .cover img{
  position:absolute; inset:0;
  width:100%; height:100%; object-fit:cover;
  transition:transform .7s var(--ease);
}
.lau .course-card:hover .cover img{ transform:scale(1.05); }

.lau .course-card .flag{
  position:absolute; top:14px; left:14px;
  font-size:10.5px; font-weight:600;
  letter-spacing:.16em; text-transform:uppercase;
  color:var(--green-2);
  background:var(--gold-bg);
  border-radius:999px;
  padding:7px 14px;
}

.lau .course-card .body{
  display:flex; flex-direction:column; flex:1;
  padding:clamp(22px, 2vw, 30px);
}
.lau .course-card h3{
  font-size:22px; font-weight:600;
  letter-spacing:-.015em; color:var(--ink);
  margin-bottom:10px;
}
.lau .course-card p{ font-size:14px; line-height:1.68; margin-bottom:22px; }

.lau .course-card .meta{
  display:flex; flex-wrap:wrap; align-items:center; gap:10px;
  margin-top:auto;
  font-size:11.5px; font-weight:600;
  letter-spacing:.14em; text-transform:uppercase;
  color:var(--body);
}
.lau .course-card .meta .dot{ width:4px; height:4px; border-radius:50%; background:var(--gold); }
.lau .course-card .meta .price{
  margin-left:auto;
  font-size:15px; letter-spacing:0; text-transform:none;
  color:var(--green); font-weight:600;
}

.lau .courses .empty{
  grid-column:1 / -1;
  background:var(--sage);
  border-radius:var(--r);
  padding:clamp(40px, 5vw, 64px);
  text-align:center;
  font-size:15px; line-height:1.7;
}

/* ============ quiz teaser ============ */
.lau .quiz .panel{ border-bottom-left-radius:clamp(32px, 4vw, 56px); border-top-left-radius:clamp(70px, 9vw, 140px); }
.lau .quiz .dims{
  display:flex; flex-wrap:wrap; gap:10px;
  margin-top:26px;
}
.lau .quiz .dims span{
  font-size:11.5px; font-weight:600;
  letter-spacing:.16em; text-transform:uppercase;
  color:var(--green-2);
  background:var(--white);
  border-radius:999px;
  padding:9px 18px;
  opacity:0; translate:0 14px;
  transition:opacity .7s var(--ease), translate .7s var(--ease);
  transition-delay:calc(.3s + var(--i, 0) * 80ms);
}
.lau .quiz .in .dims span, .lau .quiz .panel.in .dims span{ opacity:1; translate:0 0; }
.lau .quiz .panel .sub{ max-width:46ch; }
.lau .quiz .actions{ margin-top:34px; }

/* ============ pricing teaser ============ */
.lau .pricing{ padding: clamp(50px, 6vw, 90px) clamp(18px, 3.5vw, 52px); }
.lau .pricing .head{ text-align:center; margin-bottom:clamp(34px, 4vw, 52px); }
.lau .pricing .head .sub{ margin:0 auto; max-width:50ch; }
.lau .plans{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));
  gap:clamp(18px, 2vw, 28px);
  max-width:900px; margin:0 auto;
}
.lau .plan{
  background:var(--paper);
  border:1px solid rgba(29,74,58,.12);
  border-radius:var(--r);
  padding:clamp(30px, 3vw, 44px);
  opacity:0; translate:0 20px;
  transition:opacity .8s var(--ease), translate .8s var(--ease), box-shadow .5s ease;
  transition-delay:calc(var(--i, 0) * 120ms);
}
.lau .in .plan{ opacity:1; translate:0 0; }
.lau .plan.featured{ background:var(--sage); border-color:rgba(29,74,58,.2); }
.lau .plan h3{
  font-size:13px; font-weight:600;
  letter-spacing:.18em; text-transform:uppercase;
  color:var(--green); margin-bottom:18px;
}
.lau .plan .amount{
  display:flex; align-items:baseline; gap:6px;
  margin-bottom:16px;
}
.lau .plan .amount strong{
  font-size:clamp(34px, 3.4vw, 46px); font-weight:600;
  letter-spacing:-.02em; color:var(--ink);
}
.lau .plan .amount span{ font-size:14px; color:var(--body); }
.lau .plan p{ font-size:14px; line-height:1.7; }
.lau .plan ul{ list-style:none; margin-top:20px; display:grid; gap:10px; }
.lau .plan li{
  display:flex; gap:10px; align-items:flex-start;
  font-size:14px; line-height:1.6;
}
.lau .plan li::before{
  content:""; flex:0 0 auto;
  width:7px; height:7px; margin-top:7px;
  border-radius:50%; background:var(--gold);
}

/* ============ responsive ============ */
@media (max-width: 980px){
  .lau .hero-grid{ grid-template-columns:1fr; }
  .lau .courses .head{ flex-direction:column; align-items:flex-start; }
}
@media (prefers-reduced-motion: reduce){
  .lau .course-card, .lau .plan, .lau .quiz .dims span{
    opacity:1 !important; transform:none !important; translate:0 0 !important;
  }
}
```

- [ ] **Step 4: Import the landing stylesheet**

In `app/(university)/layout.tsx`, add below the existing university stylesheet import:

```tsx
import "@/content/university/landing.css";
```

- [ ] **Step 5: Create `components/university/landing/Hero.tsx`**

```tsx
import type { CSSProperties } from "react";
import { MagneticCta } from "@/components/university/MagneticCta";
import { NotchFrame } from "@/components/university/NotchFrame";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";
import { siteImageSrc } from "@/content/site-images";

const HEADLINE = "Grow into the *abundant* | life you were made for";

const CHIPS = [
  "Self-Paced",
  "Guided Journals",
  "Free Assessments",
  "Certificates",
];

export function Hero() {
  return (
    <Reveal className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Live Abundantly University</p>
            <h1 aria-label={headingPlainText(HEADLINE)}>
              <WordReveal text={HEADLINE} />
            </h1>
            <p className="lede">
              Self-paced courses, guided journals and honest self-assessments from
              Carrie Grace — built for leaders who want to flourish without burning
              out.
            </p>
            <div className="chips">
              {CHIPS.map((chip, index) => (
                <span key={chip} style={{ "--i": index } as CSSProperties}>
                  {chip}
                </span>
              ))}
            </div>
            <div className="cta-row">
              <MagneticCta href="/university#courses" label="Explore the Courses" />
              <MagneticCta
                href="/university/quizzes"
                label="Take a Free Quiz"
                variant="ghost"
              />
            </div>
          </div>

          <NotchFrame
            src={siteImageSrc("hero")}
            alt="Carrie Grace leading a team session"
            tag="The University"
            priority
          />
        </div>
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 6: Create `components/university/landing/Pathway.tsx`**

```tsx
import type { CSSProperties } from "react";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "How the *journey* works";

const STEPS = [
  {
    title: "Start with an honest look",
    body: "Take a free Abundant Living assessment. It scores where you are across the areas that decide whether you flourish or fray, and it takes about ten minutes.",
  },
  {
    title: "Choose the course that fits",
    body: "Your results point to the course built for what you are carrying right now. Preview lessons before you pay, so you know the fit before you commit.",
  },
  {
    title: "Grow, and carry it forward",
    body: "Work at your own pace with video, written lessons and guided journals. Finish the course and earn a certificate you can show your board or your team.",
  },
];

export function Pathway() {
  return (
    <section className="band">
      <Reveal as="div" className="panel">
        <div className="cols">
          <div>
            <p className="eyebrow">How It Works</p>
            <h2 aria-label={headingPlainText(HEADING)}>
              <WordReveal text={HEADING} />
            </h2>
            <p className="sub">
              Three steps, at whatever pace your season allows. Nothing here asks
              you to pretend you are further along than you are.
            </p>
          </div>

          <div className="list">
            {STEPS.map((step, index) => (
              <div
                className="item"
                key={step.title}
                style={{ "--i": index } as CSSProperties}
              >
                <span className="n">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 7: Create `components/university/landing/CourseGrid.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";
import { formatPrice } from "@/lib/university/courses";
import type { CourseSummary } from "@/lib/university/course-types";

const HEADING = "The *catalog*";

/** Renders minutes as the compact duration the cards use, e.g. "4h 0m". */
function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function CourseGrid({ courses }: { courses: CourseSummary[] }) {
  return (
    <Reveal className="courses">
      <div className="wrap" id="courses">
        <div className="head">
          <div>
            <p className="eyebrow">Courses</p>
            <h2 aria-label={headingPlainText(HEADING)}>
              <WordReveal text={HEADING} />
            </h2>
          </div>
          <p className="sub">
            Every course opens with free preview lessons, so you can read the first
            chapter before deciding.
          </p>
        </div>

        <div className="grid">
          {courses.length === 0 ? (
            <p className="empty">
              New courses are on the way. Take a free quiz in the meantime and we
              will point you to the right one when it opens.
            </p>
          ) : (
            courses.map((course, index) => (
              <Link
                key={course.slug}
                href={`/university/courses/${course.slug}`}
                className="course-card"
                style={{ "--i": index } as CSSProperties}
              >
                <div className="cover">
                  <Image
                    src={course.coverSrc}
                    alt={course.coverAlt}
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                  {course.hasFreePreview ? (
                    <span className="flag">Free preview</span>
                  ) : null}
                </div>

                <div className="body">
                  <h3>{course.title}</h3>
                  <p>{course.summary}</p>
                  <div className="meta">
                    <span>{course.lessonCount} lessons</span>
                    <span className="dot" aria-hidden="true" />
                    <span>{formatDuration(course.estimatedMinutes)}</span>
                    <span className="price">{formatPrice(course.priceCents)}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 8: Create `components/university/landing/QuizTeaser.tsx`**

```tsx
import type { CSSProperties } from "react";
import { MagneticCta } from "@/components/university/MagneticCta";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "The Abundant Living *Quizzes*";

const DIMENSIONS = ["Rest", "Resilience", "Purpose", "Relationships", "Capacity"];

export function QuizTeaser() {
  return (
    <section className="band quiz">
      <Reveal as="div" className="panel">
        <div className="cols">
          <div>
            <p className="eyebrow">Free to Take</p>
            <h2 aria-label={headingPlainText(HEADING)}>
              <WordReveal text={HEADING} />
            </h2>
            <p className="sub">
              A ten-minute self-assessment that scores you across the areas that
              decide whether you flourish. You get a clear picture, written
              insights, and a course suggestion — free, with an account.
            </p>
            <div className="actions">
              <MagneticCta href="/university/quizzes" label="Take a Free Quiz" />
            </div>
          </div>

          <div>
            <div className="dims">
              {DIMENSIONS.map((dimension, index) => (
                <span key={dimension} style={{ "--i": index } as CSSProperties}>
                  {dimension}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 9: Create `components/university/landing/PricingTeaser.tsx`**

```tsx
import type { CSSProperties } from "react";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "Two ways to *begin*";

type PricingTeaserProps = {
  /** Cheapest published course, already formatted. Derived, never hardcoded. */
  lowestCoursePriceLabel: string;
  membershipPriceLabel: string;
  membershipInterval: "month" | "year";
};

export function PricingTeaser({
  lowestCoursePriceLabel,
  membershipPriceLabel,
  membershipInterval,
}: PricingTeaserProps) {
  return (
    <Reveal className="pricing">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">Pricing</p>
          <h2 aria-label={headingPlainText(HEADING)}>
            <WordReveal text={HEADING} />
          </h2>
          <p className="sub">
            Buy the one course you need, or take the whole shelf. Either way, the
            quizzes and preview lessons stay free.
          </p>
        </div>

        <div className="plans">
          <div className="plan" style={{ "--i": 0 } as CSSProperties}>
            <h3>Single Course</h3>
            <div className="amount">
              <strong>From {lowestCoursePriceLabel}</strong>
            </div>
            <p>Paid once. Yours for good, including every future update.</p>
            <ul>
              <li>Lifetime access to that course</li>
              <li>Guided journals and downloads</li>
              <li>Certificate on completion</li>
            </ul>
          </div>

          <div className="plan featured" style={{ "--i": 1 } as CSSProperties}>
            <h3>All-Access Membership</h3>
            <div className="amount">
              <strong>{membershipPriceLabel}</strong>
              <span>/{membershipInterval}</span>
            </div>
            <p>Every course and every quiz, for as long as you are a member.</p>
            <ul>
              <li>All courses, unlocked</li>
              <li>New releases as they land</li>
              <li>Cancel any time</li>
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
```

- [ ] **Step 10: Create `components/university/landing/ClosingCta.tsx`**

```tsx
import Link from "next/link";
import { MagneticCta } from "@/components/university/MagneticCta";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "Your next season starts *here*";

export function ClosingCta() {
  return (
    <section className="close">
      <Reveal as="div" className="panel">
        <span className="whisper" aria-hidden="true">
          begin
        </span>
        <h2 aria-label={headingPlainText(HEADING)}>
          <WordReveal text={HEADING} />
        </h2>
        <p className="sub">
          Start with a free assessment. It costs nothing, it takes ten minutes, and
          it will tell you honestly where to begin.
        </p>
        <MagneticCta href="/university/quizzes" label="Take a Free Quiz" />
        <Link className="also" href="/">
          ← Back to Carrie Grace
        </Link>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 11: Replace `app/(university)/university/page.tsx`**

The page is an async server component: it fetches, and the sections render.

```tsx
import type { Metadata } from "next";
import { ClosingCta } from "@/components/university/landing/ClosingCta";
import { CourseGrid } from "@/components/university/landing/CourseGrid";
import { Hero } from "@/components/university/landing/Hero";
import { Pathway } from "@/components/university/landing/Pathway";
import { PricingTeaser } from "@/components/university/landing/PricingTeaser";
import { QuizTeaser } from "@/components/university/landing/QuizTeaser";
import { MEMBERSHIP } from "@/lib/university/course-data";
import { formatPrice, getPublishedCourses } from "@/lib/university/courses";

export const metadata: Metadata = {
  title: "Live Abundantly University",
  description:
    "Self-paced courses, guided journals and free self-assessments from Carrie Grace, for leaders who want to flourish without burning out.",
};

export default async function UniversityLandingPage() {
  const courses = await getPublishedCourses();

  const paidPrices = courses
    .map((course) => course.priceCents)
    .filter((cents) => cents > 0);
  const lowestCoursePriceLabel = formatPrice(
    paidPrices.length > 0 ? Math.min(...paidPrices) : 0
  );

  return (
    <main className="lau">
      <Hero />
      <Pathway />
      <CourseGrid courses={courses} />
      <QuizTeaser />
      <PricingTeaser
        lowestCoursePriceLabel={lowestCoursePriceLabel}
        membershipPriceLabel={formatPrice(MEMBERSHIP.priceCents)}
        membershipInterval={MEMBERSHIP.interval}
      />
      <ClosingCta />
    </main>
  );
}
```

- [ ] **Step 12: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — every test file green, no failures.

- [ ] **Step 13: Commit**

```bash
git add content/university components/university "app/(university)" tests/university
git commit -m "Add Live Abundantly University landing page.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Verification and regression check

**Files:**
- Create: `tests/university/existing-pages.test.ts`
- Modify: none expected. Fix anything the checks surface.

**Interfaces:**
- Consumes: everything above.
- Produces: evidence the branch is ready for review.

- [ ] **Step 1: Write the regression test for the untouched pages**

The one intended change to existing output is the University nav item. This test pins the rest.

Create `tests/university/existing-pages.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assembleAboutHtml } from "@/content/assemble-about-html";
import { assembleContactHtml } from "@/content/assemble-contact-html";
import { assembleHomeHtml } from "@/content/assemble-home-html";
import { assembleZeroTurnoverHtml } from "@/content/assemble-zero-turnover-html";
import { assembleServiceHtml } from "@/content/assemble-service-html";
import { getAllServiceSlugs, getServiceBySlug } from "@/content/services";

describe("existing marketing pages", () => {
  it("still assemble complete documents", () => {
    const pages = [
      assembleHomeHtml(),
      assembleAboutHtml(),
      assembleContactHtml(),
      assembleZeroTurnoverHtml(),
    ];

    for (const html of pages) {
      expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
      expect(html).toContain("</html>");
      expect(html).toContain('href="/university"');
    }
  });

  it("still assemble every service page", () => {
    const slugs = getAllServiceSlugs();
    expect(slugs.length).toBeGreaterThan(0);

    for (const slug of slugs) {
      const service = getServiceBySlug(slug);
      expect(service).toBeDefined();

      const html = assembleServiceHtml(service!);
      expect(html).toContain(service!.pageTitle);
      expect(html).toContain('href="/university"');
    }
  });
});
```

The home page carries the link via `colabs-home-body.html`; every other page carries it via `assembleHeader`.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS — all files, no failures. Paste the summary line into the task notes.

- [ ] **Step 3: Run the linter**

Run: `npm run lint`
Expected: no errors. Fix any that appear rather than disabling rules, except the documented `no-img-element` case in the header.

- [ ] **Step 4: Run a production build**

Run: `npm run build`
Expected: succeeds. Confirm `/university` appears in the route list and that the existing routes are still listed.

- [ ] **Step 5: Check the page in a browser**

Run `npm run dev`, then at desktop width (1440) and mobile width (390) confirm each of these on `http://localhost:3000/university`:

1. The header matches the other pages, and "University" is the active item.
2. The hero headline reveals word by word, and the Pinyon Script accent is on "abundant".
3. Scrolling reveals each section once, and the course cards stagger in.
4. The primary CTA leans toward the cursor on desktop and returns to rest.
5. Course covers load through `/media/...` and the cards link to `/university/courses/<slug>`.
6. The closing panel is brand green with the gold script whisper behind it.
7. At 390 wide there is no horizontal scroll, and the mobile menu opens, closes on link tap, and closes on Escape.
8. With reduced motion enabled in the OS, all content is visible and nothing animates.

- [ ] **Step 6: Check the existing pages did not regress**

Visit `/`, `/about`, `/contact`, `/zero-turnover` and `/services/executive-consulting`. Confirm each looks exactly as it does on `main`, except for the new "University" item in the nav.

To compare precisely:

```bash
git stash list && git diff main --stat -- content/ app/
```

Expected: the only changed existing files are `content/assemble-header.ts` and `content/colabs-home-body.html`.

- [ ] **Step 7: Push the branch and open a preview deployment**

```bash
git push -u origin feature/live-abundantly-university
```

Expected: Vercel builds a preview. Open the preview URL and repeat Step 5's checks there.

- [ ] **Step 8: Commit any fixes**

```bash
git add -A
git commit -m "Verify university landing page and guard existing page output.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## What comes next

This plan covers spec Phases 1–2. The remaining phases each get their own plan, written after the preceding one is reviewed:

3. Clerk auth and sign-up — fills `authSlot`, adds `proxy.ts` scoped to `/university`
4. Neon and the data layer — replaces `lib/university/course-data.ts` behind the unchanged `courses.ts` signatures
5. Admin (courses, lessons, quizzes)
6. Dashboard and course player
7. Quizzes (self-assessments)
8. Stripe and access gating
9. Certificates
10. QA, PR, merge and deploy

**Confirm before Phase 8:** course titles and prices, and the membership price and interval, currently defaulted in `lib/university/course-data.ts`.
