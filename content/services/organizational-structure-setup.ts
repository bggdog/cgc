import type { ServicePageContent } from "./types";
import { siteImageSrc } from "../site-images";
import { CONTACT_MAILTO } from "../site-links";
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
  lede: "Whether you're scaling, restructuring, or launching, we help you build an org chart and operational framework that serves your people and your mission.",
  chips: ["Scaling & Launch", "Ops Framework", "People-Centered"],
  frameTag: "Org Structure",
  heroImage: {
    src: siteImageSrc("organizational-structure-setup"),
    alt: "Organizational structure and setup",
  },
  bandHeadingBefore: "Structure that",
  bandHeadingScript: "serves",
  bandHeadingAfter: "people",
  bandSub:
    "The right structure unlocks clarity and capacity — these are the pillars most organizational setup engagements build from.",
  includes: [
    {
      title: "Org Chart & Role Design",
      body: "Clear mission, role clarity, reporting lines, so people know how they fit and who they support.",
    },
    {
      title: "Operational Frameworks",
      body: "Actionable strategies, techniques, workflows, and systems that keep the mission moving without bottlenecks or burnout with long term sustainability.",
    },
    {
      title: "Growth & Restructuring Support",
      body: "Guidance through scale-ups, launches, and reorganizations — protecting culture while the structure shifts.",
    },
    {
      title: "Implementation Roadmaps",
      body: "A realistic path from current state to desired structure, with sequencing your team can actually follow.",
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
