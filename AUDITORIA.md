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
- O fundo da capa contém título, personagem e botão impressos e agora aparece nítido e inteiro. O controle HTML COMEÇAR está sobre o botão ilustrado, com contorno visível e foco de teclado, sem duplicar o texto da arte. O arquivo original não foi modificado. O fundo de atividades permanece visível nas demais telas.
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

## Revisão final pré-DI — 3 de novembro de 2026

### Correções aplicadas

- **Malhas:** a captura da flor confirma sete fileiras numeradas e o caule termina na borda inferior. Todas as figuras agora usam `rows: 7`; o vértice de coordenada 8 continua selecionável. Nenhum segmento, círculo, coluna ou fator de escala foi alterado. Os dois SVGs já calculavam as bordas com `rows + 1`, dispensando mudanças no desenho do modelo.
- **Demonstrações:** chaves `mila-example-seen-reduzir` e `mila-example-seen-ampliar` independentes. A primeira atividade de cada modalidade mostra seu exemplo; rever o exemplo mantém os traços. O reinício do percurso não apaga essa preferência de apresentação da sessão.
- **Reinício:** `resetSessionProgress()` zera os dois acertos e notifica a interface. JOGAR NOVAMENTE inicia uma atividade com 0 de 2; NOVA FIGURA conserva os acertos. Após reiniciar, um único modo volta a ser insuficiente para a conclusão.
- **Capa:** componente de botão existente, contorno permanente, foco visível e ativação por Enter/espaço. O texto acessível é separado da imagem, sem duplicação visual. Posição percentual acompanha a arte inteira.
- **Desenho:** instrução de usar pontos correspondentes nas duas malhas. Malha acessível por Tab, setas movem o cursor até os cruzamentos das bordas, Enter/espaço selecionam pontos e Escape cancela o ponto inicial. Mouse e teclado passam pela mesma seleção de vértices, mantendo encaixe e validação.
- **Maçaneta:** reavaliada na captura original; continua omitida. Um elemento fixo não exigiria coordenadas inteiras, mas tamanho e posição precisariam de medidas rasterizadas aproximadas. Para respeitar a regra de não inventar detalhes incertos, a inclusão depende de uma referência mais precisa ou autorização para essa aproximação; não afeta o gabarito nem impede concluir a atividade.

### Testes executados nesta revisão

- **41 testes automatizados aprovados em quatro arquivos:** 32 de geometria, 7 de progresso, 1 de demonstrações independentes e 1 de limites do cursor de teclado.
- **Compilação automática:** `build OK` após as mudanças no código. Foi usada a compilação automática da plataforma, sem executar um segundo build manual.
- **Navegador:** seis figuras × dois modos × duas resoluções = **24 atividades desenhadas por cliques e aprovadas** em 1200 × 675 e 1920 × 1080.
- Em cada atividade: Verificar, Desfazer, rejeição do desenho incompleto, Tentar novamente, Apagar e Ver exemplo; os círculos fixos e os traços preservados durante o exemplo foram conferidos. Rótulos a–j e 1–7 confirmados.
- Em ambas as resoluções: capa por teclado → apresentação → escolha → reduzir → exemplo → erro → acerto → transição → progresso preservado após recarregar → conclusão antecipada bloqueada → ampliar com seu próprio exemplo → conclusão. NOVA FIGURA preservou 2 de 2; JOGAR NOVAMENTE zerou a contagem; um acerto após o reinício permaneceu bloqueado para conclusão; o segundo acerto real liberou o encerramento.
- Cursor de teclado, seleção com Enter/espaço, cancelamento, Desfazer e limites das bordas testados no navegador. Reproduzir e Pausar também acionados.
- Capa, apresentação, seleção, atividades, transição e conclusão sem rolagem de página, transbordamento ou sobreposição das malhas nas duas resoluções; capturas de telas e diálogos inspecionadas. Nenhum erro de execução nessas verificações.
- Conferência adicional: capa em 390 × 844 mantém a arte inteira e COMEÇAR abre a apresentação.

### Arquivos modificados nesta revisão

- `src/data/figuras.ts`, `src/data/desafios.test.ts`
- `src/lib/session-progress.ts`, `src/lib/session-progress.test.ts`
- Novos: `src/lib/demonstration-session.ts`, `src/lib/demonstration-session.test.ts`, `src/lib/grid-keyboard.ts`, `src/lib/grid-keyboard.test.ts`
- `src/components/DrawingGrid.tsx`
- `src/routes/index.tsx`, `src/routes/desenhar.$figura.tsx`, `src/routes/conclusao.tsx`
- `src/styles.css`, `AGENTS.md`, `roadmap.md`, este relatório e memória pedagógica.

**Pendência única:** medidas confiáveis ou autorização de aproximação para a maçaneta fixa do caminhão. Geometria validada, escalas e identidade visual da Mila preservadas.