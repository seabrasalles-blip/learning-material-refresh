import { expect, it } from "vitest";
import { FIGURAS, comparar, type Segmento } from "@/data/figuras";
import { eraseSegment, nearestSegment } from "./segment-tools";

it("corrects the first wrong house stroke without erasing the other seventeen", () => {
  const casa = FIGURAS.casa;
  const wrong: Segmento = [[1, 3], [2, 1]];
  const drawn = [wrong, ...casa.segmentos.slice(1)];
  expect(comparar(drawn, casa.segmentos).completo).toBe(false);
  expect(nearestSegment(drawn, [1.5, 2], 0.2)).toBe(0);
  const corrected = eraseSegment(drawn, 0);
  expect(corrected).toEqual(casa.segmentos.slice(1));
  expect(corrected).toHaveLength(17);
  expect(comparar([...corrected, casa.segmentos[0]], casa.segmentos).completo).toBe(true);
});

it("selects only student strokes, not supplied wheel circles", () => {
  const truck = FIGURAS.caminhao;
  const circles = JSON.stringify(truck.circulos);
  expect(nearestSegment([], [3.5, 7], 0.25)).toBeNull();
  const remaining = eraseSegment(truck.segmentos, 0);
  expect(remaining).toHaveLength(truck.segmentos.length - 1);
  expect(JSON.stringify(truck.circulos)).toBe(circles);
});

it("leaves the drawing untouched when no stroke lies within the eraser tolerance", () => {
  expect(nearestSegment([[[1, 1], [5, 1]]], [3, 2], 0.25)).toBeNull();
});