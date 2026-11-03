import { expect, it } from "vitest";
import { moveGridCursor } from "./grid-keyboard";

it("keyboard arrows reach border intersections without escaping the ten by seven grid", () => {
  expect(moveGridCursor([10, 7], "ArrowRight", 10, 7)).toEqual([11, 7]);
  expect(moveGridCursor([11, 7], "ArrowDown", 10, 7)).toEqual([11, 8]);
  expect(moveGridCursor([11, 8], "ArrowRight", 10, 7)).toEqual([11, 8]);
  expect(moveGridCursor([11, 8], "ArrowDown", 10, 7)).toEqual([11, 8]);
  expect(moveGridCursor([1, 1], "ArrowLeft", 10, 7)).toEqual([1, 1]);
  expect(moveGridCursor([1, 1], "ArrowUp", 10, 7)).toEqual([1, 1]);
  expect(moveGridCursor([2, 2], "ArrowLeft", 10, 7)).toEqual([1, 2]);
  expect(moveGridCursor([2, 2], "ArrowUp", 10, 7)).toEqual([2, 1]);
});