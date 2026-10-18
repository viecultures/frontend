import React from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => (
  <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-heritage-forest/60 transition-opacity duration-200 data-closed:opacity-0 motion-reduce:transition-none"
    />
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <DialogPanel
          data-slot="modal-panel"
          transition
          className={cn(
            "relative w-full max-w-lg rounded-2xl border border-line bg-surface-raised p-6 text-ink-soft shadow-xl transition duration-200 data-closed:translate-y-2 data-closed:opacity-0 motion-reduce:transition-none",
            className
          )}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <DialogTitle className={title ? "pt-2 text-xl font-semibold text-ink" : "sr-only"}>
              {title || "Dialog"}
            </DialogTitle>
            <Button variant="ghost" size="icon" type="button" onClick={onClose} aria-label="Close dialog" className="ml-auto" data-autofocus>
              <X className="size-5" aria-hidden="true" />
            </Button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);
