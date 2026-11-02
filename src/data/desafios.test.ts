import { describe, expect, it } from "vitest";
import { FIGURAS_LIST, FIGURAS, comparar, type Segmento } from "./figuras";
import { criarDesafio, CELL_BASE } from "./desafios";

describe("all twelve challenges", () => {
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
it("line coverage rejects equal segment counts, gaps and collinear extensions", () => {
  const answer: Segmento[] = [[[1, 1], [5, 1]]];
  expect(comparar([[[1, 2], [5, 2]]], answer).completo).toBe(false);
  expect(comparar([[[1, 1], [2, 1]], [[3, 1], [5, 1]]], answer).faltando).toBe(1);
  expect(comparar([[[1, 1], [6, 1]]], answer).errados).toBe(1);
  expect(comparar([[[1, 1], [3, 1]], [[3, 1], [5, 1]], [[5, 1], [1, 1]]], answer).completo).toBe(true);
});
