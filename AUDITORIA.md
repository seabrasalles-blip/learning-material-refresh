# Auditoria — referências Flash e percurso com Mila

## Comparação visual e alterações

As seis PNGs de `referencias_flash_malha_6_figuras.zip` foram abertas e comparadas com os dados anteriores. As imagens são referências, não são exibidas no jogo.

- **Flor:** contorno, nervuras, caule e folhas já correspondiam; preservados. A malha inclui a extremidade inferior do caule.
- **Peixe:** boca, recortes da cauda e olho já correspondiam; segmentos preservados. A grade tem espaço até a borda inferior da referência.
- **Figura em degraus:** substitui a árvore provisória no conjunto principal; contorno escalonado, quatro diagonais, prolongamentos verticais e linha horizontal inferior recuperados.
- **Casa:** telhado trapezoidal com topo horizontal, paredes laterais, duas janelas retangulares, porta e linha inferior; removida a versão triangular simplificada.
- **Barco:** duas velas distintas, diagonal interna da vela esquerda, mastro vertical, casco trapezoidal, linha inferior e cinco vigias pretas fixas; removida a bandeira inexistente na captura.
- **Caminhão:** contorno inclinado à esquerda, três divisões superiores, cabine retangular à direita, janela, divisões horizontais e rodas na posição mostrada pela referência. Removidos os traços e a duplicação da geometria anterior.

Modelo e gabarito continuam derivados do mesmo objeto `Figura`: não há correção exclusivamente visual. As duas malhas usam as mesmas coordenadas; células de 22 e 44 px preservam os fatores ½ e 2.

## Precisão e trecho duvidoso

- Os vértices dos segmentos recuperados estão nas interseções identificáveis das capturas.
- **Maçaneta do caminhão:** pequeno traço preto horizontal entre g e h, perto da linha 5. Suas extremidades não coincidem claramente com vértices da grade; foi omitido do modelo e do gabarito, sem inventar coordenadas selecionáveis.
- As rodas e vigias não estão centradas em interseções inteiras. Centros e raios em unidades de célula foram medidos visualmente na captura rasterizada: rodas `[3.5,7]`, `[8.2,7]`, raio `0.85`; vigias `[3.5…7.5,6.5]`, raio `0.2`. O olho permanece `[4,3]`, raio `0.3`. São aproximações rasterizadas, não medidas do FLA. Espessura dos contornos e raios exatos não são certificados.
- As linhas grossas na linha 7 de degraus, barco e casa foram mantidas como parte visível do desenho. A imagem isolada não permite certificar se o Flash as tratava como desenho do aluno ou guia fornecida; nesta versão entram no gabarito de segmentos.

## Assets e progressão

- `LearningScreen` seleciona `fundo-capa` apenas na capa e `fundo-atividades` nas demais telas.
- O fundo da capa já contém título, personagem e botão impressos. Para não duplicar texto nem aparentar um botão estático, é usado como camada decorativa fortemente suavizada; títulos, botão COMEÇAR e pose transparente são elementos reais separados. O arquivo original não foi modificado.
- As cinco poses existentes são preservadas sem deformação, novas gerações ou cortes.
- Acertos de reduzir e ampliar são lembrados apenas durante a sessão; voltar às escolhas não os apaga. Repetir o mesmo modo não conclui o percurso.
- Após o primeiro acerto, CONTINUAR abre a transição com Mila convidando o outro modo. A conclusão só mostra comemoração depois dos dois modos, inclusive em acesso direto.

## Arquivos alterados

`src/data/figuras.ts`, `src/data/desafios.test.ts`, `src/lib/session-progress.ts`, `src/lib/session-progress.test.ts`, `src/components/{LearningScreen,ReferenceGrid,DrawingGrid,JourneyTransition}.tsx`, `src/routes/{desenhar.$figura,menu,conclusao,transicao}.tsx`, `src/styles.css`, `AGENTS.md`, `roadmap.md` e este relatório.

## Verificação

- Vitest: **37 testes passaram** (31 de geometria e 6 de progressão). Cobrem fatores, coordenadas compartilhadas, limites dos círculos, contornos recuperados, cobertura invertida/subdividida, faltas e excessos, conclusão com ambos os modos e preservação de acertos.
- Navegador: os **12 desafios** foram desenhados por cliques reais e aprovados. Desfazer e Apagar preservaram todos os círculos fixos; rever o exemplo manteve os segmentos do aluno.
- Percurso real: capa → apresentação → figura → reduzir → exemplo → tentativa vazia rejeitada → acerto → transição → escolha de outra figura → recarregar com progresso preservado → acesso direto à conclusão bloqueado → ampliar outra figura → conclusão comemorativa.
- Todas as 12 atividades apresentaram altura de página ≤ 675 px e largura ≤ 1200 px em **1200 × 675**, com os botões visíveis. Menu em **390 × 844** sem transbordamento horizontal.
- Capturas de capa, menu, atividades, transição e conclusão inspecionadas visualmente. Nenhum erro de execução observado; compilação automática sem erros.