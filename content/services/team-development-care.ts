import type { ServicePageContent } from "./types";
import { siteImageSrc } from "../site-images";

export const teamDevelopmentCare: ServicePageContent = {
  slug: "team-development-care",
  pageTitle: "Team Development, Care & Retreats — Carrie Grace",
  crumbName: "Team Development, Care & Retreats",
  titleWords: [
    { text: "Team Development", breakAfter: true },
    { text: "Care & Retreats" },
  ],
  titleAriaLabel: "Team Development, Care and Retreats",
  lede: "Equip your managers and staff with healthy team dynamics, genuine care, and immersive retreat experiences — building culture that reduces attrition and re-energizes teams doing hard, meaningful work.",
  chips: ["For Managers & Staff", "Retreats & Culture", "Retention Driven"],
  frameTag: "Team Development",
  heroImage: {
    src: siteImageSrc("team-development-care"),
    alt: "Team development, care, and retreats",
  },
  bandHeadingBefore: "Care that",
  bandHeadingScript: "keeps",
  bandHeadingAfter: "people",
  bandSub:
    "Teams thrive when care is structured and time apart is intentional — these are the pillars most team development and retreat engagements build from.",
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
    {
      title: "Custom Retreat Design",
      body: "Agendas shaped around your team's real needs — whether that's rebuilding trust, clarifying vision, or simply breathing again.",
    },
    {
      title: "Facilitated Trust Building",
      body: "Structured conversations and experiences that restore connection without feeling forced or performative.",
    },
    {
      title: "Vision & Alignment Sessions",
      body: "Space to recalibrate shared purpose, priorities, and how you'll move forward together.",
    },
    {
      title: "Integration & Follow-Through",
      body: "Takeaways and next steps so the retreat's momentum continues long after everyone is back at work.",
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
  ctaHref: "mailto:hello@carriegrace.consulting",
  ctaLabel: "Schedule a Discovery Call",
};
