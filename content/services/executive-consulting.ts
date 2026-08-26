import type { ServicePageContent } from "./types";
import { siteImageSrc } from "../site-images";

export const executiveConsulting: ServicePageContent = {
  slug: "executive-consulting",
  pageTitle: "Executive & Board Consulting — Carrie Grace",
  crumbName: "Executive & Board Consulting",
  titleWords: [
    { text: "Executive", breakAfter: true },
    { text: "& Board Consulting" },
  ],
  titleAriaLabel: "Executive and Board Consulting",
  lede: "Strategic guidance for executive directors, CEOs, and boards — strengthening governance, clarifying roles, and building the leadership partnerships that high-performing nonprofits require.",
  chips: ["For Leaders & Boards", "Governance Focused", "Tailored Engagements"],
  frameTag: "Executive Consulting",
  heroImage: {
    src: siteImageSrc("executive-consulting"),
    alt: "Executive and board consulting",
  },
  bandHeadingBefore: "Built around",
  bandHeadingScript: "your",
  bandHeadingAfter: "leadership",
  bandSub:
    "Every engagement is shaped in the discovery process — these are the pillars most executive and board clients build from.",
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
    {
      title: "Sustainable Decision Frameworks",
      body: "Tools and rhythms that make good decisions repeatable — long after the engagement ends.",
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
  ctaHref: "mailto:hello@carriegrace.consulting",
  ctaLabel: "Schedule a Discovery Call",
};
