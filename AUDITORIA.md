# Auditoria — referências Flash e percurso com Mila

## Banco e sequência obrigatória das perguntas — 11 de novembro de 2026

- Banco de sete perguntas: a original permanece com enunciado/alternativas e resposta B; seis novas perguntas sobre dobro, metade, fator comum, células maiores, lados proporcionais e semelhança. Todas têm três alternativas, explicações para erros e para o acerto; novas tentativas permanecem disponíveis até acertar.
- Atribuição pela ordem em que cada figura completa seus dois modos, não pela identidade da figura ou ordem de visita à reflexão. A primeira recebe sempre a original; as seguintes sorteiam apenas perguntas adicionais ainda não atribuídas. Uma modalidade, repetições da mesma modalidade e modos de figuras diferentes não consomem perguntas.
- `mila-reflection-v1` registra atribuições por figura, apresentação, etapa, última alternativa e estado de tentativa. Voltar/recarregar conserva a pergunta e a etapa, incluindo comemoração já liberada; refazer a figura não sorteia outra pergunta. Sessões antigas sem esse histórico usam a ordem dos acertos já registrados para atribuir a original à primeira figura concluída.
- `resetSessionProgress()` também limpa o histórico de perguntas. A navegação normal, inclusive retorno à capa, não reinicia o percurso; nenhum botão novo foi acrescentado. O reinício integral é coberto pelo teste da função existente, não por uma ação disponível na interface atual.
- **Limite do conjunto atual:** há seis figuras; uma sessão que conclui todas apresenta a original e cinco das seis adicionais. A sétima pergunta permanece disponível no banco, sem forçar outra pergunta ao refazer uma figura. O esgotamento das sete foi testado com sete identidades de figura simuladas, sem adicionar figuras reais.

### Resultados efetivamente obtidos

- `bunx vitest run`: **95 testes aprovados em dez arquivos**, incluindo 22 novos testes. A original foi testada com cada uma das seis figuras e cada modalidade inicial (12 casos). Sorteio sem repetição, independente da identidade, conclusão em dois modos, retorno/replay, restauração de erro/acerto, tentativas em todas as perguntas, isolamento do progresso e reinício integral também foram testados.
- Navegador em **1200×675, 1366×768 e 1920×1080**: seis figuras, dois modos por figura e um replay do peixe por resolução — **39 desenhos aprovados por cliques reais**. Pergunta original primeiro em todas as sessões; cinco adicionais únicas a seguir. Erro com feedback, recarregamento com erro preservado, acerto, recarregamento da comemoração e ESCOLHER NOVA FIGURA conferidos para todas as seis figuras. A primeira modalidade não alocou pergunta; replay não consumiu pergunta nova.
- Nenhuma rolagem horizontal/vertical ou erro de execução nos percursos finais. Capturas das perguntas com erro inspecionadas nas três resoluções. A compilação automática ficou **build OK** após corrigir a ausência de conteúdo obrigatório no estado inicial da conclusão; não foi executada compilação manual.
- Falhas intermediárias da automação: clique antes da tela estar pronta e uma edição incorreta do roteiro de teste; roteiro corrigido para aguardar carregamento/navegação, execução final completa sem falhas.
- Código alterado: `src/routes/conclusao.tsx`, `src/lib/concept-reflection.ts`, `src/lib/session-progress.ts`; novos `src/lib/reflection-questions.ts`, `src/lib/reflection-session.ts` e seu teste. Documentação: `AGENTS.md`, `roadmap.md`, este relatório e memória pedagógica. Malhas, desenhos, figuras, gabaritos, validação, assets e tutoriais preservados. Celular, toque e controles internos do tutorial não foram reexercitados nesta rodada; a pendência antiga da maçaneta continua fora do escopo.

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

## Revisão pontual do tutorial — 4 de novembro de 2026

### Correções e limites do escopo

