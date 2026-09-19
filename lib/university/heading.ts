export type HeadingWord = {
  text: string;
  /** Render in Pinyon Script (the brand accent face). */
  script: boolean;
  /** Force a line break after this word. */
  breakAfter: boolean;
};

const BREAK_TOKEN = "|";

/**
 * Parses a headline into per-word reveal units.
 *
 * Syntax: `*word*` renders in the script face; a bare `|` breaks the line
 * after the preceding word.
 */
export function splitHeadingWords(source: string): HeadingWord[] {
  const tokens = source.trim().split(/\s+/).filter(Boolean);
  const words: HeadingWord[] = [];

  for (const token of tokens) {
    if (token === BREAK_TOKEN) {
      const previous = words[words.length - 1];
      if (previous) previous.breakAfter = true;
      continue;
    }

    const script =
      token.length > 2 && token.startsWith("*") && token.endsWith("*");

    words.push({
      text: script ? token.slice(1, -1) : token,
      script,
      breakAfter: false,
    });
  }

  return words;
}

/** The headline with all markers removed — use as an `aria-label`. */
export function headingPlainText(source: string): string {
  return splitHeadingWords(source)
    .map((word) => word.text)
    .join(" ");
}
