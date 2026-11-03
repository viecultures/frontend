import type { ReactNode } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { MotionConfig } from 'motion/react';

interface AdminDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  size?: 'default' | 'wide' | 'studio';
}

export function AdminDialog({ title, onClose, children, wide = false, size }: AdminDialogProps) {
  const panelWidth =
    size === 'studio'
      ? 'max-w-[98vw] 2xl:max-w-[1720px] w-full'
      : size === 'wide' || wide
      ? 'max-w-5xl w-full'
      : 'max-w-3xl w-full';

  return (
    <Dialog open onClose={onClose} className="admin-dialog relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-heritage-forest/70 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4 md:p-6">
          <DialogPanel className={`min-w-0 ${panelWidth}`}>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