- O quadrado do **Modelo** aparece completo antes de REPRODUZIR e permanece intacto. Apenas o quadrado da **Nova malha** é formado pela animação existente.
- As demonstrações matemáticas continuam independentes por modo, agora com `mila-example-seen-v2-reduzir` e `mila-example-seen-v2-ampliar`. As chaves antigas não suprimem os novos exemplos.
- `mila-drawing-tutorial-seen-v1` registra o aprendizado compartilhado das ferramentas ao sair da prática por COMEÇAR A ATIVIDADE. A prática continua opcional. PULAR EXEMPLO não registra esse aprendizado; na primeira demonstração do outro modo, o tutorial ainda será oferecido se não tiver sido concluído. Depois de concluído, o outro modo mostra somente a escala. VER EXEMPLO permite rever as três etapas manualmente.
- Avançar e voltar manualmente em DrawingTutorial interrompem a reprodução automática, inclusive os passos com movimento reduzido.
- DrawingPractice foi inspecionado e preservado: seus segmentos e ponto inicial são estados locais; recebe somente a ação de começar, sem acesso aos segmentos reais ou ao progresso. Não foi necessário alterá-lo.
- Malhas, figuras, gabaritos, círculos fixos, assets, validação matemática e navegação principal não foram modificados. Os oito percursos de conteúdo conservam seus títulos e metadados próprios.

### Resultados efetivamente obtidos

- **`bunx vitest run`: 53 testes aprovados, sete arquivos, nenhuma falha na execução final.** Inclui três novas verificações: compatibilidade com sessões antigas, aprendizado compartilhado sem alteração de progresso e pular a escala sem registrar aprendizado das ferramentas. A primeira execução concorrente à edição ainda contou 50 testes; a execução final, após salvar todos os testes, contou 53.
- **Compilação automática da plataforma: `build OK`**, último resultado consultado em 11:41:06 UTC. **`bun run build` não foi executado:** as instruções da plataforma proíbem a compilação manual do projeto. Portanto, não se atribui aprovação a esse comando solicitado.
- **Navegador: percurso completo com a flor nas duas resoluções solicitadas, 1200 × 675 e 1920 × 1080:** capa → apresentação → seleção → reduzir → escala → tutorial de cliques → prática → atividade vazia rejeitada → revisão do exemplo com um traço real preservado → desenho correto aprovado → transição → ampliar (somente escala automaticamente) → desenho correto aprovado → conclusão. Quatro atividades aprovadas por cliques reais nesta revisão; não se afirma ter repetido os doze desafios.
- Conferidos REPRODUZIR, PAUSAR, reinício da animação, PRÓXIMO, setas anterior/próximo, limites de passos, PRATICAR NOVAMENTE, COMEÇAR A ATIVIDADE, VER EXEMPLO e PULAR EXEMPLO em cada uma das três etapas. Os controles manuais permaneceram no mesmo quadro após espera de 1,7 segundo, confirmando a pausa automática.
- A prática foi exercitada por teclado, limpa e refeita. Conferidos antes e depois: contagem dos segmentos reais inalterada e conteúdo de `mila-transformations` idêntico, tanto com atividade vazia quanto com traço real existente. A prática não entrou no desenho nem registrou acerto.
- Sessões com as duas chaves antigas receberam o novo tutorial. Concluí-lo na redução suprimiu somente cliques/prática automáticos na ampliação; o exemplo matemático da ampliação continuou presente. Com movimento reduzido, os passos manuais funcionaram e foi possível começar sem desenhar na prática.
- Capturas de escala, tutorial, prática e conclusão inspecionadas visualmente em ambas as resoluções. Os diálogos capturados ficaram integralmente dentro da tela e sem rolagem interna. Nenhum erro de execução foi capturado nas verificações finais.
- **Falhas da automação inicial:** dois timeouts ao clicar antes da hidratação da capa/atividade; o roteiro foi corrigido para aguardar carregamento e navegação. A execução final completou as duas resoluções sem falhas. Nenhuma correção adicional na aplicação foi necessária por esses timeouts.

### Arquivos alterados

