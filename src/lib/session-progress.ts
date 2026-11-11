import { useSyncExternalStore } from "react";
import type { Modo } from "@/data/figuras";

export type Completion = { figura: string; modo: Modo };
const KEY = "mila-transformations";
const EMPTY: Completion[] = [];
let snapshot: Completion[] = EMPTY;
let serialized = "";
const listeners = new Set<() => void>();

export function recordCompletion(progress: Completion[], completion: Completion): Completion[] {
  return progress.some(p => p.figura === completion.figura && p.modo === completion.modo) ? progress : [...progress, completion];
}
export function figureProgress(progress: Completion[], figura?: string): Completion[] {
  return figura ? progress.filter(p => p.figura === figura) : EMPTY;
}
export function journeyComplete(progress: Completion[], figura: string) {
  const current = figureProgress(progress, figura);
  return current.some(p => p.modo === "reduzir") && current.some(p => p.modo === "ampliar");
}
export function nextMode(progress: Completion[], figura: string): Modo {
  return figureProgress(progress, figura).some(p => p.modo === "reduzir") ? "ampliar" : "reduzir";
}
function read() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = sessionStorage.getItem(KEY) ?? "[]";
    if (raw !== serialized) {
      const parsed: unknown = JSON.parse(raw);
      snapshot = Array.isArray(parsed) ? parsed.filter((p): p is Completion => p && typeof p.figura === "string" && (p.modo === "reduzir" || p.modo === "ampliar")).reduce<Completion[]>((items, p) => recordCompletion(items, p), []) : EMPTY;
      serialized = raw;
    }
  } catch { /* The in-memory session remains available when storage is blocked. */ }
  return snapshot;
}
export function completeActivity(completion: Completion) {
  snapshot = recordCompletion(read(), completion);
  serialized = JSON.stringify(snapshot);
  try { sessionStorage.setItem(KEY, serialized); } catch { /* No persistent storage required. */ }
  listeners.forEach(listener => listener());
  return snapshot;
}
export function resetSessionProgress() {
  snapshot = EMPTY;
  serialized = "[]";
  try { sessionStorage.setItem(KEY, serialized); } catch { /* Reset also works in memory. */ }
  listeners.forEach(listener => listener());
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function useSessionProgress(figura?: string) {
  const history = useSyncExternalStore(subscribe, read, () => EMPTY);
  const progress = figureProgress(history, figura);
  return { progress, complete: figura ? journeyComplete(history, figura) : false, next: figura ? nextMode(history, figura) : "reduzir" as Modo };
}