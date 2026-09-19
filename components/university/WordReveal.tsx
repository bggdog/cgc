import { Fragment } from "react";
import type { CSSProperties } from "react";
import { splitHeadingWords } from "@/lib/university/heading";

type WordRevealProps = {
  /** Headline source. `*word*` renders in script; `|` breaks the line. */
  text: string;
};

/**
 * Renders a headline as per-word reveal spans. Pair with an `aria-label`
 * built from `headingPlainText`, since the split markup is not readable.
 */
export function WordReveal({ text }: WordRevealProps) {
  const words = splitHeadingWords(text);

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word.text}-${index}`}>
          <span className="w" style={{ "--i": index } as CSSProperties}>
            <span>
              {word.script ? <span className="script">{word.text}</span> : word.text}
            </span>
          </span>
          {word.breakAfter ? <br /> : null}
          {!word.breakAfter && index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
