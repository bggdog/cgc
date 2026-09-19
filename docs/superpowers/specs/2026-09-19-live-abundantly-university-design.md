# Live Abundantly University — Design

Date: 2026-09-19
Branch: `feature/live-abundantly-university`
Status: Approved in conversation; awaiting written-spec review.

## Goal

Add a learning platform, **Live Abundantly University**, to the Carrie Grace Consulting site. Visitors can browse courses, sign up with Google, take free self-assessment quizzes, study free preview lessons, and pay for full courses (one-time per course) or an all-access membership. Completing a course issues a verifiable PDF certificate. The quality, branding, typography and motion must match the existing site.

## Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Access model | Free tier + paid courses |
| Paid model | Both: per-course one-time purchase **and** all-access membership subscription |
| Free tier | Sign-in unlocks all quizzes and lessons flagged "free preview" |
| Authoring | Admin dashboard (Carrie edits content herself); course data lives in the database |
| Quizzes | Self-assessments scored across life dimensions, with insights and course suggestions. No per-lesson knowledge checks in v1 |
| Video | Pasted embed links (YouTube / Vimeo / Loom). No upload pipeline |
| Auth | Google sign-in only, via Clerk |
| URL structure | `/university/*` on the existing domain |

## Context: the existing site

- Next.js 16.2.9, React 19, App Router. No other runtime dependencies. Next 16 renamed `middleware.ts` to `proxy.ts`; follow `node_modules/next/dist/docs/` before writing framework code (per `AGENTS.md`).
- Every current page (`app/route.ts`, `app/about/route.ts`, `app/contact/route.ts`, `app/zero-turnover/route.ts`, `app/services/[slug]/route.ts`) is a route handler returning a full HTML string assembled in `content/assemble-*.ts` with scoped CSS/JS from `content/*/`. `app/layout.tsx` is bare.
- Brand tokens (from `content/services/service-styles.css`): Poppins (body) and Pinyon Script (accent); `--green #1d4a3a`, `--green-2 #163c2f`, `--gold #d3aa6e`, `--gold-bg #f5ead7`, `--sage #eef2ee`, `--rose #dfb1a8`, `--ink #1e2420`, `--body #626b66`, `--paper #fdfcf9`; `--r: 34px`, `--notch: 24px`, `--ease: cubic-bezier(.22,1,.36,1)`.
- Signature motion: word-by-word headline reveal, IntersectionObserver section reveals, staggered chips, magnetic pill CTA with a gold ring, notched image frames. All respect `prefers-reduced-motion`.
- Shared header: `content/assemble-header.ts` (HTML string + CSS + JS).

## Approach

A React route group inside this app (`app/(university)/university/...`), sharing the domain, header and brand tokens. Rejected: a separate Vercel project on a subdomain (duplicates brand code, two deploys) and extending the HTML-string pattern (unsuitable for auth, forms, state and admin UI).

## 1. Architecture

**Isolation.** Existing pages are not modified except for one header change (below). `proxy.ts` matches only `/university/*`, `/sign-in`, `/sign-up`, and API routes. The current pages never pass through Clerk.

**Brand system.** Tokens move into one shared `university.css` (CSS variables above). Poppins and Pinyon Script load via `next/font`. Existing CSS files are left as-is (no refactor of current pages).

**Animation primitives (React).** Ports of the vanilla behavior in `content/services/service-script.js`:
- `<WordReveal>`: headline word reveal.
- `<Reveal>`: IntersectionObserver scroll reveal.
- `<MagneticCTA>`: clamped magnetic pill button with gold ring.
All honor `prefers-reduced-motion`.

**Header.** The shared subpage header gains a "University" link (in `content/assemble-header.ts`, used by About, Contact, Zero Turnover and services). The home page uses its own header inside the Colabs export (`content/colabs-home-body.html`); Phase 1 inspects it and adds the same link with a minimal, targeted edit. University pages use a React header that matches its markup and styles, and shows sign-in / avatar state.

**Routes.**
- Public: `/university` (landing), `/university/courses/[slug]` (overview and pricing), `/university/verify/[id]` (certificate verification).
- Signed in: `/university/dashboard`, `/university/learn/[course]/[lesson]`, `/university/quizzes`, `/university/quizzes/[slug]`, `/university/certificates`.
- Admin (role-gated): `/university/admin/*`.
- Auth: `/sign-in`, `/sign-up` (Clerk, styled to brand).
- API: `/api/webhooks/stripe`, `/api/webhooks/clerk`, `/api/certificates/[id]/pdf`.

## 2. Data, access, payments

**Database:** Neon Postgres via the Vercel Marketplace; Drizzle ORM for typed queries and migrations.

