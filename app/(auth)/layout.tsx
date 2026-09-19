import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ClerkProviderTree } from "@/components/university/ClerkProviderTree";
import { isClerkConfigured } from "@/lib/university/clerk";
import { pinyonScript, poppins } from "@/lib/university/fonts";

import "@/content/university/university.css";
import "@/content/university/auth.css";

export const metadata: Metadata = {
  title: {
    default: "Account",
    template: "%s · Live Abundantly University",
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const configured = isClerkConfigured();

  return (
    <ClerkProviderTree configured={configured}>
      <div
        className={`lau-shell lau-auth-shell ${poppins.variable} ${pinyonScript.variable}`}
      >
        <div className="lau-auth-shell-bar">
          <Link href="/university">Live Abundantly University</Link>
          <Link href="/">Carrie Grace</Link>
        </div>
        {children}
      </div>
    </ClerkProviderTree>
  );
}
