import { Pencil, Undo2, Eraser } from "lucide-react";

interface Props {
  onPencil: () => void;
  onUndo: () => void;
  onErase: () => void;
  pencilActive: boolean;
}

export function ToolPanel({ onPencil, onUndo, onErase, pencilActive }: Props) {
  const btn =
    "w-16 h-16 md:w-20 md:h-20 rounded-xl border-[3px] border-[#1a6f99] bg-white flex items-center justify-center cursor-pointer hover:brightness-95 active:translate-y-[1px] transition";
  return (
    <div
      className="flex flex-col gap-4 p-3 rounded-2xl border-[3px] border-[#1a6f99]"
      style={{ background: "rgba(255,255,255,0.6)" }}
    >
      <button
        type="button"
        onClick={onPencil}
        className={btn}
        style={{ background: pencilActive ? "#fff7c2" : "white" }}
        title="Lápis"
      >
        <Pencil className="w-8 h-8 text-[#1a6f99]" />
      </button>
      <button type="button" onClick={onUndo} className={btn} title="Desfazer">
        <Undo2 className="w-8 h-8 text-[#1a6f99]" />
      </button>
      <button type="button" onClick={onErase} className={btn} title="Apagar tudo">
        <Eraser className="w-8 h-8 text-[#b03060]" />
      </button>
    </div>
  );
}
