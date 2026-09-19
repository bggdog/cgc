import type { Metadata } from "next";
import type { ReactNode } from "react";
import { UniversityShell } from "./shell";

import "@/content/header/header-styles.css";
import "@/content/university/university.css";
import "@/content/university/landing.css";

export const metadata: Metadata = {
  title: {
    default: "Live Abundantly University",
    template: "%s · Live Abundantly University",
  },
  description:
    "Self-paced courses, guided journals and honest self-assessments from Carrie Grace, for leaders who want to flourish without burning out.",
};

export default function UniversityLayout({ children }: { children: ReactNode }) {
  return <UniversityShell>{children}</UniversityShell>;
}
