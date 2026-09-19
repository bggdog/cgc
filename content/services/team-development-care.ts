import type { ServicePageContent } from "./types";
import { siteImageSrc } from "../site-images";
import { CONTACT_MAILTO } from "../site-links";

export const teamDevelopmentCare: ServicePageContent = {
  slug: "team-development-care",
  pageTitle: "Team Development & Retreats — Carrie Grace",
  crumbName: "Team Development & Retreats",
  titleWords: [
    { text: "Team Development", breakAfter: true },
    { text: "& Retreats" },
  ],
  titleAriaLabel: "Team Development and Retreats",
  lede: "Create space for your people to reconnect, reset, and grow — through intentional team development and immersive retreat experiences designed to strengthen both the individual and the team.",
  chips: ["For Managers & Staff", "Retreats & Culture", "Retention-Focused"],
  frameTag: "Team Development",
  heroImage: {
    src: siteImageSrc("team-development-care"),
    alt: "Team development and retreats",
  },
  bandHeadingBefore: "Care That",
  bandHeadingScript: "Keeps",
  bandHeadingAfter: "People",
  bandSub:
    "People stay where they feel valued. Our team development and retreat experiences create intentional space to care for your people, strengthen your team, and reconnect them to each other and the mission they serve.",
  includes: [
    {
      title: "Healthy Team Culture",
      body: "Build a team culture where people communicate well, trust one another, feel valued, and know they matter.",
    },
    {
      title: "Navigating Conflict",
      body: "Give your team practical tools to have hard conversations, work through tension, and move forward in healthy ways.",
    },
    {
      title: "Caring for Your People",
      body: "Create meaningful rhythms of care that remind your people they are more than the work they produce.",
    },
    {
      title: "Supporting Your Leaders",
      body: "Equip managers and team leaders to lead people well, recognize burnout early, and create healthier environments for their teams.",
    },
    {
      title: "Retreats That Matter",
      body: "No cookie-cutter agendas. Every retreat is thoughtfully created around your people, your culture, and what your team needs in this season.",
    },
    {
      title: "Reconnection & Renewal",
      body: "Create space to step away from the work, breathe, reconnect, and remember why the work matters.",
    },
    {
      title: "Bringing It Back Home",
      body: "Turn what happens in the room into practical next steps your team can carry back into the everyday.",
    },
  ],
  wideImage: {
    src: siteImageSrc("team-building-retreats"),
    alt: "Team building retreats",
  },
  closeHeadingWords: [
    { text: "Ready" },
    { text: "to" },
    { text: "care differently?", script: true },
  ],
  closeHeadingAriaLabel: "Ready to care differently?",
  closeSub:
    "The first step is a conversation — no pitch, no pressure. Tell us where your team is today and what you need, and we'll go from there.",
  ctaHref: CONTACT_MAILTO,
  ctaLabel: "Schedule a Discovery Call",
};
