import type { Figura, Segmento } from "./figuras";
import type { comparar } from "./comparar";

// Semantic regions per figure, classified by the midpoint of a missing or
// incorrect stroke. Keeps pedagogical copy independent from geometry.
function regiao(figura: Figura, seg: Segmento): string {
  const [[ax, ay], [bx, by]] = seg;
  const x = (ax + bx) / 2;
  const y = (ay + by) / 2;
  switch (figura.id) {
    case "flor":
      if (y <= 4) return "a parte de cima da flor";
      if (ax === bx && ax === 5) return "o caule";
      return "as folhas";
    case "casa":
      if (y < 3) return "o telhado";
      if (ay === 3 && by === 3) return "a base do telhado";
      if (x >= 5 && x <= 6 && y >= 5) return "a porta";
      if (x >= 3 && x <= 4 && y >= 4 && y <= 6) return "a janela esquerda";
      if (x >= 7 && x <= 8 && y >= 4 && y <= 6) return "a janela direita";
      if (y >= 6.5) return "a parte de baixo da casa";
      return "as paredes da casa";
    case "caminhao":
      if (x >= 7.5) return "a cabine";
      if (y >= 6) return "a parte de baixo do caminhão";
      return "a carroceria";
    case "barco":
      if (y >= 6) return "o casco";
      if (ax === bx) return "o mastro";
      return x < 6 ? "a vela da esquerda" : "a vela da direita";
    case "peixe":
      if (x >= 8) return "a cauda";
      return y < 4 ? "a parte de cima do peixe" : "a parte de baixo do peixe";
    default: {
      const vertical = y < 3 ? "de cima" : y > 5 ? "de baixo" : "do meio";
      const horizontal = x < 4 ? ", à esquerda" : x > 7 ? ", à direita" : "";
      return `a parte ${vertical} da figura${horizontal}`;
    }
  }
}

// Feedback rules (DI pages 5-6):
// A — missing strokes concentrated in one region: name that region.
// B — missing strokes in two regions: name both.
// C — only extra/incorrect strokes: suggest the eraser.
// D — drawing very different from the model: general restart guidance.
// Never uses the first missing segment as the message reference; never
// reveals the full answer; never leads with technical segment counts.
export function orientacao(figura: Figura, resultado: ReturnType<typeof comparar>): string {
  const { trechosAusentes, trechosIncorretos, acertos, total } = resultado;
  if (trechosIncorretos.length >= 3 && acertos * 2 <= total) {
    return "Vamos tentar novamente? Observe os pontos onde cada parte do desenho começa e termina.";
  }
  if (!trechosAusentes.length && trechosIncorretos.length) {
    return "Há alguns traços fora do lugar. Compare com o modelo e use a borracha para corrigi-los.";
  }
  if (!trechosAusentes.length) {
    return "Observe o modelo e confira os pontos nas duas malhas.";
  }
  const regioes = [...new Set(trechosAusentes.map(t => regiao(figura, t)))];
  let mensagem: string;
  if (regioes.length === 1) {
    mensagem = `Observe ${regioes[0]}. Alguns traços ainda estão faltando.`;
  } else if (regioes.length === 2) {
    mensagem = `Observe ${regioes[0]} e ${regioes[1]}. Confira os traços que ainda faltam.`;
  } else {
    mensagem = "Ainda faltam traços em partes diferentes da figura. Compare com o modelo, uma parte de cada vez.";
  }
  if (trechosIncorretos.length) {
    mensagem += " Há também traços fora do lugar; use a borracha para corrigi-los.";
  }
  return mensagem;
}
