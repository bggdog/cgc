import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UniversityHeader } from "@/components/university/UniversityHeader";

describe("UniversityHeader", () => {
  it("links to the main site sections and the university", () => {
    render(<UniversityHeader currentPath="/university" />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole("link", { name: "University" })).toHaveAttribute(
      "href",
      "/university"
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("marks the current page as active", () => {
    render(<UniversityHeader currentPath="/university" />);
    expect(screen.getByRole("link", { name: "University" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveClass("active");
  });

  it("treats university sub-pages as active too", () => {
    render(<UniversityHeader currentPath="/university/quizzes" />);
    expect(screen.getByRole("link", { name: "University" })).toHaveClass("active");
  });

  it("gives the logo link an accessible name", () => {
    render(<UniversityHeader currentPath="/university" />);
    expect(
      screen.getByRole("link", { name: "Carrie Grace — home" })
    ).toBeInTheDocument();
  });

  it("toggles the mobile menu open and closed", () => {
    const { container } = render(<UniversityHeader currentPath="/university" />);
    const button = screen.getByRole("button", { name: "Menu" });

    fireEvent.click(button);
    expect(container.querySelector("nav")).toHaveClass("Menu_Open__12jRk");
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(container.querySelector("nav")).not.toHaveClass("Menu_Open__12jRk");
  });

  it("closes the menu on Escape", () => {
    const { container } = render(<UniversityHeader currentPath="/university" />);

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(container.querySelector("nav")).not.toHaveClass("Menu_Open__12jRk");
  });

  it("toggles the services submenu", () => {
    const { container } = render(<UniversityHeader currentPath="/university" />);
    const chevron = screen.getByRole("button", { name: "Toggle Submenu" });

    fireEvent.click(chevron);

    expect(
      container.querySelector(".SmoothOpen_SmoothOpen__1J7VQ")
    ).toHaveClass("SmoothOpen_isOpen__eFutI");
  });

  it("renders the auth slot when one is supplied", () => {
    render(
      <UniversityHeader
        currentPath="/university"
        authSlot={<span data-testid="auth">account</span>}
      />
    );
    expect(screen.getByTestId("auth")).toBeInTheDocument();
  });

  it("renders no auth slot by default", () => {
    render(<UniversityHeader currentPath="/university" />);
    expect(screen.queryByTestId("auth")).toBeNull();
  });
});
