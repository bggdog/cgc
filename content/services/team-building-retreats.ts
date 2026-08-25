import type { ServicePageContent } from "./types";

export const teamBuildingRetreats: ServicePageContent = {
  slug: "team-building-retreats",
  pageTitle: "Team Building Retreats — Carrie Grace",
  crumbName: "Team Building Retreats",
  titleWords: [
    { text: "Team Building", breakAfter: true },
    { text: "Retreats" },
  ],
  titleAriaLabel: "Team Building Retreats",
  lede: "Immersive, facilitated retreat experiences designed to rebuild trust, recalibrate vision, and re-energize teams who are doing hard, meaningful work.",
  chips: ["Facilitated Immersion", "Trust & Vision", "Custom Designed"],
  frameTag: "Team Retreats",
  bandHeadingBefore: "Time apart to",
  bandHeadingScript: "come",
  bandHeadingAfter: "together",
  bandSub:
    "A retreat only works when it’s designed with intention — these are the elements most team retreats are built around.",
  includes: [
    {
      title: "Custom Retreat Design",
      body: "Agendas shaped around your team’s real needs — whether that’s rebuilding trust, clarifying vision, or simply breathing again.",
    },
    {
      title: "Facilitated Trust Building",
      body: "Structured conversations and experiences that restore connection without feeling forced or performative.",
    },
    {
      title: "Vision & Alignment Sessions",
      body: "Space to recalibrate shared purpose, priorities, and how you’ll move forward together.",
    },
    {
      title: "Integration & Follow-Through",
      body: "Takeaways and next steps so the retreat’s momentum continues long after everyone is back at work.",
    },
  ],
  wideTag: "Away Together",
  closeHeadingWords: [
    { text: "Ready" },
    { text: "to" },
    { text: "reconnect?", script: true },
  ],
  closeHeadingAriaLabel: "Ready to reconnect?",
  closeSub:
    "The first step is a conversation — no pitch, no pressure. Tell us what your team needs, and we'll go from there.",
  ctaHref: "mailto:hello@carriegrace.consulting",
  ctaLabel: "Schedule a Discovery Call",
};
