import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LearningScreen } from "./LearningScreen";
import { Mila } from "./Mila";
import { CartoonButton } from "./CartoonButton";
import { useSessionProgress } from "@/lib/session-progress";
import { FIGURAS } from "@/data/figuras";
export function JourneyTransition({ figura }: { figura: string }) {
  const navigate = useNavigate();
  const { progress, next, complete } = useSessionProgress(figura);
  const nome = FIGURAS[figura]?.nome.toLowerCase() ?? "figura";
  const article = ["casa", "flor", "degraus"].includes(figura) ? "a" : "o";
  return <LearningScreen step={4} figura={figura} onBack={() => navigate({ to: "/menu" })}>
    <div className="welcome-layout"><Mila pose="explaining" /><div className="welcome-copy">
      <span className="eyebrow">{progress.length > 0 ? "MAIS UMA DESCOBERTA!" : "VAMOS EXPERIMENTAR?"}</span>
      <h1>{complete ? "Vamos continuar?" : progress.length > 0 ? "Agora, a outra transformação!" : "Ampliar e reduzir!"}</h1>
      <p>{complete ? `Você já realizou as duas transformações d${article} ${nome}.` : progress.length > 0 ? `Muito bem! Você conseguiu ${next === "ampliar" ? "reduzir" : "ampliar"} ${article} ${nome}! Agora, que tal ${next} essa mesma figura?` : `Vamos completar um desafio de reduzir e um de ampliar ${article} ${nome}.`}</p>
      <div className="example-controls"><CartoonButton tone="pink" onClick={() => complete ? navigate({ to: "/conclusao", search: { figura, modo: next } }) : navigate({ to: "/desenhar/$figura", params: { figura }, search: { modo: next } })}>{complete ? "CONCLUIR" : `AGORA VAMOS ${next.toUpperCase()}!`}<ArrowRight size={18} /></CartoonButton></div>
    </div></div>
  </LearningScreen>;
}