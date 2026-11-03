import { describe, expect, it } from "vitest";
import { FIGURAS_LIST, FIGURAS, comparar, type Segmento } from "./figuras";
import { criarDesafio, CELL_BASE } from "./desafios";

describe("all twelve original challenges", () => {
  for (const figura of FIGURAS_LIST) for (const modo of ["ampliar", "reduzir"] as const) {
    const d = criarDesafio(figura, modo);
    it(`${figura.id} ${modo}: same coordinates and grid, cell size scaled by the factor`, () => {
      expect(d.fator).toBe(modo === "ampliar" ? 2 : 0.5);
      expect(d.cellResposta / d.cellModelo).toBe(d.fator);
      expect(Math.min(d.cellModelo, d.cellResposta)).toBe(CELL_BASE);
      expect(Math.max(d.cellModelo, d.cellResposta)).toBe(CELL_BASE * 2);
      // Nenhuma transformação geométrica: vértices, grade e círculos idênticos.
      expect(d.resposta.segmentos).toBe(d.modelo.segmentos);
      expect(d.resposta.cols).toBe(d.modelo.cols);
      expect(d.resposta.rows).toBe(d.modelo.rows);
      expect(d.resposta.circulos).toBe(d.modelo.circulos);
      // Círculos cabem na grade com o raio em unidades de célula.
      for (const c of figura.circulos ?? []) {
        expect(c.centro[0] - c.raio).toBeGreaterThanOrEqual(1);
        expect(c.centro[0] + c.raio).toBeLessThanOrEqual(figura.cols + 1);
        expect(c.centro[1] - c.raio).toBeGreaterThanOrEqual(1);
        expect(c.centro[1] + c.raio).toBeLessThanOrEqual(figura.rows + 1);
      }
    });
    it(`${figura.id} ${modo}: correct/reversed/subdivided versus incomplete/extra`, () => {
      const answer = d.resposta.segmentos;
      expect(comparar(answer, answer).completo).toBe(true);
      expect(comparar([...answer].reverse().map(([a, b]) => [b, a]), answer).completo).toBe(true);
      const split: Segmento[] = answer.flatMap(([a, b]) => {
        const m: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        return [[a, m], [m, b]] as Segmento[];
      });
      expect(comparar(split, answer).completo).toBe(true);
      expect(comparar([], answer).faltando).toBeGreaterThan(0);
      expect(comparar(answer.slice(1), answer).completo).toBe(false);
      expect(comparar([...answer, [[1, 1], [2, 1]]], answer).errados).toBeGreaterThan(0);
    });
  }
});
it("fish supplies one eye and truck two named wheels", () => {
  expect(FIGURAS.peixe.circulos?.map(c => c.id)).toEqual(["olho"]);
  expect(FIGURAS.caminhao.circulos?.map(c => c.id)).toEqual(["roda-traseira", "roda-dianteira"]);
});
it("all six grids have seven numbered rows and preserve the bottom vertex at coordinate eight", () => {
  expect(FIGURAS_LIST.map(f => f.rows)).toEqual([7, 7, 7, 7, 7, 7]);
  expect(FIGURAS.flor.segmentos).toContainEqual([[5, 1], [5, 8]]);
  for (const figura of FIGURAS_LIST) for (const segmento of figura.segmentos) for (const [col, row] of segmento) {
    expect(col).toBeGreaterThanOrEqual(1);
    expect(col).toBeLessThanOrEqual(figura.cols + 1);
    expect(row).toBeGreaterThanOrEqual(1);
    expect(row).toBeLessThanOrEqual(figura.rows + 1);
  }
});
it("restores the six original figures, with steps rather than a substitute tree", () => {
  expect(FIGURAS_LIST.map(f => f.id)).toEqual(["flor", "degraus", "peixe", "barco", "caminhao", "casa"]);
});
it("house has a trapezoid roof, two windows and a door", () => {
  const lines = FIGURAS.casa.segmentos;
  expect(lines).toContainEqual([[3, 1], [8, 1]]);
  for (const line of [[ [3,4],[4,4] ], [[7,4],[8,4]], [[5,5],[6,5]]] as Segmento[]) expect(lines).toContainEqual(line);
});
it("boat preserves separate sails, mast and five fixed filled portholes", () => {
  for (const line of [[[6,1],[5,6]], [[6,1],[6,6]], [[6,2],[9,5]]] as Segmento[]) expect(FIGURAS.barco.segmentos).toContainEqual(line);
  expect(FIGURAS.barco.circulos).toHaveLength(5);
  expect(FIGURAS.barco.circulos?.every(c => c.preenchido)).toBe(true);
  expect(FIGURAS.barco.circulos?.map(c => c.centro)).toEqual([[3.5,6.5],[4.5,6.5],[5.5,6.5],[6.5,6.5],[7.5,6.5]]);
});
it("truck retains the slanted body and internal straight divisions", () => {
  for (const line of [[[1,4],[3,2]], [[4,2],[4,4]], [[5,2],[5,4]], [[6,2],[6,4]], [[8,3],[8,5]]] as Segmento[]) expect(FIGURAS.caminhao.segmentos).toContainEqual(line);
});
it("steps preserve the four inner diagonals and baseline", () => {
  for (const line of [[[3,4],[4,5]], [[4,4],[5,5]], [[5,5],[6,4]], [[6,5],[7,4]], [[1,7],[11,7]]] as Segmento[]) expect(FIGURAS.degraus.segmentos).toContainEqual(line);
});
it("line coverage rejects equal segment counts, gaps and collinear extensions", () => {
  const answer: Segmento[] = [[[1, 1], [5, 1]]];
  expect(comparar([[[1, 2], [5, 2]]], answer).completo).toBe(false);
  expect(comparar([[[1, 1], [2, 1]], [[3, 1], [5, 1]]], answer).faltando).toBe(1);
  expect(comparar([[[1, 1], [6, 1]]], answer).errados).toBe(1);
  expect(comparar([[[1, 1], [3, 1]], [[3, 1], [5, 1]], [[5, 1], [1, 1]]], answer).completo).toBe(true);
});
