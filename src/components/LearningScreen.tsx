import type { ReactNode } from "react";
import { ArrowLeft, Grid2X2 } from "lucide-react";
import { CartoonButton } from "./CartoonButton";
import background from "@/assets/mila/fundo-atividades.png.asset.json";

export function LearningScreen({ children, step, onBack, footer, cover = false, activity = false }: { children: ReactNode; step?: number; onBack?: () => void; footer?: ReactNode; cover?: boolean; activity?: boolean }) {
  return <div className={`learning-screen ${cover ? "learning-cover" : ""} ${activity ? "learning-activity" : ""}`}>
    <img src={background.url} alt="" className="learning-background" aria-hidden="true" />
    <main className="learning-main">
      <header className="learning-nav">
        <div>{onBack && <CartoonButton className="back-button" onClick={onBack}><ArrowLeft size={18} /> VOLTAR</CartoonButton>}</div>
        <span className="learning-brand"><Grid2X2 size={19} /> Malha Quadriculada</span>
        <div className="learning-progress">{step && <><span>Etapa {step} de 4</span><div className="progress-dots" aria-hidden="true">{[1,2,3,4].map(n => <i key={n} className={n <= step ? "complete" : ""} />)}</div></>}</div>
      </header>
      <div className="learning-content">{children}</div>
      {footer && <footer className="learning-footer">{footer}</footer>}
    </main>
  </div>;
}