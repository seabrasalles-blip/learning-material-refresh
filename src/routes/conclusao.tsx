import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw, Home } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { CartoonButton } from "@/components/CartoonButton";
import { FIGURAS, type Modo } from "@/data/figuras";
import { pageMeta } from "@/lib/page-meta";
import { useSessionProgress } from "@/lib/session-progress";
import { JourneyTransition } from "@/components/JourneyTransition";
export const Route = createFileRoute("/conclusao")({
 validateSearch: (s: Record<string, unknown>): { figura: string; modo: Modo } => ({ figura: typeof s.figura === "string" && FIGURAS[s.figura] ? s.figura : "peixe", modo: s.modo === "ampliar" ? "ampliar" : "reduzir" }),
 head: () => pageMeta("Parabéns!", "Você concluiu a atividade de malha quadriculada com Mila."), component: Conclusion,
});
function Conclusion() {
 const navigate = useNavigate(); const { figura, modo } = Route.useSearch();
 const { complete } = useSessionProgress();
 if (!complete) return <JourneyTransition figura={figura} />;
 return <LearningScreen step={4} onBack={() => navigate({ to: "/menu" })}>
  <div className="conclusion-content"><Mila pose="celebrating" /><div><span className="eyebrow">VOCÊ CONSEGUIU!</span><h1>Parabéns!</h1><p>Você concluiu um desafio de ampliar e um de reduzir!</p><p>Agora você já sabe ampliar e reduzir figuras usando a malha!</p></div></div>
  <div className="conclusion-actions"><CartoonButton tone="pink" onClick={() => navigate({ to: "/menu" })}>NOVA FIGURA <ArrowRight size={18} /></CartoonButton><CartoonButton onClick={() => navigate({ to: "/desenhar/$figura", params: { figura }, search: { modo } })}><RotateCcw size={18} /> JOGAR NOVAMENTE</CartoonButton><CartoonButton tone="green" onClick={() => navigate({ to: "/" })}><Home size={18} /> VOLTAR AO INÍCIO</CartoonButton></div>
 </LearningScreen>;
}
