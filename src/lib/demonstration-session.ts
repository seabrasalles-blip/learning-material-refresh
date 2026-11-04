import type { Modo } from "@/data/figuras";

export const demonstrationKey = (modo: Modo) => `mila-example-seen-v2-${modo}`;
export const DRAWING_TUTORIAL_KEY = "mila-drawing-tutorial-seen-v1";
export function shouldShowDrawingTutorial(): boolean {
  try { return sessionStorage.getItem(DRAWING_TUTORIAL_KEY) !== "yes"; }
  catch { return true; }
}
export function markDrawingTutorialSeen() {
  try { sessionStorage.setItem(DRAWING_TUTORIAL_KEY, "yes"); }
  catch { /* The tools tutorial remains available without storage. */ }
}
export function shouldShowDemonstration(modo: Modo): boolean {
  try { return sessionStorage.getItem(demonstrationKey(modo)) !== "yes"; }
  catch { return true; }
}
export function markDemonstrationSeen(modo: Modo) {
  try { sessionStorage.setItem(demonstrationKey(modo), "yes"); }
  catch { /* Reviewing the example remains available without storage. */ }
}