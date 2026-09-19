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
