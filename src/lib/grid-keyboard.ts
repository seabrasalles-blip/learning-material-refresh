import type { Vertex } from "@/data/figuras";

export function moveGridCursor(vertex: Vertex, key: string, cols: number, rows: number): Vertex {
  const [col, row] = vertex;
  switch (key) {
    case "ArrowLeft": return [Math.max(1, col - 1), row];
    case "ArrowRight": return [Math.min(cols + 1, col + 1), row];
    case "ArrowUp": return [col, Math.max(1, row - 1)];
    case "ArrowDown": return [col, Math.min(rows + 1, row + 1)];
    default: return vertex;
  }
}