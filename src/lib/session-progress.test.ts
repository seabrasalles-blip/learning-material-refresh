import { describe, expect, it, vi } from "vitest";
import { completeActivity, figureProgress, journeyComplete, nextMode, recordCompletion, resetSessionProgress } from "./session-progress";

describe("per-figure pedagogical journey", () => {
  it("does not conclude after just one reduction", () => {
    expect(journeyComplete([{ figura: "peixe", modo: "reduzir" }], "peixe")).toBe(false);
  });
  it("does not conclude after just one enlargement", () => {
    expect(journeyComplete([{ figura: "casa", modo: "ampliar" }], "casa")).toBe(false);
  });
  it("never combines transformations from different figures", () => {
    const history = [{ figura: "peixe", modo: "reduzir" as const }, { figura: "casa", modo: "ampliar" as const }];
    expect(journeyComplete(history, "peixe")).toBe(false);
    expect(journeyComplete(history, "casa")).toBe(false);
  });
  it("completes fish enlargement-first only after fish reduction", () => {
    const first = recordCompletion([], { figura: "peixe", modo: "ampliar" });
    expect(nextMode(first, "peixe")).toBe("reduzir");
    expect(journeyComplete(recordCompletion(first, { figura: "peixe", modo: "reduzir" }), "peixe")).toBe(true);
  });
  it("completes house reduction-first only after house enlargement", () => {
    const first = recordCompletion([], { figura: "casa", modo: "reduzir" });
    expect(nextMode(first, "casa")).toBe("ampliar");
    expect(journeyComplete(recordCompletion(first, { figura: "casa", modo: "ampliar" }), "casa")).toBe(true);
  });
  it("deduplicates only the same figure and mode on replay", () => {
    const first = recordCompletion([], { figura: "peixe", modo: "reduzir" });
    expect(recordCompletion(first, { figura: "peixe", modo: "reduzir" })).toEqual(first);
    expect(recordCompletion(first, { figura: "flor", modo: "reduzir" })).toHaveLength(2);
  });
  it("scopes counts and invitations to the current figure", () => {
    const history = [{ figura: "peixe", modo: "reduzir" as const }, { figura: "peixe", modo: "ampliar" as const }, { figura: "casa", modo: "ampliar" as const }];
    expect(figureProgress(history, "peixe")).toHaveLength(2);
    expect(figureProgress(history, "casa")).toEqual([{ figura: "casa", modo: "ampliar" }]);
    expect(figureProgress(history, "flor")).toEqual([]);
    expect(nextMode(history, "casa")).toBe("reduzir");
  });
  it("preserves previous figures while completing another", () => {
    const fish = [{ figura: "peixe", modo: "ampliar" as const }, { figura: "peixe", modo: "reduzir" as const }];
    const history = recordCompletion(recordCompletion(fish, { figura: "casa", modo: "reduzir" }), { figura: "casa", modo: "ampliar" });
    expect(figureProgress(history, "peixe")).toEqual(fish);
    expect(journeyComplete(history, "casa")).toBe(true);
  });
  it("reads legacy valid pairs, preserves them on revisit and explicitly resets cleanly", () => {
    const storage = new Map<string, string>([["mila-transformations", JSON.stringify([{ figura: "peixe", modo: "ampliar" }, { figura: "casa", modo: "reduzir" }])]]);
    vi.stubGlobal("window", {});
    vi.stubGlobal("sessionStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
    try {
      const history = completeActivity({ figura: "peixe", modo: "reduzir" });
      expect(journeyComplete(history, "peixe")).toBe(true);
      expect(journeyComplete(history, "casa")).toBe(false);
      expect(completeActivity({ figura: "peixe", modo: "ampliar" })).toEqual(history);
      expect(resetSessionProgress()).toEqual([]);
      expect(storage.get("mila-transformations")).toBe("[]");
      const first = completeActivity({ figura: "flor", modo: "reduzir" });
      expect(first).toEqual([{ figura: "flor", modo: "reduzir" }]);
      expect(journeyComplete(first, "flor")).toBe(false);
    } finally { resetSessionProgress(); vi.unstubAllGlobals(); }
  });
});
