import { LAUNCH_COURSES } from "./course-data";
import type { CourseSummary } from "./course-types";

/**
 * The catalog read seam. Phase 4 replaces these bodies with Postgres queries;
 * the signatures stay the same so no caller changes.
 */
export async function getPublishedCourses(): Promise<CourseSummary[]> {
  return LAUNCH_COURSES.filter((course) => course.status === "published").sort(
    (a, b) => a.order - b.order
  );
}

export async function getCourseBySlug(slug: string): Promise<CourseSummary | null> {
  const courses = await getPublishedCourses();
  return courses.find((course) => course.slug === slug) ?? null;
}

/** Renders a cent amount as brand-style price copy. */
export function formatPrice(priceCents: number): string {
  if (priceCents === 0) return "Free";

  const dollars = priceCents / 100;
  return priceCents % 100 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
