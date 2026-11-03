import type { Segmento, Vertex } from "@/data/figuras";

export function eraseSegment(segmentos: Segmento[], index: number): Segmento[] {
  return segmentos.filter((_, i) => i !== index);
}

export function nearestSegment(segmentos: Segmento[], point: Vertex, tolerance: number): number | null {
  let selected: number | null = null;
  let nearest = tolerance;
  segmentos.forEach(([[ax, ay], [bx, by]], index) => {
    const dx = bx - ax, dy = by - ay;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared ? Math.max(0, Math.min(1, ((point[0] - ax) * dx + (point[1] - ay) * dy) / lengthSquared)) : 0;
    const distance = Math.hypot(point[0] - ax - t * dx, point[1] - ay - t * dy);
    if (distance <= nearest) { nearest = distance; selected = index; }
  });
  return selected;
}