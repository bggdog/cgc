/**
 * `next/font/google`'s real module body is intentionally empty — Next's
 * webpack/Turbopack build swaps in generated font-loading code via a
 * dedicated loader, and that file is never actually executed. Outside of
 * Next's own bundler (i.e. under Vitest/Vite) the empty module resolves and
 * calling e.g. `Poppins(...)` throws `TypeError: Poppins is not a function`.
 *
 * `vitest.config.ts` aliases `next/font/google` to this file so any
 * component under test that imports a Google font gets a lightweight stand-in
 * instead of the (deliberately empty) real module.
 */
import { vi } from "vitest";

type FontLoaderOptions = {
  variable?: string;
};

function makeFontLoader() {
  return vi.fn((options: FontLoaderOptions = {}) => ({
    className: "mock-font-className",
    variable: options.variable ?? "",
    style: { fontFamily: "mock-font" },
  }));
}

export const Poppins = makeFontLoader();
export const Pinyon_Script = makeFontLoader();
