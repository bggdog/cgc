import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClosingCta } from "@/components/university/landing/ClosingCta";
import { Hero } from "@/components/university/landing/Hero";
import { Pathway } from "@/components/university/landing/Pathway";
import { PricingTeaser } from "@/components/university/landing/PricingTeaser";
import { QuizTeaser } from "@/components/university/landing/QuizTeaser";

describe("Hero", () => {
  it("renders one readable headline for assistive technology", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Grow into the abundant life you were made for",
      })
    ).toBeInTheDocument();
  });

  it("offers both the catalog and the free quiz", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Explore the Courses" })).toHaveAttribute(
      "href",
      "/university#courses"
    );
    expect(screen.getByRole("link", { name: "Take a Free Quiz" })).toHaveAttribute(
      "href",
      "/university/quizzes"
    );
  });
});

describe("Pathway", () => {
  it("renders three numbered steps", () => {
    const { container } = render(<Pathway />);
    expect(container.querySelectorAll(".item")).toHaveLength(3);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});

describe("QuizTeaser", () => {
  it("links to the quizzes and says they are free", () => {
    render(<QuizTeaser />);
    expect(
      screen.getByRole("link", { name: "Take a Free Quiz" })
    ).toHaveAttribute("href", "/university/quizzes");
    expect(screen.getByText("Free to Take")).toHaveClass("eyebrow");
  });

  it("names the dimensions the quiz scores", () => {
    render(<QuizTeaser />);
    expect(screen.getByText("Rest")).toBeInTheDocument();
    expect(screen.getByText("Resilience")).toBeInTheDocument();
  });
});

describe("PricingTeaser", () => {
  it("shows both the per-course and the membership options", () => {
    render(
      <PricingTeaser
        lowestCoursePriceLabel="$99"
        membershipPriceLabel="$29"
        membershipInterval="month"
      />
    );
    expect(screen.getByText("Single Course")).toBeInTheDocument();
    expect(screen.getByText("All-Access Membership")).toBeInTheDocument();
    expect(screen.getByText("From $99")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("/month")).toBeInTheDocument();
  });
});

describe("ClosingCta", () => {
  it("renders the closing heading and a route back to the site", () => {
    render(<ClosingCta />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Your next season starts here/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Back to Carrie Grace" })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
