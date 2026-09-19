"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { UniversityAuthControls } from "@/components/university/UniversityAuthControls";
import { UniversityHeader } from "@/components/university/UniversityHeader";
import { pinyonScript, poppins } from "@/lib/university/fonts";

export function UniversityShell({
  children,
  clerkConfigured = false,
}: {
  children: ReactNode;
  clerkConfigured?: boolean;
}) {
  const pathname = usePathname() ?? "/university";

  return (
    <div className={`lau-shell ${poppins.variable} ${pinyonScript.variable}`}>
      <UniversityHeader
        currentPath={pathname}
        authSlot={clerkConfigured ? <UniversityAuthControls /> : undefined}
      />
      {children}
    </div>
  );
}
