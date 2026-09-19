/**
 * A course as the catalog and cards need it.
 *
 * This is the contract the Phase 4 database schema must satisfy; until then
 * it is served from `course-data.ts`.
 */
export type CourseSummary = {
  slug: string;
  title: string;
  /** One or two sentences for the catalog card. */
  summary: string;
  coverSrc: string;
  coverAlt: string;
  lessonCount: number;
  estimatedMinutes: number;
  /** One-time price in cents. Zero means the whole course is free. */
  priceCents: number;
  /** True when at least one lesson is readable before purchase. */
  hasFreePreview: boolean;
  status: "draft" | "published";
  /** Ascending display order in the catalog. */
  order: number;
};

export type MembershipPlan = {
  priceCents: number;
  interval: "month" | "year";
  blurb: string;
};
