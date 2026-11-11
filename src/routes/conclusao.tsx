import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Home } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { CartoonButton } from "@/components/CartoonButton";
import { FIGURAS, type Modo } from "@/data/figuras";
import { pageMeta } from "@/lib/page-meta";
import { useSessionProgress } from "@/lib/session-progress";
import { JourneyTransition } from "@/components/JourneyTransition";
import { reflectionQuestion } from "@/lib/reflection-questions";
import { continueReflection, presentReflection, submitReflectionAnswer, useReflectionSession } from "@/lib/reflection-session";
export const Route = createFileRoute("/conclusao")({
 validateSearch: (s: Record<string, unknown>): { figura: string; modo: Modo } => ({ figura: typeof s.figura === "string" && FIGURAS[s.figura] ? s.figura : "peixe", modo: s.modo === "ampliar" ? "ampliar" : "reduzir" }),
 head: () => pageMeta("Figuras semelhantes — Parabéns!", "Reflita com Mila sobre proporcionalidade e figuras semelhantes após ampliar e reduzir."), component: Conclusion,
});
function Conclusion() {
 const navigate = useNavigate(); const { figura } = Route.useSearch();
  const { complete, history } = useSessionProgress(figura);
  const reflection = useReflectionSession(figura);
  useEffect(() => { if (complete) presentReflection(figura, history); }, [complete, figura, history]);
 if (!complete) return <JourneyTransition figura={figura} />;
  if (!reflection) return <LearningScreen step={4} figura={figura} onBack={() => navigate({ to: "/menu" })}>{null}</LearningScreen>;
  const question = reflectionQuestion(reflection.questionId);
 return <LearningScreen step={4} figura={figura} onBack={() => navigate({ to: "/menu" })}>
  <div className="conclusion-synthesis">
   <div className="conclusion-content"><Mila pose={reflection.stage === "celebration" ? "celebrating" : reflection.retry ? "encouraging" : "explaining"} /><div className="synthesis-copy">
    {reflection.stage === "reflection" && <>
     <span className="eyebrow">AMPLIAR E REDUZIR</span><h1>Mesma forma!</h1>
     <p>Você percebeu? Nossos desenhos ficaram maiores ou menores, mas continuaram com a mesma forma!</p>
     <p>Na Matemática, figuras que mantêm a mesma forma e têm seus lados correspondentes proporcionais são chamadas de <strong>figuras semelhantes</strong>.</p>
      <CartoonButton tone="green" className="synthesis-next" onClick={() => continueReflection(figura)}>CONTINUAR <ArrowRight size={18} /></CartoonButton>
    </>}
    {reflection.stage === "question" && <>
      <span className="eyebrow">VAMOS PENSAR?</span><h1>{question.prompt}</h1>
      <div className="reflection-choices" role="group" aria-label="Alternativas">{question.choices.map(choice => <CartoonButton key={choice.id} onClick={() => submitReflectionAnswer(figura, choice.id)}><span>{choice.id})</span><span>{choice.text}</span></CartoonButton>)}</div>
      <p className="reflection-feedback" role="status">{reflection.retry ? question.choices.find(choice => choice.id === reflection.choice)?.explanation : ""}</p>
    </>}
    {reflection.stage === "celebration" && <>
     <span className="eyebrow">VOCÊ CONSEGUIU!</span><h1>Parabéns!</h1>
      <p role="status">{question.explanation}</p>
      <p>Você concluiu as duas transformações da figura {FIGURAS[figura].nome}!</p><p>Agora você já sabe ampliar e reduzir figuras usando a malha!</p>
    </>}
   </div></div>
   {reflection.stage === "celebration" && <div className="conclusion-actions"><CartoonButton tone="pink" onClick={() => navigate({ to: "/menu", search: { concluida: figura } })}>ESCOLHER NOVA FIGURA <ArrowRight size={18} /></CartoonButton><CartoonButton tone="green" onClick={() => navigate({ to: "/" })}><Home size={18} /> VOLTAR AO INÍCIO</CartoonButton></div>}
  </div>
 </LearningScreen>;
}
