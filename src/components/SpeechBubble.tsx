import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  tailSide?: "left" | "right";
  className?: string;
}

export function SpeechBubble({ children, tailSide = "left", className = "" }: Props) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="bg-white rounded-[50%] px-10 py-8 border-[3px] border-black text-center font-bold text-base md:text-lg leading-snug"
        style={{ minWidth: 240 }}
      >
        {children}
      </div>
      <div
        className={`absolute bottom-2 ${tailSide === "left" ? "-left-4" : "-right-4"}`}
        style={{
          width: 0,
          height: 0,
          borderTop: "16px solid transparent",
          borderBottom: "16px solid transparent",
          [tailSide === "left" ? "borderRight" : "borderLeft"]: "28px solid white",
          filter: "drop-shadow(0 0 0 black)",
        }}
      />
    </div>
  );
}
