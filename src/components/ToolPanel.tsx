import { Pencil, Undo2, Eraser } from "lucide-react";

interface Props {
  onPencil: () => void;
  onUndo: () => void;
  onErase: () => void;
  pencilActive: boolean;
}

export function ToolPanel({ onPencil, onUndo, onErase, pencilActive }: Props) {
  const btn =
    "w-12 h-12 md:w-14 md:h-14 rounded-xl border-[3px] border-[#1a6f99] bg-white flex items-center justify-center cursor-pointer hover:brightness-95 active:translate-y-[1px] transition";
  return (
    <div
      className="flex flex-row md:flex-col gap-3 p-2 rounded-2xl border-[3px] border-[#1a6f99]"
      style={{ background: "rgba(255,255,255,0.6)" }}
      role="toolbar"
      aria-label="Ferramentas de desenho"
    >
      <button
        type="button"
        onClick={onPencil}
        className={btn}
        style={{ background: pencilActive ? "#fff7c2" : "white" }}
        title="Lápis — clique em dois pontos da malha para traçar"
        aria-label="Lápis"
        aria-pressed={pencilActive}
      >
        <Pencil className="w-6 h-6 text-[#1a6f99]" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onUndo}
        className={btn}
        title="Desfazer — apaga o último traço"
        aria-label="Desfazer último traço"
      >
        <Undo2 className="w-6 h-6 text-[#1a6f99]" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onErase}
        className={btn}
        title="Borracha — apaga todo o desenho"
        aria-label="Apagar todo o desenho"
      >
        <Eraser className="w-6 h-6 text-[#b03060]" aria-hidden="true" />
      </button>
    </div>
  );
}
