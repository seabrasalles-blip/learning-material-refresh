import type { Figura, Modo, Vertex } from "./figuras";

export interface Transformacao { fator: number; origem: Vertex; destino: Vertex }
export function transformarPonto(p: Vertex, t: Transformacao): Vertex {
  return [t.destino[0] + (p[0] - t.origem[0]) * t.fator, t.destino[1] + (p[1] - t.origem[1]) * t.fator];
}
export function transformarFigura(figura: Figura, t: Transformacao): Figura {
  return {
    ...figura,
    cols: 20,
    rows: 16,
    segmentos: figura.segmentos.map(([a, b]) => [transformarPonto(a, t), transformarPonto(b, t)]),
    circulos: figura.circulos?.map(c => ({ ...c, centro: transformarPonto(c.centro, t), raio: c.raio * t.fator })),
  };
}
export function criarDesafio(figura: Figura, modo: Modo) {
  const modelo = transformarFigura(figura, { fator: modo === "reduzir" ? 2 : 1, origem: [1, 1], destino: [2, 2] });
  const transformacao: Transformacao = { fator: modo === "reduzir" ? 0.5 : 2, origem: [2, 2], destino: [2, 2] };
  const resposta = transformarFigura(modelo, transformacao);
  return { modelo, resposta, transformacao, modo };
}