import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowRight, SkipForward } from "lucide-react";
import type { Modo } from "@/data/figuras";
import { CartoonButton } from "./CartoonButton";
import { Mila } from "./Mila";
import { LearningDialog } from "./LearningDialog";
import { DrawingTutorial } from "./DrawingTutorial";
import { DrawingPractice } from "./DrawingPractice";
import { markDrawingTutorialSeen } from "@/lib/demonstration-session";
import { scaleExampleMeasures } from "@/lib/concept-reflection";

// Duas malhas com a mesma quantidade de quadradinhos; só o tamanho físico da
// célula muda. A malha da direita anima do tamanho da esquerda ao tamanho final.
const CELLS = 6;

function MiniGrid({ cell, square, trace = 1, highlight = false }: { cell: number; square: boolean; trace?: number; highlight?: boolean }) {
  const pad = 8;
  const size = CELLS * cell + pad * 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: "auto", background: "var(--grid-paper)", border: "3px solid var(--grid-ink)", borderRadius: 6 }} aria-hidden="true">
      {Array.from({ length: CELLS + 1 }, (_, i) => (
        <g key={i} stroke="var(--grid-line)" strokeWidth={1}>
          <line x1={pad + i * cell} y1={pad} x2={pad + i * cell} y2={pad + CELLS * cell} />
          <line x1={pad} y1={pad + i * cell} x2={pad + CELLS * cell} y2={pad + i * cell} />
        </g>
      ))}
      {square && <rect x={pad + 2 * cell} y={pad + 2 * cell} width={2 * cell} height={2 * cell} fill="none" stroke="var(--grid-preview)" strokeWidth={4} data-example-square="true" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trace} />}
      {square && highlight && <line x1={pad + 2 * cell} y1={pad + 2 * cell} x2={pad + 4 * cell} y2={pad + 2 * cell} stroke="var(--button-green-ink)" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, trace * 4)} data-corresponding-side="true" />}
    </svg>
  );
}

export function ScaleDemonstration({ modo, onContinue, includeDrawingTutorial = true }: { modo: Modo; onContinue: () => void; includeDrawingTutorial?: boolean }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const progressRef = useRef(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(media.matches); if (media.matches) setPlaying(false); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null) progressRef.current = Math.min(1, progressRef.current + (now - previous) / 3000);
      previous = now;
      setProgress(progressRef.current);
      if (progressRef.current < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const { modelCell, targetCell } = scaleExampleMeasures(modo);
  const cell = modelCell + (targetCell - modelCell) * Math.min(1, progress * 2);
  const trace = Math.max(0, progress * 2 - 1);
  const play = () => {
    if (reduced) { progressRef.current = 1; setProgress(1); return; }
    if (progressRef.current >= 1) { progressRef.current = 0; setProgress(0); }
    setPlaying(true);
  };
  const titles = [modo === "ampliar" ? "Vamos ampliar ao dobro!" : "Vamos reduzir à metade!", "COMO DESENHAR NA MALHA", "Agora é sua vez!"];
  return (
    <LearningDialog title={titles[step]} onClose={onContinue} className="demo-dialog">
      <div className="demo-topbar"><span>Etapa {step + 1} de {includeDrawingTutorial ? 3 : 1}</span><CartoonButton onClick={onContinue} className="skip-example"><SkipForward size={16} className="mr-1" /> PULAR EXEMPLO</CartoonButton></div>
      {step === 0 && <>
        <div className="example-content">
          <Mila pose="explaining" className="example-mila" />
          <div className="example-grids scale-concept-grids"><div><span>Modelo</span><MiniGrid cell={modelCell} square highlight /><span className="side-measure">Lado: 1 medida</span></div><ArrowRight size={22} /><div><span>Nova malha</span><MiniGrid cell={cell} square={trace > 0} trace={trace} highlight /><span className="side-measure">{progress >= 0.5 ? modo === "ampliar" ? "Lado: 2 medidas" : "Lado: ½ medida" : "Lado correspondente"}</span></div></div>
        </div>
        <p className="font-bold my-2">{modo === "ampliar" ? "Quadradinhos com o dobro da medida dos lados" : "Quadradinhos com metade da medida dos lados"}</p>
        <p className="scale-concept-speech">{modo === "ampliar"
          ? "Observe! Quando dobramos a medida de um lado, precisamos dobrar as medidas de todos os outros. Assim, a figura fica maior, mas mantém a mesma forma!"
          : "Na redução, acontece o contrário! Cada lado fica com metade da medida original. A figura fica menor, mas continua com a mesma forma!"}</p>
        <p className="scale-concept-note" aria-live="polite">{progress >= 1
          ? modo === "ampliar" ? "Essa relação entre as medidas é uma ideia importante da Matemática: a proporcionalidade!" : "Quando todas as medidas mudam na mesma proporção, a forma da figura é preservada."
          : "Você vai desenhar a figura na nova malha, nos pontos correspondentes."}</p>
        <div className="example-controls">
          <CartoonButton onClick={play} disabled={playing}><Play size={18} className="mr-1" /> REPRODUZIR</CartoonButton>
          <CartoonButton onClick={() => setPlaying(false)} disabled={!playing}><Pause size={18} className="mr-1" /> PAUSAR</CartoonButton>
          <CartoonButton tone="green" onClick={() => { setPlaying(false); if (includeDrawingTutorial) setStep(1); else onContinue(); }}>{includeDrawingTutorial ? "PRÓXIMO" : "CONTINUAR"} <ArrowRight size={18} className="ml-1" /></CartoonButton>
        </div>
      </>}
      {step === 1 && <DrawingTutorial reduced={reduced} onNext={() => setStep(2)} />}
      {step === 2 && <DrawingPractice onStart={() => { markDrawingTutorialSeen(); onContinue(); }} />}
    </LearningDialog>
  );
}