**Tables.**
- `users` (id, clerk_id, email, name, role)
- `courses` (slug, title, summary, cover image, price_cents, stripe_product_id, stripe_price_id, status draft/published)
- `modules`, `lessons` (ordered; lesson: title, video embed URL, markdown body, downloads, `is_preview`, `is_required`)
- `enrollments`, `lesson_progress` (user, lesson, completed_at, time spent)
- `quizzes`, `quiz_dimensions`, `quiz_questions`, `quiz_insights`, `quiz_attempts`
- `certificates` (id, user, course, recipient_name, issued_at)
- `purchases` (user, course, stripe_session_id, amount) and `memberships` (user, stripe_subscription_id, status, current_period_end)

**Access rule.** One server-side function, `canAccess(user, lesson)`, is the sole authority:
- Preview lessons and all quizzes: any signed-in user.
- Other lessons: user has a `purchases` row for the course, or an active `memberships` row.
- Admin: everything.
It is enforced in server components and route handlers. Client checks are for UX only.

**Stripe.**
- Checkout (payment mode) for course purchases; Checkout (subscription mode) for the membership; Customer Portal for managing or cancelling it.
- A signature-verified webhook is the source of truth: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Handlers are idempotent.
- The admin course form creates/updates the Stripe product and price.
- Preview deployments use Stripe test mode; Production uses live keys.

**Auth.** Clerk, Google OAuth only. A Clerk webhook syncs users into `users`. Admin is a Clerk role (initially the site owner and Carrie).

## 3. Learning features

**Course player.** Modules and lessons; video embed, markdown text, downloads; per-lesson mark-complete; next/previous; progress bar; locked-lesson state that leads to purchase.

**Dashboard.** Catalog with progress rings, "continue where you left off", stats (lessons completed, streak, time spent, quiz history), certificates earned.

**Quizzes (self-assessments).**
- A quiz has dimensions; each question is a 1–5 scale tied to one dimension.
- Scoring: normalized score per dimension, plus overall.
- Results page: radar chart, per-dimension insight text chosen by score band (low / mid / high, authored in admin), suggested courses per insight.
- Attempts are stored; retakes show score history over time.

**Certificates.**
- Eligible when all `is_required` lessons in a course are complete.
- Unique ID and public `/university/verify/[id]` page (name, course, date, validity).
- PDF rendered server-side with `@react-pdf/renderer`, using Poppins, Pinyon Script and the brand palette. Recipient name defaults to the user's profile name and can be corrected before issuing.

**Admin.**
- Course / module / lesson editor with reordering and draft/published.
- Quiz builder: dimensions, questions, insight bands, suggested courses.
- Student and enrollment list.

## 4. Error handling

- Webhooks: verify signatures, reject invalid ones, dedupe by event ID, return 2xx only after the DB write succeeds.
- Access failures render a branded locked/upgrade state, not a raw error.
- Route-level `error.tsx` and `not-found.tsx` styled to the brand.
- Form input validated server-side (zod) in addition to client hints.
- Missing env vars fail fast at boot with a clear message.

## 5. Testing and verification

- Unit tests (Vitest) for pure logic: `canAccess`, quiz scoring and band selection, progress and certificate eligibility.
- Stripe verified in test mode with webhook forwarding (Stripe CLI locally, test-mode keys on preview).
- Visual checks in the browser at desktop and mobile widths against the existing pages for parity of spacing, type, and motion.
- Regression check: existing routes (`/`, `/about`, `/contact`, `/zero-turnover`, `/services/*`) return the same HTML as on `main`, apart from the added header link.
- `npm run lint` and `npm run build` pass before merge.

## 6. Delivery

- All work on `feature/live-abundantly-university`; Vercel preview deployments for review.
- PR to `main` after sign-off; merge; Vercel deploys production.
- Account-dependent steps (installing Clerk, Neon and Stripe through the Vercel Marketplace; Stripe live keys and webhook endpoint; Clerk Google OAuth production credentials) require the owner's Vercel/Stripe/Google accounts. Work pauses at those points for the owner to complete the dashboard step. Secrets are never pasted into the repo or the chat.

## Phases

Each phase is committed separately, and each gets its own detailed plan before implementation.

1. Branch, foundation and brand system
2. Landing page
3. Clerk auth and sign-up
4. Neon and the data layer
5. Admin (courses, lessons, quizzes)
6. Dashboard and course player
7. Quizzes (self-assessments)
8. Stripe (per-course and membership) and access gating
9. Certificates
10. QA, PR, merge and deploy

## Out of scope for v1

Video uploads/hosting, per-lesson knowledge checks, email/password login, discussion or community features, coupons and refunds UI (handled in the Stripe dashboard), multi-language, native apps.

## Open items to resolve during planning (not blockers)

- Course names, prices and membership price/interval (placeholder data used until provided).
- Whether the four existing programs (Reimagine, Resilient, Rest, Refresh) are the launch courses.
- Certificate wording and signature block.
