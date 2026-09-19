import { afterEach, describe, expect, it, vi } from "vitest";
import { isClerkConfigured } from "@/lib/university/clerk";

describe("isClerkConfigured", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is false when either key is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_x");
    expect(isClerkConfigured()).toBe(false);
  });

  it("is false when both keys are missing", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    vi.stubEnv("CLERK_SECRET_KEY", "");
    expect(isClerkConfigured()).toBe(false);
  });

  it("is true when both keys are non-empty", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_x");
    expect(isClerkConfigured()).toBe(true);
  });
});
