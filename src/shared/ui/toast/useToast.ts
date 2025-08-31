import { useCallback } from 'react';
import { useToastContext } from './ToastProvider';
import type { ToastOptions } from './types';

// 팩토리 함수: 기본 옵션을 가진 토스트 생성 함수를 만듦
const createToastFunction =
  (addToast: (options: ToastOptions) => string, defaultOptions: Partial<ToastOptions>) =>
  (message: string, options?: Omit<ToastOptions, 'message'>) => {
    return addToast({ ...defaultOptions, ...options, message });
  };

export function useToast() {
  const { addToast, removeToast, updateToast, clearToasts } = useToastContext();

  // 기본 토스트 표시
  const toast = useCallback(
    (options: ToastOptions) => {
      return addToast(options);
    },
    [addToast],
  );

  return {
    toast,
    success: createToastFunction(addToast, { type: 'success' }),
    error: createToastFunction(addToast, { type: 'error' }),
    warning: createToastFunction(addToast, { type: 'warning' }),
    info: createToastFunction(addToast, { type: 'info' }),
    persistent: createToastFunction(addToast, { persistent: true }),
    remove: removeToast,
    update: updateToast,
    clear: clearToasts,
  };
}
