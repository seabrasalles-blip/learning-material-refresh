import { beforeEach, describe, expect, it } from "vitest";
import { drawingHint, markDrawingHintsDone, shouldShowDrawingHints } from "./drawing-hints";
import { readProgress } from "./session-progress";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as any).sessionStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v), removeItem: (k: string) => store.delete(k) };
});

describe("drawing hints", () => {
  it("follows the first-click sequence and disappears after three segments", () => {
    expect(drawingHint(null, 0)).toBe("Clique em um cruzamento para começar.");
    expect(drawingHint([1, 1], 0)).toBe("Agora escolha outro ponto para formar uma linha.");
    expect(drawingHint([2, 1], 1)).toBe("Continue ligando os pontos do desenho.");
    expect(drawingHint([2, 1], 3)).toBeNull();
  });
  it("is not repeated after being completed in the session", () => {
    expect(shouldShowDrawingHints()).toBe(true);
    markDrawingHintsDone();
    expect(shouldShowDrawingHints()).toBe(false);
  });
  it("does not touch student progress", () => {
    markDrawingHintsDone();
    expect(readProgress()).toEqual([]);
  });
});
