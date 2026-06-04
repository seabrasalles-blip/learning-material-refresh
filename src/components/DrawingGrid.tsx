import { useRef, useState } from "react";
import type { Segmento, Vertex } from "@/data/figuras";

interface Props {
  cols: number;
  rows: number;
  cell?: number;
  segmentos: Segmento[];
  pendingFrom: Vertex | null;
  toolActive: boolean; // when false (e.g. eraser), clicks are ignored
  onAddSegment: (s: Segmento) => void;
  onSetPending: (v: Vertex | null) => void;
}

const LETTERS = "abcdefghijklmnop";

export function DrawingGrid({
  cols,
  rows,
  cell = 40,
  segmentos,
  pendingFrom,
  toolActive,
  onAddSegment,
  onSetPending,
}: Props) {
  const pad = 24;
  const w = cols * cell + pad * 2;
  const h = rows * cell + pad * 2;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hover, setHover] = useState<Vertex | null>(null);

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
    if (c < 1 || c > cols || r < 1 || r > rows) return null;
    // require click within ~half a cell
    const dx = x - px(c);
    const dy = y - py(r);
    if (Math.hypot(dx, dy) > cell * 0.5) return null;
    return [c, r];
  }

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!toolActive) return;
    const p = svgPoint(e);
    if (!p) return;
    setHover(nearestVertex(p.x, p.y));
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!toolActive) return;
    const p = svgPoint(e);
    if (!p) return;
    const v = nearestVertex(p.x, p.y);
    if (!v) return;
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
      viewBox={`0 0 ${w} ${h}`}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
      onClick={handleClick}
      style={{
        background: "white",
        border: "3px solid #111",
        borderRadius: 6,
        cursor: toolActive ? "crosshair" : "default",
        width: "100%",
        height: "auto",
        maxWidth: w,
      }}
    >
      {/* grid */}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={pad + i * cell} y1={pad} x2={pad + i * cell} y2={pad + rows * cell} stroke="#555" strokeWidth={1} />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={pad} y1={pad + i * cell} x2={pad + cols * cell} y2={pad + i * cell} stroke="#555" strokeWidth={1} />
      ))}
      {/* labels */}
      {Array.from({ length: cols }).map((_, i) => (
        <text key={`cl${i}`} x={pad + i * cell + cell / 2} y={pad - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill="#111">
          {LETTERS[i]}
        </text>
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <text key={`rl${i}`} x={pad - 10} y={pad + i * cell + cell / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#111">
          {i + 1}
        </text>
      ))}
      {/* drawn segments */}
      {segmentos.map((s, i) => (
        <line
          key={i}
          x1={px(s[0][0])}
          y1={py(s[0][1])}
          x2={px(s[1][0])}
          y2={py(s[1][1])}
          stroke="#111"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}
      {/* preview line from pending to hover */}
      {pendingFrom && hover && (
        <line
          x1={px(pendingFrom[0])}
          y1={py(pendingFrom[1])}
          x2={px(hover[0])}
          y2={py(hover[1])}
          stroke="#2596be"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
      )}
      {/* pending vertex */}
      {pendingFrom && (
        <circle cx={px(pendingFrom[0])} cy={py(pendingFrom[1])} r={6} fill="#e94560" stroke="#111" strokeWidth={1.5} />
      )}
      {/* hover marker */}
      {hover && (
        <circle cx={px(hover[0])} cy={py(hover[1])} r={5} fill="#2596be" opacity={0.5} />
      )}
    </svg>
  );
}
