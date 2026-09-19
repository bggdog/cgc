import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotchFrame } from "@/components/university/NotchFrame";

describe("NotchFrame", () => {
  it("renders the image with its alt text", () => {
    render(<NotchFrame src="/media/hero" alt="Carrie leading a session" />);
    expect(
      screen.getByRole("img", { name: "Carrie leading a session" })
    ).toBeInTheDocument();
  });

  it("renders the caption tag when one is given", () => {
    render(<NotchFrame src="/media/hero" alt="Hero" tag="The University" />);
    expect(screen.getByText("The University")).toHaveClass("tag");
  });

  it("omits the notch entirely when there is no tag", () => {
    const { container } = render(<NotchFrame src="/media/hero" alt="Hero" />);
    expect(container.querySelector(".notch")).toBeNull();
  });

  it("merges extra classes onto the frame", () => {
    const { container } = render(
      <NotchFrame src="/media/hero" alt="Hero" className="tall" />
    );
    expect(container.querySelector(".frame")).toHaveClass("tall");
  });
});
