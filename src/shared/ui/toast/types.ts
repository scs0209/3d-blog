export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  onClose?: () => void;
  persistent?: boolean;
}

export interface Toast extends Required<ToastOptions> {
  id: string;
  createdAt: number;
  visible: boolean;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, options: Partial<ToastOptions>) => void;
  clearToasts: () => void;
}

export interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
  className?: string;
}