`src/components/ScaleDemonstration.tsx`, `src/components/DrawingTutorial.tsx`, `src/lib/demonstration-session.ts`, `src/lib/demonstration-session.test.ts`, `src/routes/desenhar.$figura.tsx` (somente controle de abertura do exemplo), `AGENTS.md`, `roadmap.md` e este relatório.

A pendência anterior da maçaneta do caminhão permanece fora do escopo desta revisão.
## Ajustes solicitados pela DI — 10 de novembro de 2026

### Correções e limites do escopo

- **Responsividade da seleção (páginas 1-2):** cartões, miniaturas, textos e Mila da tela de seleção agora usam `clamp()` e `minmax()` com limites mínimos e máximos. A grade 3 × 2 é preservada sempre que a largura permite; abaixo de 768 px mantém-se o layout em duas colunas já existente. As miniaturas SVG não são deformadas (escala via viewBox) e a relação 2:1/1:2 das células das malhas de atividade não foi tocada.
- **Nome da figura (página 3):** "Figura em degraus" passa a se chamar **Árvore** apenas no rótulo apresentado e nos metadados do menu. O identificador interno `degraus`, os segmentos, os vértices e o gabarito permanecem intactos.
- **Feedbacks de erro (página 5):** `orientacao.ts` foi reescrito para analisar a distribuição dos trechos ausentes e incorretos por região semântica da figura (pétalas/caule/folhas; telhado/janelas/porta/paredes; carroceria/cabine; velas/mastro/casco; corpo/cauda; regiões genéricas para a árvore). Situações: A — uma região ausente: "Observe a parte de cima da flor. Alguns traços ainda estão faltando."; B — duas regiões: ambas nomeadas; C — somente traços extras: orienta comparar e usar a borracha; D — desenho muito diferente (3+ trechos incorretos e menos da metade dos acertos): orientação geral de recomeço. O primeiro segmento ausente não é mais usado como referência; não há contagens técnicas nem revelação da resposta; o aluno corrige sem perder os traços certos.
- **Desenho proporcional deslocado (página 6):** nova rotina `translacaoUniforme` em `comparar.ts` detecta quando o desenho reproduz o gabarito após um único deslocamento uniforme (inclusive com subdivisões colineares). O desenho deslocado **não é aprovado** — a correspondência de pontos continua exigida — mas recebe feedback diferenciado: "A forma do seu desenho está certa, mas ele está em outra posição da malha. Use os pontos correspondentes das duas malhas para desenhá-lo no lugar certo."
- A sugestão da página 4 não foi implementada, conforme instrução. Malhas, gabaritos, figuras, assets, navegação e a comparação por cobertura geométrica foram preservados.

### Resultados efetivamente obtidos

- **`bunx vitest run`: 65 testes aprovados, oito arquivos, nenhuma falha.** Novos testes: oito de orientação (situações A-D na flor, erro localizado na casa, desenho aleatório no caminhão, menção de duas regiões) e quatro de translação uniforme (flor deslocada, translação com subdivisão, rejeição de deformação, rejeição de desenho parcial/vazio).
- **Compilação automática da plataforma: `build OK`** às 10:28:26 UTC. `bun run build` não foi executado: a plataforma proíbe a compilação manual do projeto.
- **Navegador — menu sem rolagem e sem cortes nas três resoluções solicitadas:** 1200 × 675 (grade 610 × 341), 1366 × 768 (694 × 388) e 1920 × 1080 (806 × 504). Capturas inspecionadas visualmente: cartões e Mila crescem proporcionalmente, textos legíveis, navegação visível, nome "Árvore" exibido.
- **Navegador — feedbacks da flor por cliques reais em 1920 × 1080:** faltando só as pétalas → "Observe a parte de cima da flor. Alguns traços ainda estão faltando."; faltando só as folhas → "Observe as folhas..."; faltando pétalas e folhas → ambas nomeadas; figura completa com um traço extra → orientação de borracha; quatro traços aleatórios → orientação geral de recomeço; flor completa deslocada duas colunas → mensagem de deslocamento, sem aprovação. Entre os cenários, o desenho foi limpo com confirmação e os traços corretos foram preservados até a limpeza.
- **Falhas da automação inicial:** dois timeouts do roteiro de teste (clique antes da hidratação; botão de confirmação dentro do diálogo modal). O roteiro foi corrigido; nenhuma correção na aplicação foi necessária.

