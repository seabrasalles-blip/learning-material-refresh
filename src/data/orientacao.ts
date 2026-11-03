import type { Figura } from "./figuras";
import type { comparar } from "./comparar";

export function orientacao(figura: Figura, resultado: ReturnType<typeof comparar>): string {
  const trecho = resultado.trechosAusentes[0] ?? resultado.trechosIncorretos[0];
  if (!trecho) return "Observe o modelo e confira os pontos nas duas malhas.";
  const [[ax, ay], [bx, by]] = trecho;
  const x = (ax + bx) / 2;
  const y = (ay + by) / 2;
  let parte: string;
  if (figura.id === "casa") {
    if (y < 3 && x < 3) parte = "o lado esquerdo do telhado";
    else if (y < 3 && x > 8) parte = "o lado direito do telhado";
    else if (y < 3) parte = "a parte superior do telhado";
    else if (ay === 3 && by === 3) parte = "a base do telhado";
    else if (x >= 5 && x <= 6 && y >= 5) parte = "a porta";
    else if (x >= 3 && x <= 4 && y >= 4 && y <= 6) parte = "a janela esquerda";
    else if (x >= 7 && x <= 8 && y >= 4 && y <= 6) parte = "a janela direita";
    else parte = x < 5.5 ? "a parte esquerda da casa" : "a parte direita da casa";
  } else {
    const vertical = y < 3 ? "superior" : y > 5 ? "inferior" : "central";
    const horizontal = x < 4 ? " esquerda" : x > 7 ? " direita" : "";
    parte = `a parte ${vertical}${horizontal} da figura`;
  }
  return resultado.trechosAusentes.length
    ? `Observe ${parte}. Confira ${ax !== bx && ay !== by ? "a inclinação e " : ""}os pontos nas duas malhas.`
    : `Observe ${parte}. Há um trecho a mais ou fora do lugar; compare com o modelo.`;
}