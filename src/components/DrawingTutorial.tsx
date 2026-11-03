import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Pencil, Play } from "lucide-react";
import { CartoonButton } from "./CartoonButton";
import { Mila } from "./Mila";

// Example grid independent from the activity; never reveals an answer figure.
const COLS = 6, ROWS = 4, CELL = 34, PAD = 14;
type P = [number, number];
const A: P = [1, 3], B: P = [3, 1], C: P = [5, 3], D: P = [2, 5], E: P = [5, 5];
const px = (p: P) => ({ x: PAD + (p[0] - 1) * CELL, y: PAD + (p[1] - 1) * CELL });
const W = COLS * CELL + PAD * 2, H = ROWS * CELL + PAD * 2;
const PENCIL = { x: W + 30, y: H / 2 };

type Frame = { action: 0 | 1 | 2; cursor: { x: number; y: number }; pending: P | null; lines: [P, P][]; pencil?: boolean };
const FRAMES: Frame[] = [
  { action: 0, cursor: px(A), pending: A, lines: [] },
  { action: 1, cursor: px(B), pending: B, lines: [[A, B]] },
  { action: 2, cursor: px(C), pending: C, lines: [[A, B], [B, C]] },
  { action: 2, cursor: PENCIL, pending: null, lines: [[A, B], [B, C]], pencil: true },
  { action: 2, cursor: px(D), pending: D, lines: [[A, B], [B, C]] },
  { action: 2, cursor: px(E), pending: E, lines: [[A, B], [B, C], [D, E]] },
];
const SPEECH = [
  "Para começar, clique em um ponto onde as linhas se cruzam.",
  "Agora clique em outro ponto. Pronto! Você desenhou uma linha!",
  "Continue ligando os pontos. Para começar outra parte do desenho, clique novamente no lápis.",
];

export function DrawingTutorial({ reduced, onNext }: { reduced: boolean; onNext: () => void }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
  useEffect(() => {
    if (!playing) return;
    if (frame >= FRAMES.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setFrame(f => f + 1), 1400);
    return () => clearTimeout(t);
  }, [playing, frame]);
  const f = FRAMES[frame];
  const transition = reduced ? "none" : "transform 0.8s ease-in-out";
  return <div className="tutorial-step">
    <div className="example-content">
      <Mila pose="explaining" className="example-mila" />
      <div>
        <p className="tutorial-speech" aria-live="polite">{SPEECH[f.action]}</p>
        <p className="tutorial-counter">Ação {f.action + 1} de 3</p>
        <svg viewBox={`0 0 ${W + 60} ${H}`} className="tutorial-svg" role="img" aria-label={`Demonstração: ${SPEECH[f.action]}`}>
          <rect x={0} y={0} width={W} height={H} fill="var(--grid-paper)" stroke="var(--grid-ink)" strokeWidth={3} rx={6} />
          {Array.from({ length: COLS + 1 }, (_, i) => <line key={`v${i}`} x1={PAD + i * CELL} y1={PAD} x2={PAD + i * CELL} y2={PAD + ROWS * CELL} stroke="var(--grid-line)" />)}
          {Array.from({ length: ROWS + 1 }, (_, i) => <line key={`h${i}`} x1={PAD} y1={PAD + i * CELL} x2={PAD + COLS * CELL} y2={PAD + i * CELL} stroke="var(--grid-line)" />)}
          {f.lines.map(([a, b], i) => <line key={i} x1={px(a).x} y1={px(a).y} x2={px(b).x} y2={px(b).y} stroke="var(--grid-ink)" strokeWidth={3.5} strokeLinecap="round" />)}
          {f.pending && <circle cx={px(f.pending).x} cy={px(f.pending).y} r={7} fill="var(--grid-pending)" stroke="var(--grid-ink)" strokeWidth={1.5} />}
          <g transform={`translate(${PENCIL.x - 18} ${PENCIL.y - 18})`}>
            <rect width={36} height={36} rx={8} fill={f.pencil ? "var(--grid-pending)" : "var(--grid-paper)"} stroke="var(--grid-ink)" strokeWidth={2.5} />
            <Pencil x={8} y={8} width={20} height={20} color="var(--grid-ink)" />
          </g>
          <g style={{ transform: `translate(${f.cursor.x}px, ${f.cursor.y}px)`, transition }}>
            <path d="M0 0 L0 20 L5 15 L9 24 L13 22 L9 13 L16 13 Z" fill="var(--grid-paper)" stroke="var(--grid-ink)" strokeWidth={1.8} strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
    <div className="example-controls">
      <CartoonButton onClick={() => setFrame(x => Math.max(0, x - 1))} disabled={frame === 0} aria-label="Passo anterior"><ArrowLeft size={18} /></CartoonButton>
      {playing
        ? <CartoonButton onClick={() => setPlaying(false)}><Pause size={18} className="mr-1" /> PAUSAR</CartoonButton>
        : <CartoonButton onClick={() => { if (reduced) return setFrame(x => Math.min(FRAMES.length - 1, x + 1)); if (frame >= FRAMES.length - 1) setFrame(0); setPlaying(true); }}><Play size={18} className="mr-1" /> {reduced ? "PRÓXIMO PASSO" : "REPRODUZIR"}</CartoonButton>}
      <CartoonButton onClick={() => setFrame(x => Math.min(FRAMES.length - 1, x + 1))} disabled={frame === FRAMES.length - 1} aria-label="Próximo passo"><ArrowRight size={18} /></CartoonButton>
      <CartoonButton tone="green" onClick={onNext}>PRÓXIMO <ArrowRight size={18} className="ml-1" /></CartoonButton>
    </div>
  </div>;
}
