/**
 * True when Clerk can run (both keys present).
 * Used to no-op proxy/UI until the owner provisions Clerk via the Vercel Marketplace.
 */
export function isClerkConfigured(): boolean {
  const publishable =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? "";
  const secret = process.env.CLERK_SECRET_KEY?.trim() ?? "";
  return publishable.length > 0 && secret.length > 0;
}