### Arquivos alterados

`src/styles.css` (somente seleção), `src/routes/menu.tsx` (metadados), `src/data/figuras.ts` (somente o rótulo), `src/data/comparar.ts` (adição de `translacaoUniforme`), `src/data/comparar.test.ts`, `src/data/orientacao.ts` (reescrito), `src/data/orientacao.test.ts` (novo), `src/routes/desenhar.$figura.tsx` (feedback de deslocamento), `roadmap.md` e este relatório.

A pendência da maçaneta do caminhão permanece fora do escopo.

## Proporcionalidade e semelhança — 11 de novembro de 2026

### Alterações pontuais

- Na etapa de escala existente, os lados superiores correspondentes são destacados em verde contrastante, com a grade visível. O Modelo permanece completo desde o início; apenas a Nova malha é traçada. As duas figuras continuam ocupando dois quadradinhos por lado, com células 13/26 ou 26/13: fatores exatos 2 e ½, sem modificar a geometria de atividades.
- As falas solicitadas sobre medidas proporcionais substituem a explicação anterior, sem acumular textos. A frase de sistematização aparece ao terminar a animação. As medidas são relativas ao lado original (1 medida → 2 medidas ou ½ medida), não medidas de área.
- A conclusão usa três momentos na mesma página: reflexão sobre figuras semelhantes → pergunta com alternativas A/B/C → comemoração. A e C mostram o feedback solicitado e permitem nova tentativa; B libera a mensagem de acerto, comemoração e os três botões existentes. VOLTAR, cabeçalho e indicador permanecem presentes.
- O estado da pergunta é local, sem armazenamento ou acesso ao progresso. Não há pontuação nova nem terceira transformação. A guarda de conclusão continua exigindo os dois modos; ferramentas, prática, tutorial de cliques, figuras, círculos, escalas e validação não foram alterados.

### Resultados efetivamente obtidos

- `bunx vitest run`: **71 testes aprovados em nove arquivos**, sem falhas. Os seis novos testes cobrem início da reflexão, tentativas A/C, liberação por B e medidas exatas de ampliar/reduzir. Os 65 testes anteriores continuam aprovados.
- Compilação automática: **build OK**, registro de 15:12:10 UTC. Não foi executada compilação manual, conforme as regras da plataforma.
- Navegador em **1200×675, 1366×768 e 1920×1080**: percurso capa → apresentação → peixe → reduzir → exemplo → desenho correto por cliques reais → transição → escolha → ampliar → exemplo → desenho correto → reflexão → pergunta → comemoração. Foram aprovadas seis atividades reais (um peixe em cada modo por resolução); não se afirma ter repetido as outras cinco figuras.
- Em cada resolução: Modelo completo antes de REPRODUZIR; PAUSAR mantém o mesmo quadro; REPRODUZIR retoma; ao final, lados SVG medidos em 52/26 na redução e 26/52 na ampliação, com traçado concluído. A etapa de escala não apresentou rolagem interna.
- Em cada resolução: alternativas A e C acionadas, feedback de erro visível, nova tentativa disponível; B libera comemoração e botões. O conteúdo de `mila-transformations` foi comparado antes/depois das respostas e permaneceu idêntico.
- NOVA FIGURA conservou 2 de 2; JOGAR NOVAMENTE zerou o progresso e abriu desenho vazio. A conclusão antecipada após reiniciar continuou bloqueada. Nenhum erro de execução foi capturado.
- Páginas e diálogos dos novos momentos sem transbordamento horizontal ou vertical nas três resoluções; capturas de escala, reflexão, pergunta com erro e comemoração inspecionadas visualmente.

