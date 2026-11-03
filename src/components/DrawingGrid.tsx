import { useRef, useState } from "react";
import type { Circulo, Segmento, Vertex } from "@/data/figuras";
import { moveGridCursor } from "@/lib/grid-keyboard";
import { nearestSegment } from "@/lib/segment-tools";

interface Props {
  cols: number;
  rows: number;
  cell?: number;
  segmentos: Segmento[];
  circulos?: Circulo[];
  pendingFrom: Vertex | null;
  toolActive: boolean; // when false (e.g. eraser), clicks are ignored
  onEraseSegment?: (index: number) => void;
  onAddSegment: (s: Segmento) => void;
  onSetPending: (v: Vertex | null) => void;
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export function DrawingGrid({
  cols,
  rows,
  cell = 40,
  segmentos,
  circulos = [],
  pendingFrom,
  toolActive,
  onEraseSegment,
  onAddSegment,
  onSetPending,
}: Props) {
  const pad = 24;
  const w = cols * cell + pad * 2;
  const h = rows * cell + pad * 2;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hover, setHover] = useState<Vertex | null>(null);
  const [keyboardCursor, setKeyboardCursor] = useState<Vertex>([1, 1]);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [eraseHover, setEraseHover] = useState<number | null>(null);

  const px = (c: number) => pad + (c - 1) * cell;
  const py = (r: number) => pad + (r - 1) * cell;

