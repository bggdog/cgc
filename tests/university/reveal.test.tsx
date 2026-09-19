import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/university/Reveal";
import { MockIntersectionObserver, setMediaQuery } from "@/tests/helpers/dom-mocks";

describe("Reveal", () => {
  it("starts hidden, without the in class", () => {
    const { container } = render(
      <Reveal className="band">
        <p>content</p>
      </Reveal>
    );
    expect(container.querySelector("section")).not.toHaveClass("in");
  });

  it("starts revealed when eager (above-the-fold hero)", () => {
    const { container } = render(
      <Reveal className="hero" eager>
        <p>content</p>
      </Reveal>
    );
    expect(container.querySelector("section")).toHaveClass("hero", "in");
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("adds the in class once the section intersects", () => {
    const { container } = render(
      <Reveal className="band">
        <p>content</p>
      </Reveal>
    );

    act(() => {
      MockIntersectionObserver.instances[0].trigger(true);
    });

    expect(container.querySelector("section")).toHaveClass("band", "in");
  });

  it("stays hidden while the section is out of view", () => {
    const { container } = render(
      <Reveal className="band">
        <p>content</p>
      </Reveal>
    );

    act(() => {
      MockIntersectionObserver.instances[0].trigger(false);
    });

    expect(container.querySelector("section")).not.toHaveClass("in");
  });

  it("shows immediately when the visitor prefers reduced motion", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);

    const { container } = render(
      <Reveal className="band">
        <p>content</p>
      </Reveal>
    );

    expect(container.querySelector("section")).toHaveClass("in");
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("renders a div when asked, for panel elements", () => {
    const { container } = render(
      <Reveal as="div" className="panel">
        <p>content</p>
      </Reveal>
    );
    expect(container.querySelector("div.panel")).toBeInTheDocument();
  });
});