### Arquivos modificados e limites

- `src/components/ScaleDemonstration.tsx`, `src/routes/conclusao.tsx`, `src/styles.css`.
- Novos: `src/lib/concept-reflection.ts` e `src/lib/concept-reflection.test.ts` (regras exclusivamente de apresentação).
- Documentação: `AGENTS.md`, `roadmap.md` e `AUDITORIA.md`.
- Sem falhas nos testes executados. Celular, movimento reduzido e os controles do tutorial de cliques/prática não foram reexercitados nesta rodada; seus componentes e funcionamento permanecem intactos. A pendência anterior da maçaneta não faz parte desta intervenção.

## Nova sequência por figura — 11 de novembro de 2026

### Alterações

- O histórico registra cada par figura/modalidade uma única vez; a conclusão e o indicador 0/1/2 consideram apenas a figura atual. Registros existentes da sessão continuam legíveis e acertos de figuras anteriores não são apagados.
- A primeira escolha permanece livre. Após o primeiro acerto, CONTINUAR encaminha à transição da mesma figura, com convite nominal e botão AGORA VAMOS AMPLIAR!/REDUZIR!, abrindo diretamente a modalidade oposta.
- Depois dos dois acertos da mesma figura, mantém-se a ordem reflexão → pergunta com tentativas → comemoração. A conclusão oferece ESCOLHER NOVA FIGURA e VOLTAR AO INÍCIO. O antigo JOGAR NOVAMENTE, que apagava todo o histórico, foi retirado dessa tela: refazer agora ocorre pela seleção da figura, preservando os registros.
- VOLTAR, retorno ao menu e retorno à capa conservam o histórico. Uma figura já concluída pode ser redesenhada sem duplicar acertos; sua contagem permanece 2 de 2. A função de reinício explícito do armazenamento continua disponível e testada, sem ser acionada pela navegação.
- Não foram alterados figuras, SVGs de desenho, gabaritos, círculos, escalas, ferramentas, feedbacks de erro, imagens ou tutoriais. A pergunta continua com estado local independente do histórico.

### Resultados efetivos

- **73 testes automatizados aprovados em nove arquivos**, incluindo nove testes de progresso por figura, seis de reflexão e todos os testes anteriores de geometria, ferramentas e apresentação.
- **Compilação automática: build OK, 16:17:50 UTC.** A checagem intermediária identificou chamadas antigas nos testes de progresso; foram atualizadas para exigir a figura. Nenhuma compilação manual foi executada.
- **1200×675, 1366×768 e 1920×1080:** capa → apresentação → peixe → ampliar → escala → tutorial → prática → desenho aprovado → convite para reduzir o peixe → redução aprovada → reflexão → resposta A com nova tentativa → B → comemoração → nova figura; depois casa → reduzir → ampliar → reflexão → nova figura. Os quatro desenhos de cada resolução foram feitos por cliques reais, totalizando doze atividades aprovadas.
- Em cada resolução, também redesenhei o peixe ampliado já concluído, totalizando **15 desenhos aprovados** nesta rodada. O histórico permaneceu exatamente igual, sem duplicatas. Retornar à capa e iniciar a flor mostrou 0 de 2, conservando os quatro acertos do peixe e da casa.
- Acesso direto à conclusão após uma única modalidade bloqueado nas duas figuras; retorno ao menu e escolha novamente do peixe conservou 1 de 2. Depois da prática, a segunda modalidade mostrou apenas a demonstração matemática; modalidades já vistas não repetiram automaticamente o exemplo.
- Teste complementar em 1280×1800 com **peixe ampliado e casa reduzida**, ambos por desenho real: nenhuma figura liberou a reflexão; ambas mostraram 1 de 2, inclusive após recarregar. Os dois registros permaneceram na sessão.
- Telas percorridas e diálogos sem rolagem de página, transbordamento ou controles fora da tela nas três resoluções solicitadas. Capturas de transição, reflexão e comemoração inspecionadas visualmente. Nenhum erro de execução observado nos percursos finais.
- O teste complementar inicialmente executou também o roteiro importado, causando espera excessiva; corrigi a proteção de execução do roteiro e a repetição complementar passou. Não houve alteração da aplicação por essa falha de automação.

