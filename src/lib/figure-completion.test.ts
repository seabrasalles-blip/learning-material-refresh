import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { completeActivity, figureFullyComplete, resetSessionProgress, type Completion } from "./session-progress";
import { continueReflection, presentReflection, REFLECTION_SESSION_KEY, submitReflectionAnswer, syncReflectionQuestions } from "./reflection-session";
import { reflectionQuestion } from "./reflection-questions";

let storage: Map<string, string>;
beforeEach(() => {
  storage = new Map();
  vi.stubGlobal("window", {});
  vi.stubGlobal("sessionStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
  resetSessionProgress();
});
afterEach(() => { resetSessionProgress(); vi.unstubAllGlobals(); });
const pair = (figura: string): Completion[] => [{ figura, modo: "ampliar" }, { figura, modo: "reduzir" }];
function answer(figura: string, progress: Completion[]) {
  presentReflection(figura, progress);
  continueReflection(figura);
  const entry = syncReflectionQuestions(progress).find(item => item.figura === figura);
  if (!entry) throw new Error("Missing reflection assignment");
  submitReflectionAnswer(figura, reflectionQuestion(entry.questionId).correct);
  return syncReflectionQuestions(progress);
}
describe("full per-figure menu completion", () => {
  it("has no completion without activities", () => {
    expect(figureFullyComplete([], [], "peixe")).toBe(false);
  });
  it("does not complete fish after enlargement alone", () => {
    expect(figureFullyComplete([{ figura: "peixe", modo: "ampliar" }], [], "peixe")).toBe(false);
  });
  it("does not complete fish with pending reflection after both transformations", () => {
    const progress = pair("peixe");
    expect(figureFullyComplete(progress, syncReflectionQuestions(progress), "peixe")).toBe(false);
  });
  it("does not complete fish on a wrong reflection answer", () => {
    const progress = pair("peixe");
    presentReflection("peixe", progress); continueReflection("peixe"); submitReflectionAnswer("peixe", "A");
    expect(figureFullyComplete(progress, syncReflectionQuestions(progress), "peixe")).toBe(false);
  });
  it("completes fish after its correct answer", () => {
    expect(figureFullyComplete(pair("peixe"), answer("peixe", pair("peixe")), "peixe")).toBe(true);
  });
  it("adds flower completion without erasing fish or completing boat", () => {
    const progress = [...pair("peixe"), ...pair("flor"), ...pair("barco")];
    answer("peixe", progress);
    const reflections = answer("flor", progress);
    expect(figureFullyComplete(progress, reflections, "peixe")).toBe(true);
    expect(figureFullyComplete(progress, reflections, "flor")).toBe(true);
    expect(figureFullyComplete(progress, reflections, "barco")).toBe(false);
  });
  it("never combines modes or reflections belonging to different figures", () => {
    const reflections = answer("flor", pair("flor"));
    expect(figureFullyComplete([{ figura: "peixe", modo: "ampliar" }, { figura: "flor", modo: "reduzir" }], reflections, "peixe")).toBe(false);
    expect(figureFullyComplete(pair("peixe"), reflections, "peixe")).toBe(false);
  });
  it("preserves earned completion after re-reading storage and replaying", () => {
    let progress: Completion[] = [];
    for (const completion of pair("peixe")) progress = completeActivity(completion);
    answer("peixe", progress);
    const saved = storage.get(REFLECTION_SESSION_KEY);
    presentReflection("peixe", progress);
    progress = completeActivity({ figura: "peixe", modo: "ampliar" });
    expect(storage.get(REFLECTION_SESSION_KEY)).toBe(saved);
    expect(figureFullyComplete(progress, syncReflectionQuestions(progress), "peixe")).toBe(true);
  });
  it("full reset removes checks and clears question history", () => {
    let progress: Completion[] = [];
    for (const completion of pair("peixe")) progress = completeActivity(completion);
    answer("peixe", progress);
    const cleared = resetSessionProgress();
    expect(figureFullyComplete(cleared, syncReflectionQuestions(cleared), "peixe")).toBe(false);
    expect(storage.get(REFLECTION_SESSION_KEY)).toBe("[]");
  });
});