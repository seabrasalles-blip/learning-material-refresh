import type { Figura, Modo } from "./figuras";

// Escala visual base da célula, em pixels. A transformação acontece apenas no
// tamanho físico dos quadradinhos: modelo e resposta compartilham as mesmas
// coordenadas de grade e a mesma quantidade de colunas e linhas.
export const CELL_BASE = 22;

export function criarDesafio(figura: Figura, modo: Modo) {
  const fator = modo === "ampliar" ? 2 : 0.5;
  const cellModelo = modo === "ampliar" ? CELL_BASE : CELL_BASE * 2;
  const cellResposta = modo === "ampliar" ? CELL_BASE * 2 : CELL_BASE;
  return { modelo: figura, resposta: figura, cellModelo, cellResposta, fator, modo };
}
