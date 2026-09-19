"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
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
  const [motionReady, setMotionReady] = useState(false);

  // Opt into entrance CSS only after mount so SSR / first paint stay solid,
  // and stylesheet HMR doesn't re-hide already-visible content.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMotionReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`lau-shell ${poppins.variable} ${pinyonScript.variable}${
        motionReady ? " lau-motion" : ""
      }`}
    >
      <UniversityHeader
        currentPath={pathname}
        authSlot={clerkConfigured ? <UniversityAuthControls /> : undefined}
      />
      {children}
    </div>
  );
}
