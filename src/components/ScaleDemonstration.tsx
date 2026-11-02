import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowRight } from "lucide-react";
import type { Modo } from "@/data/figuras";
import { CartoonButton } from "./CartoonButton";
import akemi from "@/assets/akemi-wave.png";

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
  const side = modo === "ampliar" ? 2 + 2 * progress : 4 - 2 * progress;
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
          <svg className="example-grid" viewBox="0 0 260 260" aria-label="Exemplo de transformação de um quadrado">
            <rect width="260" height="260" fill="var(--grid-paper)" />
            {Array.from({ length: 9 }, (_, i) => <g key={i} stroke="var(--grid-line)"><line x1={10 + i * 30} y1="10" x2={10 + i * 30} y2="250" /><line x1="10" y1={10 + i * 30} x2="250" y2={10 + i * 30} /></g>)}
            <rect x="70" y="70" width={side * 30} height={side * 30} fill="none" stroke="var(--grid-preview)" strokeWidth="4" data-example-square="true" />
            {Array.from({ length: Math.floor(side) }, (_, i) => <text key={i} x={85 + i * 30} y="60" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--grid-ink)">{i + 1}</text>)}
          </svg>
        </div>
        <p className="font-bold my-2">{modo === "ampliar" ? "2 → 4 quadradinhos em cada lado" : "4 → 2 quadradinhos em cada lado"}</p>
        <p>{modo === "ampliar" ? "Veja! Cada lado tinha 2 quadradinhos. Agora tem 4. A figura dobrou de tamanho!" : "Agora cada lado ficou com metade da medida. A figura ficou menor, mas manteve a mesma forma!"}</p>
        <div className="example-controls">
          <CartoonButton onClick={play} disabled={playing}><Play size={18} className="mr-1" /> REPRODUZIR</CartoonButton>
          <CartoonButton onClick={() => setPlaying(false)} disabled={!playing}><Pause size={18} className="mr-1" /> PAUSAR</CartoonButton>
          <CartoonButton tone="green" onClick={onContinue}>CONTINUAR <ArrowRight size={18} className="ml-1" /></CartoonButton>
        </div>
      </section>
    </div>
  );
}