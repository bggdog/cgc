# Live Abundantly University — Phase 3: Clerk Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire Google sign-in via Clerk for Live Abundantly University: branded `/sign-in` and `/sign-up`, header account controls in `authSlot`, and a scoped `proxy.ts` so existing HTML marketing pages never pass through Clerk.

**Architecture:** Clerk lives only under the React university/auth surfaces. `ClerkProvider` wraps `(university)` and `(auth)` layouts — not the bare root layout that serves assembled HTML. `proxy.ts` (Next.js 16; not `middleware.ts`) matches only `/university/*`, `/sign-in`, and `/sign-up`. When Clerk env keys are missing, proxy and UI degrade gracefully so `npm run build` still passes until the owner provisions Clerk via the Vercel Marketplace.

**Tech Stack:** Next.js 16.2.9 App Router, React 19, `@clerk/nextjs` (latest), Vitest + Testing Library, plain CSS under `.lau-shell`.

**Spec:** `docs/superpowers/specs/2026-09-19-live-abundantly-university-design.md` (Phase 3).

## Global Constraints

- **Read bundled Next docs first.** Per `AGENTS.md`: use `proxy.ts`, not `middleware.ts`. See `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- **Do not change existing page HTML** except for unrelated already-committed nav work. Regression: `tests/university/existing-pages.test.ts` must still pass.
- **Isolation.** Existing routes (`/`, `/about`, `/contact`, `/zero-turnover`, `/services/*`) must not run Clerk proxy logic and must not load `ClerkProvider`.
- **Google only.** Email/password is out of scope for v1; configure Google in the Clerk dashboard (owner step). App routes assume OAuth sign-in UX.
- **Brand.** Sign-in/up pages use Poppins / Pinyon Script, `--green`, `--gold`, `--paper` from `content/university/university.css`.
- **Owner pause.** Installing Clerk on Vercel and enabling Google OAuth requires the owner's accounts. Ship code + `.env.example`; document the pause. Never commit real secrets.
- **TypeScript strict.** No `any`. No `@ts-ignore`.
- **Commit after every task.**

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `lib/university/clerk.ts` | `isClerkConfigured()` — true when publishable + secret keys are set |
| `components/university/UniversityAuthControls.tsx` | Client: SignedIn/SignedOut + SignInButton + UserButton for `authSlot` |
| `components/university/ClerkProviderTree.tsx` | Client wrapper around `ClerkProvider` (or passthrough when unconfigured) |
| `app/(auth)/layout.tsx` | Auth pages shell: fonts, CSS, Clerk provider, minimal chrome |
| `app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Branded Clerk `<SignIn />` |
| `app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Branded Clerk `<SignUp />` |
| `content/university/auth.css` | Sign-in/up layout + auth control styles |
| `proxy.ts` | Scoped `clerkMiddleware` (or no-op when unconfigured) |
| `.env.example` | Documents required Clerk + routing env vars |
| `tests/university/clerk-config.test.ts` | Unit tests for `isClerkConfigured` |
| `tests/university/auth-controls.test.tsx` | Renders signed-out CTA / slot wiring without live Clerk |

**Modified:**

| File | Change |
|---|---|
| `package.json` | Add `@clerk/nextjs` |
| `app/(university)/layout.tsx` | Wrap children in `ClerkProviderTree` |
| `app/(university)/shell.tsx` | Pass `<UniversityAuthControls />` into `authSlot` when configured |
| `content/university/university.css` | Keep existing `.Menu_Auth__lau` slot; auth specifics live in `auth.css` |
| `app/(university)/layout.tsx` | Import `auth.css` |

---

### Task 1: Clerk package + config helper

**Files:**
- Modify: `package.json`
- Create: `lib/university/clerk.ts`
- Create: `tests/university/clerk-config.test.ts`
- Create: `.env.example`

- [ ] **Step 1: Write the failing test**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { isClerkConfigured } from "@/lib/university/clerk";

describe("isClerkConfigured", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is false when either key is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_x");
    expect(isClerkConfigured()).toBe(false);
  });

  it("is true when both keys are non-empty", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_x");
    expect(isClerkConfigured()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (module missing)**

Run: `npm test -- tests/university/clerk-config.test.ts`

- [ ] **Step 3: Implement helper + install + env example**

```bash
npm install @clerk/nextjs
```

```ts
/** True when Clerk can run (keys present). Used to no-op proxy/UI before Marketplace install. */
export function isClerkConfigured(): boolean {
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? "";
  const secret = process.env.CLERK_SECRET_KEY?.trim() ?? "";
  return publishable.length > 0 && secret.length > 0;
}
```

`.env.example`:

```env
# Clerk — provision via `vercel integration add clerk` (or Clerk dashboard).
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/university
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/university
```

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json lib/university/clerk.ts tests/university/clerk-config.test.ts .env.example
git commit -m "Add Clerk dependency and isClerkConfigured helper."
```

