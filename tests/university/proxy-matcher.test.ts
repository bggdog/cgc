import { describe, expect, it } from "vitest";
import { CLERK_PROXY_MATCHERS } from "../../proxy";

describe("CLERK_PROXY_MATCHERS", () => {
  it("scopes Clerk to university and auth routes only", () => {
    expect(CLERK_PROXY_MATCHERS).toEqual([
      "/university/:path*",
      "/sign-in(.*)",
      "/sign-up(.*)",
    ]);
  });
});
