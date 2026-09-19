import Link from "next/link";
import { MagneticCta } from "@/components/university/MagneticCta";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "Your next season starts *here*";

export function ClosingCta() {
  return (
    <section className="close">
      <Reveal as="div" className="panel">
        <span className="whisper" aria-hidden="true">
          begin
        </span>
        <h2 aria-label={headingPlainText(HEADING)}>
          <WordReveal text={HEADING} />
        </h2>
        <p className="sub">
          Start with a free assessment. It costs nothing, it takes ten minutes, and
          it will tell you honestly where to begin.
        </p>
        <MagneticCta href="/university/quizzes" label="Take a Free Quiz" />
        <Link className="also" href="/">
          ← Back to Carrie Grace
        </Link>
      </Reveal>
    </section>
  );
}
