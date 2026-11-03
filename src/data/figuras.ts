// Grid coordinates: column letters a..j (1..10), rows 1..7
// A vertex is [col, row] (1-indexed). Origin top-left.

export type Vertex = [number, number];
export type Segmento = [Vertex, Vertex];

export interface Circulo {
  id: string;
  centro: Vertex;
  raio: number;
  preenchido?: boolean;
}

export type Modo = "reduzir" | "ampliar";

export interface Figura {
  id: string;
  nome: string;
  cols: number; // 10
  rows: number; // 7
  segmentos: Segmento[];
  // Fixed supplied geometry, separate from student-drawn segments.
  circulos?: Circulo[];
}

const f = (a: Vertex, b: Vertex): Segmento => [a, b];

// Six original Flash figures, transcribed from the supplied captures.
// See AUDITORIA.md for non-grid circular measurements and the uncertain truck handle.
export const FIGURAS: Record<string, Figura> = {
  flor: {
    id: "flor", nome: "Flor", cols: 10, rows: 8,
    segmentos: [
      f([5, 1], [4, 2]),
      f([5, 1], [6, 2]),
      f([4, 2], [4, 3]),
      f([6, 2], [6, 3]),
      f([4, 3], [5, 4]),
      f([6, 3], [5, 4]),
      f([4, 2], [5, 3]),
      f([6, 2], [5, 3]),
      f([5, 1], [5, 8]),
      f([3, 5], [4, 5]),
      f([4, 5], [5, 6]),
      f([5, 6], [4, 6]),
      f([4, 6], [3, 5]),
      f([5, 7], [6, 6]),
      f([6, 6], [7, 6]),
      f([7, 6], [6, 7]),
      f([6, 7], [5, 7]),
    ],
  },
  degraus: {
    id: "degraus", nome: "Figura em degraus", cols: 10, rows: 8,
    segmentos: [
      f([4, 1], [6, 1]),
      f([6, 1], [6, 2]),
      f([6, 2], [7, 2]),
      f([7, 2], [7, 3]),
      f([7, 3], [8, 3]),
      f([8, 3], [8, 5]),
      f([8, 5], [7, 5]),
      f([7, 5], [7, 6]),
      f([7, 6], [6, 6]),
      f([6, 6], [6, 7]),
      f([6, 7], [4, 7]),
      f([4, 7], [4, 6]),
      f([4, 6], [3, 6]),
      f([3, 6], [3, 5]),
      f([3, 5], [2, 5]),
      f([2, 5], [2, 3]),
      f([2, 3], [3, 3]),
      f([3, 3], [3, 2]),
      f([3, 2], [4, 2]),
      f([4, 2], [4, 1]),
      f([3, 4], [4, 5]),
      f([4, 4], [5, 5]),
      f([5, 5], [6, 4]),
      f([6, 5], [7, 4]),
      f([4, 5], [4, 6]),
      f([6, 5], [6, 6]),
      f([1, 7], [11, 7]),
    ],
  },
  peixe: {
    id: "peixe", nome: "Peixe", cols: 10, rows: 8,
    circulos: [
      { id: "olho", centro: [4, 3], raio: 0.3 },
    ],
    segmentos: [
      f([2, 3], [4, 2]),
      f([4, 2], [7, 2]),
      f([7, 2], [8, 3]),
      f([8, 3], [9, 2]),
      f([9, 2], [9, 6]),
      f([9, 6], [8, 5]),
      f([8, 5], [7, 6]),
      f([7, 6], [4, 6]),
      f([4, 6], [2, 5]),
      f([2, 5], [3, 4]),
      f([3, 4], [2, 3]),
    ],
  },
  barco: {
    id: "barco", nome: "Barco", cols: 10, rows: 8,
    circulos: [
      { id: "vigia-0", centro: [3.5, 6.5], raio: 0.2, preenchido: true },
      { id: "vigia-1", centro: [4.5, 6.5], raio: 0.2, preenchido: true },
      { id: "vigia-2", centro: [5.5, 6.5], raio: 0.2, preenchido: true },
      { id: "vigia-3", centro: [6.5, 6.5], raio: 0.2, preenchido: true },
      { id: "vigia-4", centro: [7.5, 6.5], raio: 0.2, preenchido: true },
    ],
    segmentos: [
      f([1, 5], [6, 1]),
      f([6, 1], [5, 6]),
      f([5, 6], [1, 5]),
      f([6, 1], [6, 6]),
      f([6, 2], [9, 5]),
      f([9, 5], [6, 6]),
      f([2, 6], [9, 6]),
      f([9, 6], [8, 7]),
      f([8, 7], [3, 7]),
      f([3, 7], [2, 6]),
      f([1, 7], [11, 7]),
    ],
  },
  caminhao: {
    id: "caminhao", nome: "Caminhão", cols: 10, rows: 8,
    circulos: [
      { id: "roda-traseira", centro: [3.5, 7], raio: 0.85 },
      { id: "roda-dianteira", centro: [8.2, 7], raio: 0.85 },
    ],
    segmentos: [
      f([1, 4], [3, 2]),
      f([3, 2], [7, 2]),
      f([7, 2], [7, 7]),
      f([7, 7], [1, 7]),
      f([1, 7], [1, 4]),
      f([1, 6], [10, 6]),
      f([4, 2], [4, 4]),
      f([5, 2], [5, 4]),
      f([6, 2], [6, 4]),
      f([7, 3], [10, 3]),
      f([10, 3], [10, 7]),
      f([10, 7], [7, 7]),
      f([8, 3], [8, 5]),
      f([8, 5], [10, 5]),
    ],
  },
  casa: {
    id: "casa", nome: "Casa", cols: 10, rows: 8,
    segmentos: [
      f([1, 3], [3, 1]),
      f([3, 1], [8, 1]),
      f([8, 1], [10, 3]),
      f([10, 3], [1, 3]),
      f([2, 3], [2, 7]),
      f([9, 3], [9, 7]),
      f([1, 7], [11, 7]),
      f([3, 4], [4, 4]),
      f([4, 4], [4, 6]),
      f([4, 6], [3, 6]),
      f([3, 6], [3, 4]),
      f([7, 4], [8, 4]),
      f([8, 4], [8, 6]),
      f([8, 6], [7, 6]),
      f([7, 6], [7, 4]),
      f([5, 7], [5, 5]),
      f([5, 5], [6, 5]),
      f([6, 5], [6, 7]),
    ],
  },
};

export const FIGURAS_LIST = Object.values(FIGURAS);

// Normaliza segmento (não-direcionado) para comparação
export function segKey(seg: Segmento): string {
  const [[ax, ay], [bx, by]] = seg;
  const a = `${ax},${ay}`;
  const b = `${bx},${by}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export { comparar } from "./comparar";
