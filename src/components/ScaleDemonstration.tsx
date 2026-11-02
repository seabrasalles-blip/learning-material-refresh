import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowRight } from "lucide-react";
import type { Modo } from "@/data/figuras";
import { CartoonButton } from "./CartoonButton";
import akemi from "@/assets/akemi-wave.png";

// Duas malhas com a mesma quantidade de quadradinhos; só o tamanho físico da
// célula muda. A malha da direita anima do tamanho da esquerda ao tamanho final.
const CELLS = 6;
const BIG = 26;
const SMALL = 13;

function MiniGrid({ cell, square }: { cell: number; square: boolean }) {
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
      {square && <rect x={pad + 2 * cell} y={pad + 2 * cell} width={2 * cell} height={2 * cell} fill="none" stroke="var(--grid-preview)" strokeWidth={4} data-example-square="true" />}
    </svg>
  );
}

export function ScaleDemonstration({ modo, onContinue }: { modo: Modo; onContinue: () => void }) {
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
      if (previous !== null) progressRef.current = Math.min(1, progressRef.current + (now - previous) / 2200);
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
  const cell = modelCell + (targetCell - modelCell) * progress;
  const play = () => {
    if (reduced) { progressRef.current = 1; setProgress(1); return; }
    if (progressRef.current >= 1) { progressRef.current = 0; setProgress(0); }
    setPlaying(true);
  };
  return (
    <div className="activity-modal">
      <section className="activity-dialog" role="dialog" aria-modal="true" aria-labelledby="example-title">
        <h2 id="example-title" className="text-xl font-extrabold mb-3">{modo === "ampliar" ? "AMPLIAR — DOBRAR" : "REDUZIR — METADE"}</h2>
        <div className="example-content">
          <img src={akemi} alt="Akemi" className="example-akemi" />
          <MiniGrid cell={modelCell} square />
          <MiniGrid cell={cell} square />
        </div>
        <p className="font-bold my-2">{modo === "ampliar" ? "Quadradinhos menores → quadradinhos maiores" : "Quadradinhos maiores → quadradinhos menores"}</p>
        <p>{modo === "ampliar"
          ? "Veja! As duas malhas têm os mesmos quadradinhos, mas os da direita são maiores. Desenhe a figura nos mesmos pontos: ela ficará maior!"
          : "Veja! As duas malhas têm os mesmos quadradinhos, mas os da direita são menores. Desenhe a figura nos mesmos pontos: ela ficará menor!"}</p>
        <div className="example-controls">
          <CartoonButton onClick={play} disabled={playing}><Play size={18} className="mr-1" /> REPRODUZIR</CartoonButton>
          <CartoonButton onClick={() => setPlaying(false)} disabled={!playing}><Pause size={18} className="mr-1" /> PAUSAR</CartoonButton>
          <CartoonButton tone="green" onClick={onContinue}>CONTINUAR <ArrowRight size={18} className="ml-1" /></CartoonButton>
        </div>
      </section>
    </div>
  );
}
