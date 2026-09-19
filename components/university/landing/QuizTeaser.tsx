import type { CSSProperties } from "react";
import { MagneticCta } from "@/components/university/MagneticCta";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "The Abundant Living *Quizzes*";

const DIMENSIONS = ["Rest", "Resilience", "Purpose", "Relationships", "Capacity"];

export function QuizTeaser() {
  return (
    <section className="band quiz">
      <Reveal as="div" className="panel">
        <div className="cols">
          <div>
            <p className="eyebrow">Free to Take</p>
            <h2 aria-label={headingPlainText(HEADING)}>
              <WordReveal text={HEADING} />
            </h2>
            <p className="sub">
              A ten-minute self-assessment that scores you across the areas that
              decide whether you flourish. You get a clear picture, written
              insights, and a course suggestion — free, with an account.
            </p>
            <div className="actions">
              <MagneticCta href="/university/quizzes" label="Take a Free Quiz" />
            </div>
          </div>

          <div>
            <div className="dims">
              {DIMENSIONS.map((dimension, index) => (
                <span key={dimension} style={{ "--i": index } as CSSProperties}>
                  {dimension}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