---

### Task 2: Scoped `proxy.ts`

**Files:**
- Create: `proxy.ts`
- Create: `tests/university/proxy-matcher.test.ts` (export matcher list for assertion)

**Behavior:**
- Matcher covers `/university/:path*`, `/sign-in(.*)`, `/sign-up(.*)` only.
- When `isClerkConfigured()` is false, export a no-op `proxy` that returns `NextResponse.next()`.
- When configured, use `clerkMiddleware`. Do **not** call `auth.protect()` on public marketing routes (`/university` landing). Protect only future signed-in surfaces that exist later: `/university/dashboard(.*)`, `/university/learn(.*)`, `/university/quizzes(.*)`, `/university/certificates(.*)`, `/university/admin(.*)`.

- [ ] **Step 1: Implement `proxy.ts`**

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/university/clerk";

export const CLERK_PROXY_MATCHERS = [
  "/university/:path*",
  "/sign-in(.*)",
  "/sign-up(.*)",
] as const;

const isProtectedRoute = createRouteMatcher([
  "/university/dashboard(.*)",
  "/university/learn(.*)",
  "/university/quizzes(.*)",
  "/university/certificates(.*)",
  "/university/admin(.*)",
]);

const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default function proxy(
  ...args: Parameters<typeof clerkProxy>
): ReturnType<typeof clerkProxy> | NextResponse {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }
  return clerkProxy(...args);
}

export const config = {
  matcher: [...CLERK_PROXY_MATCHERS],
};
```

Note: Adjust the default-export typing if TypeScript complains about `clerkMiddleware` return type — prefer wrapping:

```ts
export default isClerkConfigured()
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) await auth.protect();
    })
  : function proxy(_req: NextRequest) {
      return NextResponse.next();
    };
```

Eval `isClerkConfigured()` at request time inside the handler if build-time env is empty but runtime has keys (Vercel).

Preferred final form:

```ts
export default function proxy(req: NextRequest, event: unknown) {
  if (!isClerkConfigured()) return NextResponse.next();
  return clerkMiddleware(async (auth, request) => {
    if (isProtectedRoute(request)) await auth.protect();
  })(req, event as never);
}
```

- [ ] **Step 2: Test matcher export**

```ts
import { describe, expect, it } from "vitest";
import { CLERK_PROXY_MATCHERS } from "../../proxy";

