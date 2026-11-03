import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LearningScreen } from "./LearningScreen";
import { Mila } from "./Mila";
import { CartoonButton } from "./CartoonButton";
import { useSessionProgress } from "@/lib/session-progress";
export function JourneyTransition({ figura }: { figura: string }) {
  const navigate = useNavigate();
  const { progress, next, complete } = useSessionProgress();
  return <LearningScreen step={4} onBack={() => navigate({ to: "/menu" })}>
    <div className="welcome-layout"><Mila pose="explaining" /><div className="welcome-copy">
      <span className="eyebrow">{progress.length > 0 ? "MAIS UMA DESCOBERTA!" : "VAMOS EXPERIMENTAR?"}</span>
      <h1>{complete ? "Vamos continuar?" : progress.length > 0 ? "Agora, a outra transformação!" : "Ampliar e reduzir!"}</h1>
      <p>{complete ? "Você já realizou as duas transformações." : progress.length > 0 ? `Você já conseguiu ${next === "ampliar" ? "reduzir" : "ampliar"}! Que tal ${next} uma figura agora?` : "Vamos completar um desafio de reduzir e um de ampliar."}</p>
      <div className="example-controls"><CartoonButton tone="pink" onClick={() => complete ? navigate({ to: "/conclusao", search: { figura, modo: next } }) : navigate({ to: "/desenhar/$figura", params: { figura }, search: { modo: next } })}>{complete ? "CONCLUIR" : next === "ampliar" ? "AMPLIAR" : "REDUZIR"}<ArrowRight size={18} /></CartoonButton><CartoonButton onClick={() => navigate({ to: "/menu" })}>ESCOLHER OUTRA FIGURA</CartoonButton></div>
    </div></div>
  </LearningScreen>;
}