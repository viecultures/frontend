import type { ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { MotionConfig } from 'motion/react';

interface AdminDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function AdminDialog({ title, onClose, children, wide = false }: AdminDialogProps) {
  return (
    <Dialog open onClose={onClose} className="admin-dialog relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-heritage-forest/70 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <DialogPanel className={`w-full min-w-0 ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
