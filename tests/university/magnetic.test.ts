import { describe, expect, it } from "vitest";
import { MAGNETIC_MAX_PX, clampPull } from "@/lib/university/magnetic";

describe("clampPull", () => {
  it("scales small distances by the strength factor", () => {
    expect(clampPull(10)).toBeCloseTo(1.8);
  });

  it("clamps large positive distances to the maximum", () => {
    expect(clampPull(5000)).toBe(MAGNETIC_MAX_PX);
  });

  it("clamps large negative distances to the negative maximum", () => {
    expect(clampPull(-5000)).toBe(-MAGNETIC_MAX_PX);
  });

  it("returns zero at the centre", () => {
    expect(clampPull(0)).toBe(0);
  });
});