  function svgPoint(e: React.MouseEvent<SVGSVGElement>): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const scaleX = w / rect.width;
    const scaleY = h / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function nearestVertex(x: number, y: number): Vertex | null {
    const c = Math.round((x - pad) / cell) + 1;
    const r = Math.round((y - pad) / cell) + 1;
    if (c < 1 || c > cols + 1 || r < 1 || r > rows + 1) return null;
    // require click within ~half a cell
    const dx = x - px(c);
    const dy = y - py(r);
    if (Math.hypot(dx, dy) > cell * 0.5) return null;
    return [c, r];
  }

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const p = svgPoint(e);
    if (!p) return;
    if (!toolActive) {
      const rect = svgRef.current?.getBoundingClientRect();
      setEraseHover(nearestSegment(segmentos, [(p.x - pad) / cell + 1, (p.y - pad) / cell + 1], rect ? 10 * w / rect.width / cell : 0.25));
      return;
    }
    setHover(nearestVertex(p.x, p.y));
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const p = svgPoint(e);
    if (!p) return;
    if (!toolActive) {
      const rect = svgRef.current?.getBoundingClientRect();
      const index = nearestSegment(segmentos, [(p.x - pad) / cell + 1, (p.y - pad) / cell + 1], rect ? 10 * w / rect.width / cell : 0.25);
      if (index !== null) onEraseSegment?.(index);
      setEraseHover(null);
      return;
    }
    const v = nearestVertex(p.x, p.y);
    if (!v) return;
    setKeyboardCursor(v);
    selectVertex(v);
  }

  function selectVertex(v: Vertex) {
    if (!pendingFrom) {
      onSetPending(v);
      return;
    }
    if (pendingFrom[0] === v[0] && pendingFrom[1] === v[1]) {
      // cancel
      onSetPending(null);
      return;
    }
    onAddSegment([pendingFrom, v]);
    onSetPending(v); // continue from this vertex
  }

  return (
    <svg
      ref={svgRef}
      aria-label="Malha de resposta"
      aria-description={toolActive ? `As letras e números nomeiam as faixas; os pontos selecionáveis são os cruzamentos. Use as setas para mover entre cruzamentos, Enter ou espaço para selecionar e Escape para cancelar o ponto inicial. Ponto atual: coluna ${keyboardCursor[0]}, linha de coordenada ${keyboardCursor[1]}.` : "Borracha ativa. Selecione um traço para apagá-lo; pelo teclado, use Tab para chegar ao traço e Enter para apagar."}
      role="group"
      tabIndex={toolActive ? 0 : -1}
      className="drawing-grid"
      onFocus={() => setKeyboardFocused(true)}
      onBlur={() => setKeyboardFocused(false)}
      onKeyDown={e => {
        if (!toolActive) return;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
          e.preventDefault();
          const next = moveGridCursor(keyboardCursor, e.key, cols, rows);
          setKeyboardCursor(next); setHover(next);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); selectVertex(keyboardCursor);
        } else if (e.key === "Escape") {
          e.preventDefault(); onSetPending(null);
        }
      }}
      data-drawing-grid="true"
      viewBox={`0 0 ${w} ${h}`}
      onMouseMove={handleMove}
      onMouseLeave={() => { setHover(null); setEraseHover(null); }}
      onClick={handleClick}
      style={{
        background: "var(--grid-paper)",
        border: "3px solid var(--grid-ink)",
        borderRadius: 6,
        cursor: toolActive ? "crosshair" : "pointer",
        width: "100%",
        height: "auto",
        maxWidth: w,
      }}
    >
      {/* grid */}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={pad + i * cell} y1={pad} x2={pad + i * cell} y2={pad + rows * cell} stroke="var(--grid-line)" strokeWidth={1} />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={pad} y1={pad + i * cell} x2={pad + cols * cell} y2={pad + i * cell} stroke="var(--grid-line)" strokeWidth={1} />
      ))}
      {/* labels */}
      {Array.from({ length: cols }).map((_, i) => (
        <text key={`cl${i}`} x={pad + i * cell + cell / 2} y={pad - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--grid-ink)">
          {LETTERS[i]}
        </text>
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <text key={`rl${i}`} x={pad - 10} y={pad + i * cell + cell / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--grid-ink)">
          {i + 1}
        </text>
      ))}
      {/* drawn segments */}
      {toolActive && Array.from({ length: (cols + 1) * (rows + 1) }, (_, i) => (
        <circle key={`vertex${i}`} cx={px(i % (cols + 1) + 1)} cy={py(Math.floor(i / (cols + 1)) + 1)} r={2} fill="var(--grid-line)" pointerEvents="none" />
      ))}
      {segmentos.map((s, i) => (
        <line
          key={i}
          x1={px(s[0][0])}
          y1={py(s[0][1])}
          x2={px(s[1][0])}
          y2={py(s[1][1])}
          data-student-segment="true"
          stroke={!toolActive && eraseHover === i ? "var(--activity-error)" : "var(--grid-ink)"}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}
      {!toolActive && segmentos.map((s, i) => (
        <line key={`erase${i}`} x1={px(s[0][0])} y1={py(s[0][1])} x2={px(s[1][0])} y2={py(s[1][1])}
          stroke="transparent" strokeWidth={16} role="button" tabIndex={0} aria-label={`Apagar traço ${i + 1}`}
          className="erasable-segment" onFocus={() => setEraseHover(i)} onBlur={() => setEraseHover(null)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onEraseSegment?.(i); setEraseHover(null); } }} />
      ))}
      {circulos.map(c => (
        <circle key={c.id} data-fixed-circle={c.id} cx={px(c.centro[0])} cy={py(c.centro[1])} r={c.raio * cell} fill={c.preenchido ? "var(--grid-ink)" : "var(--grid-paper)"} stroke="var(--grid-ink)" strokeWidth={2.5} />
      ))}
      {/* preview line from pending to hover */}
      {toolActive && pendingFrom && hover && (
        <line
          x1={px(pendingFrom[0])}
          y1={py(pendingFrom[1])}
          x2={px(hover[0])}
          y2={py(hover[1])}
          stroke="var(--grid-preview)"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
      )}
      {/* pending vertex */}
      {toolActive && pendingFrom && (
        <circle cx={px(pendingFrom[0])} cy={py(pendingFrom[1])} r={6} fill="var(--grid-pending)" stroke="var(--grid-ink)" strokeWidth={1.5} />
      )}
      {/* hover marker */}
      {toolActive && hover && (
        <circle cx={px(hover[0])} cy={py(hover[1])} r={7} fill="var(--grid-paper)" stroke="var(--grid-preview)" strokeWidth={2.5} pointerEvents="none" />
      )}
      {keyboardFocused && <circle data-keyboard-cursor="true" cx={px(keyboardCursor[0])} cy={py(keyboardCursor[1])} r={8} fill="none" stroke="var(--grid-preview)" strokeWidth={3} />}
    </svg>
  );
}
