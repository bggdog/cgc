import { vi } from "vitest";

export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly elements = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.elements.add(element);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
  }

  disconnect(): void {
    this.elements.clear();
  }

  /** Test helper: fire the observer callback for every observed element. */
  trigger(isIntersecting = true): void {
    const entries = [...this.elements].map(
      (target) => ({ target, isIntersecting }) as IntersectionObserverEntry
    );
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

const matchedQueries = new Set<string>();

/** Test helper: make `window.matchMedia(query).matches` return true. */
export function setMediaQuery(query: string, matches: boolean): void {
  if (matches) matchedQueries.add(query);
  else matchedQueries.delete(query);
}

/** Installs both mocks as globals. Called once from `vitest.setup.ts`. */
export function installDomMocks(): void {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matchedQueries.has(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/** Clears mock state between tests. */
export function resetDomMocks(): void {
  MockIntersectionObserver.instances.length = 0;
  matchedQueries.clear();
}
