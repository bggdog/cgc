import { describe, expect, it } from "vitest";
import { headingPlainText, splitHeadingWords } from "@/lib/university/heading";

describe("splitHeadingWords", () => {
  it("returns one entry per word", () => {
    expect(splitHeadingWords("Grow into the life")).toEqual([
      { text: "Grow", script: false, breakAfter: false },
      { text: "into", script: false, breakAfter: false },
      { text: "the", script: false, breakAfter: false },
      { text: "life", script: false, breakAfter: false },
    ]);
  });

  it("marks asterisk-wrapped words as script and strips the asterisks", () => {
    const words = splitHeadingWords("the *abundant* life");
    expect(words[1]).toEqual({ text: "abundant", script: true, breakAfter: false });
  });

  it("treats a bare pipe as a line break on the previous word", () => {
    const words = splitHeadingWords("Grow into | the life");
    expect(words).toHaveLength(4);
    expect(words[1]).toEqual({ text: "into", script: false, breakAfter: true });
  });

  it("ignores a leading pipe that has no previous word", () => {
    expect(splitHeadingWords("| Grow")).toEqual([
      { text: "Grow", script: false, breakAfter: false },
    ]);
  });

  it("collapses runs of whitespace", () => {
    expect(splitHeadingWords("  Grow \n  into  ")).toHaveLength(2);
  });

  it("returns an empty array for empty input", () => {
    expect(splitHeadingWords("")).toEqual([]);
    expect(splitHeadingWords("   ")).toEqual([]);
  });

  it("does not treat a lone asterisk as a script marker", () => {
    expect(splitHeadingWords("*")).toEqual([
      { text: "*", script: false, breakAfter: false },
    ]);
  });
});

describe("headingPlainText", () => {
  it("strips markers so the string can be an aria-label", () => {
    expect(headingPlainText("Grow into the *abundant* | life")).toBe(
      "Grow into the abundant life"
    );
  });
});
