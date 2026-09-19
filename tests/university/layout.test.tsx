import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UniversityShell } from "@/app/(university)/shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/university",
}));

describe("UniversityShell", () => {
  it("renders the header and its children", () => {
    render(
      <UniversityShell>
        <p>page content</p>
      </UniversityShell>
    );

    expect(screen.getByRole("link", { name: "University" })).toBeInTheDocument();
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("scopes its children under the lau-shell class", () => {
    const { container } = render(
      <UniversityShell>
        <p>page content</p>
      </UniversityShell>
    );

    expect(container.querySelector(".lau-shell")).toBeInTheDocument();
  });
});
