import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: "cyan" | "green" | "pink";
}

export function CartoonButton({ children, tone = "cyan", className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`cartoon-button cartoon-${tone} inline-flex items-center justify-center font-extrabold px-4 py-2 rounded-xl border-[3px] cursor-pointer hover:brightness-105 active:translate-y-[1px] transition ${className}`}
    >
      {children}
    </button>
  );
}
