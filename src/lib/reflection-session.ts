import { useSyncExternalStore } from "react";
import { answerReflection, INITIAL_REFLECTION, type ReflectionChoice, type ReflectionState } from "./concept-reflection";
import { ORIGINAL_QUESTION_ID, REFLECTION_QUESTIONS, reflectionQuestion } from "./reflection-questions";
import type { Completion } from "./session-progress";

export const REFLECTION_SESSION_KEY = "mila-reflection-v1";
export type QuestionAssignment = ReflectionState & { figura: string; questionId: string; presented: boolean; choice?: ReflectionChoice };
export type QuestionHistory = QuestionAssignment[];
const EMPTY: QuestionHistory = [];
let snapshot: QuestionHistory = EMPTY;
let serialized = "";
const listeners = new Set<() => void>();

// Completion order, not figure identity or reflection navigation order, determines the first question.
export function assignReflectionQuestions(history: QuestionHistory, progress: Completion[], random = Math.random): QuestionHistory {
  let result = history;
  const seenModes = new Map<string, Set<string>>();
  for (const { figura, modo } of progress) {
    const modes = seenModes.get(figura) ?? new Set<string>();
    modes.add(modo);
    seenModes.set(figura, modes);
    if (modes.size < 2 || result.some(entry => entry.figura === figura)) continue;
    const unused = REFLECTION_QUESTIONS.filter(question => question.id !== ORIGINAL_QUESTION_ID && !result.some(entry => entry.questionId === question.id));
    const questionId = result.length === 0 ? ORIGINAL_QUESTION_ID : unused[Math.min(unused.length - 1, Math.max(0, Math.floor(random() * unused.length)))]?.id ?? ORIGINAL_QUESTION_ID;
    result = [...result, { figura, questionId, presented: false, ...INITIAL_REFLECTION }];
  }
  return result;
}

function read(): QuestionHistory {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = sessionStorage.getItem(REFLECTION_SESSION_KEY) ?? "[]";
    if (raw !== serialized) {
      const parsed: unknown = JSON.parse(raw);
      snapshot = Array.isArray(parsed) ? parsed.filter((entry): entry is QuestionAssignment =>
        entry && typeof entry.figura === "string" && REFLECTION_QUESTIONS.some(q => q.id === entry.questionId) &&
        ["reflection", "question", "celebration"].includes(entry.stage) && typeof entry.retry === "boolean" && typeof entry.presented === "boolean"
      ) : EMPTY;
      serialized = raw;
    }
  } catch { /* Keep the in-memory session if browser storage is blocked. */ }
  return snapshot;
}

function write(history: QuestionHistory) {
  snapshot = history;
  serialized = JSON.stringify(history);
  try { sessionStorage.setItem(REFLECTION_SESSION_KEY, serialized); } catch { /* Session remains usable in memory. */ }
  listeners.forEach(listener => listener());
  return history;
}

export function syncReflectionQuestions(progress: Completion[]) {
  const history = read();
  const assigned = assignReflectionQuestions(history, progress);
  return assigned === history ? history : write(assigned);
}

export function presentReflection(figura: string, progress: Completion[]) {
  const history = syncReflectionQuestions(progress);
  const entry = history.find(item => item.figura === figura);
  if (!entry || entry.presented) return;
  write(history.map(item => item === entry ? { ...item, presented: true } : item));
}

export function continueReflection(figura: string) {
  write(read().map(entry => entry.figura === figura && entry.presented && entry.stage === "reflection" ? { ...entry, stage: "question", retry: false } : entry));
}

export function submitReflectionAnswer(figura: string, choice: ReflectionChoice) {
  write(read().map(entry => entry.figura === figura && entry.presented && entry.stage === "question"
    ? { ...entry, choice, ...answerReflection(choice, reflectionQuestion(entry.questionId).correct) } : entry));
}

export function resetReflectionQuestions() { return write(EMPTY); }
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useReflectionSession(figura: string) {
  return useSyncExternalStore(subscribe, read, () => EMPTY).find(entry => entry.figura === figura);
}