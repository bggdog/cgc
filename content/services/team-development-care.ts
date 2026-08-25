import type { ServicePageContent } from "./types";

export const teamDevelopmentCare: ServicePageContent = {
  slug: "team-development-care",
  pageTitle: "Team Development & Care — Carrie Grace",
  crumbName: "Team Development & Care",
  titleWords: [
    { text: "Team Development", breakAfter: true },
    { text: "& Care" },
  ],
  titleAriaLabel: "Team Development & Care",
  lede: "Equip your managers and staff with the tools for healthy team dynamics, conflict resolution, and a culture of genuine care that reduces attrition.",
  chips: ["For Managers & Staff", "Culture Focused", "Retention Driven"],
  frameTag: "Team Development",
  bandHeadingBefore: "Care that",
  bandHeadingScript: "keeps",
  bandHeadingAfter: "people",
  bandSub:
    "Teams thrive when care is structured — not left to chance. These are the pillars most team development engagements build from.",
  includes: [
    {
      title: "Healthy Team Dynamics",
      body: "Practical frameworks for communication, feedback, and collaboration that help teams work with honesty and trust.",
    },
    {
      title: "Conflict Resolution Skills",
      body: "Tools for naming tension early and working through it — before small issues become culture-breaking patterns.",
    },
    {
      title: "Manager Coaching & Support",
      body: "Equipping the leaders closest to your staff with the skills to care well without burning themselves out.",
    },
    {
      title: "Culture of Retention",
      body: "Everyday rhythms and practices that make people feel valued, supported, and willing to stay.",
    },
  ],
  wideTag: "In the Culture",
  closeHeadingWords: [
    { text: "Ready" },
    { text: "to" },
    { text: "care differently?", script: true },
  ],
  closeHeadingAriaLabel: "Ready to care differently?",
  closeSub:
    "The first step is a conversation — no pitch, no pressure. Tell us where your team is today, and we'll go from there.",
  ctaHref: "mailto:hello@carriegrace.consulting",
  ctaLabel: "Schedule a Discovery Call",
};