describe("CLERK_PROXY_MATCHERS", () => {
  it("scopes Clerk to university and auth routes only", () => {
    expect(CLERK_PROXY_MATCHERS).toEqual([
      "/university/:path*",
      "/sign-in(.*)",
      "/sign-up(.*)",
    ]);
  });
});
```

- [ ] **Step 3: `npm test` + `npm run build` (without keys) must pass**

- [ ] **Step 4: Commit**

```bash
git add proxy.ts tests/university/proxy-matcher.test.ts
git commit -m "Add scoped Clerk proxy for university and auth routes."
```

---

### Task 3: Auth controls + provider tree

**Files:**
- Create: `components/university/ClerkProviderTree.tsx`
- Create: `components/university/UniversityAuthControls.tsx`
- Create: `content/university/auth.css`
- Create: `tests/university/auth-controls.test.tsx`
- Modify: `app/(university)/layout.tsx`, `app/(university)/shell.tsx`

- [ ] **Step 1: Provider tree**

```tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export function ClerkProviderTree({
  children,
  configured,
}: {
  children: ReactNode;
  configured: boolean;
}) {
  if (!configured) return children;
  return <ClerkProvider>{children}</ClerkProvider>;
}
```

- [ ] **Step 2: Auth controls**

```tsx
"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function UniversityAuthControls() {
  return (
    <div className="lau-auth" data-testid="auth">
      <SignedOut>
        <SignInButton mode="redirect">
          <button type="button" className="lau-auth-signin">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/university"
          appearance={{
            elements: {
              avatarBox: "lau-auth-avatar",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
```

When Clerk is unconfigured, shell passes no `authSlot` (same as Phase 2).

- [ ] **Step 3: Wire layout + shell**

`layout.tsx`: import auth.css; wrap with `<ClerkProviderTree configured={isClerkConfigured()}>`.

`shell.tsx`: `authSlot={isClerkConfigured() ? <UniversityAuthControls /> : undefined}` — but `isClerkConfigured` uses server env; for client shell, pass a `clerkConfigured` boolean prop from the server layout into shell.

```tsx
// layout.tsx (server)
const configured = isClerkConfigured();
return (
  <ClerkProviderTree configured={configured}>
    <UniversityShell clerkConfigured={configured}>{children}</UniversityShell>
  </ClerkProviderTree>
);
```

- [ ] **Step 4: Styles in `auth.css`** for `.lau-auth-signin` (green pill, gold focus ring), auth page centering.

- [ ] **Step 5: Tests** — mock `@clerk/nextjs` SignedOut to always render children; assert Sign in button label when controls mounted.

- [ ] **Step 6: Commit**

```bash
git commit -m "Wire Clerk provider and university header auth controls."
```

---

### Task 4: Branded sign-in and sign-up pages

**Files:**
- Create: `app/(auth)/layout.tsx`
- Create: `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- Create: `app/(auth)/sign-up/[[...sign-up]]/page.tsx`

- [ ] **Step 1: Auth layout** — same fonts/CSS as university; `ClerkProviderTree`; simple header link back to `/university`.

- [ ] **Step 2: Pages**

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="lau-auth-page">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#1d4a3a",
            colorText: "#1e2420",
            borderRadius: "34px",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/university"
      />
    </main>
  );
}
```

Mirror for SignUp with `signInUrl="/sign-in"`.

When unconfigured, render a branded message: “Sign-in is being connected. Check back soon.” instead of Clerk components (so build/preview without keys still works).

- [ ] **Step 3: Commit**

```bash
git commit -m "Add branded Clerk sign-in and sign-up pages."
```

---

### Task 5: Verify + owner pause notes

- [ ] **Step 1: Run** `npm test`, `npm run lint`, `npm run build`
- [ ] **Step 2: Confirm** `existing-pages.test.ts` still passes
- [ ] **Step 3: Append owner checklist** to the end of this plan file (already below) — do not block the PR of code on Marketplace install
- [ ] **Step 4: Final commit if any fixups**

## Owner checklist (pause — not agent work)

1. `vercel integration add clerk` (or connect Clerk in the Vercel dashboard) for the `cgc` project.
2. Confirm env vars on Preview + Production: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, sign-in/up URLs above.
3. In Clerk dashboard: enable **Google** only; disable email/password if offered for this instance.
4. Add allowed origins / redirect URLs for local (`http://localhost:3000`) and production (`https://www.carriegraceconsulting.co`).
5. Smoke-test: Sign in from `/university` → Google → land on `/university` with UserButton visible.

## Spec coverage (Phase 3 only)

| Spec item | Task |
|---|---|
| Google via Clerk | Owner checklist + SignIn/SignUp |
| `/sign-in`, `/sign-up` | Task 4 |
| Header sign-in / avatar | Task 3 (`authSlot`) |
| `proxy.ts` scoped so HTML pages skip Clerk | Task 2 |
| Isolation from assembled HTML pages | Tasks 2–3 (no root ClerkProvider) |

## Out of scope this phase

Neon/users sync webhook, admin roles, protecting quiz/learn routes that do not exist yet (matchers reserved), Stripe, certificates.
