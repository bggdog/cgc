import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseGrid } from "@/components/university/landing/CourseGrid";
import type { CourseSummary } from "@/lib/university/course-types";

const courses: CourseSummary[] = [
  {
    slug: "refresh",
    title: "Refresh",
    summary: "Be filled again.",
    coverSrc: "/media/resource-refresh",
    coverAlt: "Refresh cover",
    lessonCount: 12,
    estimatedMinutes: 240,
    priceCents: 14900,
    hasFreePreview: true,
    status: "published",
    order: 1,
  },
  {
    slug: "rest",
    title: "Rest",
    summary: "Stabilize and recover.",
    coverSrc: "/media/resource-rest",
    coverAlt: "Rest cover",
    lessonCount: 10,
    estimatedMinutes: 210,
    priceCents: 0,
    hasFreePreview: false,
    status: "published",
    order: 2,
  },
];

describe("CourseGrid", () => {
  it("renders a card per course", () => {
    const { container } = render(<CourseGrid courses={courses} />);
    expect(container.querySelectorAll(".course-card")).toHaveLength(2);
  });

  it("links each card to its course page", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByRole("link", { name: /Refresh/ })).toHaveAttribute(
      "href",
      "/university/courses/refresh"
    );
  });

  it("shows the price, lesson count and duration", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByText("$149")).toBeInTheDocument();
    expect(screen.getByText("12 lessons")).toBeInTheDocument();
    expect(screen.getByText("4h 0m")).toBeInTheDocument();
  });

  it("shows Free for a zero-price course", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("flags courses that have a free preview", () => {
    render(<CourseGrid courses={courses} />);
    expect(screen.getByText("Free preview")).toBeInTheDocument();
  });

  it("renders an honest empty state when there are no courses", () => {
    render(<CourseGrid courses={[]} />);
    expect(screen.getByText(/New courses are on the way/)).toBeInTheDocument();
  });
});
