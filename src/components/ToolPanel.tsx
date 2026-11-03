import { Pencil, Undo2, Eraser, Trash2 } from "lucide-react";
import { CartoonButton } from "./CartoonButton";

interface Props {
  onPencil: () => void;
  onUndo: () => void;
  onErase: () => void;
  onClear: () => void;
  pencilActive: boolean;
}

export function ToolPanel({ onPencil, onUndo, onErase, onClear, pencilActive }: Props) {
  const btn = "tool-button";
  return (
    <div
      className="flex flex-row gap-3"
      role="toolbar"
      aria-label="Ferramentas de desenho"
    >
      <CartoonButton
        type="button"
        onClick={onPencil}
        className={btn}
        title="Lápis — clique em dois pontos da malha para traçar"
        aria-label="Lápis"
        aria-pressed={pencilActive}
      >
        <Pencil className="w-6 h-6" aria-hidden="true" />
      </CartoonButton>
      <CartoonButton
        type="button"
        onClick={onUndo}
        className={btn}
        title="Desfazer — apaga o último traço"
        aria-label="Desfazer último traço"
      >
        <Undo2 className="w-6 h-6" aria-hidden="true" />
      </CartoonButton>
      <CartoonButton
        tone="pink"
        type="button"
        onClick={onErase}
        className={btn}
         title="Borracha — apagar um traço"
         aria-label="Borracha"
         aria-pressed={!pencilActive}
      >
        <Eraser className="w-6 h-6" aria-hidden="true" />
      </CartoonButton>
      <CartoonButton type="button" onClick={onClear} title="Limpar tudo" aria-label="Limpar tudo" className="clear-drawing-button">
        <Trash2 size={18} aria-hidden="true" /> LIMPAR TUDO
      </CartoonButton>
    </div>
  );
}
