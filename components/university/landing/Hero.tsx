import type { CSSProperties } from "react";
import { MagneticCta } from "@/components/university/MagneticCta";
import { NotchFrame } from "@/components/university/NotchFrame";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";
import { siteImageSrc } from "@/content/site-images";

const HEADLINE = "Grow into the *abundant* | life you were made for";

const CHIPS = [
  "Self-Paced",
  "Guided Journals",
  "Free Assessments",
  "Certificates",
];

export function Hero() {
  return (
    <Reveal className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Live Abundantly University</p>
            <h1 aria-label={headingPlainText(HEADLINE)}>
              <WordReveal text={HEADLINE} />
            </h1>
            <p className="lede">
              Self-paced courses, guided journals and honest self-assessments from
              Carrie Grace — built for leaders who want to flourish without burning
              out.
            </p>
            <div className="chips">
              {CHIPS.map((chip, index) => (
                <span key={chip} style={{ "--i": index } as CSSProperties}>
                  {chip}
                </span>
              ))}
            </div>
            <div className="cta-row">
              <MagneticCta href="/university#courses" label="Explore the Courses" />
              <MagneticCta
                href="/university/quizzes"
                label="Take a Free Quiz"
                variant="ghost"
              />
            </div>
          </div>

          <NotchFrame
            src={siteImageSrc("hero")}
            alt="Carrie Grace leading a team session"
            tag="The University"
            priority
          />
        </div>
      </div>
    </Reveal>
  );
}
