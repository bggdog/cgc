import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";
import { formatPrice } from "@/lib/university/courses";
import type { CourseSummary } from "@/lib/university/course-types";

const HEADING = "The *catalog*";

/** Renders minutes as the compact duration the cards use, e.g. "4h 0m". */
function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function CourseGrid({ courses }: { courses: CourseSummary[] }) {
  return (
    <Reveal className="courses">
      <div className="wrap" id="courses">
        <div className="head">
          <div>
            <p className="eyebrow">Courses</p>
            <h2 aria-label={headingPlainText(HEADING)}>
              <WordReveal text={HEADING} />
            </h2>
          </div>
          <p className="sub">
            Every course opens with free preview lessons, so you can read the first
            chapter before deciding.
          </p>
        </div>

        <div className="grid">
          {courses.length === 0 ? (
            <p className="empty">
              New courses are on the way. Take a free quiz in the meantime and we
              will point you to the right one when it opens.
            </p>
          ) : (
            courses.map((course, index) => (
              <Link
                key={course.slug}
                href={`/university/courses/${course.slug}`}
                className="course-card"
                style={{ "--i": index } as CSSProperties}
              >
                <div className="cover">
                  <Image
                    src={course.coverSrc}
                    alt={course.coverAlt}
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                  {course.hasFreePreview ? (
                    <span className="flag">Free preview</span>
                  ) : null}
                </div>

                <div className="body">
                  <h3>{course.title}</h3>
                  <p>{course.summary}</p>
                  <div className="meta">
                    <span>{course.lessonCount} lessons</span>
                    <span className="dot" aria-hidden="true" />
                    <span>{formatDuration(course.estimatedMinutes)}</span>
                    <span className="price">{formatPrice(course.priceCents)}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Reveal>
  );
}
