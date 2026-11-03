import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { Segmento, Vertex } from "@/data/figuras";
import { DrawingGrid } from "./DrawingGrid";
import { CartoonButton } from "./CartoonButton";
import { Mila } from "./Mila";

// Local-only practice: its segments never reach the activity drawing or progress.
export function DrawingPractice({ onStart }: { onStart: () => void }) {
  const [segmentos, setSegmentos] = useState<Segmento[]>([]);
  const [pending, setPending] = useState<Vertex | null>(null);
  const done = segmentos.length > 0;
  return <div className="tutorial-step">
    <div className="example-content">
      <Mila pose={done ? "celebrating" : "encouraging"} className="example-mila" />
      <div className="practice-box">
        <p className="tutorial-speech" aria-live="polite">{done ? "Isso! Agora você já sabe como começar!" : "Agora é sua vez! Clique em dois pontos para desenhar uma linha."}</p>
        <div className="practice-grid"><DrawingGrid cols={5} rows={3} cell={36} segmentos={segmentos} pendingFrom={pending} toolActive onAddSegment={s => setSegmentos(p => [...p, s])} onSetPending={setPending} /></div>
      </div>
    </div>
    <div className="example-controls">
      {done && <CartoonButton onClick={() => { setSegmentos([]); setPending(null); }}><RotateCcw size={18} className="mr-1" /> PRATICAR NOVAMENTE</CartoonButton>}
      <CartoonButton tone="green" onClick={onStart}>COMEÇAR A ATIVIDADE <ArrowRight size={18} className="ml-1" /></CartoonButton>
    </div>
  </div>;
}
