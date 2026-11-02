// Grid coordinates: column letters a..j (1..10), rows 1..7
// A vertex is [col, row] (1-indexed). Origin top-left.

export type Vertex = [number, number];
export type Segmento = [Vertex, Vertex];

export interface Circulo {
  id: string;
  centro: Vertex;
  raio: number;
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

export const FIGURAS: Record<string, Figura> = {
  peixe: {
    id: "peixe",
    nome: "Peixe",
    cols: 10,
    rows: 7,
    circulos: [{ id: "olho", centro: [4, 3], raio: 0.3 }],
    segmentos: [
      // Outline transcribed from the original video, including mouth and tail notches.
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
  casa: {
    id: "casa",
    nome: "Casa",
    cols: 10,
    rows: 7,
    segmentos: [
      // paredes
      f([3, 6], [3, 4]),
      f([3, 4], [6, 1]),
      f([6, 1], [9, 4]),
      f([9, 4], [9, 6]),
      f([9, 6], [3, 6]),
      // porta
      f([5, 6], [5, 4]),
      f([5, 4], [7, 4]),
      f([7, 4], [7, 6]),
    ],
  },
  barco: {
    id: "barco",
    nome: "Barco",
    cols: 10,
    rows: 7,
    segmentos: [
      // casco
      f([2, 5], [3, 7]),
      f([3, 7], [8, 7]),
      f([8, 7], [9, 5]),
      f([9, 5], [2, 5]),
      // mastro
      f([5, 5], [5, 1]),
      // vela
      f([5, 1], [9, 5]),
      // bandeira
      f([5, 1], [7, 2]),
      f([7, 2], [5, 2]),
    ],
  },
  arvore: {
    // ATENÇÃO: no material original esta posição é a "figura em degraus".
    // Dados da Árvore preservados provisoriamente — correção pendente.
    id: "arvore",
    nome: "Árvore",
    cols: 10,
    rows: 7,
    segmentos: [
      // tronco
      f([5, 7], [5, 5]),
      f([5, 5], [6, 5]),
      f([6, 5], [6, 7]),
      f([6, 7], [5, 7]),
      // copa
      f([3, 5], [5, 5]),
      f([6, 5], [8, 5]),
      f([3, 5], [6, 1]),
      f([6, 1], [8, 5]),
    ],
  },
  caminhao: {
    id: "caminhao",
    nome: "Caminhão",
    cols: 10,
    rows: 7,
    circulos: [
      { id: "roda-traseira", centro: [3, 6.4], raio: 0.65 },
      { id: "roda-dianteira", centro: [8.5, 6.4], raio: 0.65 },
    ],
    segmentos: [
      // carroceria
      f([1, 3], [1, 6]),
      f([1, 6], [7, 6]),
      f([7, 6], [7, 3]),
      f([7, 3], [1, 3]),
      // cabine
      f([7, 4], [9, 4]),
      f([9, 4], [10, 5]),
      f([10, 5], [10, 6]),
      f([10, 6], [7, 6]),
      // janela
      f([7, 4], [9, 4]),
      f([9, 4], [9, 5]),
      f([9, 5], [7, 5]),
    ],
  },
  flor: {
    id: "flor",
    nome: "Flor",
    cols: 10,
    rows: 8,
    segmentos: [
      // Original video's petals, inner veins, stem and asymmetric leaves.
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
