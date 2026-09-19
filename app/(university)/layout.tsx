import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProviderTree } from "@/components/university/ClerkProviderTree";
import { isClerkConfigured } from "@/lib/university/clerk";
import { UniversityShell } from "./shell";

import "@/content/header/header-styles.css";
import "@/content/university/university.css";
import "@/content/university/landing.css";
import "@/content/university/auth.css";

export const metadata: Metadata = {
  title: {
    default: "Live Abundantly University",
    template: "%s · Live Abundantly University",
  },
  description:
    "Self-paced courses, guided journals and honest self-assessments from Carrie Grace, for leaders who want to flourish without burning out.",
};

export default function UniversityLayout({ children }: { children: ReactNode }) {
  const clerkConfigured = isClerkConfigured();

  return (
    <ClerkProviderTree configured={clerkConfigured}>
      <UniversityShell clerkConfigured={clerkConfigured}>{children}</UniversityShell>
    </ClerkProviderTree>
  );
}
