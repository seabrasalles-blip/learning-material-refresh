import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowRight, SkipForward } from "lucide-react";
import type { Modo } from "@/data/figuras";
import { CartoonButton } from "./CartoonButton";
import { Mila } from "./Mila";
import { LearningDialog } from "./LearningDialog";
import { DrawingTutorial } from "./DrawingTutorial";
import { DrawingPractice } from "./DrawingPractice";

// Duas malhas com a mesma quantidade de quadradinhos; só o tamanho físico da
// célula muda. A malha da direita anima do tamanho da esquerda ao tamanho final.
const CELLS = 6;
const BIG = 26;
const SMALL = 13;

function MiniGrid({ cell, square, trace = 1 }: { cell: number; square: boolean; trace?: number }) {
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
    </svg>
  );
}

export function ScaleDemonstration({ modo, onContinue }: { modo: Modo; onContinue: () => void }) {
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
  const modelCell = modo === "ampliar" ? SMALL : BIG;
  const targetCell = modo === "ampliar" ? BIG : SMALL;
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
      <div className="demo-topbar"><span>Etapa {step + 1} de 3</span><CartoonButton onClick={onContinue} className="skip-example"><SkipForward size={16} className="mr-1" /> PULAR EXEMPLO</CartoonButton></div>
      {step === 0 && <>
        <div className="example-content">
          <Mila pose="explaining" className="example-mila" />
          <div className="example-grids"><div><span>Modelo</span><MiniGrid cell={modelCell} square={progress > 0} /></div><ArrowRight size={22} /><div><span>Nova malha</span><MiniGrid cell={cell} square={trace > 0} trace={trace} /></div></div>
        </div>
        <p className="font-bold my-2">{modo === "ampliar" ? "Quadradinhos menores → quadradinhos maiores" : "Quadradinhos maiores → quadradinhos menores"}</p>
        <p>{modo === "ampliar"
          ? "Os quadradinhos da nova malha são maiores. Você vai desenhar a figura na nova malha, nos pontos correspondentes, e ela ficará maior com a mesma forma."
          : "Os quadradinhos da nova malha são menores. Você vai desenhar a figura na nova malha, nos pontos correspondentes, e ela ficará menor com a mesma forma."}</p>
        <div className="example-controls">
          <CartoonButton onClick={play} disabled={playing}><Play size={18} className="mr-1" /> REPRODUZIR</CartoonButton>
          <CartoonButton onClick={() => setPlaying(false)} disabled={!playing}><Pause size={18} className="mr-1" /> PAUSAR</CartoonButton>
          <CartoonButton tone="green" onClick={() => { setPlaying(false); setStep(1); }}>PRÓXIMO <ArrowRight size={18} className="ml-1" /></CartoonButton>
        </div>
      </>}
      {step === 1 && <DrawingTutorial reduced={reduced} onNext={() => setStep(2)} />}
      {step === 2 && <DrawingPractice onStart={onContinue} />}
    </LearningDialog>
  );
}
