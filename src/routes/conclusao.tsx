import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, RotateCcw, Home } from "lucide-react";
import { LearningScreen } from "@/components/LearningScreen";
import { Mila } from "@/components/Mila";
import { CartoonButton } from "@/components/CartoonButton";
import { FIGURAS, type Modo } from "@/data/figuras";
import { pageMeta } from "@/lib/page-meta";
import { resetSessionProgress, useSessionProgress } from "@/lib/session-progress";
import { JourneyTransition } from "@/components/JourneyTransition";
import { answerReflection, INITIAL_REFLECTION, type ReflectionChoice } from "@/lib/concept-reflection";

const CHOICES: { id: ReflectionChoice; text: string }[] = [
 { id: "A", text: "A figura muda de tamanho e de forma." },
 { id: "B", text: "A figura muda de tamanho, mas mantém a forma." },
 { id: "C", text: "A figura muda apenas de posição." },
];
export const Route = createFileRoute("/conclusao")({
 validateSearch: (s: Record<string, unknown>): { figura: string; modo: Modo } => ({ figura: typeof s.figura === "string" && FIGURAS[s.figura] ? s.figura : "peixe", modo: s.modo === "ampliar" ? "ampliar" : "reduzir" }),
 head: () => pageMeta("Figuras semelhantes — Parabéns!", "Reflita com Mila sobre proporcionalidade e figuras semelhantes após ampliar e reduzir."), component: Conclusion,
});
function Conclusion() {
 const navigate = useNavigate(); const { figura, modo } = Route.useSearch();
 const { complete } = useSessionProgress();
 const [reflection, setReflection] = useState(INITIAL_REFLECTION);
 if (!complete) return <JourneyTransition figura={figura} />;
 return <LearningScreen step={4} onBack={() => navigate({ to: "/menu" })}>
  <div className="conclusion-synthesis">
   <div className="conclusion-content"><Mila pose={reflection.stage === "celebration" ? "celebrating" : reflection.retry ? "encouraging" : "explaining"} /><div className="synthesis-copy">
    {reflection.stage === "reflection" && <>
     <span className="eyebrow">AMPLIAR E REDUZIR</span><h1>Mesma forma!</h1>
     <p>Você percebeu? Nossos desenhos ficaram maiores ou menores, mas continuaram com a mesma forma!</p>
     <p>Na Matemática, figuras que mantêm a mesma forma e têm seus lados correspondentes proporcionais são chamadas de <strong>figuras semelhantes</strong>.</p>
     <CartoonButton tone="green" className="synthesis-next" onClick={() => setReflection({ stage: "question", retry: false })}>CONTINUAR <ArrowRight size={18} /></CartoonButton>
    </>}
    {reflection.stage === "question" && <>
     <span className="eyebrow">VAMOS PENSAR?</span><h1>Quando ampliamos ou reduzimos uma figura corretamente, o que acontece?</h1>
     <div className="reflection-choices" role="group" aria-label="Alternativas">{CHOICES.map(choice => <CartoonButton key={choice.id} onClick={() => setReflection(answerReflection(choice.id))}><span>{choice.id})</span><span>{choice.text}</span></CartoonButton>)}</div>
     <p className="reflection-feedback" role="status">{reflection.retry ? "Observe novamente! Ao ampliar ou reduzir corretamente, mudamos o tamanho da figura, mas mantemos sua forma. Tente outra vez!" : ""}</p>
    </>}
    {reflection.stage === "celebration" && <>
     <span className="eyebrow">VOCÊ CONSEGUIU!</span><h1>Parabéns!</h1>
     <p role="status">Muito bem! As medidas dos lados mudam na mesma proporção e a forma é preservada. Essa é uma característica das figuras semelhantes!</p>
     <p>Você concluiu um desafio de ampliar e um de reduzir!</p><p>Agora você já sabe ampliar e reduzir figuras usando a malha!</p>
    </>}
   </div></div>
   {reflection.stage === "celebration" && <div className="conclusion-actions"><CartoonButton tone="pink" onClick={() => navigate({ to: "/menu" })}>NOVA FIGURA <ArrowRight size={18} /></CartoonButton><CartoonButton onClick={() => { resetSessionProgress(); navigate({ to: "/desenhar/$figura", params: { figura }, search: { modo } }); }}><RotateCcw size={18} /> JOGAR NOVAMENTE</CartoonButton><CartoonButton tone="green" onClick={() => navigate({ to: "/" })}><Home size={18} /> VOLTAR AO INÍCIO</CartoonButton></div>}
  </div>
 </LearningScreen>;
}