### Arquivos e limites

- Código: `src/lib/session-progress.ts`, `src/lib/session-progress.test.ts`, `src/components/LearningScreen.tsx`, `src/components/JourneyTransition.tsx`, `src/routes/escolher.$figura.tsx`, `src/routes/desenhar.$figura.tsx`, `src/routes/conclusao.tsx`.
- Documentação: `AGENTS.md`, `roadmap.md`, `AUDITORIA.md` e atualização da regra pedagógica permanente.
- As seis figuras e os dois modos continuam cobertos pelos testes matemáticos; nesta rodada, os desenhos completos no navegador foram peixe e casa, não as outras quatro figuras. Celular, toque, movimento reduzido e todos os botões internos do tutorial não foram reexercitados. A pendência antiga da maçaneta do caminhão continua dependendo de referência mais precisa ou autorização de aproximação, fora deste ajuste.

## Indicadores de conclusão das figuras — 11/11/2026

- Os cards do menu exibem CheckCircle2 verde de 22 px, posicionado em relação ao próprio card, somente quando a mesma figura tem ampliação e redução aprovadas e sua reflexão está em comemoração após resposta correta. O nome acessível passa a incluir “— concluído”. Não há novo armazenamento de progresso: a verificação combina os dois registros existentes.
- ESCOLHER NOVA FIGURA preserva conquistas e mostra a mensagem contextual solicitada. O marcador de chegada é removido do endereço por substituição; recarregar ou visitar novamente o menu retorna à orientação habitual, mantendo os checks. Os cards permanecem clicáveis para refazer.
- **bunx vitest run: 104 testes aprovados em 11 arquivos**, incluindo nove novos testes de conclusão integral. Os 22 testes existentes de sequência de perguntas continuam aprovados: original primeiro para todas as figuras e ambas as ordens iniciais, sorteio sem repetição, tentativas e reinício.
- **1200×675, 1366×768 e 1920×1080:** peixe e flor foram desenhados nos dois modos por cliques reais; verificados nenhum check inicial, ausência após uma modalidade, ausência antes da reflexão e após erro, presença após acerto, acumulação de dois checks independentes, mensagem temporária, recarregamento e card concluído clicável. O peixe foi redesenhado em cada resolução sem perder conquistas, totalizando **15 desenhos aprovados na execução final**.
- Reinício integral validado pela função existente resetSessionProgress: limpa transformações, histórico de perguntas e todos os checks. **Não existe botão de reinício integral na interface atual**; o teste chamou essa função diretamente no navegador. Não foi acrescentado um novo controle nem alterada a navegação principal neste ajuste.
- Capturas finais inspecionadas nas três resoluções; ícones contidos nos cards e sem interseção com miniaturas, sem cortes ou rolagem de página. A primeira verificação identificou pequena sobreposição com o limite da miniatura em 1200×675; medidas posteriores orientaram o ajuste para 22 px e a posição final, aprovado no roteiro completo. Nenhum erro de execução observado na rodada final.
- **Compilação automática: build OK, 20:49:04 UTC.** Nenhuma compilação manual executada. Figuras, gabaritos, SVGs, escalas, ferramentas, animações, assets e feedbacks preservados.
- Arquivos modificados: src/routes/menu.tsx, src/routes/conclusao.tsx, src/lib/session-progress.ts, src/lib/reflection-session.ts, src/styles.css; novo teste src/lib/figure-completion.test.ts; documentação AGENTS.md, roadmap.md e AUDITORIA.md.
- Limites: desenho completo no navegador reexercitado apenas para peixe e flor nesta rodada; demais figuras cobertas pelos testes existentes. Celular, toque e movimento reduzido não reexercitados. A pendência anterior da maçaneta permanece fora deste pedido.
