import type { ServicePageContent } from "./types";
import { siteImageSrc } from "../site-images";
import { CONTACT_MAILTO } from "../site-links";

export const executiveConsulting: ServicePageContent = {
  slug: "executive-consulting",
  pageTitle: "Executive & Board Consulting — Carrie Grace",
  crumbName: "Executive & Board Consulting",
  titleWords: [
    { text: "Executive", breakAfter: true },
    { text: "& Board Consulting" },
  ],
  titleAriaLabel: "Executive and Board Consulting",
  lede: "Strategic support for executive directors, CEOs & Boards to clarify roles, strengthen leadership, and build healthy partnerships that help the organization thrive.",
  chips: ["Guaranteed sustainability", "Governance Focused", "Tailored Engagements"],
  frameTag: "Executive Consulting",
  heroImage: {
    src: siteImageSrc("executive-consulting"),
    alt: "Executive and board consulting",
  },
  bandHeadingBefore: "Built Around",
  bandHeadingScript: "What Matters",
  bandHeadingAfter: "",
  bandSub:
    "No two organizations are the same. Every engagement begins with discovery and is shaped around your leadership, people, culture, and mission.",
  includes: [
    {
      title: "Executive Leadership Strategy",
      body: "Focused, high-level guidance for the decisions, challenges, transitions, and opportunities in front of you right now.",
    },
    {
      title: "Organizational Health & Culture",
      body: "Strengthening the internal culture of your organization — addressing burnout, retention, team health, and the systems that impact your people.",
    },
    {
      title: "Board & Executive Alignment",
      body: "Creating greater clarity, trust, and partnership between boards and executive leaders — with clear roles, healthy communication, and shared purpose.",
    },
    {
      title: "Transition & Succession Planning",
      body: "Steady guidance through seasons of leadership change — protecting organizational health, institutional trust, and mission momentum.",
    },
    {
      title: "Sustainable Structures & Strategy",
      body: "Building practical systems, decision-making rhythms, and leadership practices that strengthen the organization long after our work together ends.",
    },
  ],
  wideImage: {
    src: siteImageSrc("board-consulting"),
    alt: "Board consulting",
  },
  closeHeadingWords: [
    { text: "Ready" },
    { text: "to" },
    { text: "lead differently?", script: true },
  ],
  closeHeadingAriaLabel: "Ready to lead differently?",
  closeSub:
    "The first step is a conversation — no pitch, no pressure. Tell us where your leadership and board are today, and we'll go from there.",
  ctaHref: CONTACT_MAILTO,
  ctaLabel: "Schedule a Discovery Call",
};
