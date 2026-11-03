import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export function LearningDialog({ title, children, onClose, className = "" }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}><Dialog.Portal>
    <Dialog.Overlay className="dialog-overlay" />
    <Dialog.Content className={`activity-dialog ${className}`} aria-describedby={undefined}>
      <Dialog.Title className="dialog-title">{title}</Dialog.Title>
      {children}
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}