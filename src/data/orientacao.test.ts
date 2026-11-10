import { expect, it } from "vitest";
import { comparar } from "./comparar";
import { orientacao } from "./orientacao";
import { FIGURAS, type Segmento } from "./figuras";

const flor = FIGURAS.flor;
// Petals: first 8 segments (y <= 4). Stem: segment index 8. Leaves: rest.
const petalas = flor.segmentos.slice(0, 8);
const caule = flor.segmentos.slice(8, 9);
const folhas = flor.segmentos.slice(9);

it("situation A: only top strokes missing names the top of the flower", () => {
  const result = comparar([...caule, ...folhas], flor.segmentos);
  expect(orientacao(flor, result)).toBe("Observe a parte de cima da flor. Alguns traços ainda estão faltando.");
});

it("situation A: only bottom strokes missing names the leaves", () => {
  const result = comparar([...petalas, ...caule], flor.segmentos);
  expect(orientacao(flor, result)).toBe("Observe as folhas. Alguns traços ainda estão faltando.");
});

it("situation B: missing strokes in two regions names both", () => {
  const result = comparar(caule, flor.segmentos);
  expect(orientacao(flor, result)).toBe("Observe a parte de cima da flor e as folhas. Confira os traços que ainda faltam.");
});

it("situation C: almost complete figure with one extra line suggests the eraser", () => {
  const extra: Segmento = [[1, 1], [2, 2]];
  const result = comparar([...flor.segmentos, extra], flor.segmentos);
  expect(orientacao(flor, result)).toBe("Há alguns traços fora do lugar. Compare com o modelo e use a borracha para corrigi-los.");
});

it("situation D: several random strokes gets general restart guidance", () => {
  const aleatorio: Segmento[] = [[[1, 1], [3, 3]], [[8, 1], [10, 2]], [[2, 6], [4, 7]], [[9, 4], [10, 6]]];
  const result = comparar(aleatorio, flor.segmentos);
  expect(orientacao(flor, result)).toBe("Vamos tentar novamente? Observe os pontos onde cada parte do desenho começa e termina.");
});

it("localized error on the house names the roof, not an unrelated part", () => {
  const casa = FIGURAS.casa;
  const semTelhado = casa.segmentos.slice(4);
  const result = comparar(semTelhado, casa.segmentos);
  expect(orientacao(casa, result)).toContain("telhado");
});

it("random drawing on the truck gets general guidance", () => {
  const caminhao = FIGURAS.caminhao;
  const aleatorio: Segmento[] = [[[1, 1], [4, 4]], [[6, 1], [9, 5]], [[2, 7], [5, 3]], [[10, 1], [8, 7]]];
  const result = comparar(aleatorio, caminhao.segmentos);
  expect(orientacao(caminhao, result)).toBe("Vamos tentar novamente? Observe os pontos onde cada parte do desenho começa e termina.");
});

it("missing strokes never fall back to the first missing segment only", () => {
  // Stem + leaves missing: two regions must be mentioned even though the
  // first missing segment in answer order is the stem.
  const result = comparar(petalas, flor.segmentos);
  const msg = orientacao(flor, result);
  expect(msg).toContain("caule");
  expect(msg).toContain("folhas");
});
