import type { Vertex } from "@/data/figuras";

// Presentation-only session memory: separate from student progress.
export const DRAWING_HINTS_KEY = "mila-drawing-hints-done";
export const HINT_SEGMENTS_TO_FINISH = 3;

export function shouldShowDrawingHints(): boolean {
  try { return sessionStorage.getItem(DRAWING_HINTS_KEY) !== "yes"; }
  catch { return true; }
}
export function markDrawingHintsDone() {
  try { sessionStorage.setItem(DRAWING_HINTS_KEY, "yes"); }
  catch { /* hints simply reappear without storage */ }
}
export function drawingHint(pending: Vertex | null, segmentCount: number): string | null {
  if (segmentCount >= HINT_SEGMENTS_TO_FINISH) return null;
  if (segmentCount > 0) return "Continue ligando os pontos do desenho.";
  if (pending) return "Agora escolha outro ponto para formar uma linha.";
  return "Clique em um cruzamento para começar.";
}
