import type { ServicePageContent } from "./types";
import { siteImageSrc } from "../site-images";
import { CONTACT_MAILTO } from "../site-links";

export const organizationalStructureSetup: ServicePageContent = {
  slug: "organizational-structure-setup",
  pageTitle: "Organizational Structure & Setup — Carrie Grace",
  crumbName: "Organizational Structure & Setup",
  titleWords: [
    { text: "Organizational", breakAfter: true },
    { text: "Structure & Setup" },
  ],
  titleAriaLabel: "Organizational Structure & Setup",
  lede: "Whether you're launching, growing, or restructuring, we help you build the right structure for where you're going — with clear roles, healthy systems, and your mission at the center.",
  chips: ["Scaling & Launch", "Ops Framework", "People-Centered"],
  frameTag: "Org Structure",
  heroImage: {
    src: siteImageSrc("organizational-structure-setup"),
    alt: "Organizational structure and setup",
  },
  bandHeadingBefore: "Structure That",
  bandHeadingScript: "Serves",
  bandHeadingAfter: "People",
  bandSub:
    "The right structure brings clarity, creates capacity, and helps people do their best work. Every engagement is built around what your organization needs now — and where you're going next.",
  includes: [
    {
      title: "Org Chart & Role Design",
      body: "Create clear roles, reporting lines, and responsibilities so people understand where they fit, what they own, and how their work supports the mission.",
    },
    {
      title: "Operational Frameworks",
      body: "Build practical systems and workflows that make the work easier to carry — reducing bottlenecks, protecting your people, and creating greater long-term sustainability.",
    },
    {
      title: "Growth & Restructuring Support",
      body: "Navigate growth, change, or reorganization with intention — strengthening the structure without losing the people and culture that matter.",
    },
    {
      title: "Implementation Roadmaps",
      body: "Turn the plan into action with clear priorities, practical next steps, and a realistic path your team can actually follow.",
    },
  ],
  wideTag: "By Design",
  showWideSection: false,
  closeHeadingWords: [
    { text: "Ready" },
    { text: "to" },
    { text: "build well?", script: true },
  ],
  closeHeadingAriaLabel: "Ready to build well?",
  closeSub:
    "The first step is a conversation — no pitch, no pressure. Tell us where your structure is today, and we'll go from there.",
  ctaHref: CONTACT_MAILTO,
  ctaLabel: "Schedule a Discovery Call",
};
