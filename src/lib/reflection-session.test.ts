import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FIGURAS, type Modo } from "@/data/figuras";
import { completeActivity, resetSessionProgress, type Completion } from "./session-progress";
import { assignReflectionQuestions, continueReflection, presentReflection, REFLECTION_SESSION_KEY, resetReflectionQuestions, submitReflectionAnswer, syncReflectionQuestions } from "./reflection-session";
import { ORIGINAL_QUESTION_ID, REFLECTION_QUESTIONS, reflectionQuestion } from "./reflection-questions";

const pair = (figura: string, first: Modo = "reduzir"): Completion[] => [{ figura, modo: first }, { figura, modo: first === "reduzir" ? "ampliar" : "reduzir" }];
let storage: Map<string, string>;
const saved = () => JSON.parse(storage.get(REFLECTION_SESSION_KEY) ?? "[]");
beforeEach(() => {
  storage = new Map();
  vi.stubGlobal("window", {});
  vi.stubGlobal("sessionStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) });
  resetSessionProgress();
});
afterEach(() => { resetSessionProgress(); vi.unstubAllGlobals(); });

describe("mandatory session reflection sequence", () => {
  for (const figura of Object.keys(FIGURAS)) for (const first of ["ampliar", "reduzir"] as const) {
    it(`always gives the original first for ${figura}, ${first} first`, () => {
      expect(assignReflectionQuestions([], pair(figura, first), () => .999)[0]?.questionId).toBe(ORIGINAL_QUESTION_ID);
    });
  }
  it("has seven questions with three distinct alternatives and a valid correct choice", () => {
    expect(REFLECTION_QUESTIONS).toHaveLength(7);
    expect(new Set(REFLECTION_QUESTIONS.map(q => q.id)).size).toBe(7);
    for (const q of REFLECTION_QUESTIONS) {
      expect(q.choices.map(c => c.id)).toEqual(["A", "B", "C"]);
      expect(q.choices.some(c => c.id === q.correct)).toBe(true);
    }
  });
  it("does not allocate for one mode, duplicate modes or mixed figures", () => {
    expect(assignReflectionQuestions([], [{ figura: "peixe", modo: "ampliar" }, { figura: "peixe", modo: "ampliar" }, { figura: "casa", modo: "reduzir" }])).toEqual([]);
  });
  it("assigns first by completion order, not reflection visit order", () => {
    const progress: Completion[] = [{ figura: "casa", modo: "ampliar" }, ...pair("peixe"), { figura: "casa", modo: "reduzir" }];
    presentReflection("casa", progress);
    expect(saved()[0]).toMatchObject({ figura: "peixe", questionId: ORIGINAL_QUESTION_ID, presented: false });
    expect(saved()[1]).toMatchObject({ figura: "casa", presented: true });
    expect(saved()[1].questionId).not.toBe(ORIGINAL_QUESTION_ID);
  });
  it("uses all six additional questions without repetition and excludes the original from the lottery", () => {
    // A seventh completed identity exercises bank exhaustion independently of the six supplied drawings.
    const progress = Array.from({ length: 7 }, (_, i) => pair(`figure-${i}`)).flat();
    const history = assignReflectionQuestions([], progress, () => .5);
    expect(history.map(h => h.questionId)[0]).toBe(ORIGINAL_QUESTION_ID);
    expect(new Set(history.map(h => h.questionId)).size).toBe(7);
    expect(history.slice(1).some(h => h.questionId === ORIGINAL_QUESTION_ID)).toBe(false);
  });
  it("lottery results depend on random input, not figure identity", () => {
    const fish = assignReflectionQuestions([], [...pair("casa"), ...pair("peixe")], () => 0);
    const flower = assignReflectionQuestions([], [...pair("casa"), ...pair("flor")], () => 0);
    expect(fish[1]?.questionId).toBe(flower[1]?.questionId);
    expect(assignReflectionQuestions([], [...pair("casa"), ...pair("peixe")], () => .999)[1]?.questionId).not.toBe(fish[1]?.questionId);
  });
  it("replaying or revisiting completed figures does not consume another question", () => {
    const history = assignReflectionQuestions([], pair("peixe"));
    expect(assignReflectionQuestions(history, [...pair("peixe"), ...pair("peixe")], () => { throw new Error("must not draw again"); })).toBe(history);
    presentReflection("peixe", pair("peixe"));
    const before = storage.get(REFLECTION_SESSION_KEY);
    presentReflection("peixe", pair("peixe"));
    expect(storage.get(REFLECTION_SESSION_KEY)).toBe(before);
  });
  it("restores assignment, retry and celebration from storage after a reload", () => {
    presentReflection("peixe", pair("peixe"));
    continueReflection("peixe");
    submitReflectionAnswer("peixe", "A");
    const retry = storage.get(REFLECTION_SESSION_KEY);
    resetReflectionQuestions();
    storage.set(REFLECTION_SESSION_KEY, retry ?? "[]");
    expect(syncReflectionQuestions(pair("peixe"))[0]).toMatchObject({ questionId: ORIGINAL_QUESTION_ID, stage: "question", retry: true, choice: "A" });
    submitReflectionAnswer("peixe", "B");
    const success = storage.get(REFLECTION_SESSION_KEY);
    resetReflectionQuestions();
    storage.set(REFLECTION_SESSION_KEY, success ?? "[]");
    presentReflection("peixe", pair("peixe"));
    expect(saved()[0]).toMatchObject({ stage: "celebration", retry: false });
  });
  it("all questions allow repeated attempts and celebrate only their correct answer", () => {
    const progress = Array.from({ length: 7 }, (_, i) => pair(`figure-${i}`)).flat();
    const history = syncReflectionQuestions(progress);
    for (const entry of history) {
      presentReflection(entry.figura, progress);
      continueReflection(entry.figura);
      const question = reflectionQuestion(entry.questionId);
      for (const choice of question.choices.filter(c => c.id !== question.correct)) {
        submitReflectionAnswer(entry.figura, choice.id);
        expect(saved().find((e: { figura: string }) => e.figura === entry.figura)).toMatchObject({ stage: "question", retry: true });
      }
      submitReflectionAnswer(entry.figura, question.correct);
      expect(saved().find((e: { figura: string }) => e.figura === entry.figura)).toMatchObject({ stage: "celebration", retry: false });
    }
  });
  it("reflection attempts preserve transformation progress", () => {
    for (const completion of pair("peixe")) completeActivity(completion);
    const before = storage.get("mila-transformations");
    presentReflection("peixe", pair("peixe"));
    continueReflection("peixe"); submitReflectionAnswer("peixe", "C"); submitReflectionAnswer("peixe", "B");
    expect(storage.get("mila-transformations")).toBe(before);
  });
  it("full restart clears question history and restores original for a different figure", () => {
    for (const completion of [...pair("peixe"), ...pair("casa")]) completeActivity(completion);
    expect(saved()).toHaveLength(2);
    resetSessionProgress();
    expect(saved()).toEqual([]);
    for (const completion of pair("flor", "ampliar")) completeActivity(completion);
    expect(saved()).toHaveLength(1);
    expect(saved()[0].questionId).toBe(ORIGINAL_QUESTION_ID);
  });
});