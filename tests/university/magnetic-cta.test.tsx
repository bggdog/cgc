import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MagneticCta } from "@/components/university/MagneticCta";
import { setMediaQuery } from "@/tests/helpers/dom-mocks";

describe("MagneticCta", () => {
  it("renders a link with the label and the gold ring", () => {
    const { container } = render(
      <MagneticCta href="/university/courses" label="Explore the Courses" />
    );

    const link = screen.getByRole("link", { name: "Explore the Courses" });
    expect(link).toHaveAttribute("href", "/university/courses");
    expect(link).toHaveClass("cta");
    expect(container.querySelector(".ring")).toBeInTheDocument();
  });

  it("applies the ghost variant class when asked", () => {
    render(<MagneticCta href="/x" label="Secondary" variant="ghost" />);
    expect(screen.getByRole("link", { name: "Secondary" })).toHaveClass("ghost");
  });

  it("does not move on a coarse pointer", () => {
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });

    expect(link.style.transform).toBe("");
  });

  it("pulls toward the cursor on a fine pointer", () => {
    setMediaQuery("(pointer:fine)", true);
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });

    expect(link.style.transform).toMatch(/^translate\(/);
  });

  it("returns to rest when the cursor leaves", () => {
    setMediaQuery("(pointer:fine)", true);
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });
    fireEvent.mouseLeave(link);

    expect(link.style.transform).toBe("translate(0px, 0px)");
  });

  it("stays still when the visitor prefers reduced motion", () => {
    setMediaQuery("(pointer:fine)", true);
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    render(<MagneticCta href="/x" label="Go" />);
    const link = screen.getByRole("link", { name: "Go" });

    fireEvent.mouseMove(link, { clientX: 400, clientY: 400 });

    expect(link.style.transform).toBe("");
  });
});
