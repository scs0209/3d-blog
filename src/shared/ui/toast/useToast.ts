import { useCallback } from 'react';
import { useToastContext } from './ToastProvider';
import type { ToastOptions } from './types';

export function useToast() {
  const { addToast, removeToast, updateToast, clearToasts } = useToastContext();

  // 기본 토스트 표시
  const toast = useCallback(
    (options: ToastOptions) => {
      return addToast(options);
    },
    [addToast],
  );

  // 성공 토스트
  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return addToast({ ...options, message, type: 'success' });
    },
    [addToast],
  );

  // 에러 토스트
  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return addToast({ ...options, message, type: 'error' });
    },
    [addToast],
  );

  // 경고 토스트
  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return addToast({ ...options, message, type: 'warning' });
    },
    [addToast],
  );

  // 정보 토스트
  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return addToast({ ...options, message, type: 'info' });
    },
    [addToast],
  );

  // 지속 토스트 (자동으로 사라지지 않음)
  const persistent = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'persistent'>) => {
      return addToast({ ...options, message, persistent: true });
    },
    [addToast],
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    persistent,
    remove: removeToast,
    update: updateToast,
    clear: clearToasts,
  };
}

