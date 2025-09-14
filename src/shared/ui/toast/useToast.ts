'use client';

import { useCallback } from 'react';
import type { ToastOptions } from './types';
import { useToastContext } from './ToastProvider';

// 1. 이벤트 시스템 (Emitter)
// ----------------------------------------------------------------

type ToastEvents = {
  add: (options: ToastOptions) => void;
  remove: (id: string) => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
  clear: () => void;
};

const createEmitter = () => {
  const subscriptions = new Map<keyof ToastEvents, Set<ToastEvents[keyof ToastEvents]>>();

  const emit = <E extends keyof ToastEvents>(event: E, ...args: Parameters<ToastEvents[E]>) => {
    const callbacks = subscriptions.get(event);
    if (callbacks) {
      for (const cb of callbacks) {
        (cb as any)(...args);
      }
    }
  };

  const subscribe = <E extends keyof ToastEvents>(event: E, cb: ToastEvents[E]) => {
    if (!subscriptions.has(event)) {
      subscriptions.set(event, new Set());
    }
    subscriptions.get(event)!.add(cb);
    return () => {
      subscriptions.get(event)!.delete(cb);
    };
  };

  return { emit, subscribe };
};

export const toastEmitter = createEmitter();

// 2. 스탠드얼론 toast 객체
// ----------------------------------------------------------------

const createStandaloneToast =
  (defaultOptions: Partial<ToastOptions> = {}) =>
  (message: string, options?: Omit<ToastOptions, 'message'>) => {
    toastEmitter.emit('add', { ...defaultOptions, ...options, message });
  };

/**
 * 컴포넌트 외부에서도 사용할 수 있는 스탠드얼론 toast 함수입니다.
 * `sonner` 라이브러리와 유사하게 동작합니다.
 * @example
 * import { toast } from '@/shared/ui/toast/useToast';
 *
 * function handleClick() {
 *  toast.success('성공적으로 처리되었습니다.');
 * }
 */
export const toast = {
  show: createStandaloneToast(),
  success: createStandaloneToast({ type: 'success' }),
  error: createStandaloneToast({ type: 'error' }),
  warning: createStandaloneToast({ type: 'warning' }),
  info: createStandaloneToast({ type: 'info' }),
  persistent: createStandaloneToast({ persistent: true }),
  remove: (id: string) => toastEmitter.emit('remove', id),
  update: (id: string, options: Partial<ToastOptions>) => toastEmitter.emit('update', id, options),
  clear: () => toastEmitter.emit('clear'),
};

// 3. 기존 useToast 훅 (호환성 유지)
// ----------------------------------------------------------------

// 팩토리 함수: 기본 옵션을 가진 토스트 생성 함수를 만듦
const createToastFunction = (addToast: (options: ToastOptions) => string, defaultOptions: Partial<ToastOptions>) => {
  return (message: string, options?: Omit<ToastOptions, 'message'>) => {
    return addToast({ ...defaultOptions, ...options, message });
  };
};

/**
 * ToastProvider 내부의 컴포넌트에서 토스트를 사용하기 위한 훅입니다.
 */
export function useToast() {
  const { addToast, removeToast, updateToast, clearToasts } = useToastContext();

  const showToast = useCallback(
    (options: ToastOptions) => {
      return addToast(options);
    },
    [addToast],
  );

  return {
    toast: showToast,
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
