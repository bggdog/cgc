"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

/**
 * Wraps university/auth trees in ClerkProvider when keys are configured.
 * Root layout stays bare so assembled HTML pages never load Clerk.
 */
export function ClerkProviderTree({
  children,
  configured,
}: {
  children: ReactNode;
  configured: boolean;
}) {
  if (!configured) return <>{children}</>;
  return (
    <ClerkProvider afterSignOutUrl="/university">{children}</ClerkProvider>
  );
}
