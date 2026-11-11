import type { ReactNode } from "react";
import { ArrowLeft, Grid2X2 } from "lucide-react";
import { CartoonButton } from "./CartoonButton";
import background from "@/assets/mila/fundo-atividades.png.asset.json";
import coverBackground from "@/assets/mila/fundo-capa.png.asset.json";
import { useSessionProgress } from "@/lib/session-progress";

export function LearningScreen({ children, step, figura, onBack, footer, cover = false, activity = false }: { children: ReactNode; step?: number; figura?: string; onBack?: () => void; footer?: ReactNode; cover?: boolean; activity?: boolean }) {
  const { progress } = useSessionProgress(figura);
  return <div className={`learning-screen ${cover ? "learning-cover" : ""} ${activity ? "learning-activity" : ""}`}>
    <img src={(cover ? coverBackground : background).url} alt="" className="learning-background" aria-hidden="true" />
    <main className="learning-main">
      <header className="learning-nav">
        <div>{onBack && <CartoonButton className="back-button" onClick={onBack}><ArrowLeft size={18} /> VOLTAR</CartoonButton>}</div>
        <span className="learning-brand"><Grid2X2 size={19} /> Malha Quadriculada</span>
        <div className="learning-progress">{step && <><span>{progress.length} de 2 transformações</span><div className="progress-dots" aria-label="Progresso da figura">{(["reduzir", "ampliar"] as const).map(modo => <span key={modo} className={progress.some(p => p.modo === modo) ? "mode-complete" : ""}>{modo === "reduzir" ? "½" : "2×"}{progress.some(p => p.modo === modo) ? " ✓" : ""}</span>)}</div></>}</div>
      </header>
      <div className="learning-content">{children}</div>
      {footer && <footer className="learning-footer">{footer}</footer>}
    </main>
  </div>;
}