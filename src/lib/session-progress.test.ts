import { describe, expect, it, vi } from "vitest";
import { completeActivity, journeyComplete, nextMode, recordCompletion, resetSessionProgress } from "./session-progress";
describe("main pedagogical journey", () => {
  it("does not conclude after just one reduction", () => {
    expect(journeyComplete([{ figura: "peixe", modo: "reduzir" }])).toBe(false);
  });
  it("does not conclude after just one enlargement", () => {
    expect(journeyComplete([{ figura: "casa", modo: "ampliar" }])).toBe(false);
  });
  it("concludes with one success in each mode, even on different figures", () => {
    expect(journeyComplete([{ figura: "peixe", modo: "reduzir" }, { figura: "casa", modo: "ampliar" }])).toBe(true);
  });
  it("repeating a mode cannot satisfy both transformations", () => {
    const first = recordCompletion([], { figura: "peixe", modo: "reduzir" });
    const repeated = recordCompletion(first, { figura: "flor", modo: "reduzir" });
    expect(repeated).toEqual(first);
    expect(journeyComplete(repeated)).toBe(false);
  });
  it("preserves the earlier success when completing another figure", () => {
    const first = [{ figura: "peixe", modo: "reduzir" as const }];
    expect(recordCompletion(first, { figura: "barco", modo: "ampliar" })).toEqual([...first, { figura: "barco", modo: "ampliar" }]);
  });
  it("invites the transformation not yet completed", () => {
    expect(nextMode([{ figura: "flor", modo: "reduzir" }])).toBe("ampliar");
    expect(nextMode([{ figura: "flor", modo: "ampliar" }])).toBe("reduzir");
  });
  it("replay resets both transformations in storage and allows a genuinely new journey", () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("window", {});
    vi.stubGlobal("sessionStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
    try {
      resetSessionProgress();
      completeActivity({ figura: "peixe", modo: "reduzir" });
      expect(journeyComplete(completeActivity({ figura: "casa", modo: "ampliar" }))).toBe(true);
      expect(resetSessionProgress()).toEqual([]);
      expect(storage.get("mila-transformations")).toBe("[]");
      const first = completeActivity({ figura: "flor", modo: "reduzir" });
      expect(first).toHaveLength(1);
      expect(journeyComplete(first)).toBe(false);
      expect(journeyComplete(completeActivity({ figura: "barco", modo: "ampliar" }))).toBe(true);
    } finally { resetSessionProgress(); vi.unstubAllGlobals(); }
  });
});