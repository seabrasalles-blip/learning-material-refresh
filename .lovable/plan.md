# Reconstrução do material "Malhas Quadriculadas com Akemi"

Como o `.fla` é binário do Adobe Animate e não pode ser editado aqui, vamos reconstruir o material como aplicação web moderna em React/TypeScript, mantendo fielmente o visual e o fluxo do original.

## Telas

1. **Intro (`/`)** — Personagem Akemi com balão de fala ("Olá, amigos! Eu sou a Akemi…"), fundo azul com raios, botão **CONTINUAR** no canto inferior direito.
2. **Menu (`/menu`)** — Akemi sorrindo, fundo verde com raios, cartaz com 6 figuras clicáveis: **Peixe, Casa, Barco, Árvore, Caminhão, Flor**. Botão **VOLTAR** no topo.
3. **Atividade (`/desenhar/$figura`)** — Layout em 3 áreas:
   - Painel esquerdo: ícones de **lápis**, **desfazer**, **apagar tudo**
   - Painel direito superior: malha quadriculada vazia (colunas a–j, linhas 1–7) onde o aluno desenha
   - Painel direito inferior: malha de referência com a figura-gabarito desenhada
   - Botão **VOLTAR** (inferior esquerdo) e **VERIFICAR** (inferior direito)

## Como funciona a atividade

- **Desenho por vértices**: o aluno clica em pontos da grade (interseções). Cada par de cliques consecutivo forma um segmento reto. Pode-se manter encadeamento (último ponto vira início do próximo segmento) até o aluno clicar no ícone de lápis para "levantar".
- **Desfazer** remove o último segmento.
- **Apagar tudo** limpa a malha.
- **Verificar**: compara o conjunto de segmentos do aluno com o gabarito normalizado (segmentos não-direcionados). Mostra modal com:
  - ✅ "Parabéns!" se todos os segmentos batem
  - ❌ Mensagem amigável com contagem de acertos/erros se diverge

## Estrutura técnica

- **Rotas** (TanStack Start): `src/routes/index.tsx` (intro), `src/routes/menu.tsx`, `src/routes/desenhar.$figura.tsx`
- **Componentes**: `AkemiCharacter`, `SpeechBubble`, `RayBackground` (azul/verde), `DrawingGrid` (SVG interativo), `ReferenceGrid`, `ToolPanel`, `VerifyModal`
- **Dados**: `src/data/figuras.ts` — cada figura tem nome, ícone do menu, e array de segmentos `[{from:[col,row], to:[col,row]}]` que descreve o gabarito (peixe, casa, barco, árvore, caminhão, flor)
- **Assets**: Akemi e ícones (lápis, seta desfazer, borracha, botões VOLTAR/CONTINUAR/VERIFICAR) gerados via `imagegen` em estilo cartoon infantil próximo ao original. Fundo de raios em CSS puro (gradiente cônico).
- **SVG grid**: renderiza linhas da malha, rótulos a–j / 1–7, snap dos cliques no vértice mais próximo, segmentos desenhados como `<line>`. Hover destaca o vértice.
- **Estilo**: paleta fiel — ciano (#7dd3e0) para intro, verde (#a8e063) para menu, branco para malhas, contornos pretos espessos estilo cartoon.

## Entregáveis

- App funcional com 6 figuras jogáveis
- Visual fiel ao original (Akemi, raios, balões, botões arredondados estilo "cartoon")
- Validação automática do desenho contra o gabarito
- Responsivo (funciona em tablet/desktop)

## O que NÃO está incluso

- Áudio/narração (o original parece não ter)
- Animações da Akemi (fica estática — uma pose para intro, outra para menu)
- Edição do `.fla` original (impossível sem Adobe Animate)
