import { expect, it, vi } from "vitest";
import { markDemonstrationSeen, shouldShowDemonstration } from "./demonstration-session";

it("viewing reduction does not skip the first enlargement demonstration", () => {
  const values = new Map<string, string>();
  vi.stubGlobal("sessionStorage", { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v) });
  try {
    expect(shouldShowDemonstration("reduzir")).toBe(true);
    expect(shouldShowDemonstration("ampliar")).toBe(true);
    markDemonstrationSeen("reduzir");
    expect(shouldShowDemonstration("reduzir")).toBe(false);
    expect(shouldShowDemonstration("ampliar")).toBe(true);
    markDemonstrationSeen("ampliar");
    expect(shouldShowDemonstration("ampliar")).toBe(false);
  } finally { vi.unstubAllGlobals(); }
});