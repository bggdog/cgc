import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { UniversityAuthControls } from "@/components/university/UniversityAuthControls";
import { UniversityShell } from "@/app/(university)/shell";

vi.mock("@clerk/nextjs", () => ({
  SignedOut: ({ children }: { children: ReactNode }) => <>{children}</>,
  SignedIn: () => null,
  SignInButton: ({ children }: { children: ReactNode }) => <>{children}</>,
  UserButton: () => <div data-testid="user-button" />,
  ClerkProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/university",
}));

describe("UniversityAuthControls", () => {
  it("renders a Sign in control when signed out", () => {
    render(<UniversityAuthControls />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByTestId("auth")).toBeInTheDocument();
  });
});

describe("UniversityShell auth wiring", () => {
  it("passes auth controls into the header when Clerk is configured", () => {
    render(
      <UniversityShell clerkConfigured>
        <div>page</div>
      </UniversityShell>
    );
    expect(screen.getByTestId("auth")).toBeInTheDocument();
  });

  it("omits auth controls when Clerk is not configured", () => {
    render(
      <UniversityShell clerkConfigured={false}>
        <div>page</div>
      </UniversityShell>
    );
    expect(screen.queryByTestId("auth")).toBeNull();
  });
});
