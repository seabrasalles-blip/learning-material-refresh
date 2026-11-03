import type { Figura } from "@/data/figuras";

interface Props {
  figura: Figura;
  cell?: number;
  showLabels?: boolean;
  className?: string;
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export function ReferenceGrid({ figura, cell = 36, showLabels = true, className = "" }: Props) {
  const { cols, rows, segmentos } = figura;
  const pad = showLabels ? 22 : 6;
  const w = cols * cell + pad * 2;
  const h = rows * cell + pad * 2;
  const px = (c: number) => pad + (c - 1) * cell;
  const py = (r: number) => pad + (r - 1) * cell;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={{
        background: "var(--grid-paper)",
        border: "3px solid var(--grid-ink)",
        borderRadius: 6,
        width: w,
        height: "auto",
        maxWidth: "100%",
      }}
    >
      {/* grid lines */}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line key={`v${i}`} x1={pad + i * cell} y1={pad} x2={pad + i * cell} y2={pad + rows * cell} stroke="var(--grid-line)" strokeWidth={1} />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line key={`h${i}`} x1={pad} y1={pad + i * cell} x2={pad + cols * cell} y2={pad + i * cell} stroke="var(--grid-line)" strokeWidth={1} />
      ))}
      {/* labels */}
      {showLabels &&
        Array.from({ length: cols }).map((_, i) => (
          <text key={`cl${i}`} x={pad + i * cell + cell / 2} y={pad - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--grid-ink)">
            {LETTERS[i]}
          </text>
        ))}
      {showLabels &&
        Array.from({ length: rows }).map((_, i) => (
          <text key={`rl${i}`} x={pad - 8} y={pad + i * cell + cell / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--grid-ink)">
            {i + 1}
          </text>
        ))}
      {/* figure segments */}
      {segmentos.map((s, i) => (
        <line
          key={i}
          x1={px(s[0][0])}
          y1={py(s[0][1])}
          x2={px(s[1][0])}
          y2={py(s[1][1])}
           stroke="var(--grid-ink)"
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
      {figura.circulos?.map(c => (
        <circle key={c.id} data-fixed-circle={c.id} cx={px(c.centro[0])} cy={py(c.centro[1])} r={c.raio * cell} fill={c.preenchido ? "var(--grid-ink)" : "var(--grid-paper)"} stroke="var(--grid-ink)" strokeWidth={2.5} />
      ))}
    </svg>
  );
}
