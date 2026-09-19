import { siteImageSrc } from "@/content/site-images";
import type { CourseSummary, MembershipPlan } from "./course-types";

/**
 * Launch catalog. Titles mirror Carrie's existing published resources.
 *
 * Prices are launch defaults pending the owner's confirmation; from Phase 5
 * they are editable in the admin, and Phase 4 moves this data to Postgres.
 */
export const LAUNCH_COURSES: CourseSummary[] = [
  {
    slug: "refresh",
    title: "Refresh",
    summary:
      "A personal growth and empowerment course for leaders who have been pouring out for years and need to be filled again.",
    coverSrc: siteImageSrc("resource-refresh"),
    coverAlt: "Refresh — Personal Growth & Empowerment",
    lessonCount: 12,
    estimatedMinutes: 240,
    priceCents: 14900,
    hasFreePreview: true,
    status: "published",
    order: 1,
  },
  {
    slug: "resilient",
    title: "Resilient",
    summary:
      "A compassionate response to trauma — how to recognise it, respond well, and build teams that recover together.",
    coverSrc: siteImageSrc("resource-resilient"),
    coverAlt: "Resilient — A Compassionate Response to Trauma",
    lessonCount: 14,
    estimatedMinutes: 300,
    priceCents: 14900,
    hasFreePreview: true,
    status: "published",
    order: 2,
  },
  {
    slug: "rest",
    title: "Rest",
    summary:
      "Survivor stabilization and safe house practice, drawn from years of frontline care work and hard-won experience.",
    coverSrc: siteImageSrc("resource-rest"),
    coverAlt: "Rest — Survivor Stabilization & Safe House Guide",
    lessonCount: 10,
    estimatedMinutes: 210,
    priceCents: 19900,
    hasFreePreview: true,
    status: "published",
    order: 3,
  },
  {
    slug: "reimagine",
    title: "Reimagine",
    summary:
      "A guided journal course for dreams and visions, to help you name what is next and take the first honest step toward it.",
    coverSrc: siteImageSrc("resource-reimagine"),
    coverAlt: "Reimagine — A Dreams & Visions Guided Journal",
    lessonCount: 8,
    estimatedMinutes: 150,
    priceCents: 9900,
    hasFreePreview: true,
    status: "published",
    order: 4,
  },
];

/** All-access membership. Price pending confirmation, as above. */
export const MEMBERSHIP: MembershipPlan = {
  priceCents: 2900,
  interval: "month",
  blurb: "Every course, every quiz, and each new release while you are a member.",
};
