import { expect, it } from "vitest";
import { comparar } from "./comparar";
import { FIGURAS, type Segmento } from "./figuras";

it("identifies the exact uncovered gap and excess extension", () => {
  const answer: Segmento[] = [[[1, 1], [5, 1]]];
  const result = comparar([[[1, 1], [2, 1]], [[3, 1], [6, 1]]], answer);
  expect(result.trechosAusentes).toEqual([[[2, 1], [3, 1]]]);
  expect(result.trechosIncorretos).toEqual([[[5, 1], [6, 1]]]);
});

it("equivalent reversed subdivisions have no missing or excess coverage", () => {
  const result = comparar([[[5, 5], [3, 3]], [[3, 3], [1, 1]]], [[[1, 1], [5, 5]]]);
  expect(result.trechosAusentes).toEqual([]);
  expect(result.trechosIncorretos).toEqual([]);
  expect(result.completo).toBe(true);
});

it("locates the missing left roof diagonal rather than the last drawn stroke", () => {
  const house = FIGURAS.casa;
  const result = comparar([[[1, 3], [2, 1]], ...house.segmentos.slice(1)], house.segmentos);
  expect(result.trechosAusentes).toEqual([[[1, 3], [3, 1]]]);
  expect(result.trechosIncorretos).toEqual([[[1, 3], [2, 1]]]);
});