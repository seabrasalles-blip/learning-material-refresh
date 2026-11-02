import type { Segmento } from "./figuras";

type Interval = [number, number];
const EPS = 1e-7;
const rounded = (n: number) => Math.round(n * 1e7) / 1e7;

function line(segment: Segmento) {
  const [[ax, ay], [bx, by]] = segment;
  const length = Math.hypot(bx - ax, by - ay);
  if (length < EPS) return null;
  const sign = bx < ax || (Math.abs(bx - ax) < EPS && by < ay) ? -1 : 1;
  const dx = sign * (bx - ax) / length;
  const dy = sign * (by - ay) / length;
  const a = ax * dx + ay * dy;
  const b = bx * dx + by * dy;
  return { key: `${rounded(dx)},${rounded(dy)},${rounded(ax * dy - ay * dx)}`, interval: [Math.min(a, b), Math.max(a, b)] as Interval };
}

function merge(intervals: Interval[]): Interval[] {
  const result: Interval[] = [];
  for (const [a, b] of [...intervals].sort((x, y) => x[0] - y[0])) {
    const last = result.at(-1);
    if (last && a <= last[1] + EPS) last[1] = Math.max(last[1], b);
    else result.push([a, b]);
  }
  return result;
}

function coverage(segments: Segmento[]) {
  const map = new Map<string, Interval[]>();
  for (const segment of segments) {
    const l = line(segment);
    if (l) map.set(l.key, [...(map.get(l.key) ?? []), l.interval]);
  }
  for (const [key, intervals] of map) map.set(key, merge(intervals));
  return map;
}

function uncovered(a: Interval[], b: Interval[]) {
  let gaps = 0;
  for (const [start, end] of a) {
    let cursor = start;
    for (const [left, right] of b) {
      if (right <= cursor + EPS || left >= end - EPS) continue;
      if (left > cursor + EPS) gaps++;
      cursor = Math.max(cursor, right);
      if (cursor >= end - EPS) break;
    }
    if (cursor < end - EPS) gaps++;
  }
  return gaps;
}

export function comparar(usuario: Segmento[], gabarito: Segmento[]) {
  const user = coverage(usuario);
  const answer = coverage(gabarito);
  let faltando = 0;
  let errados = 0;
  for (const [key, intervals] of answer) faltando += uncovered(intervals, user.get(key) ?? []);
  for (const [key, intervals] of user) errados += uncovered(intervals, answer.get(key) ?? []);
  const unique = [...new Map(gabarito.map(s => [JSON.stringify(line(s)), s])).values()];
  const acertos = unique.filter(s => {
    const l = line(s);
    return l && uncovered([l.interval], user.get(l.key) ?? []) === 0;
  }).length;
  return { acertos, faltando, errados, total: unique.length, completo: faltando === 0 && errados === 0 };
}