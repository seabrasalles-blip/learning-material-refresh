import { describe, expect, it } from "vitest";
import { answerReflection, INITIAL_REFLECTION, scaleExampleMeasures } from "./concept-reflection";

describe("conceptual synthesis independent from the drawing journey", () => {
  it("starts before celebration", () => {
    expect(INITIAL_REFLECTION.stage).toBe("reflection");
  });
  it("A permits another attempt without celebration", () => {
    expect(answerReflection("A")).toEqual({ stage: "question", retry: true });
  });
  it("C permits another attempt without celebration", () => {
    expect(answerReflection("C")).toEqual({ stage: "question", retry: true });
  });
  it("B releases celebration, including after an incorrect attempt", () => {
    expect(answerReflection("A").stage).toBe("question");
    expect(answerReflection("B")).toEqual({ stage: "celebration", retry: false });
  });
  it("enlarges corresponding sides by exactly 2 without changing cell counts", () => {
    const m = scaleExampleMeasures("ampliar");
    expect(m).toEqual({ modelCell: 13, targetCell: 26, modelSide: 26, targetSide: 52 });
    expect(m.targetSide / m.modelSide).toBe(2);
  });
  it("reduces corresponding sides by exactly 1/2 without changing cell counts", () => {
    const m = scaleExampleMeasures("reduzir");
    expect(m).toEqual({ modelCell: 26, targetCell: 13, modelSide: 52, targetSide: 26 });
    expect(m.targetSide / m.modelSide).toBe(1 / 2);
  });
});