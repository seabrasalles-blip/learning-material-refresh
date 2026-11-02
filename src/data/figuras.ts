// Grid coordinates: column letters a..j (1..10), rows 1..7
// A vertex is [col, row] (1-indexed). Origin top-left.

export type Vertex = [number, number];
export type Segmento = [Vertex, Vertex];

export type Modo = "reduzir" | "ampliar";

export interface Figura {
  id: string;
  nome: string;
  cols: number; // 10
  rows: number; // 7
  segmentos: Segmento[];
  // modo da atividade: "reduzir" (modelo exibido maior que a malha de desenho)
  // ou "ampliar" (modelo exibido menor que a malha de desenho)
  modo: Modo;
  // fator matemático de escala de EXIBIÇÃO entre modelo e malha de desenho
  // (configurável; não afeta os dados geométricos usados na validação)
  escala: number;
}

const f = (a: Vertex, b: Vertex): Segmento => [a, b];

export const FIGURAS: Record<string, Figura> = {
  peixe: {
    id: "peixe",
    nome: "Peixe",
    cols: 10,
    rows: 7,
    modo: "reduzir",
    escala: 1.4,
    segmentos: [
      // corpo (losango)
      f([2, 4], [4, 2]),
      f([4, 2], [7, 2]),
      f([7, 2], [9, 4]),
      f([9, 4], [7, 6]),
      f([7, 6], [4, 6]),
      f([4, 6], [2, 4]),
      // boca
      f([2, 4], [1, 3]),
      f([2, 4], [1, 5]),
      // cauda
      f([9, 4], [10, 2]),
      f([9, 4], [10, 6]),
      f([10, 2], [10, 6]),
    ],
  },
  casa: {
    id: "casa",
    nome: "Casa",
    cols: 10,
    rows: 7,
    modo: "ampliar",
    escala: 1.4,
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
    modo: "ampliar",
    escala: 1.4,
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
    modo: "reduzir",
    escala: 1.4,
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
    modo: "ampliar",
    escala: 1.4,
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
    rows: 7,
    modo: "reduzir",
    escala: 1.4,
    segmentos: [
      // haste
      f([5, 4], [5, 7]),
      // folhas
      f([5, 6], [3, 5]),
      f([3, 5], [5, 5]),
      f([5, 6], [7, 5]),
      f([7, 5], [5, 5]),
      // pétalas (losango grande no topo)
      f([5, 1], [7, 3]),
      f([7, 3], [5, 5]),
      f([5, 5], [3, 3]),
      f([3, 3], [5, 1]),
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

export function comparar(usuario: Segmento[], gabarito: Segmento[]) {
  const setUser = new Set(usuario.map(segKey));
  const setGab = new Set(gabarito.map(segKey));
  let acertos = 0;
  setUser.forEach((k) => {
    if (setGab.has(k)) acertos++;
  });
  const faltando = [...setGab].filter((k) => !setUser.has(k)).length;
  const errados = [...setUser].filter((k) => !setGab.has(k)).length;
  return { acertos, faltando, errados, total: setGab.size, completo: faltando === 0 && errados === 0 };
}
