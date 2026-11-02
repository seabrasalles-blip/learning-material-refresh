import { describe, expect, it } from "vitest";
import { FIGURAS_LIST, FIGURAS, comparar, type Segmento } from "./figuras";
import { criarDesafio, transformarPonto } from "./desafios";

describe("all twelve transformed challenges", () => {
  for (const figura of FIGURAS_LIST) for (const modo of ["ampliar", "reduzir"] as const) {
    const d = criarDesafio(figura, modo);
    it(`${figura.id} ${modo}: exact factor, integer selectable vertices and bounds`, () => {
      expect(d.transformacao.fator).toBe(modo === "ampliar" ? 2 : 0.5);
      d.modelo.segmentos.forEach((s, i) => s.forEach((p, j) => {
        const result = d.resposta.segmentos[i][j];
        expect(result).toEqual(transformarPonto(p, d.transformacao));
        result.forEach((n, k) => { expect(Number.isInteger(n)).toBe(true); expect(n).toBeGreaterThanOrEqual(1); expect(n).toBeLessThanOrEqual(k === 0 ? 21 : 15); });
      }));
      for (const f of [d.modelo, d.resposta]) for (const c of f.circulos ?? []) {
        expect(c.centro[0] - c.raio).toBeGreaterThanOrEqual(1);
        expect(c.centro[0] + c.raio).toBeLessThanOrEqual(21);
        expect(c.centro[1] - c.raio).toBeGreaterThanOrEqual(1);
        expect(c.centro[1] + c.raio).toBeLessThanOrEqual(15);
      }
      d.resposta.circulos?.forEach((c, i) => {
        const original = d.modelo.circulos?.[i];
        expect(original).toBeDefined();
        if (!original) return;
        expect(c.centro).toEqual(transformarPonto(original.centro, d.transformacao));
        expect(c.raio).toBe(original.raio * d.transformacao.fator);
      });
    });
    it(`${figura.id} ${modo}: correct/reversed/subdivided versus original/incomplete/extra`, () => {
      const answer = d.resposta.segmentos;
      expect(comparar(answer, answer).completo).toBe(true);
      expect(comparar([...answer].reverse().map(([a, b]) => [b, a]), answer).completo).toBe(true);
      const split: Segmento[] = answer.flatMap(([a, b]) => {
        const m: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        return [[a, m], [m, b]] as Segmento[];
      });
      expect(comparar(split, answer).completo).toBe(true);
      expect(comparar(d.modelo.segmentos, answer).completo).toBe(false);
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