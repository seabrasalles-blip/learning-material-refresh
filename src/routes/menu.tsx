import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { CartoonButton } from "@/components/CartoonButton";
import { ReferenceGrid } from "@/components/ReferenceGrid";
import { FIGURAS_LIST } from "@/data/figuras";
import { pageMeta } from "@/lib/page-meta";
import { figureFullyComplete, useSessionProgress } from "@/lib/session-progress";
import { useReflectionHistory } from "@/lib/reflection-session";
export const Route = createFileRoute("/menu")({
 validateSearch: (search: Record<string, unknown>): { concluida?: string } => ({ concluida: typeof search.concluida === "string" ? search.concluida : undefined }),
 head: () => pageMeta("Escolha a figura", "Escolha flor, árvore, peixe, barco, caminhão ou casa para desenhar com Mila."), component: Menu,
});
function Menu() {
 const navigate = useNavigate();
 const { history } = useSessionProgress();
 const reflections = useReflectionHistory();
 const { concluida } = Route.useSearch();
 const [showCompletionMessage, setShowCompletionMessage] = useState(false);
 useEffect(() => {
  if (!concluida) return;
  if (figureFullyComplete(history, reflections, concluida)) setShowCompletionMessage(true);
  void navigate({ to: "/menu", search: {}, replace: true });
 }, [concluida, history, reflections, navigate]);
 return <LearningScreen step={2} onBack={() => navigate({ to: "/apresentacao" })}>
  <div className="selection-heading"><span className="eyebrow">UM DESENHO, MUITAS POSSIBILIDADES</span><h1>Qual figura vamos desenhar?</h1></div>
  <div className="figure-layout"><aside className="mila-aside"><Mila pose="thinking" /><p>{showCompletionMessage ? "Você concluiu os desafios dessa figura! Veja o sinal de concluído. Qual será a próxima?" : "Escolha a figura que você quer desenhar."}</p></aside>
  <div className="figure-options">{FIGURAS_LIST.map(fig => {
   const completed = figureFullyComplete(history, reflections, fig.id);
   return <CartoonButton key={fig.id} className="figure-option" aria-label={completed ? `${fig.nome} — concluído` : fig.nome} onClick={() => navigate({ to: "/escolher/$figura", params: { figura: fig.id } })}>
    {completed && <CheckCircle2 className="figure-completion-check" size={24} aria-hidden="true" />}
    <ReferenceGrid figura={fig} cell={13} showLabels={false} /><span>{fig.nome}</span>
   </CartoonButton>;
  })}</div></div>
 </LearningScreen>;
}
