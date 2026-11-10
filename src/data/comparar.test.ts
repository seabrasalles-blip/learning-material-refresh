import { expect, it } from "vitest";
import { comparar, translacaoUniforme } from "./comparar";
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

const shift = (segs: Segmento[], dx: number, dy: number): Segmento[] =>
  segs.map(([[ax, ay], [bx, by]]) => [[ax + dx, ay + dy], [bx + dx, by + dy]]);

it("detects a correctly proportioned flower shifted by a uniform translation", () => {
  const flor = FIGURAS.flor.segmentos;
  const moved = shift(flor, 2, 0);
  expect(comparar(moved, flor).completo).toBe(false);
  expect(translacaoUniforme(moved, flor)).toBe(true);
});

it("detects diagonal translations and subdivided strokes", () => {
  const flor = FIGURAS.flor.segmentos;
  const moved = shift(flor, 1, 0);
  const subdivided = [...moved.slice(1), [[5, 2], [5, 5]], [[5, 5], [5, 9]]] as Segmento[];
  expect(translacaoUniforme(subdivided, flor)).toBe(true);
});

it("rejects deformed drawings that are not a pure translation", () => {
  const flor = FIGURAS.flor.segmentos;
  const deformed = shift(flor, 2, 0);
  deformed[0] = [[7, 1], [7, 2]];
  expect(translacaoUniforme(deformed, flor)).toBe(false);
});

it("rejects partial drawings and empty input", () => {
  const flor = FIGURAS.flor.segmentos;
  expect(translacaoUniforme(shift(flor.slice(0, 5), 1, 0), flor)).toBe(false);
  expect(translacaoUniforme([], flor)).toBe(false);
});