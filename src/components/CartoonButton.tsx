import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: "cyan" | "green" | "pink";
}

export function CartoonButton({ children, tone = "cyan", className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`cartoon-button cartoon-${tone} inline-flex items-center justify-center gap-2 font-extrabold px-5 py-3 rounded-lg border-2 cursor-pointer hover:brightness-105 active:translate-y-[1px] transition disabled:opacity-50 disabled:cursor-default ${className}`}
    >
      {children}
    </button>
  );
}
