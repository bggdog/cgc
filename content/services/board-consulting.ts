import type { ServicePageContent } from "./types";

export const boardConsulting: ServicePageContent = {
  slug: "board-consulting",
  pageTitle: "Board Consulting — Carrie Grace",
  crumbName: "Board Consulting",
  titleWords: [
    { text: "Board", breakAfter: true },
    { text: "Consulting" },
  ],
  titleAriaLabel: "Board Consulting",
  lede: "Strengthen board governance, clarify roles, and build the partnership between board and executive leadership that high-performing nonprofits require.",
  chips: ["For Boards & Execs", "Governance Focused", "Partnership Built"],
  frameTag: "Board Consulting",
  bandHeadingBefore: "Governance that",
  bandHeadingScript: "serves",
  bandHeadingAfter: "the mission",
  bandSub:
    "Healthy boards don’t happen by accident — these are the foundations most board engagements build from.",
  includes: [
    {
      title: "Governance Clarity & Role Definition",
      body: "Clear boundaries between board oversight and executive leadership — so everyone knows where their responsibility starts and stops.",
    },
    {
      title: "Board–Executive Partnership Coaching",
      body: "Facilitated work that rebuilds trust, communication, and shared purpose between the board and the executive team.",
    },
    {
      title: "Meeting Rhythm & Decision Design",
      body: "Practical structures for agendas, reporting, and decision-making that make board time count.",
    },
    {
      title: "Onboarding & Board Development",
      body: "Tools and guidance so new members contribute with confidence — and seasoned boards stay sharp and mission-aligned.",
    },
  ],
  wideTag: "Around the Table",
  closeHeadingWords: [
    { text: "Ready" },
    { text: "to" },
    { text: "govern well?", script: true },
  ],
  closeHeadingAriaLabel: "Ready to govern well?",
  closeSub:
    "The first step is a conversation — no pitch, no pressure. Tell us where your board is today, and we'll go from there.",
  ctaHref: "mailto:hello@carriegrace.consulting",
  ctaLabel: "Schedule a Discovery Call",
};
