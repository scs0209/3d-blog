'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn-ui/components/ui/dialog';
import type { ReactNode } from 'react';

type ModalProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Modal = ({ trigger, title, description, children, open, onOpenChange }: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='sm:max-w-[425px] bg-gradient-to-br from-white/15 via-white/8 to-white/3 backdrop-blur-xl border border-white/30 shadow-2xl'
        style={{
          boxShadow:
            '0 0 30px rgba(255, 255, 255, 0.2), 0 0 60px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}
      >
        <DialogHeader className='space-y-3'>
          <DialogTitle className='text-xl font-bold text-white/95 drop-shadow-lg'>{title}</DialogTitle>
          {description && <DialogDescription className='text-white/70 drop-shadow-sm'>{description}</DialogDescription>}
        </DialogHeader>
        <div className='text-white/90'>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
