'use client';

import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn-ui/components/ui/dialog';

type ModalProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Modal = ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
