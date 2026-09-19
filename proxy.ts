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

/**
 * Next.js 16 `proxy.ts` (formerly middleware). Clerk is loaded only when keys
 * exist, so local/dev without Marketplace provisioning stays a no-op and
 * avoids pulling Clerk into every Turbopack/webpack proxy compile.
 */
export default async function proxy(request: NextRequest, event: unknown) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );

  const isProtectedRoute = createRouteMatcher([
    "/university/dashboard(.*)",
    "/university/learn(.*)",
    "/university/quizzes(.*)",
    "/university/certificates(.*)",
    "/university/admin(.*)",
  ]);

  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  })(request, event as never);
}

export const config = {
  matcher: ["/university/:path*", "/sign-in(.*)", "/sign-up(.*)"],
};
