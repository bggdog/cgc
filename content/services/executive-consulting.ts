import type { ServicePageContent } from "./types";

export const executiveConsulting: ServicePageContent = {
  slug: "executive-consulting",
  pageTitle: "Executive Consulting — Carrie Grace",
  crumbName: "Executive Consulting",
  titleWords: [
    { text: "Executive", breakAfter: true },
    { text: "Consulting" },
  ],
  titleAriaLabel: "Executive Consulting",
  lede: "Strategic guidance for executive directors, CEOs, and C-suite nonprofit leaders navigating growth, transition, or complex organizational challenges.",
  chips: ["For Executive Leaders", "1:1 & Team Formats", "Tailored Engagements"],
  frameTag: "Executive Consulting",
  bandHeadingBefore: "Built around",
  bandHeadingScript: "your",
  bandHeadingAfter: "leadership",
  bandSub:
    "Every engagement is shaped in the discovery process — these are the pillars most executive clients build from.",
  includes: [
    {
      title: "Leadership Strategy Sessions",
      body: "Focused working sessions on the decisions, transitions, and challenges sitting on your desk right now.",
    },
    {
      title: "Transition & Succession Planning",
      body: "Steady guidance through leadership changes — protecting momentum, culture, and institutional trust.",
    },
    {
      title: "Board–Executive Alignment",
      body: "Clarifying roles and building the working partnership your board and executive team both need.",
    },
    {
      title: "Sustainable Decision Frameworks",
      body: "Tools and rhythms that make good decisions repeatable — long after the engagement ends.",
    },
  ],
  wideTag: "In the Work",
  closeHeadingWords: [
    { text: "Ready" },
    { text: "to" },
    { text: "lead differently?", script: true },
  ],
  closeHeadingAriaLabel: "Ready to lead differently?",
  closeSub:
    "The first step is a conversation — no pitch, no pressure. Tell us where your organization is, and we'll go from there.",
  ctaHref: "mailto:hello@carriegrace.consulting",
  ctaLabel: "Schedule a Discovery Call",
};
