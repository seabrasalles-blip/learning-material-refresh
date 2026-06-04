import type { ReactNode } from "react";

interface Props {
  variant: "blue" | "green";
  children: ReactNode;
}

export function RayBackground({ variant, children }: Props) {
  const lightColor = variant === "blue" ? "#7dd3e8" : "#a8e063";
  const darkColor = variant === "blue" ? "#2596be" : "#5fa83a";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: `repeating-conic-gradient(from 0deg at 50% 60%, ${lightColor} 0deg 8deg, ${darkColor} 8deg 16deg)`,
      }}
    >
      {/* radial overlay to fade rays toward center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${lightColor}cc 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
