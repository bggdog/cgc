import type { Metadata } from "next";
import { ClosingCta } from "@/components/university/landing/ClosingCta";
import { CourseGrid } from "@/components/university/landing/CourseGrid";
import { Hero } from "@/components/university/landing/Hero";
import { Pathway } from "@/components/university/landing/Pathway";
import { PricingTeaser } from "@/components/university/landing/PricingTeaser";
import { QuizTeaser } from "@/components/university/landing/QuizTeaser";
import { MEMBERSHIP } from "@/lib/university/course-data";
import { formatPrice, getPublishedCourses } from "@/lib/university/courses";

// No `title` here: the layout's `default` ("Live Abundantly University")
// already covers this page. Setting one would be substituted into the
// layout's `template` ("%s · Live Abundantly University"), duplicating the
// site name. Child routes (quizzes, course detail pages) should set their
// own `title` so the template renders "<Page> · Live Abundantly University".
export const metadata: Metadata = {
  description:
    "Self-paced courses, guided journals and free self-assessments from Carrie Grace, for leaders who want to flourish without burning out.",
};

export default async function UniversityLandingPage() {
  const courses = await getPublishedCourses();

  const paidPrices = courses
    .map((course) => course.priceCents)
    .filter((cents) => cents > 0);
  const lowestCoursePriceLabel = formatPrice(
    paidPrices.length > 0 ? Math.min(...paidPrices) : 0
  );

  return (
    <main className="lau">
      <Hero />
      <Pathway />
      <CourseGrid courses={courses} />
      <QuizTeaser />
      <PricingTeaser
        lowestCoursePriceLabel={lowestCoursePriceLabel}
        membershipPriceLabel={formatPrice(MEMBERSHIP.priceCents)}
        membershipInterval={MEMBERSHIP.interval}
      />
      <ClosingCta />
    </main>
  );
}
