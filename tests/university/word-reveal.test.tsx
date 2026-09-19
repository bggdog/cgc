import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WordReveal } from "@/components/university/WordReveal";

describe("WordReveal", () => {
  it("wraps every word in a reveal span", () => {
    const { container } = render(<WordReveal text="Grow into the life" />);
    expect(container.querySelectorAll("span.w")).toHaveLength(4);
  });

  it("gives each word an increasing --i index for the stagger", () => {
    const { container } = render(<WordReveal text="one two three" />);
    const words = [...container.querySelectorAll<HTMLElement>("span.w")];
    expect(words.map((w) => w.style.getPropertyValue("--i"))).toEqual([
      "0",
      "1",
      "2",
    ]);
  });

  it("renders script words in the accent face", () => {
    const { container } = render(<WordReveal text="the *abundant* life" />);
    const script = container.querySelector("span.script");
    expect(script).toHaveTextContent("abundant");
  });

  it("emits a line break where the headline asks for one", () => {
    const { container } = render(<WordReveal text="Grow into | the life" />);
    expect(container.querySelectorAll("br")).toHaveLength(1);
  });

  it("renders the readable text for assistive technology", () => {
    render(
      <h1 aria-label="Grow into the abundant life">
        <WordReveal text="Grow into the *abundant* life" />
      </h1>
    );
    expect(
      screen.getByRole("heading", { name: "Grow into the abundant life" })
    ).toBeInTheDocument();
  });
});
