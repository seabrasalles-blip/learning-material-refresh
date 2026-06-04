import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: "cyan" | "green" | "pink";
}

export function CartoonButton({ children, tone = "cyan", className = "", ...props }: Props) {
  const tones = {
    cyan: { bg: "#bdf0fb", border: "#1a6f99", text: "#1a6f99" },
    green: { bg: "#cdf0a6", border: "#2f6b1a", text: "#2f6b1a" },
    pink: { bg: "#ffd0e0", border: "#b03060", text: "#b03060" },
  } as const;
  const t = tones[tone];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center font-extrabold tracking-wider px-6 py-2 rounded-xl border-[3px] cursor-pointer hover:brightness-105 active:translate-y-[1px] transition ${className}`}
      style={{
        background: t.bg,
        borderColor: t.border,
        color: t.text,
        textShadow: "1px 1px 0 white",
        fontFamily: "'Comic Sans MS', 'Comic Sans', system-ui, sans-serif",
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </button>
  );
}
