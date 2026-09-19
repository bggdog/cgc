import type { CSSProperties } from "react";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "How the *journey* works";

const STEPS = [
  {
    title: "Start with an honest look",
    body: "Take a free Abundant Living assessment. It scores where you are across the areas that decide whether you flourish or fray, and it takes about ten minutes.",
  },
  {
    title: "Choose the course that fits",
    body: "Your results point to the course built for what you are carrying right now. Preview lessons before you pay, so you know the fit before you commit.",
  },
  {
    title: "Grow, and carry it forward",
    body: "Work at your own pace with video, written lessons and guided journals. Finish the course and earn a certificate you can show your board or your team.",
  },
];

export function Pathway() {
  return (
    <section className="band">
      <Reveal as="div" className="panel">
        <div className="cols">
          <div>
            <p className="eyebrow">How It Works</p>
            <h2 aria-label={headingPlainText(HEADING)}>
              <WordReveal text={HEADING} />
            </h2>
            <p className="sub">
              Three steps, at whatever pace your season allows. Nothing here asks
              you to pretend you are further along than you are.
            </p>
          </div>

          <div className="list">
            {STEPS.map((step, index) => (
              <div
                className="item"
                key={step.title}
                style={{ "--i": index } as CSSProperties}
              >
                <span className="n">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
