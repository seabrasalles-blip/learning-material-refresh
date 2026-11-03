# Demonstração de como desenhar na malha

Sem alterar figuras, gabaritos, validação, fatores de escala, círculos fixos ou progressão.

## 1. Demonstração em etapas (ScaleDemonstration)
A janela de exemplo passa a ter três etapas curtas, com indicador "1 de 3" e PULAR EXEMPLO sempre visível:

1. **Escala** (atual, ajustada): duas malhas de exemplo; o quadrado não aparece pronto — ele é traçado na nova malha durante a animação, com a frase "Você vai desenhar a figura na nova malha". Ampliar e reduzir continuam separados.
2. **COMO DESENHAR NA MALHA**: malha de exemplo própria (não a da atividade), com cursor animado em três ações e a fala da Mila correspondente:
   - escolher um cruzamento (ponto destacado);
   - clicar em outro ponto (linha aparece);
   - ligar mais um ponto, depois clicar num botão LÁPIS ilustrado e iniciar um trecho separado.
   Controles REPRODUZIR / PAUSAR / PRÓXIMO. Com movimento reduzido, cada ação aparece como quadro estático com botões anterior/próximo.
3. **Agora é sua vez!**: pequena malha interativa usando o mesmo componente de desenho da atividade (mouse, toque e teclado). Ao formar o primeiro segmento: "Isso! Agora você já sabe como começar!" com PRATICAR NOVAMENTE e COMEÇAR A ATIVIDADE. A prática não é obrigatória.

Os traços da prática ficam só dentro da janela — nunca entram no desenho real nem no progresso.

## 2. Dicas na primeira atividade
Faixa discreta acima da malha de desenho, apenas na primeira atividade da sessão:
- antes do primeiro clique: "Clique em um cruzamento para começar."
- após o primeiro ponto: "Agora escolha outro ponto para formar uma linha."
- após o primeiro segmento: "Continue ligando os pontos do desenho." (some após mais alguns traços)

Lembrada por sessão (como as demonstrações), sem repetir nas demais figuras. VER EXEMPLO continua disponível.

## 3. Verificação
- Testes novos: estado das dicas (sequência e não repetição) e garantia de que a prática não altera progresso.
- Rodar todos os testes existentes.
- Navegador: figura → transformação → escala → como desenhar → prática → desenho → verificar, em 1200×675 sem rolagem, com teclado e com movimento reduzido.

## Detalhes técnicos
- Novo `DrawingTutorial.tsx` (etapa animada, SVG próprio) e `DrawingPractice.tsx` (reusa `DrawingGrid` com estado local).
- Novo `src/lib/drawing-hints.ts` (+ teste) com chave em sessionStorage, separado do progresso.
- `desenhar.$figura.tsx`: renderiza a faixa de dicas; sem mudar comparar/desafios.
- Atualizar AGENTS.md e roadmap.md.
