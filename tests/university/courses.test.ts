import { describe, expect, it } from "vitest";
import {
  formatPrice,
  getCourseBySlug,
  getPublishedCourses,
} from "@/lib/university/courses";

describe("getPublishedCourses", () => {
  it("returns only published courses", async () => {
    const courses = await getPublishedCourses();
    expect(courses.length).toBeGreaterThan(0);
    expect(courses.every((course) => course.status === "published")).toBe(true);
  });

  it("returns them in ascending display order", async () => {
    const courses = await getPublishedCourses();
    const orders = courses.map((course) => course.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("gives every course the fields a card needs", async () => {
    const courses = await getPublishedCourses();
    for (const course of courses) {
      expect(course.slug).toMatch(/^[a-z0-9-]+$/);
      expect(course.title.length).toBeGreaterThan(0);
      expect(course.summary.length).toBeGreaterThan(0);
      expect(course.coverSrc).toMatch(/^\/media\//);
      expect(course.coverAlt.length).toBeGreaterThan(0);
      expect(course.lessonCount).toBeGreaterThan(0);
      expect(course.estimatedMinutes).toBeGreaterThan(0);
      expect(course.priceCents).toBeGreaterThanOrEqual(0);
    }
  });

  it("uses unique slugs", async () => {
    const courses = await getPublishedCourses();
    const slugs = courses.map((course) => course.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getCourseBySlug", () => {
  it("finds a published course", async () => {
    const [first] = await getPublishedCourses();
    await expect(getCourseBySlug(first.slug)).resolves.toEqual(first);
  });

  it("returns null for an unknown slug", async () => {
    await expect(getCourseBySlug("no-such-course")).resolves.toBeNull();
  });
});

describe("formatPrice", () => {
  it("renders whole dollars without cents", () => {
    expect(formatPrice(14900)).toBe("$149");
  });

  it("renders cents when they are not zero", () => {
    expect(formatPrice(14950)).toBe("$149.50");
  });

  it("renders zero as Free", () => {
    expect(formatPrice(0)).toBe("Free");
  });
});
