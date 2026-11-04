import { expect, it, vi } from "vitest";
import { DRAWING_TUTORIAL_KEY, demonstrationKey, markDemonstrationSeen, markDrawingTutorialSeen, shouldShowDemonstration, shouldShowDrawingTutorial } from "./demonstration-session";

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

it("old-version viewing never suppresses the new demonstrations or tool tutorial", () => {
  const values = new Map<string, string>([["mila-example-seen-reduzir", "yes"], ["mila-example-seen-ampliar", "yes"]]);
  vi.stubGlobal("sessionStorage", { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v) });
  try {
    expect(demonstrationKey("reduzir")).toBe("mila-example-seen-v2-reduzir");
    expect(shouldShowDemonstration("reduzir")).toBe(true);
    expect(shouldShowDemonstration("ampliar")).toBe(true);
    expect(shouldShowDrawingTutorial()).toBe(true);
  } finally { vi.unstubAllGlobals(); }
});

it("learning the tools is shared across modes without touching recorded progress", () => {
  const progress = '[{"figura":"flor","modo":"reduzir"}]';
  const values = new Map<string, string>([["mila-transformations", progress]]);
  vi.stubGlobal("sessionStorage", { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v) });
  try {
    markDrawingTutorialSeen();
    expect(values.get(DRAWING_TUTORIAL_KEY)).toBe("yes");
    expect(shouldShowDrawingTutorial()).toBe(false);
    expect(shouldShowDemonstration("ampliar")).toBe(true);
    expect(values.get("mila-transformations")).toBe(progress);
  } finally { vi.unstubAllGlobals(); }
});

it("skipping a scale demonstration does not mark the tools as learned", () => {
  const values = new Map<string, string>();
  vi.stubGlobal("sessionStorage", { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => values.set(k, v) });
  try {
    markDemonstrationSeen("reduzir");
    expect(shouldShowDrawingTutorial()).toBe(true);
  } finally { vi.unstubAllGlobals(); }
});