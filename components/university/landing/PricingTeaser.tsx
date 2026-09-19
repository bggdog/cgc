import type { CSSProperties } from "react";
import { Reveal } from "@/components/university/Reveal";
import { WordReveal } from "@/components/university/WordReveal";
import { headingPlainText } from "@/lib/university/heading";

const HEADING = "Two ways to *begin*";

type PricingTeaserProps = {
  /** Cheapest published course, already formatted. Derived, never hardcoded. */
  lowestCoursePriceLabel: string;
  membershipPriceLabel: string;
  membershipInterval: "month" | "year";
};

export function PricingTeaser({
  lowestCoursePriceLabel,
  membershipPriceLabel,
  membershipInterval,
}: PricingTeaserProps) {
  return (
    <Reveal className="pricing">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">Pricing</p>
          <h2 aria-label={headingPlainText(HEADING)}>
            <WordReveal text={HEADING} />
          </h2>
          <p className="sub">
            Buy the one course you need, or take the whole shelf. Either way, the
            quizzes and preview lessons stay free.
          </p>
        </div>

        <div className="plans">
          <div className="plan" style={{ "--i": 0 } as CSSProperties}>
            <h3>Single Course</h3>
            <div className="amount">
              <strong>From {lowestCoursePriceLabel}</strong>
            </div>
            <p>Paid once. Yours for good, including every future update.</p>
            <ul>
              <li>Lifetime access to that course</li>
              <li>Guided journals and downloads</li>
              <li>Certificate on completion</li>
            </ul>
          </div>

          <div className="plan featured" style={{ "--i": 1 } as CSSProperties}>
            <h3>All-Access Membership</h3>
            <div className="amount">
              <strong>{membershipPriceLabel}</strong>
              <span>/{membershipInterval}</span>
            </div>
            <p>Every course and every quiz, for as long as you are a member.</p>
            <ul>
              <li>All courses, unlocked</li>
              <li>New releases as they land</li>
              <li>Cancel any time</li>
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
