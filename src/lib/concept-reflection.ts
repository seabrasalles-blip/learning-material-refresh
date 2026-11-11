import type { Modo } from "@/data/figuras";

// Presentation-only state: never reads or writes transformation progress.
export type ReflectionStage = "reflection" | "question" | "celebration";
export type ReflectionChoice = "A" | "B" | "C";
export type ReflectionState = { stage: ReflectionStage; retry: boolean };
export const INITIAL_REFLECTION: ReflectionState = { stage: "reflection", retry: false };

export function answerReflection(choice: ReflectionChoice): ReflectionState {
  return choice === "B"
    ? { stage: "celebration", retry: false }
    : { stage: "question", retry: true };
}

export function scaleExampleMeasures(modo: Modo) {
  const modelCell = modo === "ampliar" ? 13 : 26;
  const targetCell = modo === "ampliar" ? 26 : 13;
  return { modelCell, targetCell, modelSide: 2 * modelCell, targetSide: 2 * targetCell };
}