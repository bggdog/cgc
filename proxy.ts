import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isClerkConfigured } from "@/lib/university/clerk";

/**
 * Paths where Clerk proxy runs. Existing HTML marketing pages are excluded.
 * Keep in sync with `config.matcher` below (Next requires a static matcher).
 */
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

/**
 * Next.js 16 `proxy.ts` (formerly middleware). Runs Clerk only on university
 * and auth routes. When keys are missing, passes through so builds work before
 * Marketplace provisioning.
 */
export default function proxy(request: NextRequest, event: unknown) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  })(request, event as never);
}

export const config = {
  matcher: ["/university/:path*", "/sign-in(.*)", "/sign-up(.*)"],
};
